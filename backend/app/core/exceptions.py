from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.security_monitor import log_unhandled_exception


class AppError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


class UnauthorizedError(AppError):
    def __init__(self, detail: str = "Unauthorized") -> None:
        super().__init__(status_code=401, detail=detail)


class ImageTooLargeError(AppError):
    def __init__(self, detail: str = "Image too large") -> None:
        super().__init__(status_code=400, detail=detail)


class UnsupportedImageError(AppError):
    def __init__(self, detail: str = "Unsupported image type") -> None:
        super().__init__(status_code=400, detail=detail)


async def app_error_handler(_request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


async def unhandled_error_handler(request: Request, _exc: Exception) -> JSONResponse:
    log_unhandled_exception(
        path=request.url.path,
        method=request.method,
        error=str(_exc),
    )
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppError, app_error_handler)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, unhandled_error_handler)  # type: ignore[arg-type]
