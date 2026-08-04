from __future__ import annotations

import json
import time
from typing import Annotated

import firebase_admin
from fastapi import Depends, Header
from firebase_admin import auth

from app.core.config import settings
from app.core.exceptions import UnauthorizedError
from app.core.logging import logger
from app.schemas.auth import CurrentUser

_firebase_init_success = False
_firebase_init_attempted = False
_firebase_last_attempt: float = 0.0
_RETRY_COOLDOWN_SECONDS = 60.0


def _init_firebase() -> None:
    global _firebase_init_success  # noqa: PLW0603
    global _firebase_init_attempted  # noqa: PLW0603
    global _firebase_last_attempt  # noqa: PLW0603

    if _firebase_init_success:
        return

    now = time.monotonic()
    elapsed = now - _firebase_last_attempt
    if _firebase_init_attempted and elapsed < _RETRY_COOLDOWN_SECONDS:
        return

    _firebase_init_attempted = True
    _firebase_last_attempt = now

    if not settings.FIREBASE_SERVICE_ACCOUNT_KEY:
        logger.warning(
            "FIREBASE_SERVICE_ACCOUNT_KEY not set — "
            "all authentication requests will be rejected"
        )
        return

    try:
        service_account_info = json.loads(settings.FIREBASE_SERVICE_ACCOUNT_KEY)
        firebase_admin.initialize_app(
            firebase_admin.credentials.Certificate(service_account_info)
        )
        _firebase_init_success = True
        logger.info("Firebase Admin SDK initialized successfully")
    except json.JSONDecodeError:
        logger.critical(
            "FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON — "
            "Firebase Admin SDK NOT initialized"
        )
    except Exception:
        logger.critical(
            "Firebase Admin SDK initialization failed — "
            "all authentication requests will be rejected",
            exc_info=True,
        )


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

    if not _firebase_init_success:
        raise UnauthorizedError(
            "Authentication service is not configured"
        )

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
