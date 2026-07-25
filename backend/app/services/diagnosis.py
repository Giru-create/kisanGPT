from __future__ import annotations

from app.agents.disease import (
    DiseaseDetectionProvider,
    GeminiVisionProvider,
    compute_image_hash,
)
from app.cache.memory import TTLCache
from app.core.config import settings
from app.core.exceptions import ImageTooLargeError, UnsupportedImageError
from app.core.logging import logger
from app.schemas.disease import DiagnosisResult, TreatmentRecommendation

SUPPORTED_TYPES = frozenset({"image/jpeg", "image/png", "image/webp"})


class DiagnosisService:
    """Orchestrates image validation, disease detection, and caching."""

    def __init__(
        self,
        provider: DiseaseDetectionProvider | None = None,
    ) -> None:
        self._provider = provider or GeminiVisionProvider(
            timeout=settings.DISEASE_TIMEOUT,
        )
        self._cache = TTLCache(default_ttl=settings.DISEASE_CACHE_TTL)

    def validate_image(self, content_type: str, size: int) -> None:
        if content_type not in SUPPORTED_TYPES:
            raise UnsupportedImageError(
                f"Unsupported image type: {content_type}. "
                f"Supported: {', '.join(sorted(SUPPORTED_TYPES))}"
            )
        max_bytes = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
        if size > max_bytes:
            raise ImageTooLargeError(
                f"Image size {size / 1024 / 1024:.1f}MB exceeds "
                f"maximum {settings.MAX_IMAGE_SIZE_MB}MB"
            )

    async def detect(
        self,
        image_bytes: bytes,
        content_type: str,
    ) -> DiagnosisResult:
        self.validate_image(content_type, len(image_bytes))

        image_hash = compute_image_hash(image_bytes)
        cache_key = f"disease:{image_hash}"
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info(
                "Disease detection cache hit",
                extra={"hash": image_hash},
            )
            return DiagnosisResult(**cached)  # type: ignore[arg-type]

        try:
            raw = await self._provider.detect(image_bytes, content_type)
        except Exception:
            logger.exception("Disease detection failed")
            raise

        result = _parse_result(raw, image_hash)

        self._cache.set(cache_key, result.model_dump())
        return result


def _parse_result(raw: dict[str, object], image_hash: str) -> DiagnosisResult:
    treatments_raw = raw.get("treatments", [])
    treatments = []
    for t in treatments_raw:
        if isinstance(t, dict):
            treatments.append(
                TreatmentRecommendation(
                    type=t.get("type", "cultural"),
                    name=t.get("name", "Unknown"),
                    description=t.get("description", ""),
                    urgency=t.get("urgency", "within_days"),
                )
            )

    prevention_raw = raw.get("prevention", [])
    prevention = [p for p in prevention_raw if isinstance(p, str)]

    similar_raw = raw.get("similar_diseases", [])
    similar = [s for s in similar_raw if isinstance(s, str)]

    return DiagnosisResult(
        disease_name=str(raw.get("disease_name", "Unknown")),
        crop=str(raw.get("crop", "Unknown")),
        confidence=float(raw.get("confidence", 0.0)),
        severity=_clamp_severity(str(raw.get("severity", "medium"))),
        description=str(raw.get("description", "")),
        is_healthy=bool(raw.get("is_healthy", False)),
        treatments=treatments,
        prevention=prevention,
        similar_diseases=similar,
        image_hash=image_hash,
    )


def _clamp_severity(severity: str) -> str:
    valid = {"low", "medium", "high", "critical"}
    return severity if severity in valid else "medium"


diagnosis_service = DiagnosisService()
