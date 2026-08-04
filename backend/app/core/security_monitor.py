"""Security event monitoring — structured JSON logging for security events.

Provides a dedicated ``security_logger`` that emits structured security
events as JSON lines for easy ingestion by SIEM / log-aggregation tools.
"""

from __future__ import annotations

import json
import logging
import sys
import time
from typing import Any

# ---------------------------------------------------------------------------
# Security event logger (separate from application logger)
# ---------------------------------------------------------------------------

_SECURITY_LOGGER_NAME = "kisangpt.security"


class _SecurityJSONFormatter(logging.Formatter):
    """Formats security log records as single-line JSON."""

    def format(self, record: logging.LogRecord) -> str:
        event: dict[str, Any] = {
            "timestamp": time.time(),
            "level": record.levelname,
            "event_type": getattr(record, "event_type", "unknown"),
            "message": record.getMessage(),
        }
        # Merge any extra structured fields
        for key in (
            "user_id",
            "client_ip",
            "path",
            "method",
            "status_code",
            "endpoint",
            "detail",
        ):
            value = getattr(record, key, None)
            if value is not None:
                event[key] = value
        return json.dumps(event, default=str)


def _setup_security_logger() -> logging.Logger:
    sec_logger = logging.getLogger(_SECURITY_LOGGER_NAME)
    sec_logger.setLevel(logging.INFO)
    sec_logger.propagate = False

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)
    handler.setFormatter(_SecurityJSONFormatter())
    sec_logger.addHandler(handler)
    return sec_logger


security_logger = _setup_security_logger()


# ---------------------------------------------------------------------------
# Convenience helpers
# ---------------------------------------------------------------------------


def log_auth_failure(
    *,
    client_ip: str,
    path: str,
    detail: str,
    user_id: str | None = None,
) -> None:
    """Log a failed authentication attempt."""
    security_logger.warning(
        "Authentication failure",
        extra={
            "event_type": "auth_failure",
            "client_ip": client_ip,
            "path": path,
            "detail": detail,
            "user_id": user_id or "anonymous",
        },
    )


def log_rate_limit_exceeded(
    *,
    client_ip: str,
    path: str,
    endpoint: str,
    user_id: str | None = None,
) -> None:
    """Log a rate-limit violation."""
    security_logger.warning(
        "Rate limit exceeded",
        extra={
            "event_type": "rate_limit_exceeded",
            "client_ip": client_ip,
            "path": path,
            "endpoint": endpoint,
            "user_id": user_id or "anonymous",
        },
    )


def log_invalid_upload(
    *,
    client_ip: str,
    path: str,
    detail: str,
    user_id: str | None = None,
) -> None:
    """Log an invalid or malicious file upload attempt."""
    security_logger.warning(
        "Invalid upload",
        extra={
            "event_type": "invalid_upload",
            "client_ip": client_ip,
            "path": path,
            "detail": detail,
            "user_id": user_id or "anonymous",
        },
    )


def log_injection_attempt(
    *,
    client_ip: str,
    path: str,
    preview: str,
    user_id: str | None = None,
) -> None:
    """Log a detected prompt-injection or jailbreak attempt."""
    security_logger.warning(
        "Prompt injection attempt",
        extra={
            "event_type": "injection_attempt",
            "client_ip": client_ip,
            "path": path,
            "detail": preview[:200],
            "user_id": user_id or "anonymous",
        },
    )


def log_permission_denied(
    *,
    client_ip: str,
    path: str,
    method: str,
    user_id: str | None = None,
    detail: str = "Access denied",
) -> None:
    """Log a permission-denied event."""
    security_logger.warning(
        "Permission denied",
        extra={
            "event_type": "permission_denied",
            "client_ip": client_ip,
            "path": path,
            "method": method,
            "detail": detail,
            "user_id": user_id or "anonymous",
        },
    )


def log_suspicious_request(
    *,
    client_ip: str,
    path: str,
    method: str,
    detail: str,
) -> None:
    """Log a suspicious or anomalous request."""
    security_logger.warning(
        "Suspicious request",
        extra={
            "event_type": "suspicious_request",
            "client_ip": client_ip,
            "path": path,
            "method": method,
            "detail": detail,
        },
    )


def log_unhandled_exception(
    *,
    path: str,
    method: str,
    error: str,
) -> None:
    """Log an unexpected exception for security review."""
    security_logger.error(
        "Unhandled exception",
        extra={
            "event_type": "unhandled_exception",
            "path": path,
            "method": method,
            "detail": error,
        },
    )
