# Changelog

All notable changes to KisanGPT are documented in this file.

This project follows a milestone-based development workflow.

---

# [Unreleased]

## Added

### Voice Assistant (Phase 8 — OpenCode)

- **Voice Provider Abstraction**: `SpeechToTextProvider` ABC + `MockSpeechToTextProvider`, `TextToSpeechProvider` ABC + `MockTextToSpeechProvider` for development/testing (`app/agents/voice.py`).
- **Voice Schemas**: `SpeechToTextResponse`, `TextToSpeechRequest`, `TextToSpeechResponse`, `VoiceCommand`, `VoiceCommandResponse`, `VoiceChatRequest`, `VoiceChatResponse`, `VoiceSession`, `VoiceHealthResponse` Pydantic models (`app/schemas/voice.py`).
- **Voice Service**: Orchestrates STT/TTS, intent detection, voice chat, and session management (`app/services/voice.py`).
- **Voice Endpoints**: `POST /api/v1/voice/stt`, `POST /api/v1/voice/tts`, `POST /api/v1/voice/command`, `POST /api/v1/voice/chat`, `POST /api/v1/voice/session`, `DELETE /api/v1/voice/session/{id}`, `GET /api/v1/voice/health` (`app/api/v1/voice.py`).
- **Voice Config**: Added `VOICE_STT_TIMEOUT`, `VOICE_TTS_TIMEOUT`, `VOICE_SUPPORTED_LANGUAGES` settings (`app/core/config.py`).
- **Voice Tests**: 15 tests for provider, service, and schemas (`tests/test_voice.py`, `tests/test_voice_schemas.py`).

### Voice Assistant (Phase 8 — Antigravity)

- **Voice Types**: `STTResult`, `TTSResult`, `VoiceCommandResult`, `VoiceChatResult`, `VoiceMessage`, `VoiceUIState` types (`features/voice/types/voice.types.ts`).
- **Voice Store**: Zustand slice with voice state, language, messages, conversation management (`features/voice/store/voiceStore.ts`).
- **useVoice Hook**: Wires store to mock data with recording, text input, and conversation management (`features/voice/hooks/useVoice.ts`).
- **Voice Components**: `VoiceLanguageSelector`, `VoiceMessageBubble`, `VoiceInputBar`, `VoiceRecordButton`, `VoiceSkeleton`, `VoiceError`, `VoiceEmpty` (`features/voice/components/`).
- **Voice Page**: `/voice` route with animated state transitions and scroll-to-bottom (`app/voice/page.tsx`).
- **VoiceAssistantBar Integration**: Updated dashboard bar to use voice store with full-view link.
- **Navigation**: Added "Voice Assistant" link to sidebar navigation.

### Market Intelligence (Phase 6 — OpenCode)

- **Market Provider Abstraction**: `MarketDataProvider` ABC + `MockMarketProvider` for development/testing (`app/agents/market.py`).
- **Market Schemas**: `CommodityPrice`, `PriceTrend`, `MarketPriceResponse`, `MarketTrendResponse`, `PriceAlert`, `PriceAlertCreate`, `PriceAlertResponse`, `MarketOverview` Pydantic models (`app/schemas/market.py`).
- **Market Service**: Orchestrates market data fetching, caching (TTLCache), and price alert management (`app/services/market.py`).
- **Market Endpoints**: `GET /api/v1/market/prices`, `GET /api/v1/market/trend`, `GET /api/v1/market/overview`, `POST /api/v1/market/alerts`, `GET /api/v1/market/alerts`, `DELETE /api/v1/market/alerts/{id}` (`app/api/v1/market.py`).
- **Market Config**: Added `MARKET_CACHE_TTL` and `MARKET_TIMEOUT` settings (`app/core/config.py`).
- **Market Tests**: 19 tests for provider, service, and schemas (`tests/test_market.py`, `tests/test_market_schemas.py`).

### Market Intelligence (Phase 6 — Antigravity)

- **Market Types**: `CommodityPrice`, `PriceTrend`, `PriceAlert`, `MarketOverview`, UI state types (`features/market/types/market.types.ts`).
- **Market Store**: Zustand slice with overview, price list, trend state, and commodity selection (`features/market/store/marketStore.ts`).
- **useMarket Hook**: Wires store to mock data with commodity selection, overview, prices, and trend loading (`features/market/hooks/useMarket.ts`).
- **Market Components**: `MarketOverviewCard`, `CommoditySelector`, `PriceListTable`, `TrendChart` (SVG sparkline), `MarketSkeleton`, `MarketError`, `MarketEmpty` (`features/market/components/`).
- **Market Page**: `/market` route with animated state transitions (`app/market/page.tsx`).
- **Dashboard Integration**: `MandiPricesWidget` now fetches live data from market store instead of hardcoded props.
- **Navigation**: Added "Market Intelligence" link to sidebar navigation.

