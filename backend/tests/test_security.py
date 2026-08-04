from unittest.mock import MagicMock, patch

import pytest

from app.core.exceptions import UnauthorizedError
from app.core.security import _extract_token, get_current_user


def test_extract_token_valid() -> None:
    token = _extract_token("Bearer abc123")
    assert token == "abc123"


def test_extract_token_missing() -> None:
    with pytest.raises(UnauthorizedError, match="Missing Authorization header"):
        _extract_token(None)


def test_extract_token_invalid_format() -> None:
    with pytest.raises(UnauthorizedError, match="Invalid Authorization header format"):
        _extract_token("Token abc123")


def test_extract_token_bearer_only() -> None:
    with pytest.raises(UnauthorizedError, match="Invalid Authorization header format"):
        _extract_token("Bearer")


@pytest.mark.asyncio
async def test_get_current_user_missing_header() -> None:
    with patch("app.core.security._firebase_init_success", True):
        with pytest.raises(UnauthorizedError, match="Missing Authorization header"):
            await get_current_user(authorization=None)


@pytest.mark.asyncio
@patch("app.core.security.auth.verify_id_token")
async def test_get_current_user_valid_token(mock_verify: MagicMock) -> None:
    mock_verify.return_value = {
        "uid": "user-123",
        "phone_number": "+919876543210",
        "name": "Ravi Kumar",
    }
    with patch("app.core.security._firebase_init_success", True):
        user = await get_current_user(authorization="Bearer valid-token")
    assert user.user_id == "user-123"
    assert user.phone == "+919876543210"
    assert user.name == "Ravi Kumar"


@pytest.mark.asyncio
@patch("app.core.security.auth.verify_id_token")
async def test_get_current_user_expired_token(mock_verify: MagicMock) -> None:
    from firebase_admin.auth import ExpiredIdTokenError

    mock_verify.side_effect = ExpiredIdTokenError("Token expired", "expired")
    with patch("app.core.security._firebase_init_success", True):
        with pytest.raises(UnauthorizedError, match="Token has expired"):
            await get_current_user(authorization="Bearer expired-token")


@pytest.mark.asyncio
@patch("app.core.security.auth.verify_id_token")
async def test_get_current_user_invalid_token(mock_verify: MagicMock) -> None:
    from firebase_admin.auth import InvalidIdTokenError

    mock_verify.side_effect = InvalidIdTokenError("Invalid token")
    with patch("app.core.security._firebase_init_success", True):
        with pytest.raises(UnauthorizedError, match="Invalid token"):
            await get_current_user(authorization="Bearer bad-token")
