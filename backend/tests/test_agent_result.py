"""Tests for AgentResult schema."""

from app.agents.schemas import AgentConfig, AgentMetrics, AgentResult


class TestAgentResult:
    """Tests for AgentResult."""

    def test_minimal_creation(self):
        result = AgentResult(name="test")
        assert result.name == "test"
        assert result.success is True
        assert result.confidence == 1.0
        assert result.execution_time_ms == 0.0
        assert result.data == {}
        assert result.sources == []
        assert result.metadata == {}
        assert result.errors == []
        assert result.timestamp > 0

    def test_full_creation(self):
        result = AgentResult(
            name="weather",
            success=True,
            confidence=0.9,
            execution_time_ms=123.4,
            data={"temp": 25},
            sources=["api"],
            metadata={"key": "val"},
            errors=["warn"],
        )
        assert result.name == "weather"
        assert result.confidence == 0.9
        assert result.execution_time_ms == 123.4
        assert result.data == {"temp": 25}
        assert result.sources == ["api"]
        assert result.metadata == {"key": "val"}
        assert result.errors == ["warn"]

    def test_name_must_be_non_empty(self):
        import pytest
        from pydantic import ValidationError

        with pytest.raises(ValidationError):
            AgentResult(name="")

    def test_confidence_bounds(self):
        import pytest
        from pydantic import ValidationError

        with pytest.raises(ValidationError):
            AgentResult(name="t", confidence=-0.1)
        with pytest.raises(ValidationError):
            AgentResult(name="t", confidence=1.1)

    def test_to_tool_result_success(self):
        result = AgentResult(
            name="weather",
            success=True,
            data={"temp": 25},
        )
        tr = result.to_tool_result()
        assert tr == {"tool": "weather", "success": True, "data": {"temp": 25}}

    def test_to_tool_result_failure(self):
        result = AgentResult(
            name="disease",
            success=False,
            data={},
        )
        tr = result.to_tool_result()
        assert tr == {"tool": "disease", "success": False, "data": {}}


class TestAgentConfig:
    """Tests for AgentConfig."""

    def test_defaults(self):
        config = AgentConfig()
        assert config.timeout_seconds == 10.0
        assert config.max_retries == 1
        assert config.enabled is True
        assert config.priority == 0

    def test_custom_values(self):
        config = AgentConfig(
            timeout_seconds=5.0, max_retries=3, enabled=False, priority=5
        )
        assert config.timeout_seconds == 5.0
        assert config.max_retries == 3
        assert config.enabled is False
        assert config.priority == 5

    def test_timeout_must_be_positive(self):
        import pytest
        from pydantic import ValidationError

        with pytest.raises(ValidationError):
            AgentConfig(timeout_seconds=0)

    def test_max_retries_non_negative(self):
        import pytest
        from pydantic import ValidationError

        with pytest.raises(ValidationError):
            AgentConfig(max_retries=-1)


class TestAgentMetrics:
    """Tests for AgentMetrics."""

    def test_creation(self):
        metrics = AgentMetrics(agent_name="weather")
        assert metrics.agent_name == "weather"
        assert metrics.started_at > 0
        assert metrics.finished_at is None
        assert metrics.duration_ms == 0.0
        assert metrics.success is False
        assert metrics.retry_count == 0
        assert metrics.error_message is None

    def test_mark_finished_success(self):
        metrics = AgentMetrics(agent_name="test")
        metrics.mark_finished(True)
        assert metrics.success is True
        assert metrics.finished_at is not None
        assert metrics.duration_ms >= 0
        assert metrics.error_message is None

    def test_mark_finished_failure(self):
        metrics = AgentMetrics(agent_name="test")
        metrics.mark_finished(False, "something broke")
        assert metrics.success is False
        assert metrics.error_message == "something broke"
