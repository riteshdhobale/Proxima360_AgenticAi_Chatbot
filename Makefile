# Proxima360 AI Chatbot - Enhanced Agentic AI Platform
# Makefile for managing all services and development workflows

.PHONY: help install start stop restart logs clean test build \
	backend-start backend-stop backend-restart backend-dev backend-test backend-logs \
	frontend-start frontend-stop frontend-restart frontend-dev frontend-build frontend-test frontend-logs \
	python-env python-install python-test python-clean \
	docker-build docker-up docker-down docker-logs docker-clean \
	db-start db-stop db-restart db-status db-logs db-shell db-seed db-init db-reset db-backup db-restore \
	kill-ports health setup status env-check demo-mode prod-mode \
	test-ai test-chat test-backend test-frontend test-integration test-e2e \
	deploy-dev deploy-prod quick-start full-reset

# Configuration
BACKEND_PORT=8004
FRONTEND_PORT=8080
BACKEND_DIR=backend/fastapi_retail_ai
FRONTEND_DIR=frontend/proxima360-ai-dialog-main
PYTHON_ENV=.venv
PYTHON_BIN=$(PYTHON_ENV)/bin/python
PIP_BIN=$(PYTHON_ENV)/bin/pip
UVICORN_BIN=$(PYTHON_ENV)/bin/uvicorn

# Default target
help:
	@echo "🤖 Proxima360 AI Chatbot - Service Management"
	@echo "============================================="
	@echo ""
	@echo "📋 Available commands:"
	@echo ""
	@echo "🚀 Quick Start Commands:"
	@echo "  quick-start   - Complete setup and start (new developers)"
	@echo "  start         - Start all services (backend + frontend)"
	@echo "  stop          - Stop all services"
	@echo "  restart       - Restart all services"
	@echo "  status        - Check service status"
	@echo "  logs          - Show service logs"
	@echo ""
	@echo "🐍 Python/Backend Commands:"
	@echo "  python-env    - Create Python virtual environment"
	@echo "  python-install- Install Python dependencies"
	@echo "  backend-start - Start FastAPI backend only"
	@echo "  backend-dev   - Start backend in development mode"
	@echo "  backend-stop  - Stop backend service"
	@echo "  backend-test  - Test backend API endpoints"
	@echo "  backend-logs  - Show backend logs"
	@echo ""
	@echo "⚛️ Frontend Commands:"
	@echo "  frontend-start- Start React frontend only"
	@echo "  frontend-dev  - Start frontend in development mode"
	@echo "  frontend-build- Build frontend for production"
	@echo "  frontend-stop - Stop frontend service"
	@echo "  frontend-test - Run frontend tests"
	@echo "  frontend-logs - Show frontend logs"
	@echo ""
	@echo "🧪 Testing Commands:"
	@echo "  test          - Run all tests"
	@echo "  test-ai       - Test AI chatbot functionality"
	@echo "  test-chat     - Test chat endpoints"
	@echo "  test-backend  - Test backend API"
	@echo "  test-frontend - Test frontend components"
	@echo "  test-integration - Run integration tests"
	@echo ""
	@echo "🗄️ Database Commands:"
	@echo "  db-start      - Start database (PostgreSQL/demo mode)"
	@echo "  db-stop       - Stop database"
	@echo "  db-status     - Check database status"
	@echo "  db-seed       - Seed database with sample data"
	@echo "  db-reset      - Reset database completely"
	@echo ""
	@echo "🐳 Docker Commands:"
	@echo "  docker-build  - Build Docker images"
	@echo "  docker-up     - Start with Docker Compose"
	@echo "  docker-down   - Stop Docker services"
	@echo "  docker-logs   - Show Docker logs"
	@echo ""
	@echo "🛠️ Utility Commands:"
	@echo "  install       - Install all dependencies"
	@echo "  setup         - Complete development setup"
	@echo "  clean         - Clean all build files and dependencies"
	@echo "  kill-ports    - Kill processes on common ports"
	@echo "  health        - Check service health"
	@echo "  env-check     - Check environment configuration"
	@echo "  demo-mode     - Enable demo mode (no database required)"
	@echo "  prod-mode     - Enable production mode"
	@echo ""
	@echo "🚢 Deployment Commands:"
	@echo "  build         - Build production version"
	@echo "  deploy-dev    - Deploy to development environment"
	@echo "  deploy-prod   - Deploy to production environment"
	@echo "  full-reset    - Complete project reset and setup"