### Authentication & AI Chat (OpenCode)

- **Firebase Authentication**: Firebase Admin SDK integration with token verification, `get_current_user` dependency for protected routes (`app/core/security.py`).
- **User Schema**: `CurrentUser` Pydantic model for authenticated user context (`app/schemas/auth.py`).
- **Auth Endpoint**: `GET /api/v1/auth/me` returns current user info from Firebase token (`app/api/v1/auth.py`).
- **Chat Schemas**: `ChatRequest`, `ChatResponse`, `ChatMessage`, `Conversation` Pydantic models (`app/schemas/chat.py`).
- **Chat Agent**: Gemini-powered chat agent with farming domain system prompt, streaming support (`app/agents/chat.py`).
- **Conversation Service**: In-memory per-user conversation store with TTL expiry and message limits (`app/services/conversation.py`).
- **Chat Service**: Orchestrates ChatAgent + ConversationService for message handling (`app/services/chat.py`).
- **Chat Endpoints**: `POST /api/v1/chat` (standard) and `POST /api/v1/chat/stream` (SSE streaming) (`app/api/v1/chat.py`).
- **UnauthorizedError**: Custom 401 exception for auth failures (`app/core/exceptions.py`).
- **Gemini Model Config**: Added `GEMINI_MODEL` setting (default: `gemini-2.0-flash`) (`app/core/config.py`).
- **Dependencies**: Added `firebase-admin>=7.5.0` and `google-generativeai>=0.8.0` to `pyproject.toml`.
- **Tests**: Auth dependency tests, chat schema tests, conversation service tests (`tests/test_security.py`, `tests/test_chat.py`).

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

### Weather Intelligence (OpenCode)

- **Weather Schemas**: `CurrentWeather`, `DailyForecast`, `ForecastResponse`, `FarmingAdvice`, `WeatherAdviceResponse`, `WeatherQuery` Pydantic models (`app/schemas/weather.py`).
- **WeatherProvider ABC**: Abstract base class for weather data providers with `get_current`, `get_forecast`, `resolve_coordinates` methods (`app/agents/weather.py`).
- **OpenWeatherMapProvider**: Concrete implementation using OpenWeatherMap free tier APIs (Current Weather + 5-day Forecast), metric units, httpx client with configurable timeout (`app/agents/weather.py`).
- **WeatherService**: Orchestrator with in-memory TTL caching, provider-agnostic design, structured logging (`app/services/weather.py`).
- **Farming Advice Engine**: Rule-based recommendations for temperature extremes, humidity, wind, and rain forecast — no AI dependency (`app/services/weather.py`).
- **Weather Endpoints**: `GET /api/v1/weather/current`, `GET /api/v1/weather/forecast`, `GET /api/v1/weather/advice` — all authenticated, support lat/lon or city query params (`app/api/v1/weather.py`).
- **TTLCache**: Generic in-memory cache with per-key TTL expiration, reusable across modules (`app/cache/memory.py`).
- **Config**: Added `OPENWEATHERMAP_API_KEY`, `WEATHER_TIMEOUT`, `WEATHER_CACHE_TTL` settings (`app/core/config.py`).
- **Dependencies**: Added `httpx>=0.28.0` to main dependencies (`pyproject.toml`).
- **Tests**: TTLCache tests, weather service tests with MockWeatherProvider, farming advice rule tests, schema validation tests (`tests/test_weather.py`, `tests/test_weather_schemas.py`).

### Crop Disease Detection (OpenCode)

