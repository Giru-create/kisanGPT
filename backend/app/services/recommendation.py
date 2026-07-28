"""Recommendation engine for personalized farming suggestions."""

from __future__ import annotations

from app.core.logging import logger
from app.llm.provider import LLMProvider, get_default_provider
from app.schemas.memory import Recommendation, RecommendationRequest
from app.services.memory import MemoryService

RECOMMENDATION_SYSTEM_PROMPT = """You are an expert farming advisor for Indian farmers.

Based on the farmer's history and context, provide personalized recommendations.

Always consider:
- Local climate and weather patterns
- Crop rotation best practices
- Water management
- Soil health
- Market conditions
- Sustainable farming practices

Provide specific, actionable recommendations with clear reasoning.
Respond in the same language as the context (Hindi, Punjabi, or English)."""


class RecommendationEngine:
    """Engine for generating personalized farming recommendations."""

    def __init__(
        self,
        memory_service: MemoryService | None = None,
        llm_provider: LLMProvider | None = None,
    ) -> None:
        self._memory_service = memory_service or MemoryService()
        self._llm_provider = llm_provider or self._safe_get_provider()

    @staticmethod
    def _safe_get_provider() -> LLMProvider | None:
        """Return the default provider if configured, else ``None``."""
        try:
            return get_default_provider()
        except Exception:
            return None

    async def generate_recommendations(
        self,
        user_id: str,
        request: RecommendationRequest,
    ) -> list[Recommendation]:
        """Generate personalized recommendations based on user's memory."""
        # Get relevant memories
        memories = await self._memory_service.get_user_memories(
            user_id=user_id,
            limit=20,
        )

        # Build context from memories
        context_parts = []
        for memory in memories:
            context_parts.append(
                f"[{memory.memory_type}] {memory.content}"
                + (f" (Crop: {memory.crop})" if memory.crop else "")
                + (f" (Location: {memory.location})" if memory.location else "")
            )

        context = (
            "\n".join(context_parts)
            if context_parts
            else "No previous memories available."
        )

        # Build user context
        user_context = f"User ID: {user_id}"
        if request.crop:
            user_context += f", Primary Crop: {request.crop}"
        if request.location:
            user_context += f", Location: {request.location}"

        # Generate recommendations using LLM
        if self._llm_provider:
            try:
                user_content = f"""Farmer Context: {user_context}

Recent Farm History:
{context}

Generate {request.limit} personalized farming recommendations based on this history."""

                response = await self._llm_provider.generate(
                    system_instruction=RECOMMENDATION_SYSTEM_PROMPT,
                    user_content=user_content,
                )

                # Parse LLM response into recommendations
                recommendations = self._parse_recommendations(
                    user_id=user_id,
                    response=response,
                    source_memories=[m.memory_id for m in memories[:5]],
                )

                if not recommendations:
                    # LLM returned text but parser found no structured recommendations
                    source_ids = [m.memory_id for m in memories[:5]]
                    recommendations = [
                        Recommendation(
                            user_id=user_id,
                            title="Farming Recommendation",
                            content=response.strip(),
                            recommendation_type="general",
                            priority="medium",
                            confidence=0.6,
                            source_memories=source_ids,
                        )
                    ]

                logger.info(
                    "Recommendations generated via LLM",
                    extra={"user_id": user_id, "count": len(recommendations)},
                )

                return recommendations[: request.limit]

            except Exception:
                logger.warning(
                    "LLM recommendation generation failed, using fallback",
                    extra={"user_id": user_id},
                )

        # Fallback: return basic recommendations based on memory patterns
        return self._generate_fallback_recommendations(
            user_id=user_id,
            memories=memories,
            request=request,
        )

    def _parse_recommendations(
        self,
        user_id: str,
        response: str,
        source_memories: list[str],
    ) -> list[Recommendation]:
        """Parse LLM response into structured recommendations."""
        recommendations = []

        # Simple parsing: split by numbered items or paragraphs
        lines = response.strip().split("\n")
        current_title = ""
        current_content = []

        for line in lines:
            line = line.strip()
            if not line:
                if current_title and current_content:
                    recommendations.append(
                        Recommendation(
                            user_id=user_id,
                            title=current_title,
                            content=" ".join(current_content),
                            recommendation_type="general",
                            priority="medium",
                            confidence=0.7,
                            source_memories=source_memories,
                        )
                    )
                    current_title = ""
                    current_content = []
                continue

            # Check if line is a title (starts with number or bullet)
            if line[0].isdigit() or line.startswith(("-", "*", "•")):
                if current_title and current_content:
                    recommendations.append(
                        Recommendation(
                            user_id=user_id,
                            title=current_title,
                            content=" ".join(current_content),
                            recommendation_type="general",
                            priority="medium",
                            confidence=0.7,
                            source_memories=source_memories,
                        )
                    )
                current_title = line.lstrip("0123456789.-*• ").strip()
                current_content = []
            else:
                current_content.append(line)

        # Add last recommendation
        if current_title and current_content:
            recommendations.append(
                Recommendation(
                    user_id=user_id,
                    title=current_title,
                    content=" ".join(current_content),
                    recommendation_type="general",
                    priority="medium",
                    confidence=0.7,
                    source_memories=source_memories,
                )
            )

        return recommendations

    def _generate_fallback_recommendations(
        self,
        user_id: str,
        memories: list,
        request: RecommendationRequest,
    ) -> list[Recommendation]:
        """Generate basic recommendations when LLM is unavailable."""
        recommendations = []

        # Analyze memory patterns
        memory_types = {}
        crops = set()
        for memory in memories:
            memory_types[memory.memory_type] = (
                memory_types.get(memory.memory_type, 0) + 1
            )
            if getattr(memory, "crop", None):
                crops.add(str(memory.crop))

        # Generate recommendations based on patterns
        if memory_types.get("diagnosis", 0) > 0:
            recommendations.append(
                Recommendation(
                    user_id=user_id,
                    title="Regular Crop Health Monitoring",
                    content=(
                        "Based on your disease diagnosis history, we recommend"
                        " weekly crop health checks to catch issues early."
                    ),
                    recommendation_type="crop",
                    priority="high",
                    confidence=0.8,
                    source_memories=[m.memory_id for m in memories[:3]],
                )
            )

        if memory_types.get("weather", 0) > 2:
            recommendations.append(
                Recommendation(
                    user_id=user_id,
                    title="Weather-Based Planning",
                    content=(
                        "You frequently check weather. Consider setting up"
                        " automated weather alerts for your farm."
                    ),
                    recommendation_type="general",
                    priority="medium",
                    confidence=0.7,
                    source_memories=[m.memory_id for m in memories[:3]],
                )
            )

        if crops:
            crop_list = ", ".join(crops)
            recommendations.append(
                Recommendation(
                    user_id=user_id,
                    title=f"Crop Rotation for {crop_list}",
                    content=(
                        f"Consider rotating {crop_list} with legumes"
                        " to improve soil health."
                    ),
                    recommendation_type="crop",
                    priority="medium",
                    confidence=0.6,
                    source_memories=[m.memory_id for m in memories[:3]],
                )
            )

        # Default recommendation if no patterns detected
        if not recommendations:
            recommendations.append(
                Recommendation(
                    user_id=user_id,
                    title="Start Recording Farm Activities",
                    content=(
                        "Log your daily farming activities to get"
                        " personalized recommendations based on"
                        " your practices."
                    ),
                    recommendation_type="general",
                    priority="low",
                    confidence=0.5,
                )
            )

        return recommendations[: request.limit]
