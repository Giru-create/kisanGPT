#!/bin/bash
set -e

echo "Setting up KisanGPT development environment..."

echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "Installing backend dependencies..."
cd backend && pip install -e ".[dev]" && cd ..

echo "Setup complete. Run 'make help' to see available commands."
