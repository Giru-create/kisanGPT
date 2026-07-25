from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.disease import (
    DiagnosisHistoryItem,
    DiagnosisHistoryResponse,
    DiagnosisResult,
    DiseaseDetectionResponse,
    TreatmentRecommendation,
)


class TestTreatmentRecommendation:
    def test_valid_chemical(self) -> None:
        t = TreatmentRecommendation(
            type="chemical",
            name="Chlorothalonil",
            description="Apply every 7 days",
            urgency="immediate",
        )
        assert t.type == "chemical"
        assert t.urgency == "immediate"

    def test_valid_cultural(self) -> None:
        t = TreatmentRecommendation(
            type="cultural",
            name="Remove leaves",
            description="Prune infected parts",
            urgency="within_days",
        )
        assert t.type == "cultural"

    def test_valid_biological(self) -> None:
        t = TreatmentRecommendation(
            type="biological",
            name="Trichoderma",
            description="Apply soil treatment",
            urgency="preventive",
        )
        assert t.type == "biological"

    def test_valid_mechanical(self) -> None:
        t = TreatmentRecommendation(
            type="mechanical",
            name="Tillage",
            description="Deep ploughing",
            urgency="preventive",
        )
        assert t.type == "mechanical"

    def test_invalid_type(self) -> None:
        with pytest.raises(ValidationError):
            TreatmentRecommendation(
                type="homeopathic",
                name="X",
                description="Y",
                urgency="immediate",
            )

    def test_invalid_urgency(self) -> None:
        with pytest.raises(ValidationError):
            TreatmentRecommendation(
                type="chemical",
                name="X",
                description="Y",
                urgency="whenever",
            )


class TestDiagnosisResult:
    def test_valid(self) -> None:
        r = DiagnosisResult(
            disease_name="Late Blight",
            crop="Tomato",
            confidence=0.92,
            severity="high",
            description="Fungal disease",
            is_healthy=False,
            treatments=[],
            prevention=["Use clean seeds"],
            similar_diseases=["Early Blight"],
            image_hash="abc123",
        )
        assert r.confidence == 0.92
        assert r.is_healthy is False

    def test_confidence_bounds(self) -> None:
        with pytest.raises(ValidationError):
            DiagnosisResult(
                disease_name="X",
                crop="Y",
                confidence=1.5,
                severity="low",
                description="d",
                is_healthy=True,
                treatments=[],
                prevention=[],
                similar_diseases=[],
                image_hash="h",
            )

    def test_invalid_severity(self) -> None:
        with pytest.raises(ValidationError):
            DiagnosisResult(
                disease_name="X",
                crop="Y",
                confidence=0.5,
                severity="extreme",
                description="d",
                is_healthy=True,
                treatments=[],
                prevention=[],
                similar_diseases=[],
                image_hash="h",
            )

    def test_healthy_plant(self) -> None:
        r = DiagnosisResult(
            disease_name="Healthy",
            crop="Rice",
            confidence=0.98,
            severity="low",
            description="No disease detected",
            is_healthy=True,
            treatments=[],
            prevention=[],
            similar_diseases=[],
            image_hash="h",
        )
        assert r.is_healthy is True


class TestDiseaseDetectionResponse:
    def test_valid(self) -> None:
        resp = DiseaseDetectionResponse(
            disease_name="Powdery Mildew",
            crop="Wheat",
            confidence=0.85,
            severity="medium",
            description="Fungal infection",
            is_healthy=False,
            treatments=[],
            prevention=[],
            similar_diseases=[],
            image_hash="def456",
        )
        assert resp.disease_name == "Powdery Mildew"


class TestDiagnosisHistory:
    def test_valid_item(self) -> None:
        item = DiagnosisHistoryItem(
            id="diag_001",
            disease_name="Blight",
            crop="Potato",
            confidence=0.88,
            created_at="2026-07-25T10:00:00Z",
        )
        assert item.id == "diag_001"

    def test_valid_history(self) -> None:
        h = DiagnosisHistoryResponse(diagnoses=[])
        assert len(h.diagnoses) == 0
