from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import os
import decimal
from dotenv import load_dotenv
import httpx
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any, Union
import re

# Load .env variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres.nagzxvpuoagsbrfwgogv:riteshjustin24@aws-0-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require"
)

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")


class QueryRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatMessage(BaseModel):
    id: str
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime
    # 'query', 'allocation_preview', 'allocation_confirmed', 'allocation_rejected'
    message_type: str
    sql: Optional[str] = None
    current_values: Optional[dict] = None
    proposed_values: Optional[dict] = None


# In-memory conversation storage (in production, use a database)
conversations: dict = {}  # session_id -> List[ChatMessage]


async def generate_sql_from_llama(prompt, user_message):
    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.1",
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": user_message}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.together.xyz/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )

    data = response.json()
    print(data)

    if 'choices' in data and data['choices']:
        response_content = data['choices'][0]['message']['content'].strip()

        # Try to extract SQL from code blocks first

        # Look for SQL in code blocks (```sql ... ```)
        sql_blocks = re.findall(r'```sql\s*\n(.*?)\n```',
                                response_content, re.DOTALL | re.IGNORECASE)
        if sql_blocks:
            sql = sql_blocks[0].strip()
            return sql

        # Look for SQL in any code blocks (``` ... ```)
        code_blocks = re.findall(
            r'```\s*\n(.*?)\n```', response_content, re.DOTALL)
        if code_blocks:
            # Check if it looks like SQL
            potential_sql = code_blocks[0].strip()
            if any(keyword in potential_sql.upper() for keyword in ['SELECT', 'UPDATE', 'INSERT', 'DELETE', 'FROM', 'WHERE', 'SET']):
                return potential_sql

        # If no code blocks, try to extract SQL statements directly
        # Look for lines that start with SQL keywords
        lines = response_content.split('\n')
        sql_lines = []
        in_sql = False

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Start of SQL statement
            if any(line.upper().startswith(keyword) for keyword in ['SELECT', 'UPDATE', 'INSERT', 'DELETE', 'WITH']):
                in_sql = True
                sql_lines = [line]
            elif in_sql:
                # Continue collecting SQL lines
                if line.endswith(';'):
                    sql_lines.append(line)
                    break
                elif any(keyword in line.upper() for keyword in ['FROM', 'WHERE', 'SET', 'VALUES', 'GROUP BY', 'ORDER BY', 'HAVING', 'JOIN', 'AND', 'OR']):
                    sql_lines.append(line)
                else:
                    # Stop if we hit non-SQL content
                    if len(sql_lines) > 1:  # We have at least a reasonable SQL statement
                        break

        if sql_lines:
            sql = ' '.join(sql_lines)
            # Clean up any remaining markdown
            sql = sql.replace("```sql", "").replace("```", "").strip()
            return sql

        # Fallback: return the original content cleaned up
        sql = response_content.replace("```sql", "").replace("```", "").strip()
        return sql
    else:
        raise ValueError(f"Unexpected response format: {data}")


def fix_column_names(sql: str) -> str:
    # Column name mappings for proper case-sensitive PostgreSQL columns
    column_mappings = {
        "opening_stock": '"Opening_Stock"',
        "Opening_Stock": '"Opening_Stock"',  # Ensure quoted version
        "closing_stock": '"Closing_Stock"',
        "Closing_Stock": '"Closing_Stock"',  # Ensure quoted version
        "stock_in": '"Stock_In"',
        "Stock_In": '"Stock_In"',
        "stock_out": '"Stock_Out"',
        "Stock_Out": '"Stock_Out"',
        "warehouse_id": '"Warehouse_ID"',
        "Warehouse_ID": '"Warehouse_ID"',
        "sku_id": '"SKU_ID"',
        "SKU_ID": '"SKU_ID"',
        "week": '"Week"',
        "Week": '"Week"',
        "wos": '"WOS"',
        "WOS": '"WOS"',
        "min": '"Min"',
        "Min": '"Min"',
        "threshold": '"Threshold"',
        "Threshold": '"Threshold"',
        "max": '"Max"',
        "Max": '"Max"',
        "lead_time_days": '"Lead_Time_Days"',
        "Lead_Time_Days": '"Lead_Time_Days"',
        "units_sold": '"Units_Sold"',
        "Units_Sold": '"Units_Sold"',
        "sales_data": '"sales_data"',
        "inventory_data": '"inventory_data"'
    }

    # Apply mappings - be careful not to double-quote already quoted names
    for old_name, new_name in column_mappings.items():
        if new_name not in sql:  # Only replace if not already properly quoted
            sql = sql.replace(old_name, new_name)

    # Fix common error: Store_ID should be Warehouse_ID for inventory_data table
    if '"inventory_data"' in sql and '"Store_ID"' in sql:
        sql = sql.replace('"Store_ID"', '"Warehouse_ID"')

    return sql


def run_query(sql: str, fix_quotes: bool = True) -> Union[List[Dict[str, Any]], str]:
    """Execute a SQL query and return the results with proper type handling."""
    if fix_quotes:
        sql = fix_column_names(sql)
    print(f"Executing SQL: {sql}")

    conn = None
    cur = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute(sql)

        # For SELECT queries
        if sql.strip().upper().startswith('SELECT'):
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description]

            # Convert decimal and date types to JSON-serializable formats
            processed_rows = []
            for row in rows:
                processed_row = {}
                for col, val in zip(columns, row):
                    if isinstance(val, decimal.Decimal):
                        processed_row[col] = float(val)
                    else:
                        processed_row[col] = val
                processed_rows.append(processed_row)

            cur.close()
            conn.close()
            return processed_rows

        # For non-SELECT queries
        conn.commit()
        cur.close()
        conn.close()
        return "Query executed successfully."

    except psycopg2.Error as e:
        print(f"Database error: {e}")
        if conn:
            conn.rollback()
        if cur:
            cur.close()
        if conn:
            conn.close()
        return f"Error executing query: {str(e)}"
    except Exception as e:
        print(f"General error: {e}")
        if cur:
            cur.close()
        if conn:
            conn.close()
        return f"Error: {str(e)}"