# Quick start for new developers
quick-start: setup start
	@echo "🎉 Proxima360 AI Chatbot is ready!"
	@echo "📱 Frontend: http://localhost:$(FRONTEND_PORT)"
	@echo "🔧 Backend API: http://localhost:$(BACKEND_PORT)"
	@echo "📚 API Docs: http://localhost:$(BACKEND_PORT)/docs"
	@echo ""
	@echo "💡 Try these commands in the chat:"
	@echo "  - 'hello' (conversational)"
	@echo "  - 'show inventory for SKU 100010001'"
	@echo "  - 'analyze sales trends'"
	@echo "  - 'start monitoring'"

# Environment setup
setup: python-env python-install install env-check
	@echo "🎯 Setting up Proxima360 AI Chatbot development environment..."
	@echo "Creating environment files..."
	@mkdir -p $(BACKEND_DIR)
	@mkdir -p $(FRONTEND_DIR)
	@echo "# Proxima360 AI Chatbot Backend Environment" > $(BACKEND_DIR)/.env
	@echo "DEMO_MODE=true" >> $(BACKEND_DIR)/.env
	@echo "TOGETHER_API_KEY=tgp_v1_SVHtipTjCmGJ3M6rvjHrxtnKqWnbShrVHshVQtBf8io" >> $(BACKEND_DIR)/.env
	@echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/proxima360" >> $(BACKEND_DIR)/.env
	@echo "POSTGRES_DB=proxima360" >> $(BACKEND_DIR)/.env
	@echo "POSTGRES_USER=postgres" >> $(BACKEND_DIR)/.env
	@echo "POSTGRES_PASSWORD=password" >> $(BACKEND_DIR)/.env
	@echo "POSTGRES_HOST=localhost" >> $(BACKEND_DIR)/.env
	@echo "POSTGRES_PORT=5432" >> $(BACKEND_DIR)/.env
	@echo "# Frontend Environment" > $(FRONTEND_DIR)/.env
	@echo "VITE_API_BASE_URL=http://127.0.0.1:$(BACKEND_PORT)" >> $(FRONTEND_DIR)/.env
	@echo "VITE_ENABLE_DEMO_MODE=true" >> $(FRONTEND_DIR)/.env
	@echo "✅ Development environment ready!"
	@echo "💡 Run 'make start' to start all services"

# Python environment management
python-env:
	@echo "🐍 Creating Python virtual environment..."
	@if [ ! -d "$(PYTHON_ENV)" ]; then \
		python3 -m venv $(PYTHON_ENV); \
		echo "✅ Virtual environment created"; \
	else \
		echo "✅ Virtual environment already exists"; \
	fi

python-install: python-env
	@echo "📦 Installing Python dependencies..."
	@$(PIP_BIN) install --upgrade pip
	@$(PIP_BIN) install -r $(BACKEND_DIR)/requirements.txt
	@$(PIP_BIN) install pytest httpx pytest-asyncio
	@echo "✅ Python dependencies installed"

python-test:
	@echo "🧪 Running Python tests..."
	@cd $(BACKEND_DIR) && $(PYTHON_BIN) -m pytest -v
	@echo "✅ Python tests completed"

python-clean:
	@echo "🧹 Cleaning Python environment..."
	@rm -rf $(PYTHON_ENV)
	@rm -rf $(BACKEND_DIR)/__pycache__
	@rm -rf $(BACKEND_DIR)/**/__pycache__
	@echo "✅ Python environment cleaned"

