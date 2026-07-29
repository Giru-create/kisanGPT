"""Semantic chunking with configurable size, overlap, and heading preservation."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class TextChunk:
    """A chunk of text with metadata."""

    content: str
    chunk_index: int
    heading: str = ""
    start_char: int = 0
    end_char: int = 0
    metadata: dict[str, object] = field(default_factory=dict)


class SemanticChunker:
    """Split text into semantic chunks.

    Features:
    - Configurable chunk size and overlap
    - Heading preservation (each chunk carries its parent heading)
    - Paragraph boundary awareness
    - Table preservation when possible
    """

    def __init__(
        self,
        chunk_size: int = 500,
        chunk_overlap: int = 100,
    ) -> None:
        self._chunk_size = chunk_size
        self._chunk_overlap = chunk_overlap

    def chunk(
        self, text: str, metadata: dict[str, object] | None = None
    ) -> list[TextChunk]:
        """Split text into semantic chunks."""
        if not text.strip():
            return []

        paragraphs = self._split_paragraphs(text)
        chunks: list[TextChunk] = []
        current_heading = ""
        buffer = ""
        buffer_start = 0
        char_pos = 0

        for para in paragraphs:
            if self._is_heading(para):
                if buffer.strip():
                    chunks.extend(
                        self._flush_buffer(
                            buffer, buffer_start, current_heading, len(chunks), metadata
                        )
                    )
                    buffer = ""
                current_heading = para.strip("# *")
                buffer_start = char_pos
                char_pos += len(para) + 1
                continue

            if len(buffer) + len(para) + 1 > self._chunk_size and buffer.strip():
                chunks.extend(
                    self._flush_buffer(
                        buffer, buffer_start, current_heading, len(chunks), metadata
                    )
                )
                overlap_text = self._get_overlap_text(buffer)
                buffer = overlap_text
                buffer_start = char_pos - len(overlap_text)

            if buffer:
                buffer += "\n\n" + para
            else:
                buffer = para
                buffer_start = char_pos

            char_pos += len(para) + 1

        if buffer.strip():
            chunks.extend(
                self._flush_buffer(
                    buffer, buffer_start, current_heading, len(chunks), metadata
                )
            )

        return chunks

    def _split_paragraphs(self, text: str) -> list[str]:
        lines = text.split("\n")
        paragraphs: list[str] = []
        current: list[str] = []

        for line in lines:
            if line.strip() == "":
                if current:
                    paragraphs.append("\n".join(current))
                    current = []
            else:
                current.append(line)

        if current:
            paragraphs.append("\n".join(current))

        return paragraphs

    def _is_heading(self, text: str) -> bool:
        stripped = text.strip()
        if not stripped:
            return False
        return stripped.startswith("#") or (
            stripped.endswith(":") and len(stripped) < 80
        )

    def _get_overlap_text(self, text: str) -> str:
        if self._chunk_overlap <= 0:
            return ""
        words = text.split()
        overlap_words = words[-self._chunk_overlap // 5 :]
        return " ".join(overlap_words)

    def _flush_buffer(
        self,
        text: str,
        start: int,
        heading: str,
        index: int,
        metadata: dict[str, object] | None,
    ) -> list[TextChunk]:
        cleaned = text.strip()
        if not cleaned:
            return []

        chunk_meta = dict(metadata) if metadata else {}
        chunk = TextChunk(
            content=cleaned,
            chunk_index=index,
            heading=heading,
            start_char=start,
            end_char=start + len(cleaned),
            metadata=chunk_meta,
        )
        return [chunk]