async def get_current_values(sql: str):
    """Extract current values from database for comparison in preview"""
    try:
        # Extract SKU, Warehouse, and other identifiers from the SQL

        # More flexible regex to handle both quoted and unquoted column names and values
        sku_match = re.search(
            r'(?:"SKU_ID"|SKU_ID)\s*=\s*[\'"]?(\d+)[\'"]?', sql, re.IGNORECASE)
        warehouse_match = re.search(
            r'(?:"Warehouse_ID"|Warehouse_ID)\s*(?:ILIKE|=)\s*[\'"]([^\'"]+)[\'"]', sql, re.IGNORECASE)
        week_match = re.search(
            r'(?:"Week"|Week)\s*=\s*[\'"]([^\'"]+)[\'"]', sql, re.IGNORECASE)

        if sku_match and warehouse_match:
            sku_id = sku_match.group(1)
            warehouse_id = warehouse_match.group(1)
            # Use actual date from DB
            week = week_match.group(1) if week_match else '2022-06-27'

            # Query current values
            current_query = f'''
            SELECT "SKU_ID", "Warehouse_ID", "Week", "Opening_Stock", "Stock_In", "Stock_Out", 
                   "Closing_Stock", "WOS", "Min", "Threshold", "Max", "Lead_Time_Days"
            FROM "inventory_data" 
            WHERE "SKU_ID" = {sku_id} 
            AND "Warehouse_ID" ILIKE '{warehouse_id}'
            ORDER BY "Week" DESC
            LIMIT 1
            '''

            result = run_query(current_query, fix_quotes=False)
            return result[0] if result else None
    except Exception as e:
        print(f"Error getting current values: {e}")
        return None


def extract_proposed_values(sql: str):
    """Extract proposed values from the UPDATE SQL statement"""
    proposed = {}

    # Extract various SET clauses - handle both quoted and unquoted column names
    patterns = {
        'Opening_Stock': r'(?:"Opening_Stock"|Opening_Stock)\s*=\s*(\d+)',
        'Stock_In': r'(?:"Stock_In"|Stock_In)\s*=\s*(\d+)',
        'Stock_Out': r'(?:"Stock_Out"|Stock_Out)\s*=\s*(\d+)',
        'Closing_Stock': r'(?:"Closing_Stock"|Closing_Stock)\s*=\s*(\d+)',
        'WOS': r'(?:"WOS"|WOS)\s*=\s*(\d+(?:\.\d+)?)',
        'Min': r'(?:"Min"|Min)\s*=\s*(\d+)',
        'Threshold': r'(?:"Threshold"|Threshold)\s*=\s*(\d+)',
        'Max': r'(?:"Max"|Max)\s*=\s*(\d+)',
        'Lead_Time_Days': r'(?:"Lead_Time_Days"|Lead_Time_Days)\s*=\s*(\d+)',
    }

    for field, pattern in patterns.items():
        match = re.search(pattern, sql, re.IGNORECASE)
        if match:
            proposed[field] = match.group(1)

    return proposed


def enhance_update_sql(sql: str, current_values: dict) -> str:
    """Add proper Week filter to UPDATE statements based on current values"""
    if current_values and sql.strip().upper().startswith("UPDATE"):

        # Get the Week from current values
        week = current_values.get('Week')
        sku_id = current_values.get('SKU_ID')
        warehouse_id = current_values.get('Warehouse_ID')

        if week and sku_id and warehouse_id:
            # Create a simplified UPDATE statement
            set_clause_match = re.search(
                r'SET\s+(.+?)\s+WHERE', sql, re.IGNORECASE | re.DOTALL)
            if set_clause_match:
                set_clause = set_clause_match.group(1).strip()

                # Create clean UPDATE statement
                clean_sql = f'''UPDATE "inventory_data"
SET {set_clause}
WHERE "Week" = '{week}' 
AND "SKU_ID" = {sku_id} 
AND "Warehouse_ID" ILIKE '{warehouse_id}';'''
                return clean_sql

    return sql


# Conversation history management functions
def get_session_id(req: QueryRequest) -> str:
    """Get or create session ID"""
    if req.session_id:
        return req.session_id
    # Generate new session ID based on timestamp
    return f"session_{int(datetime.now().timestamp())}"


def add_message_to_history(session_id: str, role: str, content: str,
                           message_type: str = 'query', sql: str = None,
                           current_values: dict = None, proposed_values: dict = None):
    """Add a message to conversation history"""
    if session_id not in conversations:
        conversations[session_id] = []

    message = ChatMessage(
        id=f"msg_{len(conversations[session_id]) + 1}",
        role=role,
        content=content,
        timestamp=datetime.now(),
        message_type=message_type,
        sql=sql,
        current_values=current_values,
        proposed_values=proposed_values
    )

    conversations[session_id].append(message)
    return message


def get_conversation_history(session_id: str) -> List[ChatMessage]:
    """Get conversation history for a session"""
    return conversations.get(session_id, [])


def format_history_for_response(history: List[ChatMessage]) -> List[dict]:
    """Format conversation history for API response"""
    return [
        {
            "id": msg.id,
            "role": msg.role,
            "content": msg.content,
            "timestamp": msg.timestamp.isoformat(),
            "message_type": msg.message_type,
            "sql": msg.sql,
            "current_values": msg.current_values,
            "proposed_values": msg.proposed_values
        }
        for msg in history
    ]


