"""Async retry helper with exponential backoff and timeout support.

Usage::

    result = await retry_async(
        some_coro,
        max_retries=3,
        base_delay=0.5,
        timeout=10.0,
    )
"""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING, Any, TypeVar

from app.core.logging import logger

if TYPE_CHECKING:
    from collections.abc import Callable

T = TypeVar("T")


async def retry_async(
    func: Callable[..., Any],
    *args: Any,
    max_retries: int = 3,
    base_delay: float = 0.5,
    max_delay: float = 30.0,
    timeout: float | None = None,
    retryable_exceptions: tuple[type[BaseException], ...] = (Exception,),
    **kwargs: Any,
) -> Any:
    """Execute ``func(*args, **kwargs)`` with retry and exponential backoff.

    Args:
        func: Async callable to execute.
        *args: Positional args passed to func.
        max_retries: Maximum number of retry attempts (0 = no retries).
        base_delay: Initial delay between retries in seconds.
        max_delay: Upper bound for the delay.
        timeout: Per-attempt timeout in seconds (None = no timeout).
        retryable_exceptions: Exception types that trigger a retry.
        **kwargs: Keyword args passed to func.

    Returns:
        The return value of func.

    Raises:
        The last exception if all retries fail.
    """
    last_exc: BaseException | None = None

    for attempt in range(max_retries + 1):
        try:
            if timeout is not None:
                result = await asyncio.wait_for(func(*args, **kwargs), timeout=timeout)
            else:
                result = await func(*args, **kwargs)
            return result
        except retryable_exceptions as exc:
            last_exc = exc
            if attempt == max_retries:
                break

            delay = min(base_delay * (2**attempt), max_delay)
            logger.warning(
                "Retry attempt failed",
                extra={
                    "attempt": attempt + 1,
                    "max_retries": max_retries,
                    "delay_s": round(delay, 2),
                    "error": str(exc),
                },
            )
            await asyncio.sleep(delay)

    raise last_exc  # type: ignore[misc]
