"""AI Guardrails — output validation, sensitive-data filtering, and safe
fallbacks for every LLM interaction in KisanGPT.

All AI-generated content MUST pass through ``validate_llm_output`` before
being returned to the user.
"""

from __future__ import annotations

import re

# ---------------------------------------------------------------------------
# Sensitive-data patterns that must never leak into LLM responses
# ---------------------------------------------------------------------------

_SENSITIVE_PATTERNS: list[re.Pattern[str]] = [
    # API keys / tokens
    re.compile(r"(?:api[_-]?key|token|secret|password)\s*[:=]\s*\S+", re.IGNORECASE),
    re.compile(r"AIza[0-9A-Za-z_-]{35}"),  # Google API key
    re.compile(r"sk-[A-Za-z0-9]{20,}"),  # OpenAI-style key
    re.compile(r"ghp_[A-Za-z0-9]{36}"),  # GitHub PAT
    re.compile(r"Bearer\s+[A-Za-z0-9._-]{20,}", re.IGNORECASE),
    # Firebase / JWT tokens
    re.compile(r"eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"),  # JWT
    # Credit-card / Aadhaar-like numbers
    re.compile(r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b"),
    re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b"),  # 12-digit Aadhaar
    # Internal paths
    re.compile(r"(?:/home/|/root/|C:\\Users\\)[^\s\"']+"),
]

# ---------------------------------------------------------------------------
# Jailbreak / role-play detection
# ---------------------------------------------------------------------------

_JAILBREAK_PATTERNS: list[re.Pattern[str]] = [
    re.compile(r"\b(?:DAN|Do\s+Anything\s+Now)\b", re.IGNORECASE),
    re.compile(r"developer\s+mode", re.IGNORECASE),
    re.compile(r"jailbreak", re.IGNORECASE),
    re.compile(
        r"pretend\s+(?:you(?:'re| are)|to\s+be)\s+(?!a\s+farming)", re.IGNORECASE
    ),
    re.compile(
        r"act\s+as\s+(?:if\s+)?(?:you\s+)?(?:have\s+no|without)\s+(?:restrictions?|rules?)",
        re.IGNORECASE,
    ),
    re.compile(
        r"bypass\s+(?:all\s+)?(?:restrictions?|rules?|guidelines?)", re.IGNORECASE
    ),
    re.compile(r"\[INST\]|\[/INST\]|<<SYS>>|<</SYS>>", re.IGNORECASE),
    re.compile(r"<\|im_start\|>|<\|im_end\|>", re.IGNORECASE),
]

# ---------------------------------------------------------------------------
# Harmful-content patterns
# ---------------------------------------------------------------------------

_HARMFUL_PATTERNS: list[re.Pattern[str]] = [
    re.compile(
        r"\b(?:how\s+to\s+)?(?:make\s+(?:a\s+)?(?:bomb|explosive|weapon|drug|poison))\b",
        re.IGNORECASE,
    ),
    re.compile(r"\b(?:hack\s+(?:into|a\s+))\b", re.IGNORECASE),
    re.compile(r"\b(?:steal|theft|shoplift)\b", re.IGNORECASE),
    re.compile(r"\b(?:kill|murder|assault)\b", re.IGNORECASE),
    re.compile(r"\b(?:suicide|self[\s-]harm)\b", re.IGNORECASE),
]

# ---------------------------------------------------------------------------
# Safe fallback responses
# ---------------------------------------------------------------------------

_FALLBACK_UNSAFE = (
    "I can only help with farming-related topics such as crop management, "
    "weather, market prices, and government schemes. "
    "Please ask a farming-related question."
)

_FALLBACK_VALIDATION_FAILED = (
    "I'm unable to provide a response to that request. "
    "Please ask about farming, crops, weather, or market prices."
)

_FALLBACK_JAILBREAK = (
    "I noticed an attempt to bypass my guidelines. "
    "I am KisanGPT, a farming assistant, and I can only help with "
    "agricultural topics like crops, weather, market prices, and "
    "government schemes."
)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def detect_jailbreak(text: str) -> bool:
    """Return True if *text* contains jailbreak or role-play bypass attempts."""
    return any(p.search(text) for p in _JAILBREAK_PATTERNS)


def detect_harmful_content(text: str) -> bool:
    """Return True if *text* requests harmful or illegal instructions."""
    return any(p.search(text) for p in _HARMFUL_PATTERNS)


def filter_sensitive_data(text: str) -> str:
    """Replace sensitive data patterns with redacted placeholders."""
    filtered = text
    for pattern in _SENSITIVE_PATTERNS:
        filtered = pattern.sub("[REDACTED]", filtered)
    return filtered


def validate_llm_output(output: str, *, max_length: int = 8000) -> str:
    """Validate and sanitise LLM output before returning to the user.

    1. Truncate to *max_length* to prevent context overflow.
    2. Filter sensitive data (API keys, tokens, paths).
    3. If the output is empty, return a safe fallback.

    Returns the cleaned output string.
    """
    if not output or not output.strip():
        return _FALLBACK_VALIDATION_FAILED

    cleaned = filter_sensitive_data(output)

    if len(cleaned) > max_length:
        cleaned = cleaned[:max_length] + "\n[Response truncated]"

    return cleaned


def safe_fallback(reason: str = "default") -> str:
    """Return a safe, non-revealing fallback response."""
    fallbacks = {
        "unsafe": _FALLBACK_UNSAFE,
        "jailbreak": _FALLBACK_JAILBREAK,
        "validation_failed": _FALLBACK_VALIDATION_FAILED,
    }
    return fallbacks.get(reason, _FALLBACK_VALIDATION_FAILED)
