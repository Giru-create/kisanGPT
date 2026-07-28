"""In-memory repository for farmer profiles, memory items, and conversation history.

Provides repository-pattern storage without requiring a database.
Can be swapped for a database-backed implementation later.
"""

from __future__ import annotations

from datetime import UTC, datetime

from app.core.logging import logger
from app.memory.schemas import (
    ConversationHistoryItem,
    FarmerProfile,
    FarmerProfileCreateRequest,
    MemoryItem,
    MemoryItemCreateRequest,
)


class FarmerProfileRepository:
    """Stores farmer profiles in memory, keyed by user_id."""

    def __init__(self) -> None:
        self._profiles: dict[str, FarmerProfile] = {}

    def get_by_user(self, user_id: str) -> FarmerProfile | None:
        return self._profiles.get(user_id)

    def save(self, user_id: str, request: FarmerProfileCreateRequest) -> FarmerProfile:
        existing = self._profiles.get(user_id)
        now = datetime.now(UTC)

        if existing:
            updated = existing.model_copy(
                update={
                    "name": request.name or existing.name,
                    "location": request.location or existing.location,
                    "preferred_language": (
                        request.preferred_language or existing.preferred_language
                    ),
                    "crops": request.crops or existing.crops,
                    "farming_type": (request.farming_type or existing.farming_type),
                    "farm_size_hectares": (
                        request.farm_size_hectares
                        if request.farm_size_hectares is not None
                        else existing.farm_size_hectares
                    ),
                    "soil_type": request.soil_type or existing.soil_type,
                    "updated_at": now,
                }
            )
            self._profiles[user_id] = updated
            logger.info(
                "Farmer profile updated",
                extra={"user_id": user_id},
            )
            return updated

        profile = FarmerProfile(
            user_id=user_id,
            name=request.name,
            location=request.location,
            preferred_language=request.preferred_language,
            crops=request.crops,
            farming_type=request.farming_type,
            farm_size_hectares=request.farm_size_hectares,
            soil_type=request.soil_type,
        )
        self._profiles[user_id] = profile
        logger.info(
            "Farmer profile created",
            extra={"user_id": user_id, "farmer_id": profile.farmer_id},
        )
        return profile

    def delete(self, user_id: str) -> bool:
        if user_id in self._profiles:
            del self._profiles[user_id]
            return True
        return False


class MemoryItemRepository:
    """Stores persistent memory items in memory, keyed by user_id + memory_id."""

    def __init__(self) -> None:
        self._items: dict[str, MemoryItem] = {}
        self._user_items: dict[str, list[str]] = {}

    def save(self, user_id: str, request: MemoryItemCreateRequest) -> MemoryItem:
        item = MemoryItem(
            user_id=user_id,
            category=request.category,
            key=request.key,
            value=request.value,
            confidence=request.confidence,
            source=request.source,
        )
        self._items[item.memory_id] = item
        self._user_items.setdefault(user_id, []).append(item.memory_id)

        logger.info(
            "Memory item saved",
            extra={
                "memory_id": item.memory_id,
                "user_id": user_id,
                "category": item.category,
            },
        )
        return item

    def get(self, user_id: str, memory_id: str) -> MemoryItem | None:
        item = self._items.get(memory_id)
        if item and item.user_id == user_id:
            return item
        return None

    def get_by_user(
        self, user_id: str, category: str | None = None
    ) -> list[MemoryItem]:
        item_ids = self._user_items.get(user_id, [])
        items = [self._items[mid] for mid in item_ids if mid in self._items]
        if category:
            items = [i for i in items if i.category == category]
        return items

    def get_by_key(self, user_id: str, key: str) -> MemoryItem | None:
        for item_id in self._user_items.get(user_id, []):
            item = self._items.get(item_id)
            if item and item.key == key:
                return item
        return None

    def delete(self, user_id: str, memory_id: str) -> bool:
        item = self._items.get(memory_id)
        if not item or item.user_id != user_id:
            return False

        del self._items[memory_id]
        user_list = self._user_items.get(user_id, [])
        if memory_id in user_list:
            user_list.remove(memory_id)
        return True

    def delete_by_user(self, user_id: str) -> int:
        item_ids = self._user_items.pop(user_id, [])
        count = 0
        for mid in item_ids:
            if mid in self._items:
                del self._items[mid]
                count += 1
        return count


class ConversationHistoryRepository:
    """Stores recent conversation history per user, limited to last N messages."""

    MAX_HISTORY = 50

    def __init__(self) -> None:
        self._history: dict[str, list[ConversationHistoryItem]] = {}

    def add_message(self, user_id: str, message: ConversationHistoryItem) -> None:
        self._history.setdefault(user_id, []).append(message)
        if len(self._history[user_id]) > self.MAX_HISTORY:
            self._history[user_id] = self._history[user_id][-self.MAX_HISTORY :]

    def get_history(
        self, user_id: str, limit: int = 20
    ) -> list[ConversationHistoryItem]:
        messages = self._history.get(user_id, [])
        return messages[-limit:]

    def clear(self, user_id: str) -> int:
        messages = self._history.pop(user_id, [])
        return len(messages)
