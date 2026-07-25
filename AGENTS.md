# AGENTS.md

> This file is referenced in `AGENT.md` as the first file to read before any coding.
>
> It serves as the entry point for all AI coding agents.

---

## Quick Start

Before making any code changes:

1. Read this file completely
2. Read `AGENT.md` for engineering principles
3. Read `ROADMAP.md` for current project status
4. Read `CURRENT_TASK.md` for current task details
5. Read all documentation in `/docs` directory

---

## Project Overview

**KisanGPT** is an AI-powered farming assistant for Indian farmers.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript 5, Tailwind CSS 3, Zustand, Framer Motion |
| Backend | Python 3.11+, FastAPI, Pydantic v2, httpx |
| AI | Google Gemini API (gemini-2.5-flash) |
| Database | Firebase Auth, ChromaDB (future) |
| Testing | Vitest (frontend), pytest (backend) |
| CI/CD | GitHub Actions |

---

## AI Agent Responsibilities

### Antigravity (Frontend Agent)

- UI Design
- UX
- Frontend Architecture
- Accessibility (WCAG 2.1 AA)
- Responsive Design
- Animations
- Design System
- Visual Components

### OpenCode (Backend Agent)

- Backend Architecture
- FastAPI
- APIs
- Authentication
- AI Agents
- Gemini Integration
- Firebase
- ChromaDB
- Business Logic
- Testing
- Deployment
- Documentation

---

## Architecture

### Project Structure

```
kisangpt/
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # Reusable UI components
│   │   ├── features/   # Feature modules (dashboard, weather, disease)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── types/      # TypeScript type definitions
│   ├── public/         # Static assets
│   └── package.json
├── backend/            # FastAPI application
│   ├── app/
│   │   ├── api/        # API endpoints
│   │   ├── core/       # Configuration, exceptions, middleware
│   │   ├── models/     # Pydantic models
│   │   ├── services/   # Business logic
│   │   └── agents/     # AI agents
│   ├── tests/          # pytest tests
│   └── pyproject.toml
├── docs/               # Documentation
├── AGENT.md            # Engineering constitution
├── ARCHITECTURE.md     # Technical architecture
├── ROADMAP.md          # Development roadmap
├── CURRENT_TASK.md     # Current task definition
└── CHANGELOG.MD        # Version history
```

### API Design

- All endpoints: `/api/v1/`
- Authentication: Firebase ID tokens
- Streaming: Server-Sent Events (SSE)
- Validation: Pydantic v2
- Error handling: Structured error responses

---

## Coding Standards

### TypeScript (Frontend)

- Strict mode enabled
- No `any` types
- Functional components with hooks
- Tailwind CSS for styling
- Path aliases: `@/` → `src/`

### Python (Backend)

- Type hints required
- Ruff for linting/formatting
- Pydantic for validation
- Structured logging
- Clean architecture

---

## Testing Requirements

### Frontend (Vitest)

```bash
cd frontend
pnpm test
```

### Backend (pytest)

```bash
cd backend
pytest -v
```

---

## Quality Checklist

Before considering any task complete:

- [ ] Code builds successfully
- [ ] All tests pass
- [ ] Lint passes
- [ ] Type checking passes
- [ ] Documentation updated
- [ ] No duplicated logic
- [ ] No security issues
- [ ] Accessibility considered
- [ ] Performance reviewed

---

## Key Files

| File | Purpose |
|------|---------|
| `AGENT.md` | Engineering constitution and principles |
| `ARCHITECTURE.md` | Technical architecture decisions |
| `ROADMAP.md` | Development roadmap and progress |
| `CURRENT_TASK.md` | Current task definition |
| `CHANGELOG.MD` | Version history and changes |
| `frontend/docs/` | Frontend specifications |

---

## Communication

Always explain:

1. What you will do
2. Why you are doing it
3. Files that will change
4. Risks involved
5. Testing performed
6. Remaining work

If uncertain, ask. Never guess.

---

## Remember

Quality is always more important than speed.

Every commit should move KisanGPT closer to production-ready.
