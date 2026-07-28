from __future__ import annotations

from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.core.security import get_current_user
from app.main import app
from app.schemas.auth import CurrentUser
from app.tools.base import BaseTool


class StubWeatherTool(BaseTool):
    name = "weather"
    description = "Stub weather."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        return self._success({"temperature": 28})


class StubMarketTool(BaseTool):
    name = "market"
    description = "Stub market."

    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        return self._success({"wheat": 2200})


def _mock_auth(user: CurrentUser) -> Any:
    async def _get() -> CurrentUser:
        return user

    return _get


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def mock_user() -> CurrentUser:
    return CurrentUser(user_id="test-uid", phone="+919876543210", name="Test Farmer")


class TestAgentChatEndpoint:
    def test_returns_200(self, client: TestClient, mock_user: CurrentUser) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/agent/chat",
                json={"message": "What is the weather?"},
            )
            assert response.status_code == 200
        finally:
            app.dependency_overrides.clear()

    def test_response_structure(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/agent/chat",
                json={"message": "What is the wheat price?"},
            )
            data = response.json()
            assert "message" in data
            assert "planned_tools" in data
            assert "tool_results" in data
            assert isinstance(data["planned_tools"], list)
            assert isinstance(data["tool_results"], list)
        finally:
            app.dependency_overrides.clear()

    def test_weather_query_selects_weather_tool(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/agent/chat",
                json={"message": "Will it rain today?"},
            )
            data = response.json()
            assert "weather" in data["planned_tools"]
        finally:
            app.dependency_overrides.clear()

    def test_empty_message_returns_422(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post("/api/v1/agent/chat", json={"message": ""})
            assert response.status_code == 422
        finally:
            app.dependency_overrides.clear()

    def test_requires_auth(self, client: TestClient) -> None:
        response = client.post(
            "/api/v1/agent/chat",
            json={"message": "Hello"},
        )
        assert response.status_code in (401, 422)

    def test_context_fields_forwarded(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/agent/chat",
                json={
                    "message": "Weather in Delhi?",
                    "city": "Delhi",
                    "lat": 28.61,
                    "lon": 77.21,
                },
            )
            assert response.status_code == 200
            data = response.json()
            assert "weather" in data["planned_tools"]
        finally:
            app.dependency_overrides.clear()
