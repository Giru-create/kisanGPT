"""Async-safe TTL cache for weather and market data.

Wraps the existing sync TTLCache with an async interface
so services can use ``await cache.get(...)`` / ``await cache.set(...)``.
"""

from __future__ import annotations

import asyncio
import time
from typing import Any


class AsyncTTLCache:
    """Async-safe in-memory cache with per-key TTL expiration.

    Uses a lock to prevent concurrent corruption. The underlying store
    is a plain dict so reads are fast; the lock only protects writes.
    """

    def __init__(self, default_ttl: int = 600) -> None:
        self._default_ttl = default_ttl
        self._store: dict[str, tuple[Any, float]] = {}
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Any | None:
        entry = self._store.get(key)
        if entry is None:
            return None

        value, expires_at = entry
        if time.monotonic() > expires_at:
            async with self._lock:
                self._store.pop(key, None)
            return None

        return value

    async def set(self, key: str, value: Any, ttl: int | None = None) -> None:
        effective_ttl = ttl if ttl is not None else self._default_ttl
        async with self._lock:
            self._store[key] = (value, time.monotonic() + effective_ttl)

    async def delete(self, key: str) -> None:
        async with self._lock:
            self._store.pop(key, None)

    async def clear(self) -> None:
        async with self._lock:
            self._store.clear()

    def __len__(self) -> int:
        now = time.monotonic()
        self._store = {k: v for k, v in self._store.items() if v[1] > now}
        return len(self._store)

    def __contains__(self, key: str) -> bool:
        entry = self._store.get(key)
        if entry is None:
            return False
        _, expires_at = entry
        return time.monotonic() <= expires_at


# Singleton caches for services
weather_cache = AsyncTTLCache(default_ttl=600)
market_cache = AsyncTTLCache(default_ttl=300)
