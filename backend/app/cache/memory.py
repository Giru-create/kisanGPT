from __future__ import annotations

import time
from typing import Any


class TTLCache:
    """Simple in-memory cache with per-key TTL expiration and max size limit."""

    def __init__(self, default_ttl: int = 600, max_size: int = 1000) -> None:
        self._default_ttl = default_ttl
        self._max_size = max_size
        self._store: dict[str, tuple[Any, float]] = {}

    def get(self, key: str) -> Any | None:
        entry = self._store.get(key)
        if entry is None:
            return None

        value, expires_at = entry
        if time.monotonic() > expires_at:
            del self._store[key]
            return None

        return value

    def set(self, key: str, value: Any, ttl: int | None = None) -> None:
        effective_ttl = ttl if ttl is not None else self._default_ttl
        if key in self._store:
            self._store[key] = (value, time.monotonic() + effective_ttl)
            return

        if len(self._store) >= self._max_size:
            self._evict_expired()
            if len(self._store) >= self._max_size:
                self._evict_oldest()

        self._store[key] = (value, time.monotonic() + effective_ttl)

    def delete(self, key: str) -> None:
        self._store.pop(key, None)

    def clear(self) -> None:
        self._store.clear()

    def _evict_expired(self) -> None:
        now = time.monotonic()
        expired = [k for k, (_, exp) in self._store.items() if exp <= now]
        for k in expired:
            del self._store[k]

    def _evict_oldest(self) -> None:
        if not self._store:
            return
        oldest_key = min(self._store, key=lambda k: self._store[k][1])
        del self._store[oldest_key]

    def __len__(self) -> int:
        now = time.monotonic()
        self._store = {k: v for k, v in self._store.items() if v[1] > now}
        return len(self._store)

    def __contains__(self, key: str) -> bool:
        return self.get(key) is not None
