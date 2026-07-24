# Changelog

All notable changes to KisanGPT are documented in this file.

This project follows a milestone-based development workflow.

---

# [Unreleased]

## Added

### Frontend Foundation (Antigravity)

- **Feature-Based Folder Structure**: Modular folder hierarchy following `ARCHITECTURE.md` (`app`, `components`, `constants`, `features`, `hooks`, `lib`, `store`, `styles`, `types`, `utils`).
- **Design Tokens System**: Centralized design tokens for colors (KisanGPT Emerald `#16a34a`, Harvest Amber `#f59e0b`, Slate base), typography, spacing, radii, z-index (`src/constants/tokens.ts`).
- **Theme System**: Dark, Light, and System modes with persistent storage, `document.documentElement` class toggle, and smooth color transitions (`src/store/themeStore.ts`, `src/app/providers.tsx`).
- **Typography & Color System**: Scalable rem typography hierarchy, high contrast WCAG AA color palette (`src/app/globals.css`, `tailwind.config.ts`).
- **Atomic UI Components**: Accessible `Button`, `Input`, `Card`, `Badge`, `Dialog` (Modal), `Skeleton`, `Spinner`, `Alert`, `Avatar`, `Tooltip`, `Table`, and `ThemeToggle` (`src/components/ui/`).
- **Layout System**: `AppShell`, `Header`, `Sidebar`, `Footer`, `PageContainer`, and `Grid` primitives (`src/components/layout/`).
- **Navigation Primitives**: `SkipToContent`, `NavLink` with `aria-current="page"`, `Breadcrumbs`, and `MobileNav` responsive menu (`src/components/navigation/`).
- **Accessibility Foundation**: `a11y.ts` utilities, `VisuallyHidden`, `FocusTrap`, `LiveRegion`, `useFocusTrap`, `useKeyboardShortcut`, and `useReducedMotion` hooks (`src/components/accessibility/`, `src/hooks/`).

### Backend Foundation (OpenCode)

- **FastAPI Application**: Production-ready FastAPI app with CORS, lifespan hooks, and versioned API routing (`app/main.py`).
- **API Versioning**: Central v1 router at `/api/v1/` with health endpoint (`app/api/v1/router.py`, `app/api/v1/health.py`).
- **Configuration Management**: Pydantic Settings loading from `.env` with typed env vars for Gemini, Firebase, ChromaDB (`app/core/config.py`).
- **Structured Logging**: JSON-formatted logging with request method, path, status code, and duration (`app/core/logging.py`, `app/core/middleware.py`).
- **Exception Handling**: Global exception handlers returning structured JSON errors, never exposing internals (`app/core/exceptions.py`).
- **Request Logging Middleware**: Logs every request with method, path, status code, and response time.
- **Lifecycle Management**: Startup/shutdown hooks via FastAPI lifespan for future database/AI connections (`app/core/lifespan.py`).
- **Testing Setup**: pytest + pytest-asyncio + httpx with health check and root endpoint tests.
- **Linting & Formatting**: Ruff 0.16.0 configured for linting and formatting with strict rule set.
- **Docker**: Multi-stage Dockerfile with development and production targets.
- **Agents Package**: Empty `app/agents/` package per Clean Architecture spec.

## Planned
- Backend foundation (complete)
- AI chat
- Disease detection
- Weather intelligence
- Market intelligence
- Voice assistant
- Farm memory
- Government schemes
- Testing & CI/CD
- Deployment

---

# [0.1.0] - Project Initialization

## Added

### Repository

- Created KisanGPT repository.
- Established project structure.
- Added documentation directory.
- Added frontend directory.
- Added backend directory.
- Added shared directory.
- Added assets directory.
- Added scripts directory.
- Added tests directory.
- Added GitHub workflows directory.

### Documentation

- Added Product Requirements Document (PRD).
- Added Technical Requirements Document (TRD).
- Added AI Architecture documentation.
- Added User Journey documentation.
- Added Feature specifications.
- Added AGENTS.md.
- Added ROADMAP.md.
- Added CHANGELOG.md.

### Planning

- Defined project milestones.
- Defined engineering workflow.
- Defined AI collaboration strategy.
- Assigned frontend ownership to Antigravity.
- Assigned backend ownership to OpenCode.

---

# Release History

| Version | Date | Description |
|----------|------|-------------|
| 0.1.0 | YYYY-MM-DD | Initial project setup and documentation |

---

# Upcoming

## Version 0.2.0

Planned:

- Next.js initialization
- FastAPI initialization
- Development tooling
- Linting
- Testing
- Environment configuration

---

# AI Agent Notes

Before starting work:

1. Read AGENTS.md.
2. Read ROADMAP.md.
3. Read this CHANGELOG.md.
4. Read relevant documentation in `/docs`.
5. Summarize project status.
6. Create an implementation plan.
7. Wait for approval.

After completing work:

- Update this changelog.
- Record completed features.
- Record architectural changes.
- Record dependency changes.
- Record breaking changes.
- Wait for approval.

---

# Versioning

Use Semantic Versioning.

MAJOR.MINOR.PATCH

Examples:

- 0.1.0
- 0.2.0
- 0.2.1
- 1.0.0

Increment:

PATCH → Bug fixes

MINOR → New features

MAJOR → Breaking changes