"""Metadata extraction from document paths and content."""

from __future__ import annotations

from pathlib import Path

# Map directory names to categories
CATEGORY_MAP: dict[str, str] = {
    "government": "government_scheme",
    "schemes": "government_scheme",
    "weather": "weather",
    "diseases": "disease",
    "fertilizers": "fertilizer",
    "soil": "soil",
    "crops": "crop",
}

# Common Indian crops for tag extraction
KNOWN_CROPS: list[str] = [
    "rice",
    "wheat",
    "cotton",
    "sugarcane",
    "maize",
    "jowar",
    "bajra",
    "groundnut",
    "soybean",
    "mustard",
    "sunflower",
    "potato",
    "tomato",
    "onion",
    "chilli",
    "turmeric",
    "cumin",
    "coriander",
    "cardamom",
    "tea",
    "coffee",
    "rubber",
    "coconut",
    "areca",
    "cashew",
    "mango",
    "banana",
    "grapes",
    "pomegranate",
    "guava",
    "papaya",
    "lemon",
    "pulses",
    "chickpea",
    "lentil",
    "pea",
    "blackgram",
    "greengram",
]


class MetadataExtractor:
    """Extract structured metadata from document source paths and content.

    Produces metadata fields:
    - title: derived from filename
    - source: original file path
    - category: derived from parent directory
    - language: defaults to "en"
    - crop: extracted from path or content
    - state: extracted from content
    - district: extracted from content
    - year: extracted from content
    - tags: list of relevant tags
    """

    def extract(
        self,
        source: str,
        content: str = "",
        extra: dict[str, object] | None = None,
    ) -> dict[str, object]:
        """Extract metadata from source path and content."""
        p = Path(source)
        category = CATEGORY_MAP.get(p.parent.name.lower(), "general")
        title = p.stem.replace("_", " ").replace("-", " ").title()

        crop = self._extract_crop(p, content)
        state = self._extract_state(content)
        year = self._extract_year(content)
        tags = self._build_tags(category, crop, content)

        meta: dict[str, object] = {
            "title": title,
            "source": source,
            "category": category,
            "language": "en",
            "crop": crop,
            "state": state,
            "district": "",
            "year": year,
            "tags": tags,
        }
        if extra:
            meta.update(extra)
        return meta

    def _extract_crop(self, path: Path, content: str) -> str:
        filename = path.stem.lower()
        for crop in KNOWN_CROPS:
            if crop in filename:
                return crop
        content_lower = content[:500].lower()
        for crop in KNOWN_CROPS:
            if crop in content_lower:
                return crop
        return ""

    def _extract_state(self, content: str) -> str:
        states = [
            "Punjab",
            "Haryana",
            "Uttar Pradesh",
            "Madhya Pradesh",
            "Rajasthan",
            "Gujarat",
            "Maharashtra",
            "Karnataka",
            "Tamil Nadu",
            "Andhra Pradesh",
            "Telangana",
            "Kerala",
            "West Bengal",
            "Bihar",
            "Jharkhand",
            "Chhattisgarh",
            "Odisha",
            "Assam",
            "Uttarakhand",
            "Himachal Pradesh",
        ]
        content_lower = content[:1000].lower()
        for state in states:
            if state.lower() in content_lower:
                return state
        return ""

    def _extract_year(self, content: str) -> str:
        import re

        years = re.findall(r"\b(20[12]\d)\b", content[:2000])
        if years:
            return max(years)
        return ""

    def _build_tags(self, category: str, crop: str, content: str) -> list[str]:
        tags = [category]
        if crop:
            tags.append(crop)
        keywords = [
            "organic",
            "irrigation",
            "harvest",
            "sowing",
            "fertilizer",
            "pesticide",
            "disease",
            "weather",
            "monsoon",
            "drought",
            "flood",
            "scheme",
            "subsidy",
            "loan",
            "insurance",
        ]
        content_lower = content[:2000].lower()
        for kw in keywords:
            if kw in content_lower:
                tags.append(kw)
        return tags