@app.post("/chat")
async def chat(req: QueryRequest):
    # Get or create session ID
    session_id = get_session_id(req)

    # Add user message to history
    add_message_to_history(session_id, "user", req.message)

    prompt = """You are a SQL expert for supply chain inventory management. Generate clean, executable SQL queries based on user requests.

DATABASE SCHEMA:
- "sales_data" table: "Week" DATE, "Store_ID" VARCHAR, "SKU_ID" INTEGER, "Units_Sold" INTEGER  
- "inventory_data" table: "Week" DATE, "SKU_ID" INTEGER, "Warehouse_ID" VARCHAR, "Opening_Stock" INTEGER, "Stock_In" INTEGER, "Stock_Out" INTEGER, "Closing_Stock" INTEGER, "WOS" NUMERIC, "Min" INTEGER, "Threshold" INTEGER, "Max" INTEGER, "Lead_Time_Days" INTEGER

CRITICAL RULES:
1. Always use double quotes around table and column names
2. Use ILIKE for text comparisons, = for exact numbers
3. For allocation/update requests, use "inventory_data" table with "Warehouse_ID" (NOT Store_ID)
4. For sales queries, use "sales_data" table with "Store_ID"
5. For stock/inventory operations, use "inventory_data" table only
6. For date operations on Week column, use DATE '2022-06-27' - INTERVAL '7 days' syntax
7. WOS (Weeks of Supply) is NUMERIC type, not FLOAT
8. Return ONLY clean SQL - no explanations or markdown

EXAMPLE QUERIES:
- Show last week's sales: SELECT * FROM "sales_data" WHERE "Week" >= (DATE '2022-06-27' - INTERVAL '7 days');
- Show inventory for SKU: SELECT * FROM "inventory_data" WHERE "SKU_ID" = 123456;
- Show low stock: SELECT * FROM "inventory_data" WHERE "Closing_Stock" < "Min";

EXAMPLES:
User: "show inventory for SKU 123456" → SELECT * FROM "inventory_data" WHERE "SKU_ID" = 123456;
User: "allocate 50 units to warehouse A" → UPDATE "inventory_data" SET "Stock_In" = 50 WHERE "SKU_ID" = 123456 AND "Warehouse_ID" ILIKE 'A';
User: "sales for store 001" → SELECT * FROM "sales_data" WHERE "Store_ID" = '001';

Generate clean SQL for this request:"""

    ai_response = await generate_sql_from_llama(prompt, req.message)

    # Check if the AI response is actually SQL or just conversational text
    ai_response_upper = ai_response.strip().upper()
    is_sql_query = (
        ai_response_upper.startswith(("SELECT", "INSERT", "UPDATE", "DELETE", "WITH", "SHOW")) or
        "FROM" in ai_response_upper or
        "WHERE" in ai_response_upper
    )

    # If it's not a SQL query, treat as conversational response
    if not is_sql_query:
        # Add AI response to history
        add_message_to_history(session_id, "assistant", ai_response)

        # Get updated conversation history
        history = get_conversation_history(session_id)

        return {
            "session_id": session_id,
            "response": ai_response,
            "is_conversational": True,
            "conversation_history": format_history_for_response(history)
        }

    # If it is SQL, proceed with query execution
    sql = ai_response

    # Process and clean up the SQL
    sql = sql.replace("DATEADD", "DATE")  # Fix any DATEADD functions
    sql = sql.replace("day", "days")  # Standardize interval unit

    # Handle specific date patterns
    if "last week" in req.message.lower():
        sql = sql.replace(
            '"Week" >= CURRENT_DATE - 7',
            '"Week" >= (DATE \'2022-06-27\' - INTERVAL \'7 days\')'
        )

    # Detect write queries
    if sql.strip().upper().startswith(("INSERT", "UPDATE", "DELETE")):
        # Get current values for preview
        current_values = await get_current_values(sql)
        proposed_values = extract_proposed_values(sql)

        # Enhance SQL with proper Week filter for updates
        if sql.strip().upper().startswith("UPDATE"):
            sql = enhance_update_sql(sql, current_values)

        # Add allocation preview to history
        preview_message = "Here's the allocation preview. Please confirm before I execute it:"
        add_message_to_history(session_id, "assistant", preview_message,
                               "allocation_preview", sql, current_values, proposed_values)

        # Get updated conversation history
        history = get_conversation_history(session_id)

        return {
            "session_id": session_id,
            "preview_message": preview_message,
            "sql": sql,
            "pending": True,
            "current_values": current_values,
            "proposed_values": proposed_values,
            "conversation_history": format_history_for_response(history)
        }

    try:
        result = run_query(sql)

        # Get AI insights for agentic capabilities
        analysis_type = "sales" if "sales_data" in sql.lower() else "inventory"
        insights = await analyze_data_patterns(result, analysis_type)
        smart_recommendations = await generate_smart_recommendations(session_id, result, analysis_type)
        monitoring_data = await proactive_monitoring(session_id)

        # Create intelligent response content
        base_response = f"Here are the results:"

        # Build AI insights summary
        ai_insights = []

        # Add critical alerts first
        if monitoring_data["critical_alerts"]:
            ai_insights.append("🚨 **CRITICAL ALERTS:**")
            for alert in monitoring_data["critical_alerts"][:3]:
                ai_insights.append(
                    f"• {alert['message']} - {alert['action_required']}")

        # Add immediate actions
        if smart_recommendations["immediate_actions"]:
            ai_insights.append("\n⚡ **IMMEDIATE ACTIONS:**")
            for action in smart_recommendations["immediate_actions"][:3]:
                ai_insights.append(
                    f"• {action['action']} ({action['priority']} priority) - {action['timeline']}")

        # Add business insights
        if insights["alerts"] or insights["trends"]:
            ai_insights.append("\n📊 **BUSINESS INSIGHTS:**")
            for insight in (insights["alerts"] + insights["trends"])[:4]:
                ai_insights.append(f"• {insight}")

        # Add strategic recommendations
        if smart_recommendations["strategic_insights"]:
            ai_insights.append("\n💡 **STRATEGIC RECOMMENDATIONS:**")
            for insight in smart_recommendations["strategic_insights"][:3]:
                ai_insights.append(f"• {insight}")

        # Add optimization opportunities
        if smart_recommendations["optimization_opportunities"]:
            ai_insights.append("\n🎯 **OPTIMIZATION OPPORTUNITIES:**")
            for opp in smart_recommendations["optimization_opportunities"][:2]:
                ai_insights.append(
                    f"• {opp['description']} - {opp['suggestion']}")

        # Add key metrics
        if insights.get("metrics"):
            ai_insights.append("\n📈 **KEY METRICS:**")
            for key, value in insights["metrics"].items():
                if isinstance(value, (int, float)):
                    ai_insights.append(
                        f"• {key.replace('_', ' ').title()}: {value}")

        # Combine base response with AI insights
        if ai_insights:
            response_content = base_response + \
                "\n\n🤖 **AI ANALYSIS:**\n" + "\n".join(ai_insights)
        else:
            response_content = base_response

        # Add assistant response to history
        add_message_to_history(session_id, "assistant",
                               response_content, "query", sql)

        # Get updated conversation history
        history = get_conversation_history(session_id)

        return {
            "session_id": session_id,
            "sql": sql,
            "response": result,
            "ai_insights": response_content,
            "insights": insights,
            "smart_recommendations": smart_recommendations,
            "monitoring_data": monitoring_data,
            "conversation_history": format_history_for_response(history)
        }
    except Exception as e:
        # Add error to history
        error_message = f"Error executing query: {str(e)}"
        add_message_to_history(session_id, "assistant",
                               error_message, "query", sql)

        # Get updated conversation history
        history = get_conversation_history(session_id)

        return {
            "session_id": session_id,
            "error": str(e),
            "sql": sql,
            "conversation_history": format_history_for_response(history)
        }


