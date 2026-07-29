"""Tests for AgentRouter."""

from app.agents.base import BaseAgent
from app.agents.context import AgentContext
from app.agents.router import AgentRouter
from app.agents.schemas import AgentResult


class StubAgent(BaseAgent):
    """Minimal agent for testing router."""

    name = "stub"
    description = "Stub agent"
    supported_intents = ["greeting", "hello"]
    priority = 5

    async def run(self, context: AgentContext) -> AgentResult:
        return AgentResult(name=self.name, success=True)


class WeatherStub(BaseAgent):
    name = "weather"
    description = "Weather"
    supported_intents = ["weather", "rain"]
    priority = 10

    async def run(self, context: AgentContext) -> AgentResult:
        return AgentResult(name=self.name, success=True)


class MarketStub(BaseAgent):
    name = "market"
    description = "Market"
    supported_intents = ["price", "sell"]
    priority = 8

    async def run(self, context: AgentContext) -> AgentResult:
        return AgentResult(name=self.name, success=True)


class TestAgentRouterRegistration:
    """Tests for router registration and retrieval."""

    def test_register_and_get(self):
        router = AgentRouter()
        agent = StubAgent()
        router.register(agent)
        assert router.get("stub") is agent

    def test_get_nonexistent_returns_none(self):
        router = AgentRouter()
        assert router.get("nope") is None

    def test_list_agents(self):
        router = AgentRouter()
        a1 = StubAgent()
        a2 = WeatherStub()
        router.register(a1)
        router.register(a2)
        agents = router.list_agents()
        assert len(agents) == 2
        assert a1 in agents
        assert a2 in agents

    def test_list_names(self):
        router = AgentRouter()
        router.register(StubAgent())
        router.register(WeatherStub())
        names = router.list_names()
        assert "stub" in names
        assert "weather" in names

    def test_init_with_agents(self):
        agents = [StubAgent(), WeatherStub()]
        router = AgentRouter(agents=agents)
        assert len(router.list_agents()) == 2
        assert router.get("stub") is agents[0]


class TestAgentRouterPriority:
    """Tests for priority-based sorting."""

    def test_get_by_priority(self):
        router = AgentRouter()
        router.register(StubAgent())  # priority 5
        router.register(WeatherStub())  # priority 10
        router.register(MarketStub())  # priority 8
        sorted_agents = router.get_by_priority()
        assert sorted_agents[0].name == "weather"
        assert sorted_agents[1].name == "market"
        assert sorted_agents[2].name == "stub"


class TestAgentRouterIntentMatching:
    """Tests for intent-based routing."""

    def test_route_by_intent_single(self):
        router = AgentRouter()
        router.register(StubAgent())
        router.register(WeatherStub())
        result = router.route_by_intent(["greeting"])
        assert result == ["stub"]

    def test_route_by_intent_multiple(self):
        router = AgentRouter()
        router.register(StubAgent())
        router.register(WeatherStub())
        router.register(MarketStub())
        result = router.route_by_intent(["weather", "price"])
        assert "market" in result
        assert "weather" in result
        assert "stub" not in result

    def test_route_by_intent_no_match(self):
        router = AgentRouter()
        router.register(StubAgent())
        result = router.route_by_intent(["unknown"])
        assert result == []

    def test_route_by_intent_partial_match(self):
        router = AgentRouter()
        router.register(StubAgent())
        router.register(WeatherStub())
        result = router.route_by_intent(["rain", "hello"])
        assert "weather" in result
        assert "stub" in result

    def test_route_by_intent_deduplicates(self):
        router = AgentRouter()
        router.register(StubAgent())
        result = router.route_by_intent(["greeting", "hello"])
        assert result == ["stub"]