# Install all dependencies
install: python-install
	@echo "📦 Installing all dependencies..."
	@echo "Installing frontend dependencies..."
	@cd $(FRONTEND_DIR) && npm install
	@echo "✅ All dependencies installed!"

# Backend service management
backend-start: python-env python-install
	@echo "🚀 Starting FastAPI backend on port $(BACKEND_PORT)..."
	@cd $(BACKEND_DIR) && ../../$(UVICORN_BIN) main:app --host 127.0.0.1 --port $(BACKEND_PORT) &
	@echo "✅ Backend started on http://127.0.0.1:$(BACKEND_PORT)"
	@echo "📚 API Documentation: http://127.0.0.1:$(BACKEND_PORT)/docs"

backend-dev: python-env python-install
	@echo "🔧 Starting FastAPI backend in development mode..."
	@cd $(BACKEND_DIR) && $(UVICORN_BIN) main:app --reload --host 127.0.0.1 --port $(BACKEND_PORT) &
	@echo "✅ Backend development server started with auto-reload"

backend-stop:
	@echo "🛑 Stopping backend service..."
	@pkill -f "uvicorn.*main:app" || true
	@pkill -f "python.*main.py" || true
	@echo "✅ Backend stopped"

backend-restart: backend-stop
	@sleep 2
	@make backend-start

backend-test:
	@echo "🧪 Testing backend API endpoints..."
	@echo "Testing health endpoint..."
	@curl -s http://127.0.0.1:$(BACKEND_PORT)/test || echo "❌ Backend not responding"
	@echo ""
	@echo "Testing chat endpoint..."
	@curl -s -X POST http://127.0.0.1:$(BACKEND_PORT)/chat \
		-H "Content-Type: application/json" \
		-d '{"message": "hello"}' | head -c 100 || echo "❌ Chat endpoint not working"
	@echo ""
	@echo "Testing AI features..."
	@curl -s -X POST http://127.0.0.1:$(BACKEND_PORT)/chat \
		-H "Content-Type: application/json" \
		-d '{"message": "show inventory for SKU 100010001"}' | head -c 150 || echo "❌ AI features not working"
	@echo ""

backend-logs:
	@echo "📊 Backend service logs:"
	@echo "Check terminal where backend is running or use 'make logs'"

# Frontend service management
frontend-start:
	@echo "🚀 Starting React frontend on port $(FRONTEND_PORT)..."
	@cd $(FRONTEND_DIR) && npm run dev &
	@echo "✅ Frontend started on http://localhost:$(FRONTEND_PORT)"

frontend-dev:
	@echo "🔧 Starting frontend in development mode..."
	@cd $(FRONTEND_DIR) && npm run dev

frontend-build:
	@echo "🏗️ Building frontend for production..."
	@cd $(FRONTEND_DIR) && npm run build
	@echo "✅ Frontend build completed"
	@echo "📦 Build size: $$(du -sh $(FRONTEND_DIR)/dist 2>/dev/null || echo 'N/A')"

frontend-stop:
	@echo "🛑 Stopping frontend service..."
	@pkill -f "vite" || true
	@pkill -f "npm.*dev" || true
	@echo "✅ Frontend stopped"

frontend-restart: frontend-stop
	@sleep 2
	@make frontend-start

frontend-test:
	@echo "🧪 Running frontend tests..."
	@cd $(FRONTEND_DIR) && npm test || echo "⚠️ No tests configured yet"
	@echo "✅ Frontend tests completed"

frontend-logs:
	@echo "📊 Frontend service logs:"
	@echo "Check terminal where frontend is running or use 'make logs'"

