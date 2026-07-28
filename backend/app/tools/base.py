from __future__ import annotations

import abc
from typing import Any


class BaseTool(abc.ABC):
    """Abstract base class for all orchestrator tools.

    Every tool wraps an existing service and exposes a uniform
    interface for the orchestrator to call.
    """

    name: str
    description: str

    @abc.abstractmethod
    async def run(self, query: str, context: dict[str, Any]) -> dict[str, Any]:
        """Execute the tool with the given query and context.

        Args:
            query: The user's natural-language query.
            context: Arbitrary context dict (user info, location, etc.).

        Returns:
            A dict with keys ``tool``, ``success``, and ``data``.
        """
        ...

    def _success(self, data: Any) -> dict[str, Any]:
        return {"tool": self.name, "success": True, "data": data}

    def _error(self, error: str) -> dict[str, Any]:
        return {"tool": self.name, "success": False, "data": {"error": error}}
