"""Thin async wrapper around the google-genai SDK."""

from __future__ import annotations

from typing import TYPE_CHECKING

from app.core.config import settings

if TYPE_CHECKING:
    from google import genai


class GeminiClient:
    """Lazily-initialised async Gemini client.

    Uses the same ``google-genai`` SDK already present in the project.
    """

    def __init__(self) -> None:
        self._client: genai.Client | None = None

    def _get_client(self) -> genai.Client:  # type: ignore[name-defined]
        if self._client is None:
            from google import genai

            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
        return self._client

    async def generate_content(
        self,
        *,
        model: str,
        contents: str,
        system_instruction: str,
    ) -> str:
        """Send a single-turn prompt and return the text response."""
        client = self._get_client()
        response = await client.aio.models.generate_content(
            model=model,
            contents=contents,
            config=type(client).types.GenerateContentConfig(
                system_instruction=system_instruction,
            ),
        )
        return response.text or ""

    @property
    def available(self) -> bool:
        """Return ``True`` if the API key is configured."""
        return bool(settings.GEMINI_API_KEY)


gemini_client = GeminiClient()
