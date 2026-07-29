"""Tests for retry logic in MasterAgent._run_single_agent()."""

import pytest

from app.agents.context import AgentContext
from app.agents.master import MasterAgent
from app.agents.schemas import AgentConfig, AgentResult


class StubAgent:
    """Agent stub that can be configured to fail a certain number of times."""

    def __init__(self, name="test", fail_count=0, max_retries=1):
        self.name = name
        self.description = "test"
        self.supported_intents = [name]
        self.priority = 0
        self.config = AgentConfig(timeout_seconds=5.0, max_retries=max_retries)
        self._fail_count = fail_count
        self._call_count = 0

    async def run(self, context):
        self._call_count += 1
        if self._call_count <= self._fail_count:
            raise RuntimeError(f"Fail attempt {self._call_count}")
        return AgentResult(name=self.name, success=True, confidence=0.9)


class TestRetryLogic:
    """Tests for retry behavior."""

    @pytest.mark.asyncio
    async def test_no_retry_on_success(self):
        agent = StubAgent(fail_count=0, max_retries=3)
        master = MasterAgent()
        metrics, result = await master._run_single_agent(agent, AgentContext())
        assert metrics.success is True
        assert metrics.retry_count == 0
        assert agent._call_count == 1
        assert result is not None
        assert result.success is True

    @pytest.mark.asyncio
    async def test_retry_on_failure_succeeds(self):
        agent = StubAgent(fail_count=1, max_retries=2)
        master = MasterAgent()
        metrics, result = await master._run_single_agent(agent, AgentContext())
        assert metrics.success is True
        # retry_count tracks attempts that failed (0-indexed + 1)
        assert metrics.retry_count == 1
        assert agent._call_count == 2

    @pytest.mark.asyncio
    async def test_retry_exhausted(self):
        agent = StubAgent(fail_count=5, max_retries=2)
        master = MasterAgent()
        metrics, result = await master._run_single_agent(agent, AgentContext())
        assert metrics.success is False
        # 1 initial + 2 retries = 3 attempts, retry_count = attempt + 1 = 3
        assert metrics.retry_count == 3
        assert agent._call_count == 3
        assert result is not None
        assert result.success is False

    @pytest.mark.asyncio
    async def test_no_retry_when_max_retries_zero(self):
        agent = StubAgent(fail_count=1, max_retries=0)
        master = MasterAgent()
        metrics, result = await master._run_single_agent(agent, AgentContext())
        assert metrics.success is False
        assert metrics.retry_count == 1
        assert agent._call_count == 1

    @pytest.mark.asyncio
    async def test_retry_on_timeout(self):
        class TimeoutAgent:
            name = "timeout"
            description = "timeout"
            supported_intents = ["timeout"]
            priority = 0
            config = AgentConfig(timeout_seconds=0.01, max_retries=1)

            async def run(self, context):
                import asyncio

                await asyncio.sleep(10)
                return AgentResult(name="timeout", success=True)

        master = MasterAgent()
        metrics, result = await master._run_single_agent(TimeoutAgent(), AgentContext())
        assert metrics.success is False
        assert metrics.retry_count == 2

    @pytest.mark.asyncio
    async def test_error_message_recorded(self):
        agent = StubAgent(fail_count=10, max_retries=1)
        master = MasterAgent()
        metrics, result = await master._run_single_agent(agent, AgentContext())
        assert metrics.error_message is not None
        assert "Fail attempt" in metrics.error_message