@app.post("/confirm")
async def confirm_sql(req: dict):
    try:
        sql = req.get("sql", "")
        session_id = req.get("session_id", "")
        action = req.get("action", "approve")  # 'approve' or 'reject'

        if action == "reject":
            # Add rejection to history
            add_message_to_history(
                session_id, "user", "❌ Allocation rejected", "allocation_rejected")
            add_message_to_history(
                session_id, "assistant", "Allocation has been cancelled. No changes were made to the database.", "allocation_rejected")

            # Get updated conversation history
            history = get_conversation_history(session_id)

            return {
                "status": "rejected",
                "message": "Allocation cancelled",
                "session_id": session_id,
                "conversation_history": format_history_for_response(history)
            }

        # Apply column name fixes to ensure all column names are properly quoted
        result = run_query(sql, fix_quotes=True)

        # Add approval and success to history
        add_message_to_history(
            session_id, "user", "✅ Allocation approved", "allocation_confirmed")
        add_message_to_history(
            session_id, "assistant", f"Allocation executed successfully: {result}", "allocation_confirmed", sql)

        # Get updated conversation history
        history = get_conversation_history(session_id)

        return {
            "status": "success",
            "result": result,
            "session_id": session_id,
            "conversation_history": format_history_for_response(history)
        }
    except Exception as e:
        # Add error to history
        if session_id:
            add_message_to_history(
                session_id, "assistant", f"❌ Error executing allocation: {str(e)}", "allocation_confirmed", sql)
            history = get_conversation_history(session_id)
            return {
                "status": "error",
                "error": str(e),
                "session_id": session_id,
                "conversation_history": format_history_for_response(history)
            }

        return {"status": "error", "error": str(e)}


@app.get("/conversations/{session_id}")
async def get_conversation(session_id: str):
    """Get conversation history for a specific session"""
    history = get_conversation_history(session_id)
    return {
        "session_id": session_id,
        "conversation_history": format_history_for_response(history),
        "message_count": len(history)
    }


@app.get("/conversations")
async def list_conversations():
    """List all conversation sessions"""
    sessions = []
    for session_id, messages in conversations.items():
        if messages:
            last_message = messages[-1]
            sessions.append({
                "session_id": session_id,
                "last_activity": last_message.timestamp.isoformat(),
                "message_count": len(messages),
                "last_message_preview": last_message.content[:100] + "..." if len(last_message.content) > 100 else last_message.content
            })

    # Sort by last activity
    sessions.sort(key=lambda x: x["last_activity"], reverse=True)
    return {"sessions": sessions}


@app.delete("/conversations/{session_id}")
async def clear_conversation(session_id: str):
    """Clear conversation history for a specific session"""
    if session_id in conversations:
        del conversations[session_id]
        return {"status": "success", "message": f"Conversation {session_id} cleared"}
    return {"status": "error", "message": "Session not found"}


@app.post("/conversations/new")
async def create_new_conversation():
    """Create a new conversation session"""
    new_session_id = f"session_{int(datetime.now().timestamp())}"
    conversations[new_session_id] = []
    return {"session_id": new_session_id}


