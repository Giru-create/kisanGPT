from __future__ import annotations

from typing import Any

from app.tools.base import BaseTool


class DiseaseTool(BaseTool):
    """Adapter that wraps the existing DiagnosisService.

    In this orchestration layer the tool does not perform image
    analysis — it simply surfaces disease-related information
    based on the text query.
    """

    name = "disease"
    description = "Diagnose crop diseases and get treatment recommendations."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        image_bytes = context.get("image_bytes")
        content_type = context.get("content_type", "image/jpeg")

        if not image_bytes:
            return self._success(
                {
                    "message": (
                        "Disease detection requires an image. "
                        "Please upload a photo of the affected crop."
                    ),
                    "query": query,
                }
            )

        from app.services.diagnosis import diagnosis_service

        try:
            result = await diagnosis_service.detect(image_bytes, content_type)
            return self._success(result.model_dump(mode="json"))
        except Exception as exc:
            return self._error(str(exc))
