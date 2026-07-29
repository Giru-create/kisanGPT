"""Tests for parallel agent execution in MasterAgent."""

import asyncio
import time
from unittest.mock import patch

import pytest

from app.agents.context import AgentContext
from app.agents.master import MasterAgent
from app.agents.schemas import AgentConfig, AgentResult


class StubAgent:
    """Minimal agent stub for testing."""

    def __init__(self, name, delay=0.0, success=True):
        self.name = name
        self.description = f"{name} agent"
        self.supported_intents = [name]
        self.priority = 0
        self.config = AgentConfig(timeout_seconds=5.0, max_retries=0)
        self._delay = delay
        self._success = success

    async def run(self, context):
        if self._delay > 0:
            await asyncio.sleep(self._delay)
        return AgentResult(name=self.name, success=self._success, confidence=0.9)


class TestParallelExecution:
    """Tests for parallel execution in MasterAgent._execute_agents()."""

    @pytest.mark.asyncio
    async def test_single_agent_execution(self):
        agent = StubAgent("weather")
        master = MasterAgent()

        with patch.object(master._router, "get", return_value=agent):
            results = await master._execute_agents(["weather"], AgentContext())

        assert len(results) == 1
        assert results[0].name == "weather"
        assert results[0].success is True

    @pytest.mark.asyncio
    async def test_parallel_agents_run_concurrently(self):
        agent1 = StubAgent("weather", delay=0.1)
        agent2 = StubAgent("market", delay=0.1)
        master = MasterAgent()

        def get_agent(name):
            return agent1 if name == "weather" else agent2

        with patch.object(master._router, "get", side_effect=get_agent):
            start = time.time()
            results = await master._execute_agents(
                ["weather", "market"], AgentContext()
            )
            elapsed = time.time() - start

        assert len(results) == 2
        # Should run in parallel (less than sum of delays)
        assert elapsed < 0.3

    @pytest.mark.asyncio
    async def test_empty_agent_list(self):
        master = MasterAgent()
        results = await master._execute_agents([], AgentContext())
        assert results == []

    @pytest.mark.asyncio
    async def test_agent_not_found_skipped(self):
        master = MasterAgent()

        with patch.object(master._router, "get", return_value=None):
            results = await master._execute_agents(["nonexistent"], AgentContext())

        assert results == []

    @pytest.mark.asyncio
    async def test_agent_exception_captured(self):
        class FailingAgent:
            name = "failing"
            description = "failing"
            supported_intents = ["fail"]
            priority = 0
            config = AgentConfig(timeout_seconds=5.0, max_retries=0)

            async def run(self, context):
                raise RuntimeError("Boom!")

        master = MasterAgent()
        with patch.object(master._router, "get", return_value=FailingAgent()):
            results = await master._execute_agents(["failing"], AgentContext())

        assert len(results) == 1
        assert results[0].success is False
        assert "Boom!" in results[0].errors[0]

    @pytest.mark.asyncio
    async def test_mixed_success_and_failure(self):
        agent1 = StubAgent("weather", success=True)
        agent2 = StubAgent("market", success=False)

        master = MasterAgent()

        def get_agent(name):
            return agent1 if name == "weather" else agent2

        with patch.object(master._router, "get", side_effect=get_agent):
            results = await master._execute_agents(
                ["weather", "market"], AgentContext()
            )

        assert len(results) == 2
        successes = [r for r in results if r.success]
        failures = [r for r in results if not r.success]
        assert len(successes) == 1
        assert len(failures) == 1