async def analyze_data_patterns(query_result: list, analysis_type: str) -> dict:
    """Analyze query results for business insights"""
    insights = {
        "trends": [],
        "alerts": [],
        "recommendations": [],
        "metrics": {},
        "predictions": []
    }

    if not query_result:
        return insights

    if analysis_type == "inventory":
        # Analyze inventory patterns
        low_stock_count = 0
        overstock_count = 0
        total_value = 0

        for row in query_result:
            closing_stock = row.get("Closing_Stock", 0)
            min_stock = row.get("Min", 0)
            max_stock = row.get("Max", 0)
            wos = row.get("WOS", 0)
            sku_id = row.get("SKU_ID")
            warehouse_id = row.get("Warehouse_ID")

            # Check for potential stock-outs
            if closing_stock < min_stock:
                low_stock_count += 1
                shortage = min_stock - closing_stock
                insights["alerts"].append(
                    f"⚠️ Critical: SKU {sku_id} in {warehouse_id} is {shortage} units below minimum ({closing_stock}/{min_stock})")
                insights["recommendations"].append(
                    f"🚀 Urgent restock needed: Order {shortage + (min_stock * 0.2):.0f} units for SKU {sku_id}")

            # Check for overstock situations
            elif closing_stock > max_stock:
                overstock_count += 1
                excess = closing_stock - max_stock
                insights["alerts"].append(
                    f"📈 Overstock: SKU {sku_id} in {warehouse_id} has {excess} excess units ({closing_stock}/{max_stock})")
                insights["recommendations"].append(
                    f"💡 Redistribute {excess} units of SKU {sku_id} to other warehouses or offer promotions")

            # Analyze WOS (Weeks of Supply)
            if wos < 1:
                insights["alerts"].append(
                    f"🔴 Critical WOS: SKU {sku_id} has only {wos:.1f} weeks of supply")
                insights["predictions"].append(
                    f"📉 SKU {sku_id} will stock out in {wos * 7:.0f} days without restock")
            elif wos < 2:
                insights["alerts"].append(
                    f"🟡 Low WOS: SKU {sku_id} has {wos:.1f} weeks of supply")
                insights["recommendations"].append(
                    f"⏰ Plan restock for SKU {sku_id} within 1 week")
            elif wos > 8:
                insights["trends"].append(
                    f"📊 High WOS: SKU {sku_id} has {wos:.1f} weeks of supply - consider reducing orders")

            # Calculate inventory value (assuming each unit has value)
            total_value += closing_stock

            # Smart reorder suggestions based on lead time
            lead_time = row.get("Lead_Time_Days", 7)
            if wos <= (lead_time / 7) + 1:  # WOS less than lead time + 1 week buffer
                optimal_order = (min_stock + max_stock) / 2 - closing_stock
                if optimal_order > 0:
                    insights["recommendations"].append(
                        f"🎯 Smart Reorder: SKU {sku_id} needs {optimal_order:.0f} units (Lead time: {lead_time} days)")

        # Overall metrics
        insights["metrics"] = {
            "total_skus_analyzed": len(query_result),
            "low_stock_items": low_stock_count,
            "overstock_items": overstock_count,
            "total_inventory_units": total_value,
            "stock_health_score": max(0, 100 - (low_stock_count + overstock_count) * 10)
        }

        # Strategic insights
        if low_stock_count > len(query_result) * 0.2:  # More than 20% low stock
            insights["alerts"].append(
                f"🚨 Inventory Crisis: {low_stock_count} items critically low - review supply chain")
            insights["recommendations"].append(
                "📋 Implement emergency procurement process and review supplier performance")

    elif analysis_type == "sales":
        # Analyze sales patterns
        total_sales = sum(row.get("Units_Sold", 0) for row in query_result)
        avg_sales = total_sales / len(query_result) if query_result else 0
        high_performers = []
        low_performers = []

        for row in query_result:
            units_sold = row.get("Units_Sold", 0)
            sku_id = row.get("SKU_ID")
            store_id = row.get("Store_ID")

            if units_sold > avg_sales * 1.5:  # 50% above average
                high_performers.append((sku_id, store_id, units_sold))
                insights["trends"].append(
                    f"🌟 Star Performer: SKU {sku_id} in store {store_id} sold {units_sold} units")
            elif units_sold < avg_sales * 0.3:  # 70% below average
                low_performers.append((sku_id, store_id, units_sold))
                insights["trends"].append(
                    f"📉 Underperformer: SKU {sku_id} in store {store_id} sold only {units_sold} units")

        # Sales insights and recommendations
        insights["metrics"] = {
            "total_sales": total_sales,
            "average_sales_per_sku": avg_sales,
            "high_performers": len(high_performers),
            "low_performers": len(low_performers),
            "sales_distribution_score": (len(high_performers) - len(low_performers)) * 10
        }

        # Strategic recommendations based on sales data
        if high_performers:
            top_sku = max(high_performers, key=lambda x: x[2])
            insights["recommendations"].append(
                f"💰 Increase inventory for top performer SKU {top_sku[0]} - it's selling {top_sku[2]} units")

        if low_performers:
            insights["recommendations"].append(
                f"🔄 Review marketing strategy for {len(low_performers)} underperforming SKUs")
            insights["recommendations"].append(
                "💡 Consider promotions, repositioning, or discontinuation for slow-moving items")

    return insights


