from __future__ import annotations

from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.auth import CurrentUser
from app.services.conversation import ConversationService


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def mock_user() -> CurrentUser:
    return CurrentUser(
        user_id="test-uid-123", phone="+919876543210", name="Test Farmer"
    )


@pytest.fixture
def mock_auth_dependency(mock_user: CurrentUser) -> Any:
    async def _get_current_user() -> CurrentUser:
        return mock_user

    return _get_current_user


@pytest.fixture
def conversation_service() -> ConversationService:
    return ConversationService()
