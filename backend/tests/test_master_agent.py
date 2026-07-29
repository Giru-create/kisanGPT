"""Tests for MasterAgent -- the multi-agent pipeline orchestrator."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.agents.context import AgentContext
from app.agents.master import MasterAgent
from app.agents.schemas import AgentConfig, AgentResult


class StubAgent:
    def __init__(self, name, success=True, data=None):
        self.name = name
        self.description = f"{name} agent"
        self.supported_intents = [name]
        self.priority = 0
        self.config = AgentConfig(timeout_seconds=5.0, max_retries=0)
        self._success = success
        self._data = data or {}

    async def run(self, context):
        return AgentResult(name=self.name, success=self._success, data=self._data)


class TestMasterAgentInit:
    """Tests for MasterAgent initialization."""

    def test_default_init(self):
        master = MasterAgent()
        assert master._router is not None
        assert master._response_agent is not None
        assert master._metrics == []

    def test_custom_router(self):
        from app.agents.router import AgentRouter

        router = AgentRouter()
        master = MasterAgent(agent_router=router)
        assert master._router is router


class TestMasterAgentChat:
    """Tests for MasterAgent.chat() method."""

    @pytest.mark.asyncio
    async def test_chat_basic_flow(self):
        master = MasterAgent()

        weather = StubAgent("weather", data={"temp": 25})
        master._router.register(weather)

        with (
            patch.object(master._router, "route", return_value=["weather"]),
            patch.object(
                master._response_agent,
                "generate",
                return_value="It is 25 degrees.",
            ),
        ):
            result = await master.chat("What is the weather?")

        assert result["message"] == "It is 25 degrees."
        assert "weather" in result["planned_tools"]
        assert result["overall_confidence"] > 0
        assert "tool_results" in result
        assert "context" in result
        assert "agent_metrics" in result

    @pytest.mark.asyncio
    async def test_chat_empty_route(self):
        master = MasterAgent()

        with (
            patch.object(master._router, "route", return_value=[]),
            patch.object(
                master._response_agent,
                "generate",
                return_value="I can help with that.",
            ),
        ):
            result = await master.chat("Hello")

        assert result["message"] == "I can help with that."
        assert result["planned_tools"] == []
        assert result["overall_confidence"] == 0.0

    @pytest.mark.asyncio
    async def test_chat_with_context(self):
        master = MasterAgent()
        ctx = AgentContext(user_id="farmer1", city="Delhi")

        weather = StubAgent("weather", data={"temp": 25})
        master._router.register(weather)

        with (
            patch.object(master._router, "route", return_value=["weather"]),
            patch.object(
                master._response_agent,
                "generate",
                return_value="Delhi is 25C.",
            ),
        ):
            await master.chat("Weather in Delhi?", context=ctx)

        assert ctx.user_id == "farmer1"
        assert ctx.city == "Delhi"
        assert ctx.message == "Weather in Delhi?"

    @pytest.mark.asyncio
    async def test_chat_context_enrichment(self):
        master = MasterAgent()

        weather = StubAgent("weather", data={"temp": 25})
        master._router.register(weather)

        with (
            patch.object(master._router, "route", return_value=["weather"]),
            patch.object(
                master._response_agent,
                "generate",
                return_value="Done.",
            ),
        ):
            result = await master.chat("Weather?")

        ctx = result["context"]
        assert ctx["query"] == "Weather?"

    @pytest.mark.asyncio
    async def test_chat_metrics_collected(self):
        master = MasterAgent()

        weather = StubAgent("weather")
        master._router.register(weather)

        with (
            patch.object(master._router, "route", return_value=["weather"]),
            patch.object(
                master._response_agent,
                "generate",
                return_value="Done.",
            ),
        ):
            result = await master.chat("Weather?")

        assert len(result["agent_metrics"]) == 1
        assert result["agent_metrics"][0]["agent_name"] == "weather"

    @pytest.mark.asyncio
    async def test_chat_multiple_agents(self):
        master = MasterAgent()

        weather = StubAgent("weather", data={"temp": 25})
        market = StubAgent("market", data={"price": 100})
        master._router.register(weather)
        master._router.register(market)

        with (
            patch.object(master._router, "route", return_value=["weather", "market"]),
            patch.object(
                master._response_agent,
                "generate",
                return_value="Weather and market data.",
            ),
        ):
            result = await master.chat("Weather and price?")

        assert len(result["planned_tools"]) == 2
        assert len(result["tool_results"]) == 2
        assert len(result["agent_metrics"]) == 2

    @pytest.mark.asyncio
    async def test_chat_partial_agent_failure(self):
        master = MasterAgent()

        weather = StubAgent("weather", success=True)
        market = StubAgent("market", success=False)
        master._router.register(weather)
        master._router.register(market)

        with (
            patch.object(master._router, "route", return_value=["weather", "market"]),
            patch.object(
                master._response_agent,
                "generate",
                return_value="Partial data.",
            ),
        ):
            result = await master.chat("Weather and price?")

        # All routed agents appear in planned_tools
        assert "weather" in result["planned_tools"]
        assert "market" in result["planned_tools"]

    @pytest.mark.asyncio
    async def test_chat_overall_confidence_all_success(self):
        master = MasterAgent()

        weather = StubAgent("weather")
        market = StubAgent("market")
        master._router.register(weather)
        master._router.register(market)

        with (
            patch.object(master._router, "route", return_value=["weather", "market"]),
            patch.object(
                master._response_agent,
                "generate",
                return_value="Done.",
            ),
        ):
            result = await master.chat("Test?")

        assert result["overall_confidence"] == 1.0

    @pytest.mark.asyncio
    async def test_chat_overall_confidence_partial_failure(self):
        master = MasterAgent()

        weather = StubAgent("weather", success=True)
        market = StubAgent("market", success=False)
        master._router.register(weather)
        master._router.register(market)

        with (
            patch.object(master._router, "route", return_value=["weather", "market"]),
            patch.object(
                master._response_agent,
                "generate",
                return_value="Partial.",
            ),
        ):
            result = await master.chat("Test?")

        assert result["overall_confidence"] == 0.5


class TestMasterAgentMemory:
    """Tests for memory loading and saving."""

    @pytest.mark.asyncio
    async def test_load_memory_none_when_no_manager(self):
        master = MasterAgent()
        result = await master._load_memory("user1")
        assert result is None

    @pytest.mark.asyncio
    async def test_load_memory_none_when_no_user_id(self):
        master = MasterAgent(memory_manager=AsyncMock())
        result = await master._load_memory("")
        assert result is None

    @pytest.mark.asyncio
    async def test_save_memory_skips_when_no_manager(self):
        master = MasterAgent()
        await master._save_memory("user1", "hi", "hello")

    @pytest.mark.asyncio
    async def test_save_memory_skips_when_no_user_id(self):
        master = MasterAgent(memory_manager=AsyncMock())
        await master._save_memory("", "hi", "hello")

    @pytest.mark.asyncio
    async def test_load_memory_returns_dict(self):
        mock_manager = AsyncMock()
        mock_ctx = MagicMock()
        mock_ctx.model_dump.return_value = {"key": "val"}
        mock_manager.retrieve_memory.return_value = mock_ctx

        master = MasterAgent(memory_manager=mock_manager)
        result = await master._load_memory("user1")
        assert result == {"key": "val"}

    @pytest.mark.asyncio
    async def test_load_memory_exception_returns_none(self):
        mock_manager = AsyncMock()
        mock_manager.retrieve_memory.side_effect = RuntimeError("DB error")

        master = MasterAgent(memory_manager=mock_manager)
        result = await master._load_memory("user1")
        assert result is None


class TestMasterAgentMergeContext:
    """Tests for _merge_into_context()."""

    def test_merge_sets_metadata(self):
        master = MasterAgent()
        ctx = AgentContext()
        results = [
            AgentResult(name="weather", success=True),
            AgentResult(name="market", success=False),
        ]
        master._merge_into_context(results, ctx)
        assert ctx.metadata["agents_executed"] == ["weather", "market"]
        assert ctx.metadata["overall_success"] is False

    def test_merge_all_success(self):
        master = MasterAgent()
        ctx = AgentContext()
        results = [
            AgentResult(name="weather", success=True),
            AgentResult(name="market", success=True),
        ]
        master._merge_into_context(results, ctx)
        assert ctx.metadata["overall_success"] is True
