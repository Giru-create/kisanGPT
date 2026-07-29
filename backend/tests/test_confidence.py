"""Tests for confidence scoring and context enrichment in MasterAgent."""

from app.agents.context import AgentContext
from app.agents.master import MasterAgent
from app.agents.schemas import AgentResult


class TestConfidenceScoring:
    """Tests for _compute_confidence()."""

    def test_empty_results(self):
        assert MasterAgent._compute_confidence([]) == 0.0

    def test_all_successful(self):
        results = [
            AgentResult(name="weather", success=True),
            AgentResult(name="market", success=True),
        ]
        assert MasterAgent._compute_confidence(results) == 1.0

    def test_all_failed(self):
        results = [
            AgentResult(name="weather", success=False),
            AgentResult(name="market", success=False),
        ]
        assert MasterAgent._compute_confidence(results) == 0.0

    def test_mixed_success_failure(self):
        results = [
            AgentResult(name="weather", success=True),
            AgentResult(name="market", success=False),
            AgentResult(name="disease", success=True),
        ]
        confidence = MasterAgent._compute_confidence(results)
        assert abs(confidence - 0.667) < 0.01

    def test_single_success(self):
        results = [AgentResult(name="weather", success=True)]
        assert MasterAgent._compute_confidence(results) == 1.0

    def test_single_failure(self):
        results = [AgentResult(name="weather", success=False)]
        assert MasterAgent._compute_confidence(results) == 0.0

    def test_decimal_precision(self):
        results = [
            AgentResult(name="a", success=True),
            AgentResult(name="b", success=True),
            AgentResult(name="c", success=True),
            AgentResult(name="d", success=True),
            AgentResult(name="e", success=False),
        ]
        confidence = MasterAgent._compute_confidence(results)
        assert confidence == 0.8


class TestContextEnrichment:
    """Tests for _enrich_context_from_result()."""

    def test_weather_enrichment(self):
        master = MasterAgent()
        ctx = AgentContext()
        result = AgentResult(name="weather", success=True, data={"temp": 25})
        master._enrich_context_from_result("weather", result, ctx)
        assert ctx.weather == {"temp": 25}

    def test_market_enrichment(self):
        master = MasterAgent()
        ctx = AgentContext()
        result = AgentResult(name="market", success=True, data={"price": 100})
        master._enrich_context_from_result("market", result, ctx)
        assert ctx.market == {"price": 100}

    def test_disease_enrichment(self):
        master = MasterAgent()
        ctx = AgentContext()
        result = AgentResult(name="disease", success=True, data={"disease": "blight"})
        master._enrich_context_from_result("disease", result, ctx)
        assert ctx.diagnosis == {"disease": "blight"}

    def test_knowledge_enrichment(self):
        master = MasterAgent()
        ctx = AgentContext()
        result = AgentResult(
            name="knowledge",
            success=True,
            data={"documents": [{"id": 1}]},
        )
        master._enrich_context_from_result("knowledge", result, ctx)
        assert ctx.documents == [{"id": 1}]

    def test_memory_enrichment(self):
        master = MasterAgent()
        ctx = AgentContext()
        result = AgentResult(
            name="memory",
            success=True,
            data={"messages": [{"role": "user"}]},
        )
        master._enrich_context_from_result("memory", result, ctx)
        assert ctx.history == [{"role": "user"}]

    def test_failed_result_no_enrichment(self):
        master = MasterAgent()
        ctx = AgentContext()
        result = AgentResult(name="weather", success=False, data={"temp": 25})
        master._enrich_context_from_result("weather", result, ctx)
        assert ctx.weather == {}

    def test_unknown_agent_no_enrichment(self):
        master = MasterAgent()
        ctx = AgentContext()
        result = AgentResult(name="unknown", success=True, data={"foo": "bar"})
        master._enrich_context_from_result("unknown", result, ctx)
        assert ctx.weather == {}
        assert ctx.market == {}


class TestMergeContext:
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
