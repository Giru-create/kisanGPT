import time

from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call):  # type: ignore[override]
        start = time.perf_counter()
        response = await call(request)
        duration_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "%s %s %d %.1fms",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )
        return response


def register_middleware(app: FastAPI) -> None:
    app.add_middleware(RequestLoggingMiddleware)