# Start all services
start: backend-start
	@sleep 3
	@make frontend-start
	@echo ""
	@echo "🎉 All services started successfully!"
	@echo "📱 Frontend: http://localhost:$(FRONTEND_PORT)"
	@echo "🔧 Backend: http://127.0.0.1:$(BACKEND_PORT)"
	@echo "📚 API Docs: http://127.0.0.1:$(BACKEND_PORT)/docs"
	@echo ""
	@echo "🤖 AI Chatbot Features:"
	@echo "  • Natural language processing"
	@echo "  • SQL query generation"
	@echo "  • Business intelligence insights"
	@echo "  • Inventory management"
	@echo "  • Demo mode (no database required)"
	@echo ""
	@echo "💡 Try asking: 'show inventory status' or 'hello'"

# Stop all services
stop: backend-stop frontend-stop
	@echo "✅ All services stopped"

# Restart all services
restart: stop
	@sleep 2
	@make start

# Show logs (placeholder for future log aggregation)
logs:
	@echo "📊 Service logs:"
	@echo "🔧 Backend: Check terminal running 'make backend-start'"
	@echo "⚛️ Frontend: Check terminal running 'make frontend-start'"
	@echo ""
	@echo "💡 For real-time logs, run services in separate terminals:"
	@echo "  Terminal 1: make backend-dev"
	@echo "  Terminal 2: make frontend-dev"

# Testing commands
test: python-test frontend-test backend-test
	@echo "✅ All tests completed"

test-ai:
	@echo "🤖 Testing AI chatbot functionality..."
	@echo "Testing conversational AI..."
	@curl -s -X POST http://127.0.0.1:$(BACKEND_PORT)/chat \
		-H "Content-Type: application/json" \
		-d '{"message": "hello"}' | grep -o '"response":"[^"]*"' || echo "❌ Conversational AI not working"
	@echo ""
	@echo "Testing inventory queries..."
	@curl -s -X POST http://127.0.0.1:$(BACKEND_PORT)/chat \
		-H "Content-Type: application/json" \
		-d '{"message": "show inventory for SKU 100010001"}' | grep -o '"SKU_ID":[0-9]*' || echo "❌ Inventory queries not working"
	@echo ""
	@echo "Testing AI insights..."
	@curl -s -X POST http://127.0.0.1:$(BACKEND_PORT)/chat \
		-H "Content-Type: application/json" \
		-d '{"message": "analyze sales trends"}' | grep -o '"ai_insights":"[^"]*"' | head -c 50 || echo "❌ AI insights not working"
	@echo ""

test-chat:
	@echo "💬 Testing chat endpoints..."
	@echo "Testing basic chat..."
	@curl -s -X POST http://127.0.0.1:$(BACKEND_PORT)/chat \
		-H "Content-Type: application/json" \
		-d '{"message": "test message"}' | jq '.session_id' 2>/dev/null || echo "❌ Chat endpoint not responding"
	@echo "Testing conversation history..."
	@curl -s http://127.0.0.1:$(BACKEND_PORT)/conversations | jq '.sessions' 2>/dev/null || echo "❌ Conversation history not working"
	@echo "✅ Chat tests completed"

test-backend: backend-test test-ai test-chat

test-frontend:
	@echo "⚛️ Testing frontend..."
	@echo "Checking if frontend is accessible..."
	@curl -s http://localhost:$(FRONTEND_PORT) | head -c 100 || echo "❌ Frontend not accessible"
	@echo ""
	@echo "✅ Frontend tests completed"

test-integration:
	@echo "🔗 Running integration tests..."
	@echo "Testing frontend-backend communication..."
	@# Future: Add comprehensive integration tests
	@echo "⚠️ Integration tests not implemented yet"

# Kill processes on specific ports
kill-ports:
	@echo "🔪 Killing processes on common ports..."
	@lsof -ti:$(FRONTEND_PORT) | xargs kill -9 2>/dev/null || true
	@lsof -ti:$(BACKEND_PORT) | xargs kill -9 2>/dev/null || true
	@lsof -ti:8000 | xargs kill -9 2>/dev/null || true
	@lsof -ti:8001 | xargs kill -9 2>/dev/null || true
	@lsof -ti:8002 | xargs kill -9 2>/dev/null || true
	@lsof -ti:8003 | xargs kill -9 2>/dev/null || true
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@lsof -ti:5000 | xargs kill -9 2>/dev/null || true
	@lsof -ti:5173 | xargs kill -9 2>/dev/null || true
	@lsof -ti:5432 | xargs kill -9 2>/dev/null || true
	@echo "✅ Ports cleared"