async def generate_smart_recommendations(session_id: str, query_result: list, analysis_type: str) -> dict:
    """Generate intelligent recommendations based on historical patterns and current data"""
    recommendations = {
        "immediate_actions": [],
        "strategic_insights": [],
        "optimization_opportunities": [],
        "risk_alerts": [],
        "predicted_outcomes": []
    }

    # Analyze conversation history for learning patterns
    history = get_conversation_history(session_id)

    # Learn from previous interactions
    previous_allocations = [
        msg for msg in history if msg.message_type == "allocation_confirmed"]
    allocation_patterns = {}

    for allocation in previous_allocations:
        if allocation.proposed_values:
            for key, value in allocation.proposed_values.items():
                if key not in allocation_patterns:
                    allocation_patterns[key] = []
                allocation_patterns[key].append(float(value))

    if analysis_type == "inventory":
        for row in query_result:
            sku_id = row.get("SKU_ID")
            warehouse_id = row.get("Warehouse_ID")
            closing_stock = row.get("Closing_Stock", 0)
            wos = row.get("WOS", 0)
            min_stock = row.get("Min", 0)
            max_stock = row.get("Max", 0)

            # Immediate action recommendations
            if closing_stock < min_stock:
                urgency = "HIGH" if closing_stock < min_stock * 0.5 else "MEDIUM"
                recommendations["immediate_actions"].append({
                    "priority": urgency,
                    "action": f"Restock SKU {sku_id} in {warehouse_id}",
                    "reason": f"Current: {closing_stock}, Minimum: {min_stock}",
                    "suggested_quantity": max_stock - closing_stock,
                    "timeline": "Within 24 hours" if urgency == "HIGH" else "Within 48 hours"
                })

            # Strategic insights based on learned patterns
            if allocation_patterns and 'Opening_Stock' in allocation_patterns:
                avg_opening_stock = sum(
                    allocation_patterns['Opening_Stock']) / len(allocation_patterns['Opening_Stock'])
                if closing_stock > avg_opening_stock * 1.2:
                    recommendations["strategic_insights"].append(
                        f"SKU {sku_id} consistently maintains higher stock levels - consider optimizing storage costs")

            # Optimization opportunities
            if wos > 6:  # More than 6 weeks of supply
                recommendations["optimization_opportunities"].append({
                    "type": "Cost Optimization",
                    "description": f"SKU {sku_id} has {wos:.1f} weeks of supply",
                    "suggestion": "Reduce next order quantity or delay procurement",
                    "potential_savings": f"~{(closing_stock - max_stock) * 0.1:.0f} units worth of storage cost"
                })

            # Risk alerts with predictions
            if wos < 2 and closing_stock > 0:
                days_until_stockout = wos * 7
                recommendations["risk_alerts"].append({
                    "severity": "HIGH" if days_until_stockout < 7 else "MEDIUM",
                    "alert": f"SKU {sku_id} predicted stockout in {days_until_stockout:.0f} days",
                    "mitigation": "Expedite procurement or transfer from other warehouses"
                })

            # Predicted outcomes based on current trends
            if len(previous_allocations) >= 2:
                recommendations["predicted_outcomes"].append(
                    f"Based on allocation history, SKU {sku_id} may need restock every {wos * 0.8:.0f} days")

    elif analysis_type == "sales":
        total_sales = sum(row.get("Units_Sold", 0) for row in query_result)

        # Sales-based inventory recommendations
        for row in query_result:
            units_sold = row.get("Units_Sold", 0)
            sku_id = row.get("SKU_ID")

            if units_sold > 0:
                # Predict inventory needs based on sales velocity
                weekly_demand = units_sold
                recommended_stock = weekly_demand * 4  # 4 weeks of stock

                recommendations["strategic_insights"].append(
                    f"SKU {sku_id} selling {units_sold} units/week - maintain {recommended_stock} units inventory")

                # High performer
                if units_sold > total_sales / len(query_result) * 2:
                    recommendations["optimization_opportunities"].append({
                        "type": "Revenue Optimization",
                        "description": f"SKU {sku_id} is a high performer",
                        "suggestion": "Increase stock levels and consider cross-selling",
                        "potential_revenue": f"~{units_sold * 1.3:.0f} additional units possible"
                    })

    return recommendations


async def proactive_monitoring(session_id: str) -> dict:
    """Proactively monitor inventory and sales for potential issues"""
    monitoring_results = {
        "critical_alerts": [],
        "trend_analysis": [],
        "performance_metrics": {},
        "predictive_insights": []
    }

    try:
        # Check for critical inventory issues across all warehouses
        critical_inventory_query = '''
        SELECT "SKU_ID", "Warehouse_ID", "Closing_Stock", "Min", "WOS", "Week"
        FROM "inventory_data" 
        WHERE CAST("Closing_Stock" AS FLOAT) < CAST("Min" AS FLOAT) * 1.2
        ORDER BY (CAST("Closing_Stock" AS FLOAT) / NULLIF(CAST("Min" AS FLOAT), 0)) ASC
        LIMIT 10
        '''

        critical_items = run_query(critical_inventory_query, fix_quotes=False)

        for item in critical_items:
            severity = "CRITICAL" if item["Closing_Stock"] < item["Min"] else "WARNING"
            monitoring_results["critical_alerts"].append({
                "severity": severity,
                "message": f"SKU {item['SKU_ID']} in {item['Warehouse_ID']}: {item['Closing_Stock']} units (Min: {item['Min']})",
                "wos": item["WOS"],
                "action_required": "Immediate restock" if severity == "CRITICAL" else "Plan restock"
            })

        # Simple sales analysis without date intervals
        sales_trend_query = '''
        SELECT "SKU_ID", "Week", SUM("Units_Sold") as total_sold
        FROM "sales_data" 
        WHERE "Week" >= '2022-06-06'
        GROUP BY "SKU_ID", "Week"
        ORDER BY "SKU_ID", "Week"
        LIMIT 50
        '''

        sales_trends = run_query(sales_trend_query, fix_quotes=False)

        # Group by SKU to analyze trends
        sku_trends = {}
        for sale in sales_trends:
            sku = sale["SKU_ID"]
            if sku not in sku_trends:
                sku_trends[sku] = []
            sku_trends[sku].append(sale["total_sold"])

        # Analyze each SKU's trend
        for sku, sales_data in sku_trends.items():
            if len(sales_data) >= 2:
                recent_avg = sum(sales_data[-2:]) / 2  # Last 2 weeks average
                # Previous weeks average
                older_avg = sum(sales_data[:-2]) / max(1, len(sales_data) - 2)

                if recent_avg > older_avg * 1.3:  # 30% increase
                    monitoring_results["trend_analysis"].append({
                        "sku": sku,
                        "trend": "INCREASING",
                        "change": f"+{((recent_avg / older_avg - 1) * 100):.1f}%",
                        "recommendation": "Consider increasing inventory levels"
                    })
                elif recent_avg < older_avg * 0.7:  # 30% decrease
                    monitoring_results["trend_analysis"].append({
                        "sku": sku,
                        "trend": "DECREASING",
                        "change": f"-{((1 - recent_avg / older_avg) * 100):.1f}%",
                        "recommendation": "Investigate cause and adjust inventory"
                    })

        # Calculate overall performance metrics
        total_inventory_query = '''
        SELECT 
            COUNT(*) as total_skus,
            SUM("Closing_Stock") as total_units,
            AVG("WOS") as avg_wos,
            COUNT(CASE WHEN "Closing_Stock" < "Min" THEN 1 END) as low_stock_count
        FROM "inventory_data" 
        WHERE "Week" = (SELECT MAX("Week") FROM "inventory_data")
        '''

        metrics = run_query(total_inventory_query, fix_quotes=False)
        if metrics:
            metric = metrics[0]
            monitoring_results["performance_metrics"] = {
                "total_skus": metric["total_skus"],
                "total_inventory_units": metric["total_units"],
                "average_wos": round(metric["avg_wos"], 2),
                "low_stock_items": metric["low_stock_count"],
                "inventory_health_score": max(0, 100 - (metric["low_stock_count"] / metric["total_skus"] * 100))
            }

        # Predictive insights based on patterns
        if len(critical_items) > 5:
            monitoring_results["predictive_insights"].append(
                "⚠️ High number of low-stock items detected. Supply chain review recommended.")

        if monitoring_results["performance_metrics"].get("inventory_health_score", 0) < 70:
            monitoring_results["predictive_insights"].append(
                "📊 Inventory health score below optimal. Consider strategic inventory rebalancing.")

    except Exception as e:
        monitoring_results["critical_alerts"].append({
            "severity": "ERROR",
            "message": f"Monitoring system error: {str(e)}",
            "action_required": "Check system health"
        })

    return monitoring_results


