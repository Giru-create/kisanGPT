# KisanGPT Architecture

> This document defines the technical architecture of KisanGPT.
>
> Every AI coding agent (OpenCode, Antigravity, Claude, Codex, etc.) must read this document before making architectural decisions.
>
> This document is the single source of truth for project architecture.

---

# Vision

KisanGPT is an AI-powered farming assistant designed for Indian farmers.

The application provides intelligent recommendations through conversational AI while integrating weather intelligence, crop disease detection, market prices, farm memory, and government schemes into a unified experience.

---

# Engineering Principles

Every architectural decision should prioritize:

- Simplicity
- Scalability
- Reliability
- Security
- Accessibility
- Performance
- Maintainability
- Developer Experience

Never sacrifice maintainability for short-term speed.

---

# High-Level Architecture

```
                User
                  │
                  ▼
         Next.js Frontend
                  │
                  ▼
            API Gateway
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    FastAPI Backend      AI Services
        │                   │
        ▼                   ▼
 Firebase Firestore     Gemini API
        │                   │
        └─────────┬─────────┘
                  ▼
              ChromaDB
                  │
                  ▼
             Long-term Memory
```

---

# Technology Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand
- React Hook Form
- Zod

---

## Backend

- FastAPI
- Python
- Pydantic
- Uvicorn

---

## Database

- Firebase Firestore
- ChromaDB

---

## AI

- Google Gemini
- Retrieval-Augmented Generation (RAG)

---

## Authentication

- Firebase Authentication

---

## Deployment

Frontend

- Vercel

Backend

- Railway or Render

---

# Project Structure

```
KisanGPT/

frontend/
backend/
shared/
docs/
tests/
scripts/

.github/

.env.example

README.md

AGENTS.md
ROADMAP.md
CURRENT_TASK.md
CHANGELOG.md
ARCHITECTURE.md
```

---

# Frontend Architecture

Frontend follows Feature-Based Architecture.

```
frontend/

app/

components/

features/

hooks/

services/

store/

types/

utils/

constants/

styles/

assets/
```

---

# Backend Architecture

Backend follows Clean Architecture.

```
backend/

app/

api/

agents/

services/

models/

schemas/

repositories/

core/

utils/

config/

tests/
```

---

# AI Architecture

Each AI capability is implemented as an independent agent.

Examples

- Chat Agent
- Disease Detection Agent
- Weather Agent
- Market Agent
- Government Scheme Agent
- Recommendation Agent
- Memory Agent

Each agent has:

- Single responsibility
- Clear input
- Clear output
- Logging
- Error handling
- Retry logic

Never create one giant AI agent.

---

# API Design

REST-first architecture.

Every endpoint includes:

- Validation
- Authentication
- Error handling
- Logging
- Typed responses

---

# Data Flow

```
User

↓

Frontend

↓

FastAPI

↓

Business Services

↓

AI Agents

↓

Gemini

↓

Response

↓

Frontend
```

---

# Memory Flow

```
User Message

↓

Embedding

↓

ChromaDB

↓

Relevant Context

↓

Gemini

↓

Response
```

---

# Folder Responsibilities

Frontend

Responsible for:

- UI
- UX
- Accessibility
- Responsive Design

Backend

Responsible for:

- APIs
- Business Logic
- AI
- Authentication

Shared

Responsible for:

- Shared Types
- Utilities
- Constants

---

# Coding Standards

Always:

- Strict typing
- Modular code
- Reusable components
- Small functions
- Meaningful naming
- Feature-based organization

Never:

- Duplicate logic
- Hardcode secrets
- Create giant files

---

# Error Handling

Every layer must gracefully handle errors.

Never expose internal exceptions.

Always return meaningful messages.

---

# Logging

Use structured logging.

No debug print statements in production.

---

# Security

Always:

- Validate input
- Sanitize uploads
- Protect secrets
- Use environment variables
- Authenticate requests
- Prevent prompt injection where applicable

---

# Testing Strategy

Every feature must include:

- Unit tests
- Integration tests
- Manual verification

Before merging:

- Tests pass
- Lint passes
- Type checking passes

---

# Accessibility

Frontend must satisfy:

- WCAG AA
- Keyboard navigation
- Screen reader compatibility
- Focus management
- Reduced motion support

Accessibility is mandatory.

---

# Performance

Optimize for:

- Fast startup
- Lazy loading
- Dynamic imports
- Optimized images
- Streaming AI responses
- Efficient database queries

---

# AI Collaboration

## Antigravity

Owns:

- UI/UX
- Frontend
- Accessibility
- Design System

---

## OpenCode

Owns:

- Backend
- AI
- APIs
- Firebase
- FastAPI
- ChromaDB
- Deployment
- Testing

---

# Development Workflow

Before coding:

1. Read AGENTS.md
2. Read ARCHITECTURE.md
3. Read CURRENT_TASK.md
4. Read ROADMAP.md
5. Read CHANGELOG.md

Create a plan.

Wait for approval.

Implement one milestone.

Update documentation.

Stop.

---

# Future Architecture

Planned integrations:

- Multi-language support
- Voice-first interaction
- Offline mode
- Push notifications
- Analytics dashboard
- Admin portal
- Farmer community features

These should be added without disrupting the core architecture.

---

# Definition of Good Architecture

Good architecture is:

- Easy to understand
- Easy to extend
- Easy to test
- Easy to maintain
- Easy to scale

Every architectural decision should make future development easier, not harder.