# KisanGPT

AI-powered farming assistant for Indian farmers.

## Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS

**Backend:** FastAPI, Python, Pydantic

**AI:** Google Gemini, RAG with ChromaDB

**Database:** Firebase Firestore

**Auth:** Firebase Authentication

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- pip

### Installation

```bash
make setup
```

### Development

```bash
make dev-frontend   # Start frontend (port 3000)
make dev-backend    # Start backend (port 8000)
```

### Commands

```bash
make help           # Show all commands
make lint           # Run linters
make format         # Format code
make test           # Run tests
make typecheck      # Type check
```

## Project Structure

```
kisangpt/
  frontend/          # Next.js app
  backend/           # FastAPI app
  shared/            # Shared types
  docs/              # Documentation
  scripts/           # Dev scripts
  .github/           # CI/CD
```

## Environment Variables

Copy `.env.example` to `.env.local` in each stack directory and fill in the values.

## License

Private
