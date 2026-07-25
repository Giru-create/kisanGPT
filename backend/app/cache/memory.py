from __future__ import annotations

import time
from typing import Any


class TTLCache:
    """Simple in-memory cache with per-key TTL expiration."""

    def __init__(self, default_ttl: int = 600) -> None:
        self._default_ttl = default_ttl
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
        self._store[key] = (value, time.monotonic() + effective_ttl)

    def delete(self, key: str) -> None:
        self._store.pop(key, None)

    def clear(self) -> None:
        self._store.clear()

    def __len__(self) -> int:
        now = time.monotonic()
        self._store = {k: v for k, v in self._store.items() if v[1] > now}
        return len(self._store)

    def __contains__(self, key: str) -> bool:
        return self.get(key) is not None
