from __future__ import annotations

from typing import TYPE_CHECKING

from app.agents.chat import ChatAgent
from app.core.logging import logger
from app.schemas.chat import ChatMessage, ChatRequest, ChatResponse
from app.services.conversation import conversation_service

if TYPE_CHECKING:
    from collections.abc import AsyncIterator


class ChatService:
    """Orchestrates ChatAgent + ConversationService."""

    def __init__(self) -> None:
        self._agent = ChatAgent()

    async def send(self, user_id: str, request: ChatRequest) -> ChatResponse:
        conversation = conversation_service.get_or_create(
            user_id=user_id,
            conversation_id=request.conversation_id,
        )

        user_message = ChatMessage(role="user", content=request.message)
        conversation_service.add_message(conversation.conversation_id, user_message)

        response_text = await self._agent.generate(conversation.messages)

        assistant_message = ChatMessage(role="assistant", content=response_text)
        conversation_service.add_message(
            conversation.conversation_id, assistant_message
        )

        logger.info(
            "Chat response sent",
            extra={
                "conversation_id": conversation.conversation_id,
                "user_id": user_id,
            },
        )

        return ChatResponse(
            content=response_text,
            conversation_id=conversation.conversation_id,
        )

    async def send_stream(
        self,
        user_id: str,
        request: ChatRequest,
    ) -> AsyncIterator[str]:
        conversation = conversation_service.get_or_create(
            user_id=user_id,
            conversation_id=request.conversation_id,
        )

        user_message = ChatMessage(role="user", content=request.message)
        conversation_service.add_message(conversation.conversation_id, user_message)

        full_response = ""
        async for chunk in self._agent.generate_stream(conversation.messages):
            full_response += chunk
            yield chunk

        assistant_message = ChatMessage(role="assistant", content=full_response)
        conversation_service.add_message(
            conversation.conversation_id, assistant_message
        )


chat_service = ChatService()
