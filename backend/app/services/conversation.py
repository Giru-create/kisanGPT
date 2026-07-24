from __future__ import annotations

import time
from collections import defaultdict

from app.core.logging import logger
from app.schemas.chat import ChatMessage, Conversation

MAX_MESSAGES_PER_CONVERSATION = 50
CONVERSATION_TTL_SECONDS = 30 * 60  # 30 minutes


class ConversationService:
    """In-memory conversation store per user.

    Will be replaced by ChromaDB in Phase 9.
    """

    def __init__(self) -> None:
        self._conversations: dict[str, Conversation] = {}
        self._user_conversations: dict[str, list[str]] = defaultdict(list)

    def get(self, conversation_id: str) -> Conversation | None:
        conversation = self._conversations.get(conversation_id)
        if conversation and self._is_expired(conversation):
            self.delete(conversation_id)
            return None
        return conversation

    def get_or_create(self, user_id: str, conversation_id: str | None) -> Conversation:
        if conversation_id:
            conversation = self.get(conversation_id)
            if conversation and conversation.user_id == user_id:
                return conversation

        conversation = Conversation(user_id=user_id)
        self._conversations[conversation.conversation_id] = conversation
        self._user_conversations[user_id].append(conversation.conversation_id)
        logger.info(
            "Created conversation",
            extra={"conversation_id": conversation.conversation_id, "user_id": user_id},
        )
        return conversation

    def add_message(self, conversation_id: str, message: ChatMessage) -> None:
        conversation = self._conversations.get(conversation_id)
        if not conversation:
            return

        conversation.messages.append(message)
        conversation.updated_at = message.timestamp

        if len(conversation.messages) > MAX_MESSAGES_PER_CONVERSATION:
            conversation.messages = conversation.messages[
                -MAX_MESSAGES_PER_CONVERSATION:
            ]

    def delete(self, conversation_id: str) -> None:
        conversation = self._conversations.pop(conversation_id, None)
        if conversation:
            user_list = self._user_conversations.get(conversation.user_id, [])
            if conversation_id in user_list:
                user_list.remove(conversation_id)

    def cleanup_expired(self) -> int:
        expired = [
            cid for cid, conv in self._conversations.items() if self._is_expired(conv)
        ]
        for cid in expired:
            self.delete(cid)
        if expired:
            logger.info(
                "Cleaned up expired conversations",
                extra={"count": len(expired)},
            )
        return len(expired)

    def _is_expired(self, conversation: Conversation) -> bool:
        elapsed = time.time() - conversation.updated_at.timestamp()
        return elapsed > CONVERSATION_TTL_SECONDS


conversation_service = ConversationService()
