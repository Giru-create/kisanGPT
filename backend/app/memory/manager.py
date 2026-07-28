"""Memory manager -- single interface for all memory operations.

Provides a unified API for the orchestrator to retrieve, save, and
update farmer memory.  Coordinates short-term, long-term, and
extracted memory.
"""

from __future__ import annotations

from app.core.logging import logger
from app.memory.extractor import extract_from_message
from app.memory.long_term import LongTermMemory
from app.memory.repository import (  # noqa: TC001
    ConversationHistoryRepository,
    FarmerProfileRepository,
    MemoryItemRepository,
)
from app.memory.schemas import (  # noqa: TC001
    FarmerProfile,
    FarmerProfileCreateRequest,
    MemoryContext,
    MemoryItem,
)
from app.memory.short_term import ShortTermMemory


class MemoryManager:
    """Unified interface for memory retrieval, save, and update.

    Coordinates:
        - ShortTermMemory (current conversation)
        - LongTermMemory (persistent farmer data)
        - MemoryExtractor (automatic extraction from messages)
    """

    def __init__(
        self,
        profile_repo: FarmerProfileRepository | None = None,
        memory_repo: MemoryItemRepository | None = None,
        history_repo: ConversationHistoryRepository | None = None,
    ) -> None:
        self._long_term = LongTermMemory(
            profile_repo=profile_repo,
            memory_repo=memory_repo,
            history_repo=history_repo,
        )
        self._short_term = ShortTermMemory()

    # -- Retrieve --

    async def retrieve_memory(self, user_id: str) -> MemoryContext:
        """Load full memory context for a user.

        Combines long-term persistent data with current conversation state.

        Args:
            user_id: The authenticated user ID.

        Returns:
            A MemoryContext with profile, history, preferences, and facts.
        """
        context = self._long_term.get_context(user_id)

        # Merge short-term messages into history
        short_messages = self._short_term.get_messages(user_id)
        if short_messages:
            existing_ids = {(m.role, m.content) for m in context.history}
            for msg in short_messages:
                if (msg.role, msg.content) not in existing_ids:
                    context.history.append(msg)

        logger.info(
            "Memory retrieved",
            extra={
                "user_id": user_id,
                "has_profile": context.farmer_profile is not None,
                "history_count": len(context.history),
                "facts_count": len(context.facts),
            },
        )
        return context

    # -- Save --

    async def save_memory(self, user_id: str, message: str) -> list[MemoryItem]:
        """Extract and save useful information from a user message.

        Analyses the message for factual farming information and
        persists anything worth remembering.

        Args:
            user_id: The authenticated user ID.
            message: The raw user message text.

        Returns:
            List of newly created memory items.
        """
        extracted = extract_from_message(message)
        saved: list[MemoryItem] = []

        for item_request in extracted:
            # Skip duplicates
            existing = self._long_term.get_fact_by_key(user_id, item_request.key)
            if existing and existing.value == item_request.value:
                continue

            item = self._long_term.save_memory_item(user_id, item_request)
            saved.append(item)

        if saved:
            logger.info(
                "Memory items saved",
                extra={"user_id": user_id, "count": len(saved)},
            )

        return saved

    # -- Update --

    async def update_profile(
        self, user_id: str, request: FarmerProfileCreateRequest
    ) -> FarmerProfile:
        """Create or update the farmer's profile.

        Args:
            user_id: The authenticated user ID.
            request: Profile fields to set.

        Returns:
            The updated FarmerProfile.
        """
        return self._long_term.save_profile(user_id, request)

    async def save_conversation_message(
        self, user_id: str, role: str, content: str
    ) -> None:
        """Record a message in both short-term and long-term history.

        Args:
            user_id: The authenticated user ID.
            role: Message role ('user' or 'assistant').
            content: Message text.
        """
        self._short_term.add_message(user_id, role, content)
        self._long_term.add_history_message(user_id, role, content)

    # -- Delete --

    async def delete_memory_item(self, user_id: str, memory_id: str) -> bool:
        """Delete a specific memory item.

        Args:
            user_id: The authenticated user ID.
            memory_id: ID of the memory item to delete.

        Returns:
            True if deleted, False if not found.
        """
        return self._long_term.delete_memory_item(user_id, memory_id)

    async def clear_user_memory(self, user_id: str) -> dict[str, int]:
        """Clear all memory for a user.

        Args:
            user_id: The authenticated user ID.

        Returns:
            Dict with counts of cleared items.
        """
        history_count = self._long_term.clear_history(user_id)
        self._short_term.clear(user_id)
        return {"history_cleared": history_count}

    # -- Convenience --

    def get_profile(self, user_id: str) -> FarmerProfile | None:
        """Get farmer profile without async."""
        return self._long_term.get_profile(user_id)

    def get_user_facts(
        self, user_id: str, category: str | None = None
    ) -> list[MemoryItem]:
        """Get all memory items for a user."""
        return self._long_term.get_user_facts(user_id, category)
