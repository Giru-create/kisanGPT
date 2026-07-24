from __future__ import annotations

import json
from typing import TYPE_CHECKING

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat import chat_service

if TYPE_CHECKING:
    from app.core.security import CurrentUserDependency

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def send_message(
    current_user: CurrentUserDependency,
    request: ChatRequest,
) -> ChatResponse:
    return await chat_service.send(
        user_id=current_user.user_id,
        request=request,
    )


@router.post("/stream")
async def send_message_stream(
    current_user: CurrentUserDependency,
    request: ChatRequest,
) -> StreamingResponse:
    async def event_generator() -> None:  # type: ignore[no-untyped-def]
        try:
            async for chunk in chat_service.send_stream(
                user_id=current_user.user_id,
                request=request,
            ):
                data = json.dumps({"content": chunk})
                yield f"event: message\ndata: {data}\n\n"
            yield "event: done\ndata: {}\n\n"
        except Exception:
            error_data = json.dumps({"error": "Stream failed"})
            yield f"event: error\ndata: {error_data}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
