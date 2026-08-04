"""Secure logging utilities — automatically masks sensitive data in log records.

This module provides a ``SensitiveDataFilter`` that strips API keys, tokens,
passwords, authorization headers, PII, and file contents from every log
record before it reaches the handler.
"""

from __future__ import annotations

import logging
import re

# ---------------------------------------------------------------------------
# Patterns for sensitive data that must NEVER appear in logs
# ---------------------------------------------------------------------------

_MASKED_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    # API keys
    (re.compile(r"(AIza[0-9A-Za-z_-]{35})"), "AIza[REDACTED]"),
    (re.compile(r"(sk-[A-Za-z0-9]{20,})"), "sk-[REDACTED]"),
    (re.compile(r"(ghp_[A-Za-z0-9]{36})"), "ghp_[REDACTED]"),
    # Generic key=value patterns
    (re.compile(r"(api[_-]?key\s*[:=]\s*)(\S{8})\S*", re.IGNORECASE), r"\1\2***"),
    (re.compile(r"(token\s*[:=]\s*)(\S{8})\S*", re.IGNORECASE), r"\1\2***"),
    (re.compile(r"(secret\s*[:=]\s*)(\S{8})\S*", re.IGNORECASE), r"\1\2***"),
    (re.compile(r"(password\s*[:=]\s*)(\S{4})\S*", re.IGNORECASE), r"\1****"),
    # Bearer tokens
    (re.compile(r"(Bearer\s+)(\S{8})\S*", re.IGNORECASE), r"\1\2***"),
    # Authorization headers
    (re.compile(r"(Authorization:\s*)(\S{8})\S*", re.IGNORECASE), r"\1\2***"),
    # JWT tokens (eyJ...)
    (
        re.compile(
            r"(eyJ[A-Za-z0-9_-]{10,})\.([A-Za-z0-9_-]{10,})\.([A-Za-z0-9_-]{10,})"
        ),
        r"eyJ[REDACTED].\3",
    ),
    # Firebase service account key blocks
    (re.compile(r'"private_key"\s*:\s*"[^"]{20}'), '"private_key": "[REDACTED'),
    # Aadhaar / credit card numbers
    (re.compile(r"\b(\d{4})\s?\d{4}\s?\d{4}(\d{4})\b"), r"\1****\2"),
    # File contents in upload logs
    (
        re.compile(r"(file[_-]?content\s*[:=]\s*).{0,50}", re.IGNORECASE),
        r"\1[REDACTED]",
    ),
]

# Fields that should be masked in structured log extras
_SENSITIVE_FIELDS = frozenset(
    {
        "authorization",
        "auth_header",
        "token",
        "api_key",
        "password",
        "secret",
        "firebase_key",
        "service_account",
        "private_key",
        "file_content",
        "image_bytes",
        "audio_bytes",
    }
)


class SensitiveDataFilter(logging.Filter):
    """Logging filter that masks sensitive data in log messages and extras."""

    def filter(self, record: logging.LogRecord) -> bool:  # noqa: A003
        # Mask the message string
        if record.msg and isinstance(record.msg, str):
            for pattern, replacement in _MASKED_PATTERNS:
                record.msg = pattern.sub(replacement, record.msg)

        # Mask any args
        if record.args:
            if isinstance(record.args, dict):
                record.args = {
                    k: self._mask_value(v) if isinstance(v, str) else v
                    for k, v in record.args.items()
                }
            elif isinstance(record.args, tuple):
                record.args = tuple(
                    self._mask_value(a) if isinstance(a, str) else a
                    for a in record.args
                )

        # Mask sensitive fields in structured extras
        for key in list(vars(record).keys()):
            if key.lower() in _SENSITIVE_FIELDS:
                value = getattr(record, key, None)
                if isinstance(value, str) and len(value) > 8:
                    setattr(record, key, value[:8] + "[REDACTED]")

        return True

    @staticmethod
    def _mask_value(value: str) -> str:
        for pattern, replacement in _MASKED_PATTERNS:
            value = pattern.sub(replacement, value)
        return value


def install_sensitive_data_filter() -> None:
    """Install the SensitiveDataFilter on the ``kisangpt`` logger.

    Call this once during application startup (after ``setup_logging``).
    """
    target_logger = logging.getLogger("kisangpt")
    for handler in target_logger.handlers:
        if not any(isinstance(f, SensitiveDataFilter) for f in handler.filters):
            handler.addFilter(SensitiveDataFilter())
