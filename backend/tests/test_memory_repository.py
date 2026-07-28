"""Tests for memory repositories."""

from __future__ import annotations

from app.memory.repository import (
    ConversationHistoryRepository,
    FarmerProfileRepository,
    MemoryItemRepository,
)
from app.memory.schemas import (
    FarmerProfileCreateRequest,
    MemoryItemCreateRequest,
)


class TestFarmerProfileRepository:
    """Tests for FarmerProfileRepository."""

    def test_save_and_get(self) -> None:
        repo = FarmerProfileRepository()
        request = FarmerProfileCreateRequest(
            name="Ramesh", location="Agra", crops=["wheat"]
        )
        profile = repo.save("user-1", request)
        assert profile.name == "Ramesh"
        assert profile.location == "Agra"

        retrieved = repo.get_by_user("user-1")
        assert retrieved is not None
        assert retrieved.name == "Ramesh"

    def test_update_existing(self) -> None:
        repo = FarmerProfileRepository()
        repo.save("user-1", FarmerProfileCreateRequest(name="Ramesh"))
        updated = repo.save("user-1", FarmerProfileCreateRequest(name="Ramesh Kumar"))
        assert updated.name == "Ramesh Kumar"

    def test_get_nonexistent(self) -> None:
        repo = FarmerProfileRepository()
        assert repo.get_by_user("nobody") is None

    def test_delete(self) -> None:
        repo = FarmerProfileRepository()
        repo.save("user-1", FarmerProfileCreateRequest(name="Ramesh"))
        assert repo.delete("user-1") is True
        assert repo.get_by_user("user-1") is None

    def test_delete_nonexistent(self) -> None:
        repo = FarmerProfileRepository()
        assert repo.delete("nobody") is False


class TestMemoryItemRepository:
    """Tests for MemoryItemRepository."""

    def test_save_and_get(self) -> None:
        repo = MemoryItemRepository()
        request = MemoryItemCreateRequest(
            category="crop", key="grows_wheat", value="wheat"
        )
        item = repo.save("user-1", request)
        assert item.key == "grows_wheat"
        assert item.value == "wheat"

        retrieved = repo.get("user-1", item.memory_id)
        assert retrieved is not None
        assert retrieved.key == "grows_wheat"

    def test_get_by_user(self) -> None:
        repo = MemoryItemRepository()
        repo.save(
            "user-1",
            MemoryItemCreateRequest(category="crop", key="grows_wheat", value="wheat"),
        )
        repo.save(
            "user-1",
            MemoryItemCreateRequest(
                category="location", key="farm_location", value="Agra"
            ),
        )
        items = repo.get_by_user("user-1")
        assert len(items) == 2

    def test_get_by_user_with_category(self) -> None:
        repo = MemoryItemRepository()
        repo.save(
            "user-1",
            MemoryItemCreateRequest(category="crop", key="grows_wheat", value="wheat"),
        )
        repo.save(
            "user-1",
            MemoryItemCreateRequest(
                category="location", key="farm_location", value="Agra"
            ),
        )
        crops = repo.get_by_user("user-1", category="crop")
        assert len(crops) == 1
        assert crops[0].category == "crop"

    def test_get_by_key(self) -> None:
        repo = MemoryItemRepository()
        repo.save(
            "user-1",
            MemoryItemCreateRequest(category="crop", key="grows_wheat", value="wheat"),
        )
        item = repo.get_by_key("user-1", "grows_wheat")
        assert item is not None
        assert item.value == "wheat"

    def test_get_by_key_nonexistent(self) -> None:
        repo = MemoryItemRepository()
        assert repo.get_by_key("user-1", "nobody") is None

    def test_delete(self) -> None:
        repo = MemoryItemRepository()
        item = repo.save(
            "user-1",
            MemoryItemCreateRequest(category="crop", key="grows_wheat", value="wheat"),
        )
        assert repo.delete("user-1", item.memory_id) is True
        assert repo.get("user-1", item.memory_id) is None

    def test_delete_wrong_user(self) -> None:
        repo = MemoryItemRepository()
        item = repo.save(
            "user-1",
            MemoryItemCreateRequest(category="crop", key="grows_wheat", value="wheat"),
        )
        assert repo.delete("user-2", item.memory_id) is False

    def test_delete_by_user(self) -> None:
        repo = MemoryItemRepository()
        repo.save(
            "user-1",
            MemoryItemCreateRequest(category="crop", key="grows_wheat", value="wheat"),
        )
        repo.save(
            "user-1",
            MemoryItemCreateRequest(category="crop", key="grows_rice", value="rice"),
        )
        count = repo.delete_by_user("user-1")
        assert count == 2
        assert repo.get_by_user("user-1") == []


class TestConversationHistoryRepository:
    """Tests for ConversationHistoryRepository."""

    def test_add_and_get(self) -> None:
        repo = ConversationHistoryRepository()
        from app.memory.schemas import ConversationHistoryItem

        msg = ConversationHistoryItem(role="user", content="Hello")
        repo.add_message("user-1", msg)
        history = repo.get_history("user-1")
        assert len(history) == 1
        assert history[0].content == "Hello"

    def test_get_with_limit(self) -> None:
        repo = ConversationHistoryRepository()
        from app.memory.schemas import ConversationHistoryItem

        for i in range(10):
            repo.add_message(
                "user-1",
                ConversationHistoryItem(role="user", content=f"msg{i}"),
            )
        history = repo.get_history("user-1", limit=3)
        assert len(history) == 3
        assert history[0].content == "msg7"

    def test_clear(self) -> None:
        repo = ConversationHistoryRepository()
        from app.memory.schemas import ConversationHistoryItem

        repo.add_message(
            "user-1",
            ConversationHistoryItem(role="user", content="Hello"),
        )
        count = repo.clear("user-1")
        assert count == 1
        assert repo.get_history("user-1") == []

    def test_max_history_limit(self) -> None:
        repo = ConversationHistoryRepository()
        from app.memory.schemas import ConversationHistoryItem

        for i in range(60):
            repo.add_message(
                "user-1",
                ConversationHistoryItem(role="user", content=f"msg{i}"),
            )
        history = repo.get_history("user-1", limit=100)
        assert len(history) == ConversationHistoryRepository.MAX_HISTORY
