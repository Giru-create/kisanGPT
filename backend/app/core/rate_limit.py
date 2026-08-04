"""Rate-limiting middleware for FastAPI.

Uses a sliding-window counter per key (IP or user_id).
Configurable via environment variables through app.core.config.settings.
"""

from __future__ import annotations

import time
from collections import defaultdict
from collections.abc import Callable  # noqa: TC003

from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.core.logging import logger
from app.core.security_monitor import log_rate_limit_exceeded


class _SlidingWindowCounter:
    """Per-key sliding window counter with automatic expiry."""

    __slots__ = ("window_seconds", "_buckets", "_max_per_window")

    def __init__(self, window_seconds: int, max_per_window: int) -> None:
        self.window_seconds = window_seconds
        self._max_per_window = max_per_window
        self._buckets: dict[str, list[float]] = defaultdict(list)

    def is_allowed(self, key: str) -> bool:
        now = time.monotonic()
        cutoff = now - self.window_seconds
        bucket = self._buckets[key]
        # Prune old entries
        self._buckets[key] = bucket = [t for t in bucket if t > cutoff]
        if len(bucket) >= self._max_per_window:
            return False
        bucket.append(now)
        return True

    def remaining(self, key: str) -> int:
        now = time.monotonic()
        cutoff = now - self.window_seconds
        bucket = self._buckets[key]
        bucket[:] = [t for t in bucket if t > cutoff]
        return max(0, self._max_per_window - len(bucket))

    def retry_after(self, key: str) -> float:
        """Seconds until the oldest entry in the window expires."""
        bucket = self._buckets[key]
        if not bucket:
            return 0.0
        now = time.monotonic()
        return max(0.0, bucket[0] + self.window_seconds - now)


# ---------------------------------------------------------------------------
# Path → rate-limit config mapping
# ---------------------------------------------------------------------------

_RATE_LIMIT_MAP: dict[str, tuple[str, int]] = {
    "/api/v1/chat": ("chat", settings.RATE_LIMIT_CHAT_PER_MINUTE),
    "/api/v1/disease": ("disease", settings.RATE_LIMIT_DISEASE_PER_MINUTE),
    "/api/v1/voice": ("voice", settings.RATE_LIMIT_VOICE_PER_MINUTE),
    "/api/v1/weather": ("weather", settings.RATE_LIMIT_WEATHER_PER_MINUTE),
    "/api/v1/market": ("market", settings.RATE_LIMIT_MARKET_PER_MINUTE),
}


def _resolve_limit(path: str) -> tuple[str, int]:
    for prefix, (name, limit) in _RATE_LIMIT_MAP.items():
        if path.startswith(prefix):
            return name, limit
    return "default", settings.RATE_LIMIT_DEFAULT_PER_MINUTE


# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Sliding-window rate limiter keyed by IP (anonymous) or user_id (auth'd)."""

    def __init__(self, app: Callable) -> None:  # type: ignore[override]
        super().__init__(app)
        self._window = 60  # 1-minute sliding window
        self._counters: dict[str, _SlidingWindowCounter] = {}

    def _get_counter(self, endpoint_name: str, limit: int) -> _SlidingWindowCounter:
        key = f"{endpoint_name}:{limit}"
        if key not in self._counters:
            self._counters[key] = _SlidingWindowCounter(self._window, limit)
        return self._counters[key]

    def _client_ip(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    async def dispatch(self, request: Request, call_next: Callable) -> Response:  # type: ignore[override]
        if not settings.RATE_LIMIT_ENABLED:
            return await call_next(request)

        # Skip rate limiting for health checks and docs
        path = request.url.path
        if path in ("/api/v1/health", "/api/v1/voice/health", "/docs", "/redoc", "/"):
            return await call_next(request)

        endpoint_name, limit = _resolve_limit(path)

        # Try to extract user_id from Authorization header
        user_id: str | None = None
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            # Extract user_id from token without full verification (lightweight)
            # The actual auth verification happens downstream
            try:
                import base64

                payload_part = auth_header.split(".")[1]
                # Add padding
                padding = 4 - len(payload_part) % 4
                if padding != 4:
                    payload_part += "=" * padding
                decoded = base64.urlsafe_b64decode(payload_part)
                import json

                claims = json.loads(decoded)
                user_id = claims.get("sub") or claims.get("uid")
            except Exception:
                pass

        # Key: prefer user_id, fall back to IP
        key = f"{user_id}" if user_id else f"ip:{self._client_ip(request)}"
        rate_key = f"{endpoint_name}:{key}"

        counter = self._get_counter(endpoint_name, limit)

        if not counter.is_allowed(rate_key):
            retry = counter.retry_after(rate_key)
            logger.warning(
                "Rate limit exceeded",
                extra={
                    "key": key,
                    "endpoint": endpoint_name,
                    "path": path,
                },
            )
            log_rate_limit_exceeded(
                client_ip=self._client_ip(request),
                path=path,
                endpoint=endpoint_name,
                user_id=user_id,
            )
            return Response(
                status_code=429,
                content='{"detail":"Rate limit exceeded. Please try again later."}',
                media_type="application/json",
                headers={
                    "Retry-After": str(int(retry) + 1),
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                },
            )

        response = await call_next(request)
        remaining = counter.remaining(rate_key)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response


def register_rate_limiting(app: FastAPI) -> None:
    """Register the rate-limiting middleware on the app."""
    app.add_middleware(RateLimitMiddleware)
    logger.info(
        "Rate limiting enabled",
        extra={
            "default": settings.RATE_LIMIT_DEFAULT_PER_MINUTE,
            "chat": settings.RATE_LIMIT_CHAT_PER_MINUTE,
            "disease": settings.RATE_LIMIT_DISEASE_PER_MINUTE,
            "voice": settings.RATE_LIMIT_VOICE_PER_MINUTE,
            "weather": settings.RATE_LIMIT_WEATHER_PER_MINUTE,
            "market": settings.RATE_LIMIT_MARKET_PER_MINUTE,
        },
    )
