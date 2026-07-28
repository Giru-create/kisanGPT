from app.agents.registry import ToolRegistry
from app.tools.base import BaseTool


class DummyTool(BaseTool):
    name = "dummy"
    description = "A dummy tool for testing."

    async def run(self, query: str, context: dict) -> dict:  # type: ignore[override]
        return self._success({"echo": query})


class TestToolRegistry:
    def test_register_and_get(self) -> None:
        registry = ToolRegistry()
        tool = DummyTool()
        registry.register(tool)
        assert registry.get("dummy") is tool

    def test_get_missing_returns_none(self) -> None:
        registry = ToolRegistry()
        assert registry.get("nonexistent") is None

    def test_list_tools(self) -> None:
        registry = ToolRegistry()
        registry.register(DummyTool())
        tools = registry.list_tools()
        assert len(tools) == 1
        assert tools[0]["name"] == "dummy"
        assert tools[0]["description"] == "A dummy tool for testing."

    def test_list_names(self) -> None:
        registry = ToolRegistry()
        registry.register(DummyTool())
        assert registry.list_names() == ["dummy"]

    def test_register_overwrites(self) -> None:
        registry = ToolRegistry()
        tool1 = DummyTool()
        tool2 = DummyTool()
        registry.register(tool1)
        registry.register(tool2)
        assert registry.get("dummy") is tool2

    def test_default_registry_has_all_tools(self) -> None:
        from app.agents.registry import default_registry

        names = default_registry.list_names()
        assert "weather" in names
        assert "disease" in names
        assert "market" in names
        assert "memory" in names
        assert "dashboard" in names
