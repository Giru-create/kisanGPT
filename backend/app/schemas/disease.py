from __future__ import annotations

from pydantic import BaseModel, Field


class TreatmentRecommendation(BaseModel):
    type: str = Field(..., pattern=r"^(chemical|cultural|biological|mechanical)$")
    name: str
    description: str
    urgency: str = Field(..., pattern=r"^(immediate|within_days|preventive)$")


class DiagnosisResult(BaseModel):
    disease_name: str
    crop: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    severity: str = Field(..., pattern=r"^(low|medium|high|critical)$")
    description: str
    is_healthy: bool
    treatments: list[TreatmentRecommendation]
    prevention: list[str]
    similar_diseases: list[str]
    image_hash: str


class DiseaseDetectionResponse(BaseModel):
    disease_name: str
    crop: str
    confidence: float
    severity: str
    description: str
    is_healthy: bool
    treatments: list[TreatmentRecommendation]
    prevention: list[str]
    similar_diseases: list[str]
    image_hash: str


class DiagnosisHistoryItem(BaseModel):
    id: str
    disease_name: str
    crop: str
    confidence: float
    created_at: str


class DiagnosisHistoryResponse(BaseModel):
    diagnoses: list[DiagnosisHistoryItem]