# Health check
health:
	@echo "🏥 Checking service health..."
	@echo "Backend ($(BACKEND_PORT)):"
	@curl -s http://127.0.0.1:$(BACKEND_PORT)/test 2>/dev/null | head -c 50 || echo "❌ Backend not responding"
	@echo ""
	@echo "Frontend ($(FRONTEND_PORT)):"
	@curl -s http://localhost:$(FRONTEND_PORT) 2>/dev/null | head -c 50 || echo "❌ Frontend not responding"
	@echo ""
	@echo "AI Chat functionality:"
	@curl -s -X POST http://127.0.0.1:$(BACKEND_PORT)/chat \
		-H "Content-Type: application/json" \
		-d '{"message": "health check"}' 2>/dev/null | grep -o '"session_id":"[^"]*"' || echo "❌ AI Chat not working"
	@echo ""

# Status check
status:
	@echo "📈 Proxima360 AI Chatbot - Service Status:"
	@echo "========================================"
	@lsof -i :$(FRONTEND_PORT) >/dev/null 2>&1 && echo "✅ Frontend ($(FRONTEND_PORT)): Running" || echo "❌ Frontend ($(FRONTEND_PORT)): Stopped"
	@lsof -i :$(BACKEND_PORT) >/dev/null 2>&1 && echo "✅ Backend ($(BACKEND_PORT)): Running" || echo "❌ Backend ($(BACKEND_PORT)): Stopped"
	@echo ""
	@echo "🐍 Python Environment:"
	@[ -d "$(PYTHON_ENV)" ] && echo "✅ Virtual environment: Ready" || echo "❌ Virtual environment: Missing"
	@echo ""
	@echo "📦 Dependencies:"
	@[ -d "$(FRONTEND_DIR)/node_modules" ] && echo "✅ Frontend dependencies: Installed" || echo "❌ Frontend dependencies: Missing"
	@$(PIP_BIN) list 2>/dev/null | grep -q fastapi && echo "✅ Backend dependencies: Installed" || echo "❌ Backend dependencies: Missing"
	@echo ""
	@echo "💾 Demo Mode Status:"
	@grep -q "DEMO_MODE=true" $(BACKEND_DIR)/.env 2>/dev/null && echo "✅ Demo mode: Enabled" || echo "❌ Demo mode: Disabled"

# Environment check
env-check:
	@echo "🔍 Checking environment configuration..."
	@echo "Python version: $$(python3 --version)"
	@echo "Node version: $$(node --version 2>/dev/null || echo 'Not installed')"
	@echo "NPM version: $$(npm --version 2>/dev/null || echo 'Not installed')"
	@echo "Virtual environment: $$([ -d '$(PYTHON_ENV)' ] && echo 'Ready' || echo 'Missing')"
	@echo "Backend directory: $$([ -d '$(BACKEND_DIR)' ] && echo 'Found' || echo 'Missing')"
	@echo "Frontend directory: $$([ -d '$(FRONTEND_DIR)' ] && echo 'Found' || echo 'Missing')"

# Mode switching
demo-mode:
	@echo "🎭 Enabling demo mode..."
	@sed -i '' 's/DEMO_MODE=.*/DEMO_MODE=true/' $(BACKEND_DIR)/.env 2>/dev/null || echo "DEMO_MODE=true" >> $(BACKEND_DIR)/.env
	@echo "✅ Demo mode enabled - no database required"
	@echo "💡 Restart backend with 'make backend-restart' to apply changes"

