from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter, UploadFile

from app.core.upload import secure_read_upload
from app.schemas.disease import DiseaseDetectionResponse
from app.services.diagnosis import diagnosis_service

if TYPE_CHECKING:
    from app.core.security import CurrentUserDependency

router = APIRouter()


@router.post("/detect", response_model=DiseaseDetectionResponse)
async def detect_disease(
    current_user: CurrentUserDependency,
    file: UploadFile,
) -> DiseaseDetectionResponse:
    content_type = file.content_type or "application/octet-stream"
    image_bytes = await secure_read_upload(file)

    result = await diagnosis_service.detect(
        image_bytes=image_bytes,
        content_type=content_type,
    )

    return DiseaseDetectionResponse(
        disease_name=result.disease_name,
        crop=result.crop,
        confidence=result.confidence,
        severity=result.severity,
        description=result.description,
        is_healthy=result.is_healthy,
        treatments=result.treatments,
        prevention=result.prevention,
        similar_diseases=result.similar_diseases,
        image_hash=result.image_hash,
    )
