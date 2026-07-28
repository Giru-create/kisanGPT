"""Tests for the ContextBuilder."""

from __future__ import annotations

from app.agents.context_builder import ContextBuilder


class TestContextBuilderBuild:
    """Tests for ContextBuilder.build."""

    def test_build_merges_basic_fields(self) -> None:
        ctx = ContextBuilder.build(query="hello", tool_results=[])
        assert ctx["query"] == "hello"
        assert ctx["knowledge"] == []
        assert ctx["tool_results"] == []
        assert ctx["memory"] == {}

    def test_build_with_memory(self) -> None:
        mem = {"conversation_id": "abc", "messages": []}
        ctx = ContextBuilder.build(query="q", tool_results=[], memory=mem)
        # Legacy format is normalised into the new structure
        assert ctx["memory"]["history"] == []
        assert ctx["memory"]["farmer_profile"] is None
        assert ctx["memory"]["preferences"] == {}
        assert ctx["memory"]["facts"] == []
        assert ctx["memory"]["conversation_id"] == "abc"

    def test_build_extracts_knowledge_from_tool_results(self) -> None:
        tool_results = [
            {
                "tool": "knowledge",
                "success": True,
                "data": {
                    "documents": [{"id": "1", "content": "doc1", "source": "obs"}],
                    "count": 1,
                },
            },
            {
                "tool": "weather",
                "success": True,
                "data": {"temp": 30},
            },
        ]
        ctx = ContextBuilder.build(query="q", tool_results=tool_results)
        assert len(ctx["knowledge"]) == 1
        assert ctx["knowledge"][0]["content"] == "doc1"

    def test_build_knowledge_empty_when_no_knowledge_tool(self) -> None:
        tool_results = [
            {"tool": "weather", "success": True, "data": {"temp": 30}},
        ]
        ctx = ContextBuilder.build(query="q", tool_results=tool_results)
        assert ctx["knowledge"] == []

    def test_build_knowledge_empty_when_knowledge_fails(self) -> None:
        tool_results = [
            {
                "tool": "knowledge",
                "success": False,
                "data": {"error": "fail"},
            },
        ]
        ctx = ContextBuilder.build(query="q", tool_results=tool_results)
        assert ctx["knowledge"] == []


class TestExtractKnowledge:
    """Tests for ContextBuilder._extract_knowledge."""

    def test_extracts_from_knowledge_tool(self) -> None:
        results = [
            {
                "tool": "knowledge",
                "success": True,
                "data": {"documents": [{"id": "a", "content": "x", "source": "s"}]},
            }
        ]
        docs = ContextBuilder._extract_knowledge(results)
        assert len(docs) == 1

    def test_ignores_non_knowledge_tools(self) -> None:
        results = [
            {"tool": "weather", "success": True, "data": {}},
            {"tool": "market", "success": True, "data": {}},
        ]
        docs = ContextBuilder._extract_knowledge(results)
        assert docs == []

    def test_ignores_failed_knowledge_tool(self) -> None:
        results = [
            {
                "tool": "knowledge",
                "success": False,
                "data": {"error": "x"},
            }
        ]
        docs = ContextBuilder._extract_knowledge(results)
        assert docs == []

    def test_empty_results(self) -> None:
        assert ContextBuilder._extract_knowledge([]) == []

    def test_knowledge_data_not_dict(self) -> None:
        results = [{"tool": "knowledge", "success": True, "data": "string"}]
        docs = ContextBuilder._extract_knowledge(results)
        assert docs == []
