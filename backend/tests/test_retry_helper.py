"""Tests for retry_async helper."""

from __future__ import annotations

import asyncio

import pytest

from app.core.retry import retry_async


class TestRetryAsync:
    """Tests for async retry with exponential backoff."""

    @pytest.mark.asyncio
    async def test_success_first_attempt(self):
        call_count = 0

        async def func() -> str:
            nonlocal call_count
            call_count += 1
            return "ok"

        result = await retry_async(func, max_retries=3, base_delay=0.01)
        assert result == "ok"
        assert call_count == 1

    @pytest.mark.asyncio
    async def test_retry_then_succeed(self):
        call_count = 0

        async def func() -> str:
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise ValueError("not yet")
            return "ok"

        result = await retry_async(func, max_retries=3, base_delay=0.01, timeout=5.0)
        assert result == "ok"
        assert call_count == 3

    @pytest.mark.asyncio
    async def test_all_retries_fail(self):
        async def func() -> str:
            raise ValueError("always fails")

        with pytest.raises(ValueError, match="always fails"):
            await retry_async(func, max_retries=2, base_delay=0.01)

    @pytest.mark.asyncio
    async def test_no_retries(self):
        call_count = 0

        async def func() -> str:
            nonlocal call_count
            call_count += 1
            raise ValueError("fail")

        with pytest.raises(ValueError):
            await retry_async(func, max_retries=0, base_delay=0.01)
        assert call_count == 1

    @pytest.mark.asyncio
    async def test_timeout_per_attempt(self):
        async def slow_func() -> str:
            await asyncio.sleep(10)
            return "never"

        with pytest.raises((asyncio.TimeoutError, asyncio.CancelledError)):
            await retry_async(slow_func, max_retries=0, timeout=0.01, base_delay=0.01)

    @pytest.mark.asyncio
    async def test_timeout_then_succeed(self):
        call_count = 0

        async def func() -> str:
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                await asyncio.sleep(10)
            return "ok"

        result = await retry_async(func, max_retries=2, timeout=0.01, base_delay=0.01)
        assert result == "ok"
        assert call_count == 2

    @pytest.mark.asyncio
    async def test_only_retries_specified_exceptions(self):
        call_count = 0

        async def func() -> str:
            nonlocal call_count
            call_count += 1
            raise TypeError("wrong type")

        with pytest.raises(TypeError):
            await retry_async(
                func,
                max_retries=3,
                base_delay=0.01,
                retryable_exceptions=(ValueError,),
            )
        assert call_count == 1

    @pytest.mark.asyncio
    async def test_args_passed_through(self):
        async def func(a: int, b: str) -> str:
            return f"{a}-{b}"

        result = await retry_async(func, 42, "hello", max_retries=0)
        assert result == "42-hello"

    @pytest.mark.asyncio
    async def test_kwargs_passed_through(self):
        async def func(*, x: int, y: str) -> str:
            return f"{x}-{y}"

        result = await retry_async(func, x=10, y="world", max_retries=0)
        assert result == "10-world"

    @pytest.mark.asyncio
    async def test_exponential_backoff_timing(self):
        call_count = 0

        async def func() -> str:
            nonlocal call_count
            call_count += 1
            if call_count <= 3:
                raise ValueError("fail")
            return "ok"

        start = asyncio.get_event_loop().time()
        result = await retry_async(func, max_retries=3, base_delay=0.1, max_delay=1.0)
        elapsed = asyncio.get_event_loop().time() - start

        assert result == "ok"
        # Delays: 0.1 + 0.2 + 0.4 = 0.7s minimum
        assert elapsed >= 0.6