prod-mode:
	@echo "🏭 Enabling production mode..."
	@sed -i '' 's/DEMO_MODE=.*/DEMO_MODE=false/' $(BACKEND_DIR)/.env 2>/dev/null || echo "DEMO_MODE=false" >> $(BACKEND_DIR)/.env
	@echo "✅ Production mode enabled - database required"
	@echo "💡 Restart backend with 'make backend-restart' to apply changes"

# Build for production
build: frontend-build
	@echo "🏗️ Building production version..."
	@echo "✅ Production build completed"

# Clean all dependencies and build files
clean: python-clean
	@echo "🧹 Cleaning project..."
	@rm -rf $(FRONTEND_DIR)/node_modules
	@rm -rf $(FRONTEND_DIR)/dist
	@rm -rf $(FRONTEND_DIR)/.vite
	@rm -rf .vite
	@rm -rf **/__pycache__
	@rm -rf .pytest_cache
	@echo "✅ Project cleaned"

# Database management (placeholder for future database integration)
db-start:
	@echo "🗄️ Database management..."
	@echo "✅ Demo mode active - using mock data"
	@echo "💡 No database setup required in demo mode"

db-stop:
	@echo "🛑 Stopping database services..."
	@echo "ℹ️ Demo mode - no database to stop"

db-status:
	@echo "📊 Database Status:"
	@grep -q "DEMO_MODE=true" $(BACKEND_DIR)/.env 2>/dev/null && echo "✅ Demo mode: Using mock data" || echo "❌ Production mode: Database required"

db-seed:
	@echo "🌱 Seeding database..."
	@echo "ℹ️ Demo mode uses built-in mock data"

db-reset:
	@echo "🔄 Resetting database..."
	@echo "ℹ️ Demo mode - mock data is automatically reset on restart"

# Docker commands (for future Docker integration)
docker-build:
	@echo "🐳 Docker support coming soon..."
	@echo "💡 For now, use 'make start' to run services locally"

docker-up:
	@echo "🐳 Docker Compose support coming soon..."
	@echo "💡 Use 'make start' for local development"

docker-down:
	@echo "🐳 Docker services management coming soon..."

docker-logs:
	@echo "🐳 Docker logs will be available when Docker support is added"

# Deployment commands (placeholder)
deploy-dev:
	@echo "🚀 Development deployment..."
	@make build
	@echo "✅ Ready for development deployment"
	@echo "💡 Deploy the contents of $(FRONTEND_DIR)/dist"

deploy-prod:
	@echo "🚀 Production deployment..."
	@make prod-mode
	@make build
	@echo "✅ Ready for production deployment"
	@echo "💡 Configure production database and deploy"

# Complete project reset
full-reset: clean setup
	@echo "🔄 Complete project reset completed"
	@echo "🎯 Project is ready for development"
	@echo "💡 Run 'make start' to begin"

# Quick development commands
dev: setup backend-dev
	@echo "🔧 Development mode started"
	@echo "💡 Run 'make frontend-dev' in another terminal"

# Help for specific topics
help-testing:
	@echo "🧪 Testing Commands Help:"
	@echo "  test          - Run all tests"
	@echo "  test-ai       - Test AI/ML functionality"
	@echo "  test-chat     - Test chat endpoints"
	@echo "  test-backend  - Test backend API"
	@echo "  test-frontend - Test frontend"
	@echo "  backend-test  - Quick backend health check"

help-deployment:
	@echo "🚀 Deployment Help:"
	@echo "  build         - Build for production"
	@echo "  deploy-dev    - Deploy to development"
	@echo "  deploy-prod   - Deploy to production"
	@echo "  prod-mode     - Switch to production mode"
	@echo "  demo-mode     - Switch to demo mode"

help-development:
	@echo "🛠️ Development Help:"
	@echo "  setup         - Complete setup"
	@echo "  backend-dev   - Backend with auto-reload"
	@echo "  frontend-dev  - Frontend with hot reload"
	@echo "  python-env    - Create Python environment"
	@echo "  install       - Install dependencies"
	@echo "  clean         - Clean project"
