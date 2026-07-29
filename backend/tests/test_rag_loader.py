"""Tests for RAG document loader."""

from __future__ import annotations

import json
from typing import TYPE_CHECKING

from app.rag.loader import DocumentLoader, LoadedDocument

if TYPE_CHECKING:
    from pathlib import Path


class TestLoadedDocument:
    """Tests for LoadedDocument."""

    def test_doc_id_deterministic(self):
        d1 = LoadedDocument(content="hello", source="/a/b.md", file_type="md")
        d2 = LoadedDocument(content="hello", source="/a/b.md", file_type="md")
        assert d1.doc_id == d2.doc_id

    def test_doc_id_differs_by_source(self):
        d1 = LoadedDocument(content="hello", source="/a/b.md", file_type="md")
        d2 = LoadedDocument(content="hello", source="/a/c.md", file_type="md")
        assert d1.doc_id != d2.doc_id


class TestDocumentLoader:
    """Tests for DocumentLoader."""

    def test_load_txt(self, tmp_path: Path):
        f = tmp_path / "test.txt"
        f.write_text("Hello world")
        loader = DocumentLoader()
        doc = loader.load_file(f)
        assert doc is not None
        assert doc.content == "Hello world"
        assert doc.file_type == "txt"

    def test_load_md(self, tmp_path: Path):
        f = tmp_path / "guide.md"
        f.write_text("# Title\nSome content")
        loader = DocumentLoader()
        doc = loader.load_file(f)
        assert doc is not None
        assert "# Title" in doc.content
        assert doc.file_type == "md"

    def test_load_json(self, tmp_path: Path):
        f = tmp_path / "data.json"
        data = {"content": "Test content", "category": "crop"}
        f.write_text(json.dumps(data))
        loader = DocumentLoader()
        doc = loader.load_file(f)
        assert doc is not None
        assert doc.content == "Test content"
        assert doc.metadata["category"] == "crop"

    def test_load_json_list(self, tmp_path: Path):
        f = tmp_path / "list.json"
        f.write_text(json.dumps([{"a": 1}, {"b": 2}]))
        loader = DocumentLoader()
        doc = loader.load_file(f)
        assert doc is not None
        assert doc.file_type == "json"

    def test_load_nonexistent(self, tmp_path: Path):
        loader = DocumentLoader()
        doc = loader.load_file(tmp_path / "nope.txt")
        assert doc is None

    def test_load_unsupported_extension(self, tmp_path: Path):
        f = tmp_path / "image.png"
        f.write_bytes(b"\x89PNG")
        loader = DocumentLoader()
        doc = loader.load_file(f)
        assert doc is None

    def test_load_directory(self, tmp_path: Path):
        (tmp_path / "a.txt").write_text("aaa")
        (tmp_path / "b.md").write_text("# bbb")
        (tmp_path / "c.png").write_bytes(b"png")
        loader = DocumentLoader()
        docs = loader.load_directory(tmp_path)
        assert len(docs) == 2
        types = {d.file_type for d in docs}
        assert types == {"txt", "md"}

    def test_load_directory_recursive(self, tmp_path: Path):
        sub = tmp_path / "sub"
        sub.mkdir()
        (tmp_path / "a.txt").write_text("root")
        (sub / "b.txt").write_text("child")
        loader = DocumentLoader()
        docs = loader.load_directory(tmp_path, recursive=True)
        assert len(docs) == 2

    def test_load_directory_nonexistent(self, tmp_path: Path):
        loader = DocumentLoader()
        docs = loader.load_directory(tmp_path / "nope")
        assert docs == []