- **Disease Schemas**: `DiagnosisResult`, `TreatmentRecommendation`, `DiseaseDetectionResponse`, `DiagnosisHistoryItem` Pydantic models (`app/schemas/disease.py`).
- **DiseaseDetectionProvider ABC**: Abstract base class for disease detection providers with `detect` method (`app/agents/disease.py`).
- **GeminiVisionProvider**: Concrete implementation using Gemini 2.0 Flash vision capability, structured JSON prompt for disease identification, inline image bytes via `google-genai` SDK (`app/agents/disease.py`).
- **DiagnosisService**: Orchestrator with image validation (type, size), in-memory TTL caching by image hash, provider-agnostic design (`app/services/diagnosis.py`).
- **Image Validation**: Server-side enforcement of allowed types (JPEG, PNG, WebP) and max file size (10 MB) (`app/services/diagnosis.py`).
- **Image Hashing**: SHA-256 based 16-char hash for cache keys and result identification (`app/agents/disease.py`).
- **Disease Endpoint**: `POST /api/v1/disease/detect` — multipart file upload, authenticated, returns diagnosis with confidence, severity, treatments, prevention tips (`app/api/v1/disease.py`).
- **Custom Exceptions**: `ImageTooLargeError` (400), `UnsupportedImageError` (400) for image validation failures (`app/core/exceptions.py`).
- **Config**: Added `GEMINI_VISION_MODEL`, `MAX_IMAGE_SIZE_MB`, `DISEASE_TIMEOUT`, `DISEASE_CACHE_TTL` settings (`app/core/config.py`).
- **Tests**: Schema validation tests, image hash tests, service validation tests, provider mock tests, result parsing tests (`tests/test_disease.py`, `tests/test_disease_schemas.py`).

### Frontend — Weather Intelligence (Antigravity)

- **Weather Types**: `WeatherCondition`, `CurrentWeather`, `ForecastDay`, `FarmingRecommendation`, `WeatherData`, `WeatherUIState` TypeScript interfaces (`src/features/weather/types/weather.types.ts`).
- **Weather Page**: Full `/weather` route with `CurrentWeatherCard`, `ForecastStrip`, `ForecastDayCard`, `FarmingRecommendationCard`, `WeatherIcon`, `WeatherStatBadge` components (`src/features/weather/`).
- **Weather Store**: Zustand store with temperature unit toggle, location state, discriminated-union UI state (`src/features/weather/store/weatherStore.ts`).
- **Weather Hook**: `useWeather` hook with auto-load, temperature conversion, relative time formatting (`src/features/weather/hooks/useWeather.ts`).
- **Weather Constants**: Mock data, UV label ranges, weather condition mappings (`src/features/weather/constants/weather.constants.ts`).

### Frontend — Crop Disease Detection (Antigravity)

- **Disease Types**: `DiagnosisResult`, `TreatmentRecommendation`, `DiseaseSeverity`, `DiseaseUIState` TypeScript interfaces (`src/features/disease/types/disease.types.ts`).
- **Disease Detection Page**: Full `/disease` route with image upload, analysis, result display workflow (`src/features/disease/components/DiseaseDetectionPage.tsx`).
- **ImageUploader**: Camera capture (mobile) + gallery upload (desktop) with file type/size constraints (`src/features/disease/components/ImageUploader.tsx`).
- **ImagePreview**: Thumbnail preview with remove button before/after analysis (`src/features/disease/components/ImagePreview.tsx`).
- **DetectionResultCard**: Full diagnosis display with severity badge, confidence percentage, crop name, disease description, similar diseases, disclaimer (`src/features/disease/components/DetectionResultCard.tsx`).
- **TreatmentList**: Treatment recommendations with type (chemical/cultural/biological/mechanical) and urgency badges (`src/features/disease/components/TreatmentList.tsx`).
- **DetectionSkeleton**: Loading state with pulse animation during analysis (`src/features/disease/components/DetectionSkeleton.tsx`).
- **DetectionError**: Error state with retry button (`src/features/disease/components/DetectionError.tsx`).
- **DetectionEmpty**: Empty state before first scan with instructions (`src/features/disease/components/DetectionEmpty.tsx`).
- **Disease Store**: Zustand store with discriminated-union UI state (idle/uploading/analyzing/success/error) (`src/features/disease/store/diseaseStore.ts`).
- **Disease Hook**: `useDiseaseDetection` hook with file selection → upload → analyze workflow (`src/features/disease/hooks/useDiseaseDetection.ts`).
- **Navigation**: Added "Disease Detection" link to sidebar navigation (`src/constants/navigation.ts`).

## Planned

- Backend foundation (complete)
- AI chat (complete)
- Disease detection (complete)
- Weather intelligence (complete)
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
- Firebase Authentication
- AI Chat with Gemini streaming
- Weather Intelligence with OpenWeatherMap
- Crop Disease Detection with Gemini Vision
- Frontend design system & components

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