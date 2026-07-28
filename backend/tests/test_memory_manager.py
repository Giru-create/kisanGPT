"""Tests for the MemoryManager."""

from __future__ import annotations

import pytest

from app.memory.manager import MemoryManager
from app.memory.schemas import FarmerProfileCreateRequest


@pytest.fixture
def manager() -> MemoryManager:
    return MemoryManager()


class TestMemoryManagerRetrieve:
    """Tests for memory retrieval."""

    @pytest.mark.asyncio
    async def test_retrieve_empty_memory(self, manager: MemoryManager) -> None:
        ctx = await manager.retrieve_memory("user-1")
        assert ctx.farmer_profile is None
        assert ctx.history == []
        assert ctx.preferences == {}
        assert ctx.facts == []

    @pytest.mark.asyncio
    async def test_retrieve_with_profile(self, manager: MemoryManager) -> None:
        await manager.update_profile(
            "user-1",
            FarmerProfileCreateRequest(name="Ramesh", location="Agra", crops=["wheat"]),
        )
        ctx = await manager.retrieve_memory("user-1")
        assert ctx.farmer_profile is not None
        assert ctx.farmer_profile.name == "Ramesh"
        assert ctx.farmer_profile.location == "Agra"
        assert ctx.preferences["location"] == "Agra"
        assert ctx.preferences["crops"] == "wheat"

    @pytest.mark.asyncio
    async def test_retrieve_includes_short_term(self, manager: MemoryManager) -> None:
        await manager.save_conversation_message("user-1", "user", "Hello")
        ctx = await manager.retrieve_memory("user-1")
        assert len(ctx.history) == 1
        assert ctx.history[0].role == "user"
        assert ctx.history[0].content == "Hello"


class TestMemoryManagerSave:
    """Tests for memory saving."""

    @pytest.mark.asyncio
    async def test_save_extracts_crop(self, manager: MemoryManager) -> None:
        saved = await manager.save_memory("user-1", "I grow wheat in my farm")
        assert len(saved) >= 1
        crop_items = [i for i in saved if i.category == "crop"]
        assert len(crop_items) >= 1
        assert crop_items[0].value == "wheat"

    @pytest.mark.asyncio
    async def test_save_extracts_location(self, manager: MemoryManager) -> None:
        saved = await manager.save_memory("user-1", "My farm is in Agra")
        loc_items = [i for i in saved if i.category == "location"]
        assert len(loc_items) >= 1

    @pytest.mark.asyncio
    async def test_save_no_duplicates(self, manager: MemoryManager) -> None:
        await manager.save_memory("user-1", "I grow wheat")
        saved_second = await manager.save_memory("user-1", "I grow wheat")
        # Should not save duplicate
        assert len(saved_second) == 0

    @pytest.mark.asyncio
    async def test_save_conversation_message(self, manager: MemoryManager) -> None:
        await manager.save_conversation_message("user-1", "user", "Hello")
        await manager.save_conversation_message("user-1", "assistant", "Hi there!")
        ctx = await manager.retrieve_memory("user-1")
        assert len(ctx.history) == 2


class TestMemoryManagerProfile:
    """Tests for farmer profile operations."""

    @pytest.mark.asyncio
    async def test_create_profile(self, manager: MemoryManager) -> None:
        profile = await manager.update_profile(
            "user-1",
            FarmerProfileCreateRequest(
                name="Ramesh",
                location="Agra",
                preferred_language="hi",
                crops=["wheat", "potato"],
                farming_type="organic",
                soil_type="loamy",
            ),
        )
        assert profile.name == "Ramesh"
        assert profile.location == "Agra"
        assert profile.preferred_language == "hi"
        assert profile.crops == ["wheat", "potato"]
        assert profile.farming_type == "organic"
        assert profile.soil_type == "loamy"

    @pytest.mark.asyncio
    async def test_update_profile(self, manager: MemoryManager) -> None:
        await manager.update_profile(
            "user-1",
            FarmerProfileCreateRequest(name="Ramesh"),
        )
        updated = await manager.update_profile(
            "user-1",
            FarmerProfileCreateRequest(name="Ramesh Kumar"),
        )
        assert updated.name == "Ramesh Kumar"

    @pytest.mark.asyncio
    async def test_get_profile(self, manager: MemoryManager) -> None:
        assert manager.get_profile("user-1") is None
        await manager.update_profile(
            "user-1",
            FarmerProfileCreateRequest(name="Ramesh"),
        )
        profile = manager.get_profile("user-1")
        assert profile is not None
        assert profile.name == "Ramesh"


class TestMemoryManagerDelete:
    """Tests for memory deletion."""

    @pytest.mark.asyncio
    async def test_delete_memory_item(self, manager: MemoryManager) -> None:
        saved = await manager.save_memory("user-1", "I grow wheat")
        assert len(saved) >= 1
        deleted = await manager.delete_memory_item("user-1", saved[0].memory_id)
        assert deleted is True

    @pytest.mark.asyncio
    async def test_delete_nonexistent(self, manager: MemoryManager) -> None:
        deleted = await manager.delete_memory_item("user-1", "nonexistent")
        assert deleted is False

    @pytest.mark.asyncio
    async def test_clear_user_memory(self, manager: MemoryManager) -> None:
        await manager.save_conversation_message("user-1", "user", "Hello")
        result = await manager.clear_user_memory("user-1")
        assert result["history_cleared"] == 1

    @pytest.mark.asyncio
    async def test_get_user_facts(self, manager: MemoryManager) -> None:
        await manager.save_memory("user-1", "I grow wheat")
        facts = manager.get_user_facts("user-1")
        assert len(facts) >= 1
