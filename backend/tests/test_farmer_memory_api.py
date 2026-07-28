"""Tests for the farmer memory API endpoints."""

from __future__ import annotations

from typing import Any

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


class TestFarmerProfileEndpoints:
    """Tests for farmer profile CRUD."""

    def test_create_profile_returns_200(self, client: TestClient) -> None:
        app.dependency_overrides[get_current_user] = _auth_override
        try:
            response = client.post(
                "/api/v1/farmer-memory/profile",
                json={
                    "name": "Ramesh",
                    "location": "Agra",
                    "preferred_language": "hi",
                    "crops": ["wheat", "potato"],
                    "soil_type": "loamy",
                },
            )
            assert response.status_code == 200
            data = response.json()
            assert data["profile"]["name"] == "Ramesh"
            assert data["profile"]["location"] == "Agra"
            assert data["profile"]["preferred_language"] == "hi"
            assert data["profile"]["crops"] == ["wheat", "potato"]
        finally:
            app.dependency_overrides.clear()

    def test_get_profile_returns_200(self, client: TestClient) -> None:
        app.dependency_overrides[get_current_user] = _auth_override
        try:
            # Create first
            client.post(
                "/api/v1/farmer-memory/profile",
                json={"name": "Ramesh"},
            )
            # Then get
            response = client.get("/api/v1/farmer-memory/profile")
            assert response.status_code == 200
            data = response.json()
            assert data["profile"]["name"] == "Ramesh"
        finally:
            app.dependency_overrides.clear()

    def test_get_profile_not_found(self, client: TestClient) -> None:
        def _unknown_user() -> Any:
            return type(
                "User",
                (),
                {
                    "user_id": "never-registered-user",
                    "phone": "+910000000000",
                    "name": "Ghost",
                },
            )()

        app.dependency_overrides[get_current_user] = _unknown_user
        try:
            response = client.get("/api/v1/farmer-memory/profile")
            assert response.status_code == 404
        finally:
            app.dependency_overrides.clear()

    def test_requires_auth(self, client: TestClient) -> None:
        response = client.get("/api/v1/farmer-memory/profile")
        assert response.status_code in [401, 403]


class TestMemoryItemEndpoints:
    """Tests for memory item CRUD."""

    def test_save_memory_item_returns_200(self, client: TestClient) -> None:
        app.dependency_overrides[get_current_user] = _auth_override
        try:
            response = client.post(
                "/api/v1/farmer-memory/save",
                json={
                    "category": "crop",
                    "key": "grows_wheat",
                    "value": "wheat",
                },
            )
            assert response.status_code == 200
            data = response.json()
            assert data["memory_item"]["key"] == "grows_wheat"
            assert data["memory_item"]["value"] == "wheat"
        finally:
            app.dependency_overrides.clear()

    def test_delete_memory_item_returns_200(self, client: TestClient) -> None:
        app.dependency_overrides[get_current_user] = _auth_override
        try:
            # Create first
            create_resp = client.post(
                "/api/v1/farmer-memory/save",
                json={
                    "category": "crop",
                    "key": "grows_rice",
                    "value": "rice",
                },
            )
            memory_id = create_resp.json()["memory_item"]["memory_id"]
            # Delete
            response = client.delete(f"/api/v1/farmer-memory/{memory_id}")
            assert response.status_code == 200
        finally:
            app.dependency_overrides.clear()

    def test_delete_nonexistent_returns_404(self, client: TestClient) -> None:
        app.dependency_overrides[get_current_user] = _auth_override
        try:
            response = client.delete("/api/v1/farmer-memory/nonexistent")
            assert response.status_code == 404
        finally:
            app.dependency_overrides.clear()


class TestMemoryContextEndpoint:
    """Tests for memory context retrieval."""

    def test_get_context_returns_200(self, client: TestClient) -> None:
        app.dependency_overrides[get_current_user] = _auth_override
        try:
            response = client.get("/api/v1/farmer-memory/context")
            assert response.status_code == 200
            data = response.json()
            assert "context" in data
            assert "user_id" in data
            assert data["user_id"] == "test-uid-123"
        finally:
            app.dependency_overrides.clear()