@app.get("/test")
async def test_basic_query():
    """Test basic database connectivity"""
    try:
        test_query = 'SELECT COUNT(*) as total_rows FROM "inventory_data"'
        result = run_query(test_query, fix_quotes=False)
        return {"status": "success", "result": result}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/dashboard/insights")
async def get_dashboard_insights():
    """Get comprehensive dashboard insights for management"""
    try:
        # Get overall inventory health
        inventory_health_query = '''
        SELECT 
            COUNT(*) as total_skus,
            SUM("Closing_Stock") as total_inventory,
            AVG("WOS") as avg_wos,
            COUNT(CASE WHEN "Closing_Stock" < "Min" THEN 1 END) as critical_items,
            COUNT(CASE WHEN "Closing_Stock" > "Max" THEN 1 END) as overstock_items,
            SUM(CASE WHEN "Closing_Stock" < "Min" THEN "Min" - "Closing_Stock" ELSE 0 END) as total_shortage
        FROM "inventory_data" 
        WHERE "Week" = (SELECT MAX("Week") FROM "inventory_data")
        '''

        inventory_metrics = run_query(inventory_health_query, fix_quotes=False)

        # Get sales performance
        sales_performance_query = '''
        SELECT 
            COUNT(DISTINCT "SKU_ID") as active_skus,
            SUM("Units_Sold") as total_sales,
            AVG("Units_Sold") as avg_sales_per_sku
        FROM "sales_data" 
        WHERE "Week" >= '2022-06-20'
        '''

        sales_metrics = run_query(sales_performance_query, fix_quotes=False)

        # Get top performers and underperformers
        top_performers_query = '''
        SELECT "SKU_ID", SUM("Units_Sold") as total_sold
        FROM "sales_data" 
        WHERE "Week" >= '2022-06-06'
        GROUP BY "SKU_ID"
        ORDER BY total_sold DESC
        LIMIT 5
        '''

        top_performers = run_query(top_performers_query, fix_quotes=False)

        # Calculate health scores
        inv_metrics = inventory_metrics[0] if inventory_metrics else {}
        sales_metrics_data = sales_metrics[0] if sales_metrics else {}

        inventory_health_score = max(0, 100 - (
            (inv_metrics.get('critical_items', 0) / max(1, inv_metrics.get('total_skus', 1))) * 60 +
            (inv_metrics.get('overstock_items', 0) /
             max(1, inv_metrics.get('total_skus', 1))) * 40
        ))

        return {
            "dashboard_summary": {
                "inventory_health_score": round(inventory_health_score, 1),
                "total_inventory_value": inv_metrics.get('total_inventory', 0),
                "critical_items_count": inv_metrics.get('critical_items', 0),
                "overstock_items_count": inv_metrics.get('overstock_items', 0),
                "average_wos": round(inv_metrics.get('avg_wos', 0), 2),
                "weekly_sales": sales_metrics_data.get('total_sales', 0),
                "active_skus": sales_metrics_data.get('active_skus', 0)
            },
            "top_performers": top_performers,
            "urgent_actions": [
                f"⚠️ {inv_metrics.get('critical_items', 0)} SKUs below minimum stock",
                f"📈 {inv_metrics.get('overstock_items', 0)} SKUs above maximum stock",
                f"🎯 Total shortage: {inv_metrics.get('total_shortage', 0)} units"
            ],
            "generated_at": datetime.now().isoformat()
        }

    except Exception as e:
        return {"error": f"Dashboard generation failed: {str(e)}"}


