# Proxima360 Retail AI Copilot
# Developer workflow helpers. Secrets are never written by this file.

.PHONY: help setup install backend-install frontend-install dev backend-dev frontend-dev lint build test clean env-example

BACKEND_PORT ?= 8004
FRONTEND_PORT ?= 8080
BACKEND_DIR := backend/fastapi_retail_ai
FRONTEND_DIR := frontend/proxima360-ai-dialog-main
PYTHON ?= python3
VENV := .venv
PIP := $(VENV)/bin/pip
UVICORN := $(VENV)/bin/uvicorn

help:
	@echo "Proxima360 Retail AI Copilot"
	@echo ""
	@echo "Common commands:"
	@echo "  make setup          Create env examples and install dependencies"
	@echo "  make backend-dev    Run FastAPI on http://127.0.0.1:$(BACKEND_PORT)"
	@echo "  make frontend-dev   Run Vite frontend"
	@echo "  make dev            Start backend, then print frontend command"
	@echo "  make lint           Run available lint/syntax checks"
	@echo "  make build          Build frontend"
	@echo "  make clean          Remove local generated files"

setup: env-example install
	@echo "Setup complete. Add your own keys to $(BACKEND_DIR)/.env before calling the LLM."

env-example:
	@mkdir -p $(BACKEND_DIR) $(FRONTEND_DIR)
	@if [ ! -f "$(BACKEND_DIR)/.env" ]; then \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
		echo "Created $(BACKEND_DIR)/.env from .env.example"; \
	else \
		echo "Keeping existing $(BACKEND_DIR)/.env"; \
	fi
	@if [ ! -f "$(FRONTEND_DIR)/.env" ]; then \
		echo "VITE_API_BASE_URL=http://127.0.0.1:$(BACKEND_PORT)" > $(FRONTEND_DIR)/.env; \
		echo "VITE_ENABLE_DEMO_MODE=true" >> $(FRONTEND_DIR)/.env; \
		echo "Created $(FRONTEND_DIR)/.env"; \
	else \
		echo "Keeping existing $(FRONTEND_DIR)/.env"; \
	fi

install: backend-install frontend-install

$(VENV):
	$(PYTHON) -m venv $(VENV)

backend-install: $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install -r $(BACKEND_DIR)/requirements.txt
	$(PIP) install pytest httpx pytest-asyncio

frontend-install:
	cd $(FRONTEND_DIR) && npm ci

backend-dev: $(VENV)
	cd $(BACKEND_DIR) && ../../$(UVICORN) main:app --reload --host 127.0.0.1 --port $(BACKEND_PORT)

frontend-dev:
	cd $(FRONTEND_DIR) && npm run dev -- --host 127.0.0.1 --port $(FRONTEND_PORT)

dev:
	@echo "Terminal 1: make backend-dev"
	@echo "Terminal 2: make frontend-dev"

lint:
	$(PYTHON) -m compileall -q $(BACKEND_DIR)
	cd $(FRONTEND_DIR) && npm run lint

build:
	cd $(FRONTEND_DIR) && npm run build

test: lint build

clean:
	rm -rf $(VENV) .pytest_cache
	rm -rf $(FRONTEND_DIR)/dist $(FRONTEND_DIR)/.vite
	find . -type d -name __pycache__ -prune -exec rm -rf {} +
