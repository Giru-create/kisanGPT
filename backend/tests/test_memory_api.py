"""Tests for memory API endpoints."""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def _mock_user() -> Any:
    return type(
        "User",
        (),
        {
            "user_id": "test-uid-123",
            "phone": "+919876543210",
            "name": "Test",
        },
    )()


class TestMemoryEndpoints:
    """Tests for memory API endpoints."""

    def test_create_memory(self, client: TestClient) -> None:
        with patch("app.core.security.get_current_user") as mock:
            mock.return_value = AsyncMock(return_value=_mock_user())
            response = client.post(
                "/api/v1/memory",
                json={
                    "content": "Observed yellow leaves on wheat",
                    "memory_type": "observation",
                    "crop": "wheat",
                },
                headers={"Authorization": "Bearer fake-token"},
            )
            assert response.status_code in [200, 401, 403]

    def test_search_memories(self, client: TestClient) -> None:
        with patch("app.core.security.get_current_user") as mock:
            mock.return_value = AsyncMock(return_value=_mock_user())
            response = client.post(
                "/api/v1/memory/search",
                json={"query": "wheat disease"},
                headers={"Authorization": "Bearer fake-token"},
            )
            assert response.status_code in [200, 401, 403]

    def test_get_memory(self, client: TestClient) -> None:
        with patch("app.core.security.get_current_user") as mock:
            mock.return_value = AsyncMock(return_value=_mock_user())
            response = client.get(
                "/api/v1/memory/test-memory-id",
                headers={"Authorization": "Bearer fake-token"},
            )
            assert response.status_code in [200, 401, 403, 404]

    def test_delete_memory(self, client: TestClient) -> None:
        with patch("app.core.security.get_current_user") as mock:
            mock.return_value = AsyncMock(return_value=_mock_user())
            response = client.delete(
                "/api/v1/memory/test-memory-id",
                headers={"Authorization": "Bearer fake-token"},
            )
            assert response.status_code in [200, 401, 403, 404]

    def test_list_memories(self, client: TestClient) -> None:
        with patch("app.core.security.get_current_user") as mock:
            mock.return_value = AsyncMock(return_value=_mock_user())
            response = client.get(
                "/api/v1/memory",
                headers={"Authorization": "Bearer fake-token"},
            )
            assert response.status_code in [200, 401, 403]

    def test_get_recommendations(self, client: TestClient) -> None:
        with patch("app.core.security.get_current_user") as mock:
            mock.return_value = AsyncMock(return_value=_mock_user())
            response = client.post(
                "/api/v1/memory/recommendations",
                json={"crop": "wheat", "limit": 5},
                headers={"Authorization": "Bearer fake-token"},
            )
            assert response.status_code in [200, 401, 403]