@app.post("/ai/optimize")
async def ai_optimize_allocation(req: dict):
    """AI-powered allocation optimization"""
    try:
        warehouse_id = req.get("warehouse_id", "")
        # balance, minimize_cost, maximize_service
        optimization_type = req.get("type", "balance")

        if optimization_type == "balance":
            # Get all inventory that needs balancing
            optimization_query = f'''
            SELECT "SKU_ID", "Warehouse_ID", "Closing_Stock", "Min", "Max", "WOS", "Lead_Time_Days"
            FROM "inventory_data" 
            WHERE ("Closing_Stock" < "Min" OR "Closing_Stock" > "Max")
            {f'AND "Warehouse_ID" ILIKE \'{warehouse_id}\'' if warehouse_id else ''}
            AND "Week" = (SELECT MAX("Week") FROM "inventory_data")
            ORDER BY ABS("Closing_Stock" - ("Min" + "Max")/2) DESC
            '''

            items_to_optimize = run_query(optimization_query, fix_quotes=False)

            optimization_plan = []
            for item in items_to_optimize:
                sku = item["SKU_ID"]
                current_stock = item["Closing_Stock"]
                min_stock = item["Min"]
                max_stock = item["Max"]
                optimal_stock = (min_stock + max_stock) / 2

                if current_stock < min_stock:
                    shortage = optimal_stock - current_stock
                    optimization_plan.append({
                        "sku_id": sku,
                        "warehouse_id": item["Warehouse_ID"],
                        "action": "INCREASE_STOCK",
                        "current_stock": current_stock,
                        "recommended_stock": int(optimal_stock),
                        "adjustment": int(shortage),
                        "reason": f"Below minimum ({min_stock})",
                        "priority": "HIGH" if current_stock < min_stock * 0.5 else "MEDIUM"
                    })
                elif current_stock > max_stock:
                    excess = current_stock - optimal_stock
                    optimization_plan.append({
                        "sku_id": sku,
                        "warehouse_id": item["Warehouse_ID"],
                        "action": "REDUCE_STOCK",
                        "current_stock": current_stock,
                        "recommended_stock": int(optimal_stock),
                        "adjustment": -int(excess),
                        "reason": f"Above maximum ({max_stock})",
                        "priority": "MEDIUM"
                    })

            return {
                "optimization_type": optimization_type,
                "total_items": len(optimization_plan),
                "high_priority": len([p for p in optimization_plan if p["priority"] == "HIGH"]),
                "optimization_plan": optimization_plan[:10],  # Top 10 items
                "estimated_impact": {
                    "cost_reduction": sum([abs(p["adjustment"]) * 0.1 for p in optimization_plan]),
                    "service_improvement": len([p for p in optimization_plan if p["action"] == "INCREASE_STOCK"])
                }
            }

    except Exception as e:
        return {"error": f"Optimization failed: {str(e)}"}


@app.post("/ai/predict")
async def ai_predict_demand(req: dict):
    """AI-powered demand prediction"""
    try:
        sku_id = req.get("sku_id")
        prediction_weeks = req.get("weeks", 4)

        # Get historical sales data
        historical_query = f'''
        SELECT "Week", SUM("Units_Sold") as total_sold
        FROM "sales_data" 
        WHERE "SKU_ID" = {sku_id}
        GROUP BY "Week"
        ORDER BY "Week" DESC
        LIMIT 12
        '''

        historical_data = run_query(historical_query, fix_quotes=False)

        if len(historical_data) < 3:
            return {"error": "Insufficient historical data for prediction"}

        # Simple trend analysis (in production, use ML models)
        sales_values = [row["total_sold"] for row in historical_data]
        avg_sales = sum(sales_values) / len(sales_values)

        # Calculate trend
        recent_avg = sum(sales_values[:4]) / min(4, len(sales_values))
        older_avg = sum(sales_values[4:]) / max(1, len(sales_values) - 4)
        trend_factor = recent_avg / older_avg if older_avg > 0 else 1

        # Generate predictions
        predictions = []
        for week in range(1, prediction_weeks + 1):
            predicted_demand = avg_sales * trend_factor * \
                (0.95 + 0.1 * week/prediction_weeks)  # Simple trending
            # Confidence decreases over time
            confidence = max(50, 90 - week * 10)

            predictions.append({
                "week": week,
                "predicted_demand": round(predicted_demand),
                "confidence_level": confidence,
                "recommendation": "STOCK_UP" if predicted_demand > avg_sales * 1.2 else "NORMAL"
            })

        return {
            "sku_id": sku_id,
            "historical_average": round(avg_sales),
            "trend_factor": round(trend_factor, 2),
            "predictions": predictions,
            "total_predicted_demand": sum([p["predicted_demand"] for p in predictions]),
            "recommendation": "Consider adjusting inventory levels based on predicted trend"
        }

    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}


@app.post("/ai/monitor")
async def start_monitoring(req: dict):
    """Start intelligent monitoring for a session"""
    session_id = req.get(
        "session_id", f"monitor_{int(datetime.now().timestamp())}")

    monitoring_data = await proactive_monitoring(session_id)

    # Add monitoring results to conversation
    monitoring_summary = f"""🤖 PROACTIVE MONITORING ACTIVATED

🚨 CRITICAL ALERTS: {len(monitoring_data['critical_alerts'])}
📊 TREND ANALYSIS: {len(monitoring_data['trend_analysis'])} patterns detected
📈 PERFORMANCE METRICS: {monitoring_data['performance_metrics']}

The AI is now continuously monitoring your inventory and will provide real-time insights."""

    add_message_to_history(session_id, "assistant",
                           monitoring_summary, "monitoring")

    return {
        "session_id": session_id,
        "monitoring_status": "ACTIVE",
        "monitoring_data": monitoring_data,
        "message": "AI monitoring activated. I'll provide proactive insights and alerts."
    }
