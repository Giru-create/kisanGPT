"""Long-term memory for persistent farmer facts and preferences.

Stores durable information that survives across conversations:
farmer profile, extracted facts, preferences, and crop history.
"""

from __future__ import annotations

from app.memory.repository import (
    ConversationHistoryRepository,
    FarmerProfileRepository,
    MemoryItemRepository,
)
from app.memory.schemas import (
    ConversationHistoryItem,
    FarmerProfile,
    FarmerProfileCreateRequest,
    MemoryContext,
    MemoryItem,
    MemoryItemCreateRequest,
)


class LongTermMemory:
    """Provides access to persistent farmer data across sessions.

    Wraps the repository layer and exposes a clean interface for the
    memory manager to use.
    """

    def __init__(
        self,
        profile_repo: FarmerProfileRepository | None = None,
        memory_repo: MemoryItemRepository | None = None,
        history_repo: ConversationHistoryRepository | None = None,
    ) -> None:
        self._profile_repo = profile_repo or FarmerProfileRepository()
        self._memory_repo = memory_repo or MemoryItemRepository()
        self._history_repo = history_repo or ConversationHistoryRepository()

    # -- Farmer Profile --

    def get_profile(self, user_id: str) -> FarmerProfile | None:
        return self._profile_repo.get_by_user(user_id)

    def save_profile(
        self, user_id: str, request: FarmerProfileCreateRequest
    ) -> FarmerProfile:
        return self._profile_repo.save(user_id, request)

    def delete_profile(self, user_id: str) -> bool:
        return self._profile_repo.delete(user_id)

    # -- Memory Items --

    def save_memory_item(
        self, user_id: str, request: MemoryItemCreateRequest
    ) -> MemoryItem:
        return self._memory_repo.save(user_id, request)

    def get_memory_item(self, user_id: str, memory_id: str) -> MemoryItem | None:
        return self._memory_repo.get(user_id, memory_id)

    def get_user_facts(
        self, user_id: str, category: str | None = None
    ) -> list[MemoryItem]:
        return self._memory_repo.get_by_user(user_id, category)

    def get_fact_by_key(self, user_id: str, key: str) -> MemoryItem | None:
        return self._memory_repo.get_by_key(user_id, key)

    def delete_memory_item(self, user_id: str, memory_id: str) -> bool:
        return self._memory_repo.delete(user_id, memory_id)

    # -- Conversation History --

    def add_history_message(
        self, user_id: str, role: str, content: str
    ) -> ConversationHistoryItem:
        item = ConversationHistoryItem(role=role, content=content)
        self._history_repo.add_message(user_id, item)
        return item

    def get_history(
        self, user_id: str, limit: int = 20
    ) -> list[ConversationHistoryItem]:
        return self._history_repo.get_history(user_id, limit)

    def clear_history(self, user_id: str) -> int:
        return self._history_repo.clear(user_id)

    # -- Combined Context --

    def get_context(self, user_id: str, history_limit: int = 10) -> MemoryContext:
        """Build a full MemoryContext for the orchestrator."""
        profile = self.get_profile(user_id)
        history = self.get_history(user_id, limit=history_limit)
        facts = self.get_user_facts(user_id)

        preferences: dict[str, str] = {}
        if profile:
            preferences["language"] = profile.preferred_language
            if profile.location:
                preferences["location"] = profile.location
            if profile.crops:
                preferences["crops"] = ", ".join(profile.crops)

        for fact in facts:
            if fact.category == "preference":
                preferences[fact.key] = fact.value

        return MemoryContext(
            farmer_profile=profile,
            history=history,
            preferences=preferences,
            facts=facts,
        )
