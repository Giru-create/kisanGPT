from __future__ import annotations

from typing import TYPE_CHECKING

from google import genai

from app.core.config import settings
from app.core.logging import logger

if TYPE_CHECKING:
    from collections.abc import AsyncIterator

    from app.schemas.chat import ChatMessage

SYSTEM_PROMPT = """\
You are KisanGPT, an AI farming assistant designed for Indian farmers.

Your responsibilities:
- Help with crop management, planting, harvesting
- Diagnose crop diseases from descriptions
- Provide weather-related farming advice
- Share information about market prices and selling strategies
- Guide farmers on government schemes and subsidies
- Offer irrigation and water management tips
- Recommend fertilizers and pesticides

Guidelines:
- Respond in the user's preferred language (Hindi, English, or regional)
- Be concise, practical, and farmer-friendly
- Use simple language avoiding technical jargon
- Provide actionable advice when possible
- If unsure, say so honestly rather than guessing
- Never provide dangerous or illegal advice"""


class ChatAgent:
    """Single-responsibility Gemini agent for chat responses."""

    def __init__(self) -> None:
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY not set — chat will fail")
        self._client: genai.Client | None = None
        self._model = settings.GEMINI_MODEL

    def _get_client(self) -> genai.Client:
        if self._client is None:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
        return self._client

    async def generate(
        self,
        messages: list[ChatMessage],
    ) -> str:
        contents = self._build_contents(messages)
        last_message = messages[-1].content

        logger.info("Generating chat response", extra={"model": self._model})
        client = self._get_client()
        response = await client.aio.models.generate_content(
            model=self._model,
            contents=last_message,
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                history=contents[:-1] if len(contents) > 1 else None,
            ),
        )
        return response.text or ""

    async def generate_stream(
        self,
        messages: list[ChatMessage],
    ) -> AsyncIterator[str]:
        contents = self._build_contents(messages)
        last_message = messages[-1].content

        logger.info("Streaming chat response", extra={"model": self._model})
        client = self._get_client()
        async for chunk in await client.aio.models.generate_content_stream(
            model=self._model,
            contents=last_message,
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                history=contents[:-1] if len(contents) > 1 else None,
            ),
        ):
            if chunk.text:
                yield chunk.text

    def _build_contents(
        self,
        messages: list[ChatMessage],
    ) -> list[genai.types.ContentDict]:
        contents: list[genai.types.ContentDict] = []
        for msg in messages[:-1]:
            role = "user" if msg.role == "user" else "model"
            contents.append(genai.types.ContentDict(role=role, parts=[msg.content]))
        return contents
