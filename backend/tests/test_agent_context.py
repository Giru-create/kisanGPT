"""Tests for AgentContext dataclass."""

from app.agents.context import AgentContext


class TestAgentContext:
    """Tests for AgentContext."""

    def test_defaults(self):
        ctx = AgentContext()
        assert ctx.user_id == ""
        assert ctx.city is None
        assert ctx.lat is None
        assert ctx.lon is None
        assert ctx.commodity is None
        assert ctx.conversation_id is None
        assert ctx.extras == {}

    def test_sprint6_fields_defaults(self):
        ctx = AgentContext()
        assert ctx.message == ""
        assert ctx.language is None
        assert ctx.location is None
        assert ctx.history == []
        assert ctx.memory == {}
        assert ctx.documents == []
        assert ctx.weather == {}
        assert ctx.market == {}
        assert ctx.diagnosis == {}
        assert ctx.metadata == {}

    def test_custom_values(self):
        ctx = AgentContext(
            user_id="u1",
            city="Delhi",
            lat=28.6,
            lon=77.2,
            commodity="wheat",
            conversation_id="c1",
            extras={"key": "val"},
            message="hello",
            language="hi",
            location="Delhi",
        )
        assert ctx.user_id == "u1"
        assert ctx.city == "Delhi"
        assert ctx.lat == 28.6
        assert ctx.lon == 77.2
        assert ctx.commodity == "wheat"
        assert ctx.conversation_id == "c1"
        assert ctx.extras == {"key": "val"}
        assert ctx.message == "hello"
        assert ctx.language == "hi"
        assert ctx.location == "Delhi"

    def test_to_dict_basic(self):
        ctx = AgentContext(user_id="u1", city="Delhi", lat=28.6, lon=77.2)
        d = ctx.to_dict()
        assert d["user_id"] == "u1"
        assert d["city"] == "Delhi"
        assert d["lat"] == 28.6
        assert d["lon"] == 77.2

    def test_to_dict_includes_extras(self):
        ctx = AgentContext(user_id="u1", extras={"commodity": "rice"})
        d = ctx.to_dict()
        assert d["user_id"] == "u1"
        assert d["commodity"] == "rice"

    def test_to_dict_excludes_sprint6_fields(self):
        ctx = AgentContext(user_id="u1", message="hello", weather={"temp": 25})
        d = ctx.to_dict()
        assert "message" not in d
        assert "weather" not in d

    def test_mutable_defaults_are_independent(self):
        ctx1 = AgentContext()
        ctx2 = AgentContext()
        ctx1.history.append({"role": "user"})
        ctx1.metadata["key"] = "val"
        assert ctx2.history == []
        assert ctx2.metadata == {}

    def test_list_fields_mutable_independently(self):
        ctx = AgentContext()
        ctx.documents.append({"id": 1})
        ctx.weather["temp"] = 25
        ctx.market["price"] = 100
        ctx.diagnosis["disease"] = "blight"
        ctx.memory["key"] = "value"
        assert len(ctx.documents) == 1
        assert ctx.weather == {"temp": 25}
        assert ctx.market == {"price": 100}
        assert ctx.diagnosis == {"disease": "blight"}
        assert ctx.memory == {"key": "value"}
