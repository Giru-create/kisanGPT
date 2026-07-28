"""Embedding service for generating vector embeddings."""

from __future__ import annotations

import abc
from typing import TYPE_CHECKING

from app.core.config import settings
from app.core.logging import logger

if TYPE_CHECKING:
    from google import genai


class EmbeddingProvider(abc.ABC):
    """Abstract interface for embedding providers."""

    @abc.abstractmethod
    async def embed(self, text: str) -> list[float]:
        """Generate an embedding vector for the given text."""
        ...

    @abc.abstractmethod
    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """Generate embedding vectors for a batch of texts."""
        ...


class GeminiEmbeddingProvider(EmbeddingProvider):
    """Google Gemini implementation of the embedding provider."""

    def __init__(self, model: str = "text-embedding-004") -> None:
        self._model = model
        self._client: genai.Client | None = None

    def _get_client(self) -> genai.Client:  # type: ignore[name-defined]
        if self._client is None:
            from google import genai

            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
        return self._client

    async def embed(self, text: str) -> list[float]:
        """Generate an embedding vector for the given text."""
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        logger.info(
            "Gemini embed",
            extra={"model": self._model, "text_length": len(text)},
        )

        client = self._get_client()
        response = await client.aio.models.embed_content(
            model=self._model,
            contents=text,
        )
        return response.embeddings[0].values

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """Generate embedding vectors for a batch of texts."""
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        logger.info(
            "Gemini embed_batch",
            extra={"model": self._model, "batch_size": len(texts)},
        )

        client = self._get_client()
        response = await client.aio.models.embed_content(
            model=self._model,
            contents=texts,
        )
        return [embedding.values for embedding in response.embeddings]

    @property
    def available(self) -> bool:
        """Return ``True`` if the API key is configured."""
        return bool(settings.GEMINI_API_KEY)


default_embedding_provider: EmbeddingProvider | None = None


def get_default_embedding_provider() -> EmbeddingProvider:
    """Return the default Gemini embedding provider, creating it on first call."""
    global default_embedding_provider  # noqa: PLW0603
    if default_embedding_provider is None:
        default_embedding_provider = GeminiEmbeddingProvider()
    return default_embedding_provider
