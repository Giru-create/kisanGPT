from __future__ import annotations

import json
from typing import Annotated

import firebase_admin
from fastapi import Depends, Header
from firebase_admin import auth

from app.core.config import settings
from app.core.exceptions import UnauthorizedError
from app.core.logging import logger
from app.schemas.auth import CurrentUser

_firebase_initialized = False


def _init_firebase() -> None:
    global _firebase_initialized  # noqa: PLW0603
    if _firebase_initialized:
        return

    if not settings.FIREBASE_SERVICE_ACCOUNT_KEY:
        logger.warning("FIREBASE_SERVICE_ACCOUNT_KEY not set — auth will fail")
        _firebase_initialized = True
        return

    try:
        service_account_info = json.loads(settings.FIREBASE_SERVICE_ACCOUNT_KEY)
        firebase_admin.initialize_app(
            firebase_admin.credentials.Certificate(service_account_info)
        )
        _firebase_initialized = True
        logger.info("Firebase Admin SDK initialized")
    except Exception:
        logger.exception("Failed to initialize Firebase Admin SDK")
        _firebase_initialized = True


def _extract_token(authorization: str | None) -> str:
    if not authorization:
        raise UnauthorizedError("Missing Authorization header")

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise UnauthorizedError("Invalid Authorization header format")

    return parts[1]


async def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
) -> CurrentUser:
    _init_firebase()

    token = _extract_token(authorization)

    try:
        decoded_token = auth.verify_id_token(token)
    except auth.ExpiredIdTokenError as err:
        raise UnauthorizedError("Token has expired") from err
    except auth.InvalidIdTokenError as err:
        raise UnauthorizedError("Invalid token") from err
    except Exception as err:
        logger.exception("Token verification failed")
        raise UnauthorizedError("Could not verify token") from err

    uid = decoded_token.get("uid", "")
    phone = decoded_token.get("phone_number", "")
    name = decoded_token.get("name", "")

    return CurrentUser(user_id=uid, phone=phone, name=name)


CurrentUserDependency = Annotated[CurrentUser, Depends(get_current_user)]
