#!/usr/bin/env python3
"""
Test script for the Enhanced Agentic AI Chatbot
This demonstrates the intelligent features and business value
"""
import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"


def print_section(title):
    print("\n" + "="*60)
    print(f"🤖 {title}")
    print("="*60)


def test_chat(message, session_id="test_session"):
    """Test the chat endpoint with enhanced AI analysis"""
    try:
        response = requests.post(f"{BASE_URL}/chat",
                                 json={"message": message,
                                       "session_id": session_id},
                                 timeout=30)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return None


def test_dashboard():
    """Test the dashboard insights endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/dashboard/insights", timeout=30)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Dashboard Error {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Dashboard request failed: {e}")
        return None


def test_optimization():
    """Test AI optimization endpoint"""
    try:
        response = requests.post(f"{BASE_URL}/ai/optimize",
                                 json={"type": "balance"}, timeout=30)
        if response.status_code == 200:
            return response.json()
        else:
            print(
                f"❌ Optimization Error {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Optimization request failed: {e}")
        return None


def test_monitoring():
    """Test AI monitoring endpoint"""
    try:
        response = requests.post(f"{BASE_URL}/ai/monitor",
                                 json={"session_id": "monitor_test"}, timeout=30)
        if response.status_code == 200:
            return response.json()
        else:
            print(
                f"❌ Monitoring Error {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Monitoring request failed: {e}")
        return None


def display_results(data, test_name):
    """Display AI analysis results"""
    if not data:
        return

    print(f"✅ {test_name} - Success!")

    # Show SQL if available
    if 'sql' in data:
        print(f"🔍 SQL: {data['sql']}")

    # Show results count
    if 'response' in data:
        print(f"📊 Data Points: {len(data.get('response', []))}")

    # Show AI insights
    insights = data.get('insights', {})
    if insights:
        print("\n🧠 AI INSIGHTS:")
        for alert in insights.get('alerts', [])[:3]:
            print(f"   🚨 {alert}")
        for rec in insights.get('recommendations', [])[:3]:
            print(f"   💡 {rec}")

        metrics = insights.get('metrics', {})
        if metrics:
            print(f"   📈 Key Metrics: {metrics}")

    # Show smart recommendations
    smart_recs = data.get('smart_recommendations', {})
    if smart_recs:
        print("\n🎯 SMART RECOMMENDATIONS:")
        for action in smart_recs.get('immediate_actions', [])[:2]:
            print(
                f"   ⚡ {action.get('action', 'N/A')} ({action.get('priority', 'N/A')} priority)")

        for insight in smart_recs.get('strategic_insights', [])[:2]:
            print(f"   💼 {insight}")

    # Show monitoring data
    monitoring = data.get('monitoring_data', {})
    if monitoring:
        print("\n🔍 PROACTIVE MONITORING:")
        for alert in monitoring.get('critical_alerts', [])[:2]:
            print(f"   🔴 {alert.get('message', 'N/A')}")

        metrics = monitoring.get('performance_metrics', {})
        if metrics:
            print(
                f"   📊 Health Score: {metrics.get('inventory_health_score', 'N/A')}")


def main():
    print("🚀 TESTING ENHANCED AGENTIC AI CHATBOT")
    print("This demonstrates how the AI goes beyond traditional software...")

    # Test 1: Basic inventory query with AI analysis
    print_section("TEST 1: Basic Inventory Analysis")
    result1 = test_chat("Show me inventory for SKU 100010001")
    display_results(result1, "Basic Inventory Query")

    time.sleep(2)

    # Test 2: Sales trend analysis
    print_section("TEST 2: Sales Intelligence")
    result2 = test_chat("Analyze sales trends for the last 4 weeks")
    display_results(result2, "Sales Trend Analysis")

    time.sleep(2)

    # Test 3: Dashboard insights
    print_section("TEST 3: Executive Dashboard")
    dashboard = test_dashboard()
    if dashboard:
        print("✅ Dashboard Insights Generated!")
        summary = dashboard.get('dashboard_summary', {})
        print(
            f"📊 Inventory Health Score: {summary.get('inventory_health_score', 'N/A')}")
        print(
            f"📦 Total Inventory: {summary.get('total_inventory_value', 'N/A')} units")
        print(
            f"🚨 Critical Items: {summary.get('critical_items_count', 'N/A')}")
        print(f"📈 Weekly Sales: {summary.get('weekly_sales', 'N/A')} units")

        print("\n🎯 URGENT ACTIONS:")
        for action in dashboard.get('urgent_actions', []):
            print(f"   • {action}")

    time.sleep(2)

    # Test 4: AI Optimization
    print_section("TEST 4: AI-Powered Optimization")
    optimization = test_optimization()
    if optimization:
        print("✅ AI Optimization Complete!")
        print(f"📊 Items to Optimize: {optimization.get('total_items', 'N/A')}")
        print(f"🔥 High Priority: {optimization.get('high_priority', 'N/A')}")

        impact = optimization.get('estimated_impact', {})
        print(f"💰 Cost Reduction: ${impact.get('cost_reduction', 'N/A')}")
        print(
            f"📈 Service Improvement: {impact.get('service_improvement', 'N/A')} items")

        print("\n🎯 OPTIMIZATION PLAN:")
        for plan in optimization.get('optimization_plan', [])[:3]:
            print(
                f"   • SKU {plan.get('sku_id')}: {plan.get('action')} - {plan.get('reason')}")

    time.sleep(2)

    # Test 5: Proactive Monitoring
    print_section("TEST 5: Proactive AI Monitoring")
    monitoring = test_monitoring()
    if monitoring:
        print("✅ AI Monitoring Activated!")
        print(f"🔍 Status: {monitoring.get('monitoring_status', 'N/A')}")
        print(f"💬 Message: {monitoring.get('message', 'N/A')}")

        monitoring_data = monitoring.get('monitoring_data', {})
        print(
            f"🚨 Critical Alerts: {len(monitoring_data.get('critical_alerts', []))}")
        print(
            f"📊 Trend Patterns: {len(monitoring_data.get('trend_analysis', []))}")

    print_section("TESTING COMPLETE")
    print("🎉 The Enhanced Agentic AI Chatbot demonstrates:")
    print("   • Proactive issue detection and alerts")
    print("   • Intelligent business recommendations")
    print("   • Predictive analytics and optimization")
    print("   • Real-time monitoring and insights")
    print("   • Context-aware conversation intelligence")
    print("\n💡 This goes far beyond traditional software by providing")
    print("   strategic business intelligence and automated decision support!")


if __name__ == "__main__":
    main()
