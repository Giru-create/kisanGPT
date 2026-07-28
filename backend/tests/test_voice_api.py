from __future__ import annotations

from io import BytesIO
from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.core.security import get_current_user
from app.main import app
from app.schemas.auth import CurrentUser


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def mock_user() -> CurrentUser:
    return CurrentUser(user_id="test-uid", phone="+919876543210", name="Test Farmer")


def _mock_auth(user: CurrentUser) -> Any:
    async def _get() -> CurrentUser:
        return user

    return _get


class TestVoiceHealthEndpoint:
    def test_health_returns_200(self, client: TestClient) -> None:
        response = client.get("/api/v1/voice/health")
        assert response.status_code == 200

    def test_health_returns_expected_fields(self, client: TestClient) -> None:
        response = client.get("/api/v1/voice/health")
        data = response.json()
        assert data["status"] == "healthy"
        assert data["stt_available"] is True
        assert data["tts_available"] is True
        assert "hi-IN" in data["supported_languages"]
        assert "pa-IN" in data["supported_languages"]
        assert "en-US" in data["supported_languages"]


class TestVoiceTranscribeEndpoint:
    def test_transcribe_returns_200(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            audio_content = b"fake-audio-data-for-transcription"
            files = {"file": ("audio.wav", BytesIO(audio_content), "audio/wav")}
            response = client.post("/api/v1/voice/stt", files=files)
            assert response.status_code == 200
        finally:
            app.dependency_overrides.clear()

    def test_transcribe_returns_text(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            audio_content = b"test-audio"
            files = {"file": ("audio.wav", BytesIO(audio_content), "audio/wav")}
            response = client.post("/api/v1/voice/stt", files=files)
            data = response.json()
            assert "text" in data
            assert "language" in data
            assert "confidence" in data
        finally:
            app.dependency_overrides.clear()

    def test_transcribe_with_language_param(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            audio_content = b"audio-data"
            files = {"file": ("audio.wav", BytesIO(audio_content), "audio/wav")}
            response = client.post(
                "/api/v1/voice/stt", files=files, params={"language": "en-US"}
            )
            assert response.status_code == 200
            assert response.json()["language"] == "en-US"
        finally:
            app.dependency_overrides.clear()

    def test_transcribe_requires_auth(self, client: TestClient) -> None:
        files = {"file": ("audio.wav", BytesIO(b"data"), "audio/wav")}
        response = client.post("/api/v1/voice/stt", files=files)
        assert response.status_code in (401, 422)


class TestVoiceTtsEndpoint:
    def test_tts_returns_200(self, client: TestClient, mock_user: CurrentUser) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/voice/tts",
                json={"text": "Hello farmer", "language": "en-US", "voice": "default"},
            )
            assert response.status_code == 200
        finally:
            app.dependency_overrides.clear()

    def test_tts_returns_audio(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/voice/tts",
                json={"text": "Test", "language": "hi-IN"},
            )
            data = response.json()
            assert "audio_base64" in data
            assert data["mime_type"] == "audio/mpeg"
            assert data["text"] == "Test"
        finally:
            app.dependency_overrides.clear()

    def test_tts_empty_text_returns_422(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/voice/tts",
                json={"text": ""},
            )
            assert response.status_code == 422
        finally:
            app.dependency_overrides.clear()

    def test_tts_requires_auth(self, client: TestClient) -> None:
        response = client.post("/api/v1/voice/tts", json={"text": "Hello"})
        assert response.status_code in (401, 422)


class TestVoiceCommandEndpoint:
    def test_command_returns_200(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/voice/command",
                json={"text": "weather update", "language": "en-US"},
            )
            assert response.status_code == 200
        finally:
            app.dependency_overrides.clear()

    def test_command_returns_intent(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/voice/command",
                json={"text": "disease on leaves", "language": "en-US"},
            )
            data = response.json()
            assert data["intent"] == "disease_detection"
            assert data["command"] == "disease on leaves"
        finally:
            app.dependency_overrides.clear()

    def test_command_general_query(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/voice/command",
                json={"text": "unknown command", "language": "en-US"},
            )
            data = response.json()
            assert data["intent"] == "general_query"
        finally:
            app.dependency_overrides.clear()

    def test_command_requires_auth(self, client: TestClient) -> None:
        response = client.post("/api/v1/voice/command", json={"text": "help"})
        assert response.status_code in (401, 422)


class TestVoiceChatEndpoint:
    def test_chat_returns_200(self, client: TestClient, mock_user: CurrentUser) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/voice/chat",
                json={"text": "help me", "language": "en-US"},
            )
            assert response.status_code == 200
        finally:
            app.dependency_overrides.clear()

    def test_chat_returns_audio_and_text(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/voice/chat",
                json={"text": "weather", "language": "hi-IN"},
            )
            data = response.json()
            assert "response_text" in data
            assert "audio_base64" in data
            assert "conversation_id" in data
            assert data["language"] == "hi-IN"
        finally:
            app.dependency_overrides.clear()

    def test_chat_preserves_conversation_id(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/voice/chat",
                json={"text": "help", "conversation_id": "conv-abc"},
            )
            data = response.json()
            assert data["conversation_id"] == "conv-abc"
        finally:
            app.dependency_overrides.clear()

    def test_chat_requires_auth(self, client: TestClient) -> None:
        response = client.post("/api/v1/voice/chat", json={"text": "hello"})
        assert response.status_code in (401, 422)


class TestVoiceSessionEndpoint:
    def test_create_session_returns_200(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post(
                "/api/v1/voice/session", params={"language": "hi-IN"}
            )
            assert response.status_code == 200
        finally:
            app.dependency_overrides.clear()

    def test_create_session_returns_session_id(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.post("/api/v1/voice/session")
            data = response.json()
            assert "session_id" in data
            assert data["is_active"] is True
        finally:
            app.dependency_overrides.clear()

    def test_end_session_returns_200(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            create_resp = client.post("/api/v1/voice/session")
            session_id = create_resp.json()["session_id"]
            response = client.delete(f"/api/v1/voice/session/{session_id}")
            assert response.status_code == 200
            assert response.json()["detail"] == "Session ended"
        finally:
            app.dependency_overrides.clear()

    def test_end_nonexistent_session(
        self, client: TestClient, mock_user: CurrentUser
    ) -> None:
        app.dependency_overrides[get_current_user] = _mock_auth(mock_user)
        try:
            response = client.delete("/api/v1/voice/session/nonexistent-id")
            assert response.status_code == 200
            assert response.json()["detail"] == "Session not found"
        finally:
            app.dependency_overrides.clear()


class TestVoiceEndpointsCount:
    @pytest.mark.parametrize(
        "method,path",
        [
            ("GET", "/api/v1/voice/health"),
            ("POST", "/api/v1/voice/stt"),
            ("POST", "/api/v1/voice/tts"),
            ("POST", "/api/v1/voice/command"),
            ("POST", "/api/v1/voice/chat"),
            ("POST", "/api/v1/voice/session"),
        ],
    )
    def test_voice_endpoint_exists(self, client: TestClient, method: str, path: str) -> None:
        response = client.request(method, path)
        assert response.status_code != 404, f"{method} {path} returned 404 (not found)"
