from __future__ import annotations

from typing import Any

from app.tools.base import BaseTool


class MemoryTool(BaseTool):
    """Adapter for conversation memory.

    Wraps the existing ConversationService to retrieve recent
    conversation history for context-aware responses.
    """

    name = "memory"
    description = "Retrieve conversation history and user context."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        from app.services.conversation import conversation_service

        user_id = context.get("user_id", "")
        conversation_id = context.get("conversation_id")

        if not user_id:
            return self._success({"messages": [], "conversation_id": None})

        try:
            conversation = conversation_service.get_or_create(
                user_id=user_id, conversation_id=conversation_id
            )
            messages = [
                {"role": m.role, "content": m.content}
                for m in conversation.messages[-10:]
            ]
            return self._success(
                {
                    "conversation_id": conversation.conversation_id,
                    "messages": messages,
                    "message_count": len(conversation.messages),
                }
            )
        except Exception as exc:
            return self._error(str(exc))
