.PHONY: help dev-frontend dev-backend lint format test typecheck setup clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Install all dependencies
	cd frontend && npm install
	cd backend && pip install -e ".[dev]"

dev-frontend: ## Start frontend dev server
	cd frontend && npm run dev

dev-backend: ## Start backend dev server
	cd backend && uvicorn app.main:app --reload --port 8000

lint: ## Run all linters
	cd frontend && npm run lint
	cd backend && ruff check .

format: ## Format all code
	cd frontend && npm run format
	cd backend && ruff format .

test: ## Run all tests
	cd frontend && npm run test
	cd backend && pytest

typecheck: ## Run type checking
	cd frontend && npm run typecheck

clean: ## Clean build artifacts
	cd frontend && rm -rf .next node_modules dist
	cd backend && rm -rf __pycache__ .pytest_cache .mypy_cache .ruff_cache dist build *.egg-info
	rm -rf shared/__pycache__
