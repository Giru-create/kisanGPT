from __future__ import annotations

from fastapi import APIRouter, UploadFile

from app.core.security import (  # noqa: TC001 — needed at runtime by FastAPI
    CurrentUserDependency,
)
from app.core.upload import secure_read_upload
from app.schemas.voice import (
    TextToSpeechRequest,  # noqa: TC001 — needed at runtime by FastAPI
    VoiceChatRequest,  # noqa: TC001 — needed at runtime by FastAPI
)
from app.services.voice import voice_service

router = APIRouter()


@router.post("/stt")
async def speech_to_text(
    current_user: CurrentUserDependency,
    file: UploadFile,
    language: str = "hi-IN",
) -> dict[str, object]:
    audio_bytes = await secure_read_upload(file)
    result = await voice_service.transcribe(audio_bytes, language)
    return result.model_dump(mode="json")


@router.post("/tts")
async def text_to_speech(
    current_user: CurrentUserDependency,
    body: TextToSpeechRequest,
) -> dict[str, object]:
    result = await voice_service.synthesize(
        text=body.text,
        language=body.language,
        voice=body.voice,
    )
    return result.model_dump(mode="json")


@router.post("/command")
async def process_voice_command(
    current_user: CurrentUserDependency,
    body: VoiceChatRequest,
) -> dict[str, object]:
    result = await voice_service.process_command(
        text=body.text,
        language=body.language,
    )
    return result.model_dump(mode="json")


@router.post("/chat")
async def voice_chat(
    current_user: CurrentUserDependency,
    body: VoiceChatRequest,
) -> dict[str, object]:
    result = await voice_service.voice_chat(
        text=body.text,
        language=body.language,
        conversation_id=body.conversation_id,
    )
    return result.model_dump(mode="json")


@router.post("/session")
async def create_voice_session(
    current_user: CurrentUserDependency,
    language: str = "hi-IN",
) -> dict[str, object]:
    return voice_service.create_session(language)


@router.delete("/session/{session_id}")
async def end_voice_session(
    current_user: CurrentUserDependency,
    session_id: str,
) -> dict[str, str]:
    ended = voice_service.end_session(session_id)
    if not ended:
        return {"detail": "Session not found"}
    return {"detail": "Session ended"}


@router.get("/health")
async def voice_health() -> dict[str, object]:
    return {
        "status": "healthy",
        "stt_available": True,
        "tts_available": True,
        "supported_languages": ["hi-IN", "pa-IN", "en-US"],
    }
