"""Tests for AsyncTTLCache."""

from __future__ import annotations

import asyncio

import pytest

from app.core.cache import AsyncTTLCache


class TestAsyncTTLCache:
    """Tests for async TTL cache."""

    @pytest.mark.asyncio
    async def test_set_and_get(self):
        cache = AsyncTTLCache(default_ttl=60)
        await cache.set("key1", "value1")
        result = await cache.get("key1")
        assert result == "value1"

    @pytest.mark.asyncio
    async def test_get_missing_key(self):
        cache = AsyncTTLCache(default_ttl=60)
        result = await cache.get("nonexistent")
        assert result is None

    @pytest.mark.asyncio
    async def test_expiry(self):
        cache = AsyncTTLCache(default_ttl=0)
        await cache.set("key1", "value1")
        # TTL=0 means it expires immediately
        await asyncio.sleep(0.01)
        result = await cache.get("key1")
        assert result is None

    @pytest.mark.asyncio
    async def test_custom_ttl(self):
        cache = AsyncTTLCache(default_ttl=600)
        await cache.set("key1", "value1", ttl=0)
        await asyncio.sleep(0.01)
        result = await cache.get("key1")
        assert result is None

    @pytest.mark.asyncio
    async def test_delete(self):
        cache = AsyncTTLCache(default_ttl=60)
        await cache.set("key1", "value1")
        await cache.delete("key1")
        result = await cache.get("key1")
        assert result is None

    @pytest.mark.asyncio
    async def test_delete_nonexistent(self):
        cache = AsyncTTLCache(default_ttl=60)
        # Should not raise
        await cache.delete("nonexistent")

    @pytest.mark.asyncio
    async def test_clear(self):
        cache = AsyncTTLCache(default_ttl=60)
        await cache.set("key1", "value1")
        await cache.set("key2", "value2")
        await cache.clear()
        assert await cache.get("key1") is None
        assert await cache.get("key2") is None

    @pytest.mark.asyncio
    async def test_overwrite(self):
        cache = AsyncTTLCache(default_ttl=60)
        await cache.set("key1", "old")
        await cache.set("key1", "new")
        result = await cache.get("key1")
        assert result == "new"

    def test_len(self):
        cache = AsyncTTLCache(default_ttl=60)
        cache._store["a"] = ("val", 9999999999.0)
        cache._store["b"] = ("val", 9999999999.0)
        assert len(cache) == 2

    def test_len_cleans_expired(self):
        cache = AsyncTTLCache(default_ttl=60)
        cache._store["a"] = ("val", 0.0)  # expired
        cache._store["b"] = ("val", 9999999999.0)  # valid
        assert len(cache) == 1

    def test_contains(self):
        cache = AsyncTTLCache(default_ttl=60)
        cache._store["a"] = ("val", 9999999999.0)
        assert "a" in cache
        assert "b" not in cache

    def test_contains_expired(self):
        cache = AsyncTTLCache(default_ttl=60)
        cache._store["a"] = ("val", 0.0)
        assert "a" not in cache

    @pytest.mark.asyncio
    async def test_concurrent_set(self):
        cache = AsyncTTLCache(default_ttl=60)

        async def setter(key: str, val: str) -> None:
            await cache.set(key, val)

        tasks = [setter(f"key{i}", f"val{i}") for i in range(100)]
        await asyncio.gather(*tasks)

        for i in range(100):
            result = await cache.get(f"key{i}")
            assert result == f"val{i}"
