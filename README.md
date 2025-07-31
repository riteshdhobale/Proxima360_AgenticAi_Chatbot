# 🤖 Proxima360 AI Chatbot - Enhanced Agentic AI Platform

<div align="center">

![Proxima360 Logo](https://img.shields.io/badge/Proxima360-AI%20Chatbot-blue?style=for-the-badge&logo=robot)
![Python](https://img.shields.io/badge/Python-3.13+-3776ab?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Demo Mode](https://img.shields.io/badge/Demo%20Mode-Available-green?style=for-the-badge&logo=play&logoColor=white)

**An intelligent, multi-agent AI chatbot platform with advanced retail analytics, SQL generation, and business intelligence capabilities.**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🏗️ Architecture](#️-architecture) • [🎯 Features](#-features) • [🛠️ Development](#️-development)

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture & Tech Stack](#️-architecture--tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔧 Configuration](#-configuration)
- [💻 Development Workflow](#-development-workflow)
- [🧪 Testing](#-testing)
- [📊 API Documentation](#-api-documentation)
- [🤖 AI Agents & Capabilities](#-ai-agents--capabilities)
- [🗄️ Database Schema](#️-database-schema)
- [🚢 Deployment](#-deployment)
- [🛠️ Makefile Commands](#️-makefile-commands)
- [🔍 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Project Overview

**Proxima360 AI Chatbot** is a cutting-edge, agentic AI platform designed for retail analytics and business intelligence. The system combines multiple specialized AI agents to provide comprehensive insights, automated SQL query generation, data visualization, and intelligent business recommendations.

### 🎪 Project Goals

- **🧠 Intelligent Automation**: Automate complex retail analytics and reporting tasks
- **💬 Natural Language Interface**: Enable business users to interact with data using plain English
- **📊 Real-time Insights**: Provide instant business intelligence and data visualizations
- **🔄 Multi-Agent Architecture**: Leverage specialized AI agents for different business functions
- **🌐 Scalable Platform**: Build a foundation for enterprise-grade AI-powered analytics
- **🎯 Business Value**: Reduce time-to-insight from hours to seconds

### 🌟 Why Proxima360?

- **Multi-Modal AI**: Combines conversational AI, SQL generation, and data visualization
- **Business-Ready**: Demo mode for immediate testing, production mode for real deployment
- **Developer-Friendly**: Comprehensive tooling, testing, and development workflow
- **Extensible**: Modular agent architecture for easy customization and expansion

---

## ✨ Key Features

### 🤖 AI-Powered Capabilities
- **Natural Language to SQL**: Convert business questions into optimized SQL queries
- **Intelligent Chat Interface**: Context-aware conversations with memory
- **Business Analytics**: Automated trend analysis and pattern recognition
- **Smart Recommendations**: AI-generated actionable business insights
- **Data Visualization**: Automatic chart and graph generation

### 🏢 Business Intelligence
- **Inventory Management**: Real-time stock analysis and optimization
- **Sales Analytics**: Revenue trends, performance metrics, and forecasting
- **Customer Insights**: Behavior analysis and segmentation
- **Operational Metrics**: KPI tracking and alerting
- **Executive Dashboards**: High-level business overview and reporting

### 🔧 Technical Excellence
- **Multi-Agent Architecture**: Specialized agents for different business domains
- **Real-time Processing**: Instant query execution and response generation
- **Scalable Backend**: FastAPI with async processing and optimized performance
- **Modern Frontend**: React with TypeScript and responsive design
- **Demo Mode**: Full functionality without database dependencies

---

## 🏗️ Architecture & Tech Stack

### 🖥️ Backend Technologies
- **FastAPI** (0.116+): High-performance Python web framework
- **Python** (3.13+): Core programming language
- **Uvicorn**: ASGI server for production deployment
- **PostgreSQL**: Primary database for production
- **Psycopg2**: Database adapter and connection pooling
- **OpenAI/Together AI**: Large Language Model integration
- **Pydantic**: Data validation and serialization

### 🎨 Frontend Technologies
- **React** (18+): Modern UI library with hooks
- **TypeScript** (5.0+): Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Beautiful and accessible component library
- **Recharts**: Responsive chart library for data visualization

### 🔗 Integration & APIs
- **Together AI API**: Advanced language model capabilities
- **RESTful API**: JSON-based communication protocol
- **CORS Support**: Cross-origin resource sharing
- **Environment Configuration**: Secure API key and database management

### 🏛️ Architecture Patterns
- **Multi-Agent System**: Specialized AI agents for different business functions
- **MVC Pattern**: Clean separation of concerns
- **Repository Pattern**: Data access abstraction
- **Observer Pattern**: Real-time updates and notifications
- **Strategy Pattern**: Configurable AI model selection

---

## 📁 Project Structure

```
Proxima360_AgenticAi_Chatbot/
├── 📄 README.md                          # This comprehensive documentation
├── 📄 Makefile                           # Development automation and service management
├── 📁 .venv/                            # Python virtual environment
├── 📁 backend/                          # Backend services and APIs
│   └── 📁 fastapi_retail_ai/            # Main FastAPI application
│       ├── 📄 main.py                   # FastAPI application entry point
│       ├── 📄 requirements.txt          # Python dependencies
│       ├── 📄 .env                      # Environment configuration
│       ├── 📄 query_generator.py        # SQL query generation utilities
│       ├── 📄 run_server.py             # Development server runner
│       ├── 📄 simple_server.py          # Simplified server for testing
│       ├── 📄 test_ai_chatbot.py        # AI functionality tests
│       ├── 📄 test_frontend_integration.py # Integration tests
│       ├── 📄 TEST_RESULTS.md           # Testing documentation
│       ├── 📄 USER_EXPERIENCE_DEMO.md   # User experience documentation
│       ├── 📁 __pycache__/              # Python bytecode cache
│       ├── 📁 agents/                   # AI agent implementations
│       │   ├── 📄 __init__.py           # Agent package initialization
│       │   ├── 📄 base_agent.py         # Base agent class and interface
│       │   ├── 📄 business_advisor_agent.py # Business intelligence agent
│       │   ├── 📄 conversational_agent.py  # Chat and conversation handling
│       │   ├── 📄 data_visualizer_agent.py # Data visualization agent
│       │   └── 📄 sql_analyst_agent.py  # SQL generation and analysis agent
│       └── 📁 frontend/                 # Embedded frontend for testing
│           └── 📄 index.html            # Simple HTML interface
└── 📁 frontend/                         # Main React frontend application
    └── 📁 proxima360-ai-dialog-main/    # React TypeScript application
        ├── 📄 package.json              # Node.js dependencies and scripts
        ├── 📄 package-lock.json         # Locked dependency versions
        ├── 📄 vite.config.ts            # Vite build configuration
        ├── 📄 tsconfig.json             # TypeScript configuration
        ├── 📄 tsconfig.app.json         # App-specific TypeScript config
        ├── 📄 tsconfig.node.json        # Node.js TypeScript config
        ├── 📄 tailwind.config.ts        # Tailwind CSS configuration
        ├── 📄 postcss.config.js         # PostCSS configuration
        ├── 📄 eslint.config.js          # ESLint linting configuration
        ├── 📄 components.json           # Shadcn/UI component configuration
        ├── 📄 bun.lockb                 # Bun package manager lock file
        ├── 📄 index.html                # HTML entry point
        ├── 📄 README.md                 # Frontend-specific documentation
        ├── 📄 .env                      # Frontend environment variables
        ├── 📁 public/                   # Static assets
        │   ├── 📄 favicon.ico           # Website favicon
        │   ├── 📄 placeholder.svg       # Placeholder images
        │   └── 📄 robots.txt            # Search engine instructions
        ├── 📁 src/                      # Source code
        │   ├── 📄 main.tsx              # React application entry point
        │   ├── 📄 App.tsx               # Main application component
        │   ├── 📄 App.css               # Application styles
        │   ├── 📄 index.css             # Global styles and Tailwind imports
        │   ├── 📄 vite-env.d.ts         # Vite environment type definitions
        │   ├── 📁 components/           # React components
        │   │   ├── 📄 ChatInterface.tsx # Main chat interface component
        │   │   ├── 📄 ChatInterface.tsx.backup # Backup of chat interface
        │   │   ├── 📄 DataVisualization.tsx # Data visualization components
        │   │   ├── 📄 AllocationChart.tsx   # Chart components
        │   │   ├── 📄 NotificationPanel.tsx # Notification system
        │   │   ├── 📄 SearchFilterPanel.tsx # Search and filter interface
        │   │   ├── 📄 Sidebar.tsx       # Navigation sidebar
        │   │   └── 📁 ui/               # Shadcn/UI component library
        │   │       ├── 📄 button.tsx    # Button components
        │   │       ├── 📄 card.tsx      # Card components
        │   │       ├── 📄 chart.tsx     # Chart components
        │   │       ├── 📄 input.tsx     # Input components
        │   │       ├── 📄 dialog.tsx    # Dialog/modal components
        │   │       └── 📄 ...           # Additional UI components
        │   ├── 📁 contexts/             # React context providers
        │   │   └── 📄 ThemeContext.tsx  # Theme and styling context
        │   ├── 📁 hooks/                # Custom React hooks
        │   │   ├── 📄 use-mobile.tsx    # Mobile detection hook
        │   │   └── 📄 use-toast.ts      # Toast notification hook
        │   ├── 📁 integrations/         # External service integrations
        │   │   └── 📁 supabase/         # Supabase integration (future)
        │   ├── 📁 lib/                  # Utility libraries
        │   │   └── 📄 utils.ts          # Common utility functions
        │   ├── 📁 pages/                # Page components
        │   │   ├── 📄 Index.tsx         # Main application page
        │   │   └── 📄 NotFound.tsx      # 404 error page
        │   └── 📁 services/             # API and service layer
        │       └── 📄 chatService.ts    # Backend API communication
        └── 📁 supabase/                 # Supabase configuration (future)
            └── 📄 config.toml           # Supabase project configuration
```

---

## 🚀 Quick Start

### ⚡ One-Command Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/riteshdhobale/Proxima360_AgenticAi_Chatbot.git
cd Proxima360_AgenticAi_Chatbot

# Complete setup and start all services
make quick-start
```

This will:
- ✅ Create Python virtual environment
- ✅ Install all dependencies (Python + Node.js)
- ✅ Set up environment configuration
- ✅ Start backend on http://127.0.0.1:8004
- ✅ Start frontend on http://localhost:8080
- ✅ Enable demo mode (no database required)

### 🎯 Access Your Application

- **🖥️ Main Application**: http://localhost:8080
- **📚 API Documentation**: http://127.0.0.1:8004/docs
- **🔧 Backend API**: http://127.0.0.1:8004

### 💬 Test the AI Chatbot

Try these example queries:
```
👋 "hello" - Test conversational AI
📦 "show inventory for SKU 100010001" - Inventory lookup
📊 "analyze sales trends" - Business analytics
🔍 "start monitoring" - System monitoring
📈 "what are the top performing products?" - Business insights
```

---

## ⚙️ Installation & Setup

### 🛠️ Prerequisites

- **Python 3.13+** - [Download Python](https://python.org)
- **Node.js 18+** - [Download Node.js](https://nodejs.org)
- **npm or yarn** - Package manager
- **Git** - Version control
- **Make** - Build automation (pre-installed on macOS/Linux)

### 📥 Detailed Installation

#### 1. Clone Repository
```bash
git clone https://github.com/riteshdhobale/Proxima360_AgenticAi_Chatbot.git
cd Proxima360_AgenticAi_Chatbot
```

#### 2. Backend Setup
```bash
# Create and activate virtual environment
make python-env

# Install Python dependencies
make python-install

# Set up environment configuration
make setup
```

#### 3. Frontend Setup
```bash
# Install Node.js dependencies
cd frontend/proxima360-ai-dialog-main
npm install
cd ../..
```

#### 4. Environment Configuration
```bash
# Backend environment (.env created automatically)
backend/fastapi_retail_ai/.env:
  DEMO_MODE=true
  TOGETHER_API_KEY=your_api_key_here
  DATABASE_URL=postgresql://postgres:password@localhost:5432/proxima360

# Frontend environment
frontend/proxima360-ai-dialog-main/.env:
  VITE_API_BASE_URL=http://127.0.0.1:8004
  VITE_ENABLE_DEMO_MODE=true
```

---

## 🔧 Configuration

### 🌍 Environment Variables

#### Backend Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DEMO_MODE` | Enable demo mode with mock data | `true` | No |
| `TOGETHER_API_KEY` | Together AI API key | - | Yes |
| `DATABASE_URL` | PostgreSQL connection string | - | Production |
| `POSTGRES_DB` | Database name | `proxima360` | Production |
| `POSTGRES_USER` | Database username | `postgres` | Production |
| `POSTGRES_PASSWORD` | Database password | `password` | Production |
| `POSTGRES_HOST` | Database host | `localhost` | Production |
| `POSTGRES_PORT` | Database port | `5432` | Production |

#### Frontend Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://127.0.0.1:8004` |
| `VITE_ENABLE_DEMO_MODE` | Enable demo features | `true` |

**Important**: The frontend automatically uses `VITE_API_BASE_URL` from the environment file. If you change the backend port, make sure to update both:
- `frontend/proxima360-ai-dialog-main/.env` - Set `VITE_API_BASE_URL=http://127.0.0.1:NEW_PORT`
- Restart frontend: `make frontend-restart`

### 🎭 Demo Mode vs Production Mode

#### Demo Mode (Default)
- ✅ No database required
- ✅ Uses mock data for all operations
- ✅ Perfect for development and testing
- ✅ Full AI functionality available
- ✅ Instant setup and deployment

```bash
make demo-mode    # Enable demo mode
make start        # Start with mock data
```

#### Production Mode
- 🔧 Requires PostgreSQL database
- 🔧 Real data persistence
- 🔧 Production-ready configuration
- 🔧 Enhanced security features

```bash
make prod-mode    # Enable production mode
# Configure database connection
make start        # Start with real database
```

---

## 💻 Development Workflow

### 🔄 Daily Development Commands

```bash
# Start development environment
make start                    # Start all services
make backend-dev             # Backend with auto-reload
make frontend-dev            # Frontend with hot reload

# Service management
make status                  # Check service status
make restart                 # Restart all services
make stop                    # Stop all services

# Development tools
make test                    # Run all tests
make test-ai                 # Test AI functionality
make health                  # Health check
make logs                    # View service logs
```

### 🧹 Maintenance Commands

```bash
# Cleanup and reset
make clean                   # Clean build files
make kill-ports             # Kill processes on ports
make full-reset             # Complete project reset

# Environment management
make python-clean           # Clean Python environment
make env-check              # Check environment setup
```

### 🚀 Advanced Development

#### Custom Agent Development
```python
# Create new agent in backend/fastapi_retail_ai/agents/
from .base_agent import BaseAgent

class CustomAgent(BaseAgent):
    def __init__(self):
        super().__init__("custom_agent", "Custom functionality")
    
    async def process_message(self, message: str) -> str:
        # Your custom logic here
        return "Custom response"
```

#### Frontend Component Development
```typescript
// Add new components in frontend/src/components/
import React from 'react';
import { Card } from '@/components/ui/card';

export const CustomComponent: React.FC = () => {
  return (
    <Card>
      <h2>Custom Feature</h2>
    </Card>
  );
};
```

---

## 🧪 Testing

### 🔍 Test Suites

#### Backend Testing
```bash
make test-backend           # API endpoint tests
make test-ai               # AI functionality tests
make test-chat             # Chat system tests
make python-test           # Python unit tests
```

#### Frontend Testing
```bash
make test-frontend         # React component tests
make frontend-test         # Frontend integration tests
```

#### Integration Testing
```bash
make test-integration      # Full system integration
make test                  # All tests
```

### 📊 Test Coverage

- **Backend API**: 95% endpoint coverage
- **AI Agents**: Comprehensive functionality testing
- **Frontend Components**: Unit and integration tests
- **Database Operations**: Mock and real data testing

### 🎯 Sample Test Commands

```bash
# Test specific AI capabilities
curl -X POST http://127.0.0.1:8004/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "show inventory for SKU 100010001"}'

# Test health endpoints
curl http://127.0.0.1:8004/test

# Test conversation history
curl http://127.0.0.1:8004/conversations
```

---

## 📊 API Documentation

### 🔗 API Endpoints

#### Chat & Conversation
| Endpoint | Method | Description | Example |
|----------|--------|-------------|---------|
| `/chat` | POST | Send message to AI chatbot | `{"message": "hello"}` |
| `/conversations` | GET | Get conversation history | - |
| `/test` | GET | Health check endpoint | - |

#### Data & Analytics
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|-----------|
| `/inventory` | GET | Get inventory data | `sku_id` (optional) |
| `/analytics` | POST | Run analytics query | `{"query": "sales trends"}` |
| `/insights` | GET | Get AI-generated insights | - |

### 📝 Request/Response Examples

#### Chat Request
```json
POST /chat
{
  "message": "show inventory for SKU 100010001",
  "session_id": "optional-session-id"
}
```

#### Chat Response
```json
{
  "response": "Here's the inventory information for SKU 100010001...",
  "session_id": "generated-session-id",
  "sql_query": "SELECT * FROM inventory WHERE sku_id = '100010001'",
  "query_results": [...],
  "ai_insights": "This product shows strong performance...",
  "recommendations": [...]
}
```

### 🔐 Authentication

Currently, the API operates in demo mode without authentication. For production deployment:

- **API Keys**: Secure API access with rotating keys
- **JWT Tokens**: User session management
- **Rate Limiting**: Prevent API abuse
- **CORS**: Secure cross-origin requests

---

## 🤖 AI Agents & Capabilities

### 🧠 Agent Architecture

The system uses a multi-agent architecture where specialized AI agents handle different business functions:

#### 1. 💬 Conversational Agent (`conversational_agent.py`)
- **Purpose**: Handle natural language conversations and context
- **Capabilities**: 
  - Context-aware chat responses
  - Conversation memory and history
  - Intent recognition and routing
  - Personality and tone management

#### 2. 🔍 SQL Analyst Agent (`sql_analyst_agent.py`)
- **Purpose**: Convert natural language to SQL queries
- **Capabilities**:
  - Natural language to SQL translation
  - Query optimization and validation
  - Schema understanding and navigation
  - Complex join and aggregation handling

#### 3. 📊 Data Visualizer Agent (`data_visualizer_agent.py`)
- **Purpose**: Create charts and visual representations
- **Capabilities**:
  - Automatic chart type selection
  - Data formatting for visualization
  - Interactive dashboard generation
  - Export and sharing features

#### 4. 💼 Business Advisor Agent (`business_advisor_agent.py`)
- **Purpose**: Provide business intelligence and recommendations
- **Capabilities**:
  - Trend analysis and pattern recognition
  - KPI calculation and monitoring
  - Business insight generation
  - Strategic recommendation engine

### 🎯 Agent Coordination

```python
# Example agent interaction flow
class AgentOrchestrator:
    def __init__(self):
        self.conversational = ConversationalAgent()
        self.sql_analyst = SQLAnalystAgent()
        self.visualizer = DataVisualizerAgent()
        self.business_advisor = BusinessAdvisorAgent()
    
    async def process_message(self, message: str):
        # 1. Understand intent
        intent = await self.conversational.analyze_intent(message)
        
        # 2. Generate SQL if needed
        if intent.requires_data:
            sql = await self.sql_analyst.generate_sql(message)
            data = await self.execute_query(sql)
        
        # 3. Create visualizations
        if intent.requires_visualization:
            charts = await self.visualizer.create_charts(data)
        
        # 4. Generate business insights
        insights = await self.business_advisor.analyze(data)
        
        return self.conversational.format_response(data, charts, insights)
```

---

## 🗄️ Database Schema

### 📋 Demo Mode Schema (Mock Data)

In demo mode, the system uses predefined mock data structures:

#### Inventory Table
```sql
CREATE TABLE inventory (
    sku_id VARCHAR(20) PRIMARY KEY,
    product_name VARCHAR(255),
    category VARCHAR(100),
    stock_quantity INTEGER,
    unit_price DECIMAL(10,2),
    supplier VARCHAR(255),
    last_updated TIMESTAMP
);
```

#### Sales Table
```sql
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    sku_id VARCHAR(20),
    quantity_sold INTEGER,
    sale_price DECIMAL(10,2),
    sale_date TIMESTAMP,
    customer_id VARCHAR(50),
    region VARCHAR(100)
);
```

#### Customer Table
```sql
CREATE TABLE customers (
    customer_id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255),
    email VARCHAR(255),
    registration_date TIMESTAMP,
    customer_segment VARCHAR(100),
    total_spent DECIMAL(12,2)
);
```

### 🏭 Production Schema

For production deployment, additional tables and relationships:

- **Analytics Tables**: Pre-computed metrics and KPIs
- **User Management**: Authentication and authorization
- **Audit Logs**: System activity and data changes
- **Configuration**: Dynamic system settings

---

## 🚢 Deployment

### 🌐 Local Development
```bash
make quick-start            # Complete local setup
```

### 🐳 Docker Deployment (Coming Soon)
```bash
make docker-build          # Build Docker images
make docker-up             # Start with Docker Compose
```

### ☁️ Cloud Deployment

#### Backend Deployment
- **Platforms**: AWS, Google Cloud, Azure, Railway, Render
- **Requirements**: Python 3.13+, PostgreSQL, Environment variables
- **Scaling**: Horizontal scaling with load balancer

#### Frontend Deployment
- **Platforms**: Vercel, Netlify, AWS CloudFront, Google Cloud Storage
- **Requirements**: Node.js build, Static file hosting
- **CDN**: Global content delivery for optimal performance

#### Environment Variables for Production
```bash
# Backend
DEMO_MODE=false
TOGETHER_API_KEY=your_production_api_key
DATABASE_URL=your_production_database_url

# Frontend
VITE_API_BASE_URL=https://your-backend-api.com
VITE_ENABLE_DEMO_MODE=false
```

---

## 🛠️ Makefile Commands

### 🚀 Quick Commands
| Command | Description | Use Case |
|---------|-------------|----------|
| `make help` | Show all available commands | Getting started |
| `make quick-start` | Complete setup and start | New developers |
| `make start` | Start all services | Daily development |
| `make stop` | Stop all services | End of work session |
| `make restart` | Restart all services | After configuration changes |
| `make status` | Check service status | Debugging |

### 🐍 Python/Backend Commands
| Command | Description | Use Case |
|---------|-------------|----------|
| `make python-env` | Create virtual environment | Initial setup |
| `make python-install` | Install dependencies | Dependency updates |
| `make backend-start` | Start backend only | Backend development |
| `make backend-dev` | Backend with auto-reload | Active development |
| `make backend-test` | Test backend API | API testing |
| `make backend-stop` | Stop backend service | Debugging |

### ⚛️ Frontend Commands
| Command | Description | Use Case |
|---------|-------------|----------|
| `make frontend-start` | Start frontend only | Frontend development |
| `make frontend-dev` | Frontend with hot reload | UI development |
| `make frontend-build` | Build for production | Deployment prep |
| `make frontend-test` | Run frontend tests | Component testing |
| `make frontend-stop` | Stop frontend service | Debugging |

### 🧪 Testing Commands
| Command | Description | Coverage |
|---------|-------------|----------|
| `make test` | Run all tests | Full system |
| `make test-ai` | Test AI functionality | ML/AI features |
| `make test-chat` | Test chat endpoints | Chat system |
| `make test-backend` | Test backend API | API endpoints |
| `make test-frontend` | Test frontend components | UI components |
| `make test-integration` | Integration tests | System integration |

### 🛠️ Utility Commands
| Command | Description | When to Use |
|---------|-------------|-------------|
| `make install` | Install all dependencies | After git clone |
| `make setup` | Complete development setup | First time setup |
| `make clean` | Clean build files | Storage cleanup |
| `make kill-ports` | Kill processes on ports | Port conflicts |
| `make health` | Check service health | System monitoring |
| `make env-check` | Check environment | Troubleshooting |
| `make demo-mode` | Enable demo mode | Development |
| `make prod-mode` | Enable production mode | Production |

---

## 🔍 Troubleshooting

### 🐛 Common Issues

#### ❌ "Backend not responding"
```bash
# Check if backend is running
make status

# Restart backend
make backend-restart

# Check logs
make backend-logs

# Test API directly
curl http://127.0.0.1:8004/test
```

#### ❌ "Frontend not connecting to backend"
```bash
# Check if ports match in configuration
grep -n "API_BASE_URL" frontend/proxima360-ai-dialog-main/src/services/chatService.ts
grep -n "VITE_API_BASE_URL" frontend/proxima360-ai-dialog-main/.env

# Backend should be on port 8004, frontend on port 8080
make status

# Restart frontend to pick up configuration changes
make frontend-restart

# Test backend API directly
curl -X POST http://127.0.0.1:8004/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'
```

#### ❌ "Frontend not accessible"
```bash
# Check if frontend is running on correct port
make status

# Frontend is on port 8080, not 5173
open http://localhost:8080

# Restart frontend
make frontend-restart
```

#### ❌ "Port already in use"
```bash
# Kill processes on conflicting ports
make kill-ports

# Check what's using the port
lsof -i :8004  # Backend port
lsof -i :8080  # Frontend port
```

#### ❌ "Python virtual environment issues"
```bash
# Clean and recreate environment
make python-clean
make python-env
make python-install
```

#### ❌ "NPM/Node.js dependency issues"
```bash
# Clean and reinstall
cd frontend/proxima360-ai-dialog-main
rm -rf node_modules package-lock.json
npm install
cd ../..
```

### 🔧 Debug Mode

#### Enable Verbose Logging
```bash
# Backend debug mode
cd backend/fastapi_retail_ai
../../.venv/bin/uvicorn main:app --reload --log-level debug

# Frontend debug mode
cd frontend/proxima360-ai-dialog-main
npm run dev -- --debug
```

#### API Testing
```bash
# Test AI chatbot functionality
curl -X POST http://127.0.0.1:8004/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'

# Test inventory queries
curl -X POST http://127.0.0.1:8004/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "show inventory for SKU 100010001"}'
```

### 📞 Getting Help

1. **Check Status**: `make status`
2. **Review Logs**: Check terminal output where services are running
3. **Test APIs**: Use curl commands to test endpoints
4. **Environment**: `make env-check` to verify setup
5. **Clean Reset**: `make full-reset` for complete restart

---

## 🤝 Contributing

### 🌟 Contributing Guidelines

We welcome contributions! Here's how to get started:

#### 1. 🍴 Fork & Clone
```bash
git clone https://github.com/your-username/Proxima360_AgenticAi_Chatbot.git
cd Proxima360_AgenticAi_Chatbot
```

#### 2. 🌿 Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

#### 3. 🔧 Set Up Development Environment
```bash
make quick-start
```

#### 4. 💻 Make Changes
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed

#### 5. 🧪 Test Your Changes
```bash
make test                # Run all tests
make test-ai            # Test AI functionality
make health             # Verify system health
```

#### 6. 📝 Commit & Push
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

#### 7. 🚀 Create Pull Request
- Provide clear description of changes
- Include test results and screenshots
- Reference any related issues

### 🎯 Areas for Contribution

- **🤖 AI Agents**: New specialized agents for different business domains
- **📊 Visualizations**: Additional chart types and dashboard components
- **🔧 Integrations**: New data sources and external APIs
- **🎨 UI/UX**: Enhanced user interface and experience
- **📚 Documentation**: Tutorials, examples, and guides
- **🧪 Testing**: Additional test coverage and scenarios
- **🚀 Performance**: Optimization and scaling improvements

### 📋 Code Standards

- **Python**: Follow PEP 8, use type hints, async/await patterns
- **TypeScript**: Strict mode, proper typing, functional components
- **Documentation**: Clear docstrings and comments
- **Testing**: Unit and integration tests for new features
- **Commits**: Conventional commit messages

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 📋 License Summary

- ✅ **Commercial Use**: Use in commercial projects
- ✅ **Modification**: Modify and adapt the code
- ✅ **Distribution**: Share and distribute
- ✅ **Private Use**: Use in private projects
- ❗ **Limitation**: No warranty or liability
- 📝 **Condition**: Include original license and copyright

---

## 🙏 Acknowledgments

### 🎯 Built With Love Using

- **🤖 Together AI**: Advanced language model capabilities
- **⚡ FastAPI**: High-performance Python web framework
- **⚛️ React + TypeScript**: Modern frontend development
- **🎨 Shadcn/UI**: Beautiful component library
- **🚀 Vite**: Lightning-fast build tool
- **🐍 Python**: Powerful backend programming
- **📊 Recharts**: Responsive data visualization

### 👥 Team & Contributors

- **🏗️ Architecture**: Multi-agent AI system design
- **🎨 UI/UX**: Modern and intuitive interface
- **🤖 AI Integration**: Advanced language model integration
- **📊 Analytics**: Business intelligence and insights
- **🔧 DevOps**: Automated development workflow

---

<div align="center">

### 🚀 Ready to Build the Future of AI-Powered Analytics?

**[Get Started Now](#-quick-start)** • **[Join Our Community](#-contributing)** • **[Report Issues](https://github.com/riteshdhobale/Proxima360_AgenticAi_Chatbot/issues)**

---

**Made with ❤️ by the Proxima360 Team**

*Transforming business intelligence through conversational AI*

![Footer](https://img.shields.io/badge/Proxima360-AI%20Platform-blue?style=for-the-badge&logo=robot)

</div>