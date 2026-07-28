"""Memory extractor -- extracts useful farming information from conversations.

Analyses user messages and identifies factual information worth persisting:
crops, locations, preferences, and observations.
"""

from __future__ import annotations

import re

from app.core.logging import logger
from app.memory.schemas import MemoryItemCreateRequest

# Patterns that indicate extractable information
_CROP_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (
        re.compile(
            r"\b(?:grow(?:s|ing)?|cultivat(?:e|es?|ing)"
            r"|plant(?:s|ing)?)\s+(\w+)",
            re.I,
        ),
        "crop",
    ),
    (
        re.compile(r"\b(?:my|the)\s+(\w+)\s+(?:crop|field|farm|plant)", re.I),
        "crop",
    ),
    (
        re.compile(
            r"\b(?:wheat|rice|maize|corn|cotton|sugarcane"
            r"|potato|tomato|onion|mustard|soybean|groundnut"
            r"|pulses?|gram|barley|millets?|jowar|bajra|ragi)\b",
            re.I,
        ),
        "crop",
    ),
]

_LOCATION_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (
        re.compile(
            r"\b(?:in|from|at|near)\s+"
            r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
            re.I,
        ),
        "location",
    ),
    (
        re.compile(
            r"\b(?:my|the)\s+(?:farm|field|land)\s+"
            r"(?:is\s+)?(?:in|at|near)\s+"
            r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
            re.I,
        ),
        "location",
    ),
]

_PREFERENCE_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (
        re.compile(r"\b(?:prefer|like|want|need|use)\s+(.+?)(?:\.|$)", re.I),
        "preference",
    ),
    (
        re.compile(
            r"\b(?:i speak|my language is|speak in)\s+(.+?)(?:\.|$)",
            re.I,
        ),
        "language",
    ),
]

_SOIL_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (
        re.compile(r"\b(?:soil(?:\s+type)?|mitti)\s+(?:is\s+)?(\w+)", re.I),
        "soil",
    ),
    (
        re.compile(
            r"\b(?:loamy?|clay(?:ey)?|sandy?|silty?"
            r"|peaty?|chalky?|saline?)\b",
            re.I,
        ),
        "soil",
    ),
]

IRRIGATION_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (
        re.compile(
            r"\b(?:irrigat(?:e|ion)|water(?:ing)?)\s+(.+?)(?:\.|$)",
            re.I,
        ),
        "irrigation",
    ),
]


def extract_from_message(
    message: str,
) -> list[MemoryItemCreateRequest]:
    """Extract factual information from a user message.

    Analyses the message text and returns a list of memory items
    worth persisting.  Only returns items with meaningful content.

    Args:
        message: The raw user message text.

    Returns:
        A list of MemoryItemCreateRequest objects.
    """
    items: list[MemoryItemCreateRequest] = []
    seen_keys: set[str] = set()

    # Extract crops
    for pattern, _category in _CROP_PATTERNS:
        for match in pattern.finditer(message):
            value = match.group(1) if match.lastindex else match.group(0)
            value = value.strip().lower()
            if value and len(value) > 1 and value not in seen_keys:
                items.append(
                    MemoryItemCreateRequest(
                        category="crop",
                        key=f"grows_{value}",
                        value=value,
                        confidence=0.8,
                        source="conversation",
                    )
                )
                seen_keys.add(value)

    # Extract locations
    for pattern, _category in _LOCATION_PATTERNS:
        for match in pattern.finditer(message):
            value = match.group(1) if match.lastindex else match.group(0)
            value = value.strip()
            if value and len(value) > 1 and value.lower() not in seen_keys:
                items.append(
                    MemoryItemCreateRequest(
                        category="location",
                        key="farm_location",
                        value=value,
                        confidence=0.7,
                        source="conversation",
                    )
                )
                seen_keys.add(value.lower())

    # Extract preferences
    for pattern, category in _PREFERENCE_PATTERNS:
        for match in pattern.finditer(message):
            value = match.group(1) if match.lastindex else match.group(0)
            value = value.strip()
            if value and len(value) > 1:
                key = f"preference_{category}"
                if key not in seen_keys:
                    items.append(
                        MemoryItemCreateRequest(
                            category="preference",
                            key=key,
                            value=value,
                            confidence=0.6,
                            source="conversation",
                        )
                    )
                    seen_keys.add(key)

    # Extract soil type
    for pattern, _category in _SOIL_PATTERNS:
        for match in pattern.finditer(message):
            value = match.group(1) if match.lastindex else match.group(0)
            value = value.strip().lower()
            if value and len(value) > 2 and "soil_type" not in seen_keys:
                items.append(
                    MemoryItemCreateRequest(
                        category="fact",
                        key="soil_type",
                        value=value,
                        confidence=0.7,
                        source="conversation",
                    )
                )
                seen_keys.add("soil_type")

    if items:
        logger.info(
            "Extracted memory items from message",
            extra={
                "count": len(items),
                "message_len": len(message),
            },
        )

    return items
