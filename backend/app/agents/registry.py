from __future__ import annotations

from typing import TYPE_CHECKING

from app.core.logging import logger

if TYPE_CHECKING:
    from app.tools.base import BaseTool


class ToolRegistry:
    """Central registry that maps tool names to BaseTool instances.

    All default tools are registered on first use.  Additional tools
    can be registered at runtime for extensibility.
    """

    def __init__(self) -> None:
        self._tools: dict[str, BaseTool] = {}

    def register(self, tool: BaseTool) -> None:
        """Register a tool. Overwrites if the name already exists."""
        self._tools[tool.name] = tool
        logger.info("Tool registered", extra={"tool": tool.name})

    def get(self, name: str) -> BaseTool | None:
        """Retrieve a tool by name, or ``None`` if not found."""
        return self._tools.get(name)

    def list_tools(self) -> list[dict[str, str]]:
        """Return metadata for every registered tool."""
        return [
            {"name": t.name, "description": t.description} for t in self._tools.values()
        ]

    def list_names(self) -> list[str]:
        """Return just the registered tool names."""
        return list(self._tools.keys())


def _create_default_registry() -> ToolRegistry:
    """Build a registry pre-loaded with all built-in tools."""
    from app.tools.dashboard import DashboardTool
    from app.tools.disease import DiseaseTool
    from app.tools.knowledge import KnowledgeTool
    from app.tools.market import MarketTool
    from app.tools.memory import MemoryTool
    from app.tools.weather import WeatherTool

    registry = ToolRegistry()
    for tool_cls in (
        WeatherTool,
        DiseaseTool,
        MarketTool,
        MemoryTool,
        DashboardTool,
        KnowledgeTool,
    ):
        registry.register(tool_cls())
    return registry


default_registry: ToolRegistry = _create_default_registry()
