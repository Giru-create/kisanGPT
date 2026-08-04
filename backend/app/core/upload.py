"""Secure file upload utilities.

Validates Content-Length before reading into memory to prevent
memory exhaustion attacks via oversized uploads.
"""

from __future__ import annotations

from fastapi import HTTPException, UploadFile


def _max_upload_bytes() -> int:
    from app.core.config import settings

    return settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


async def secure_read_upload(
    file: UploadFile,
    *,
    max_bytes: int | None = None,
) -> bytes:
    """Read an UploadFile with size validation before loading into memory.

    Raises HTTPException (413) if the file exceeds the size limit.
    """
    limit = max_bytes if max_bytes is not None else _max_upload_bytes()
    max_mb = limit // (1024 * 1024)

    content_length = file.size
    if content_length is not None and content_length > limit:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {max_mb}MB.",
        )

    chunks: list[bytes] = []
    total = 0
    while True:
        chunk = await file.read(64 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > limit:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {max_mb}MB.",
            )
        chunks.append(chunk)

    return b"".join(chunks)
