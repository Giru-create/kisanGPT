"""Short-term memory for current conversation context.

Holds the active conversation state so the orchestrator can reference
recent messages within the same interaction.
"""

from __future__ import annotations

from app.memory.schemas import ConversationHistoryItem


class ShortTermMemory:
    """Manages current-conversation context for a single user session.

    This is lightweight and ephemeral -- it only lives for the duration
    of a single orchestration cycle or conversation turn.
    """

    def __init__(self) -> None:
        self._active: dict[str, list[ConversationHistoryItem]] = {}

    def add_message(
        self, user_id: str, role: str, content: str
    ) -> ConversationHistoryItem:
        """Append a message to the user's active conversation."""
        item = ConversationHistoryItem(role=role, content=content)
        self._active.setdefault(user_id, []).append(item)
        return item

    def get_messages(self, user_id: str) -> list[ConversationHistoryItem]:
        """Return all messages in the current active conversation."""
        return list(self._active.get(user_id, []))

    def clear(self, user_id: str) -> int:
        """Clear the active conversation for a user. Returns count cleared."""
        messages = self._active.pop(user_id, [])
        return len(messages)

    def get_recent(self, user_id: str, n: int = 5) -> list[ConversationHistoryItem]:
        """Return the last *n* messages from the active conversation."""
        messages = self._active.get(user_id, [])
        return messages[-n:]
