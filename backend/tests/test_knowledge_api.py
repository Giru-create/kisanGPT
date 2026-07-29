"""Tests for the knowledge API endpoint."""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.core.security import get_current_user
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


def _auth_override() -> Any:
    return _mock_user()


class TestKnowledgeSearchEndpoint:
    """Tests for POST /api/v1/knowledge/search."""

    def test_search_returns_200(self, client: TestClient) -> None:
        app.dependency_overrides[get_current_user] = _auth_override
        try:
            instance = AsyncMock()
            instance.retrieve.return_value = []
            with patch(
                "app.rag.retriever.KnowledgeRetriever",
                return_value=instance,
            ):
                response = client.post(
                    "/api/v1/knowledge/search",
                    json={"query": "wheat fertilizer", "k": 3},
                )
                assert response.status_code == 200
                data = response.json()
                assert "documents" in data
                assert "count" in data
                assert "query" in data
                assert data["query"] == "wheat fertilizer"
        finally:
            app.dependency_overrides.clear()

    def test_search_requires_auth(self, client: TestClient) -> None:
        response = client.post(
            "/api/v1/knowledge/search",
            json={"query": "test"},
        )
        assert response.status_code in [401, 403]

    def test_search_422_on_empty_query(self, client: TestClient) -> None:
        app.dependency_overrides[get_current_user] = _auth_override
        try:
            response = client.post(
                "/api/v1/knowledge/search",
                json={"query": ""},
            )
            assert response.status_code == 422
        finally:
            app.dependency_overrides.clear()

    def test_search_422_on_missing_query(self, client: TestClient) -> None:
        app.dependency_overrides[get_current_user] = _auth_override
        try:
            response = client.post(
                "/api/v1/knowledge/search",
                json={},
            )
            assert response.status_code == 422
        finally:
            app.dependency_overrides.clear()

    def test_search_default_k(self, client: TestClient) -> None:
        app.dependency_overrides[get_current_user] = _auth_override
        try:
            instance = AsyncMock()
            instance.retrieve.return_value = []
            with patch(
                "app.rag.retriever.KnowledgeRetriever",
                return_value=instance,
            ):
                response = client.post(
                    "/api/v1/knowledge/search",
                    json={"query": "rice"},
                )
                assert response.status_code == 200
                data = response.json()
                assert isinstance(data["documents"], list)
        finally:
            app.dependency_overrides.clear()
