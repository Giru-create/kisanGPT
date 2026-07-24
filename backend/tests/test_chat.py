from __future__ import annotations

import pytest

from app.schemas.chat import ChatMessage, ChatRequest
from app.services.conversation import ConversationService


class TestChatSchemas:
    def test_chat_request_valid(self) -> None:
        req = ChatRequest(message="Hello")
        assert req.message == "Hello"
        assert req.conversation_id is None

    def test_chat_request_with_conversation(self) -> None:
        req = ChatRequest(message="Hi", conversation_id="abc123")
        assert req.conversation_id == "abc123"

    def test_chat_request_empty_message(self) -> None:
        with pytest.raises(ValueError, match="String should have at least 1 character"):
            ChatRequest(message="")

    def test_chat_message_valid(self) -> None:
        msg = ChatMessage(role="user", content="Hello")
        assert msg.role == "user"
        assert msg.content == "Hello"
        assert msg.timestamp is not None

    def test_chat_message_invalid_role(self) -> None:
        with pytest.raises(ValueError, match="String should match pattern"):
            ChatMessage(role="invalid", content="Hello")


class TestConversationService:
    def test_create_conversation(self) -> None:
        svc = ConversationService()
        conv = svc.get_or_create("user-1", None)
        assert conv.user_id == "user-1"
        assert conv.conversation_id
        assert conv.messages == []

    def test_get_existing_conversation(self) -> None:
        svc = ConversationService()
        conv1 = svc.get_or_create("user-1", None)
        conv2 = svc.get_or_create("user-1", conv1.conversation_id)
        assert conv1.conversation_id == conv2.conversation_id

    def test_add_message(self) -> None:
        svc = ConversationService()
        conv = svc.get_or_create("user-1", None)
        msg = ChatMessage(role="user", content="Hello")
        svc.add_message(conv.conversation_id, msg)
        updated = svc.get(conv.conversation_id)
        assert updated is not None
        assert len(updated.messages) == 1
        assert updated.messages[0].content == "Hello"

    def test_delete_conversation(self) -> None:
        svc = ConversationService()
        conv = svc.get_or_create("user-1", None)
        svc.delete(conv.conversation_id)
        assert svc.get(conv.conversation_id) is None

    def test_wrong_user_cannot_access(self) -> None:
        svc = ConversationService()
        conv = svc.get_or_create("user-1", None)
        result = svc.get_or_create("user-2", conv.conversation_id)
        assert result.user_id == "user-2"
        assert result.conversation_id != conv.conversation_id
