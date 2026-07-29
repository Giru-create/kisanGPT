"""Document loaders for PDF, Markdown, TXT, and JSON files."""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class LoadedDocument:
    """A raw document loaded from disk."""

    content: str
    source: str
    file_type: str
    metadata: dict[str, object] = field(default_factory=dict)

    @property
    def doc_id(self) -> str:
        """Deterministic ID based on source path."""
        return hashlib.sha256(self.source.encode()).hexdigest()[:16]


class DocumentLoader:
    """Load documents from files or directories.

    Supported formats: .md, .txt, .json, .pdf (text extraction only).
    """

    SUPPORTED_EXTENSIONS = {".md", ".txt", ".json", ".pdf"}

    def load_file(self, path: str | Path) -> LoadedDocument | None:
        """Load a single file and return a LoadedDocument."""
        p = Path(path)
        if not p.exists():
            return None
        if p.suffix.lower() not in self.SUPPORTED_EXTENSIONS:
            return None

        ext = p.suffix.lower()
        if ext == ".pdf":
            return self._load_pdf(p)
        if ext == ".json":
            return self._load_json(p)
        return self._load_text(p)

    def load_directory(
        self, directory: str | Path, recursive: bool = True
    ) -> list[LoadedDocument]:
        """Load all supported files from a directory."""
        root = Path(directory)
        if not root.exists():
            return []

        pattern = "**/*" if recursive else "*"
        docs: list[LoadedDocument] = []
        for p in sorted(root.glob(pattern)):
            if p.is_file() and p.suffix.lower() in self.SUPPORTED_EXTENSIONS:
                doc = self.load_file(p)
                if doc is not None:
                    docs.append(doc)
        return docs

    def _load_text(self, path: Path) -> LoadedDocument:
        content = path.read_text(encoding="utf-8", errors="replace")
        return LoadedDocument(
            content=content,
            source=str(path),
            file_type=path.suffix.lower().lstrip("."),
        )

    def _load_json(self, path: Path) -> LoadedDocument | None:
        raw = path.read_text(encoding="utf-8", errors="replace")
        try:
            data = json.loads(raw)
        except (json.JSONDecodeError, ValueError):
            return None

        if isinstance(data, dict):
            content = data.get("content", data.get("text", json.dumps(data)))
            meta = {k: v for k, v in data.items() if k not in ("content", "text")}
        elif isinstance(data, list):
            content = json.dumps(data, ensure_ascii=False)
            meta = {}
        else:
            return None

        return LoadedDocument(
            content=str(content),
            source=str(path),
            file_type="json",
            metadata=meta,
        )

    def _load_pdf(self, path: Path) -> LoadedDocument | None:
        try:
            import subprocess

            result = subprocess.run(
                ["pdftotext", "-layout", str(path), "-"],
                capture_output=True,
                text=True,
                timeout=30,
            )
            if result.returncode == 0 and result.stdout.strip():
                return LoadedDocument(
                    content=result.stdout,
                    source=str(path),
                    file_type="pdf",
                )
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
        return None
