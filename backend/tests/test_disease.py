from __future__ import annotations

from typing import Any

import pytest

from app.agents.disease import DiseaseDetectionProvider, compute_image_hash
from app.core.exceptions import ImageTooLargeError, UnsupportedImageError
from app.schemas.disease import DiagnosisResult
from app.services.diagnosis import DiagnosisService


class MockDiseaseProvider(DiseaseDetectionProvider):
    """Test double for DiseaseDetectionProvider."""

    def __init__(
        self,
        response: dict[str, Any] | None = None,
        error: Exception | None = None,
    ) -> None:
        self._response = response or {
            "disease_name": "Late Blight",
            "crop": "Tomato",
            "confidence": 0.92,
            "severity": "high",
            "description": "Fungal disease",
            "is_healthy": False,
            "treatments": [
                {
                    "type": "chemical",
                    "name": "Chlorothalonil",
                    "description": "Apply weekly",
                    "urgency": "immediate",
                }
            ],
            "prevention": ["Use disease-free seeds"],
            "similar_diseases": ["Early Blight"],
        }
        self._error = error

    async def detect(self, image_bytes: bytes, content_type: str) -> dict[str, object]:
        if self._error:
            raise self._error
        return self._response  # type: ignore[return-value]


class TestImageHash:
    def test_deterministic(self) -> None:
        h1 = compute_image_hash(b"test image data")
        h2 = compute_image_hash(b"test image data")
        assert h1 == h2

    def test_different_inputs(self) -> None:
        h1 = compute_image_hash(b"image A")
        h2 = compute_image_hash(b"image B")
        assert h1 != h2

    def test_length(self) -> None:
        h = compute_image_hash(b"x")
        assert len(h) == 16


class TestDiagnosisServiceValidation:
    def test_rejects_unsupported_type(self) -> None:
        svc = DiagnosisService(provider=MockDiseaseProvider())
        with pytest.raises(UnsupportedImageError):
            svc.validate_image("image/bmp", 1000)

    def test_rejects_oversized_image(self) -> None:
        svc = DiagnosisService(provider=MockDiseaseProvider())
        max_bytes = 10 * 1024 * 1024
        with pytest.raises(ImageTooLargeError):
            svc.validate_image("image/jpeg", max_bytes + 1)

    def test_accepts_valid_jpeg(self) -> None:
        svc = DiagnosisService(provider=MockDiseaseProvider())
        svc.validate_image("image/jpeg", 1024)

    def test_accepts_valid_png(self) -> None:
        svc = DiagnosisService(provider=MockDiseaseProvider())
        svc.validate_image("image/png", 2048)

    def test_accepts_valid_webp(self) -> None:
        svc = DiagnosisService(provider=MockDiseaseProvider())
        svc.validate_image("image/webp", 4096)


class TestDiagnosisServiceDetect:
    @pytest.fixture
    def service(self) -> DiagnosisService:
        return DiagnosisService(provider=MockDiseaseProvider())

    @pytest.mark.asyncio
    async def test_detect_returns_result(self, service: DiagnosisService) -> None:
        result = await service.detect(
            image_bytes=b"fake image data",
            content_type="image/jpeg",
        )
        assert isinstance(result, DiagnosisResult)
        assert result.disease_name == "Late Blight"
        assert result.crop == "Tomato"
        assert result.confidence == 0.92

    @pytest.mark.asyncio
    async def test_detect_caches_result(self, service: DiagnosisService) -> None:
        r1 = await service.detect(b"same image", "image/jpeg")
        r2 = await service.detect(b"same image", "image/jpeg")
        assert r1.image_hash == r2.image_hash

    @pytest.mark.asyncio
    async def test_detect_provider_error(self) -> None:
        svc = DiagnosisService(
            provider=MockDiseaseProvider(error=ConnectionError("API down"))
        )
        with pytest.raises(ConnectionError):
            await svc.detect(b"img", "image/jpeg")


class TestParseResult:
    def test_parses_valid_raw(self) -> None:
        from app.services.diagnosis import _parse_result

        raw: dict[str, object] = {
            "disease_name": "Blight",
            "crop": "Rice",
            "confidence": 0.75,
            "severity": "medium",
            "description": "Test",
            "is_healthy": False,
            "treatments": [
                {
                    "type": "chemical",
                    "name": "Fungicide X",
                    "description": "Apply once",
                    "urgency": "within_days",
                }
            ],
            "prevention": ["Tip 1", "Tip 2"],
            "similar_diseases": ["Disease A"],
        }
        result = _parse_result(raw, "hash123")
        assert result.disease_name == "Blight"
        assert len(result.treatments) == 1
        assert len(result.prevention) == 2

    def test_handles_missing_fields(self) -> None:
        from app.services.diagnosis import _parse_result

        result = _parse_result({}, "hash")
        assert result.disease_name == "Unknown"
        assert result.confidence == 0.0
        assert result.is_healthy is False

    def test_clamps_invalid_severity(self) -> None:
        from app.services.diagnosis import _parse_result

        raw: dict[str, object] = {"severity": "extreme"}
        result = _parse_result(raw, "h")
        assert result.severity == "medium"
