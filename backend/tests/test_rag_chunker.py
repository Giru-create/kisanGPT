"""Tests for RAG semantic chunker."""

from __future__ import annotations

from app.rag.chunker import SemanticChunker, TextChunk


class TestSemanticChunker:
    """Tests for semantic text chunking."""

    def test_empty_text(self):
        chunker = SemanticChunker(chunk_size=100)
        assert chunker.chunk("") == []

    def test_single_paragraph(self):
        chunker = SemanticChunker(chunk_size=500)
        chunks = chunker.chunk("Hello world")
        assert len(chunks) == 1
        assert chunks[0].content == "Hello world"
        assert chunks[0].chunk_index == 0

    def test_multiple_paragraphs_fit(self):
        chunker = SemanticChunker(chunk_size=500)
        text = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph."
        chunks = chunker.chunk(text)
        assert len(chunks) >= 1

    def test_heading_preserved(self):
        chunker = SemanticChunker(chunk_size=500)
        text = "# My Heading\n\nSome content under the heading."
        chunks = chunker.chunk(text)
        assert any(c.heading == "My Heading" for c in chunks)

    def test_chunk_size_respected(self):
        chunker = SemanticChunker(chunk_size=100, chunk_overlap=20)
        paragraphs = ["Word " * 20 for _ in range(10)]
        text = "\n\n".join(paragraphs)
        chunks = chunker.chunk(text)
        for c in chunks:
            assert len(c.content) <= 150  # some tolerance

    def test_overlap_exists(self):
        chunker = SemanticChunker(chunk_size=50, chunk_overlap=20)
        paragraphs = ["Sentence one about rice farming. " * 3 for _ in range(5)]
        text = "\n\n".join(paragraphs)
        chunks = chunker.chunk(text)
        assert len(chunks) > 1

    def test_metadata_propagated(self):
        chunker = SemanticChunker(chunk_size=500)
        meta = {"source": "test.md", "category": "crop"}
        chunks = chunker.chunk("Hello", metadata=meta)
        assert chunks[0].metadata["source"] == "test.md"

    def test_bullet_items_chunked(self):
        chunker = SemanticChunker(chunk_size=100, chunk_overlap=20)
        text = "\n\n".join([f"- Item {i}: some description" for i in range(20)])
        chunks = chunker.chunk(text)
        assert len(chunks) > 1

    def test_text_chunk_fields(self):
        chunker = SemanticChunker(chunk_size=500)
        chunks = chunker.chunk("Test content here")
        assert isinstance(chunks[0], TextChunk)
        assert chunks[0].start_char >= 0
        assert chunks[0].end_char > chunks[0].start_char
