from __future__ import annotations

KEYWORD_RULES: dict[str, list[str]] = {
    "weather": [
        "weather",
        "rain",
        "temperature",
        "forecast",
        "irrigate",
        "irrigation",
        "humidity",
        "wind",
        "storm",
        "sun",
        "cold",
        "hot",
        "flood",
        "drought",
        "spray",
    ],
    "market": [
        "price",
        "market",
        "sell",
        "mandi",
        "buy",
        "rate",
        "cost",
        "profit",
        "commodity",
        "wheat",
        "rice",
        "cotton",
        "mustard",
        "msp",
    ],
    "disease": [
        "disease",
        "spots",
        "pest",
        "bug",
        "leaf",
        "fungus",
        "wilt",
        "blight",
        "infection",
        "yellow",
        "brown",
        "wilting",
        "rot",
    ],
    "memory": [
        "history",
        "previous",
        "last time",
        "remember",
        "before",
        "earlier",
        "past",
    ],
    "dashboard": [
        "fertilizer",
        "dashboard",
        "overview",
        "scheme",
        "government",
        "subsidy",
        "profile",
        "field",
        "crop",
        "farm",
    ],
}

DEFAULT_TOOLS: list[str] = ["weather", "market"]


def plan(message: str) -> list[str]:
    """Select tools based on deterministic keyword matching.

    Args:
        message: The user's natural-language message.

    Returns:
        Sorted list of unique tool names that match the message.
    """
    lower = message.lower()
    matched: set[str] = set()

    for tool_name, keywords in KEYWORD_RULES.items():
        for kw in keywords:
            if kw in lower:
                matched.add(tool_name)
                break

    if not matched:
        return list(DEFAULT_TOOLS)

    return sorted(matched)
