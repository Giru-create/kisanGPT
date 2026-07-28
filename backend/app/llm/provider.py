"""LLM provider abstraction layer."""

from __future__ import annotations

import abc

from app.core.config import settings
from app.core.logging import logger
from app.llm.client import gemini_client


class LLMProvider(abc.ABC):
    """Abstract interface for text generation providers."""

    @abc.abstractmethod
    async def generate(
        self,
        *,
        system_instruction: str,
        user_content: str,
    ) -> str:
        """Generate a completion given a system prompt and user content."""
        ...


class GeminiProvider(LLMProvider):
    """Google Gemini implementation of the LLM provider."""

    def __init__(self, model: str | None = None) -> None:
        self._model = model or settings.GEMINI_ORCHESTRATOR_MODEL

    async def generate(
        self,
        *,
        system_instruction: str,
        user_content: str,
    ) -> str:
        if not gemini_client.available:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        logger.info("Gemini generate", extra={"model": self._model})
        return await gemini_client.generate_content(
            model=self._model,
            contents=user_content,
            system_instruction=system_instruction,
        )


default_provider: LLMProvider | None = None


def get_default_provider() -> LLMProvider:
    """Return the default Gemini provider, creating it on first call."""
    global default_provider  # noqa: PLW0603
    if default_provider is None:
        default_provider = GeminiProvider()
    return default_provider
