from app.agents.planner import plan


class TestPlanner:
    def test_weather_keywords(self) -> None:
        assert "weather" in plan("What is the weather today?")

    def test_rain_keyword(self) -> None:
        assert "weather" in plan("Will it rain tomorrow?")

    def test_temperature_keyword(self) -> None:
        assert "weather" in plan("Temperature forecast for this week?")

    def test_irrigate_keyword(self) -> None:
        assert "weather" in plan("Should I irrigate today?")

    def test_market_keywords(self) -> None:
        assert "market" in plan("What is the wheat price today?")

    def test_sell_keyword(self) -> None:
        assert "market" in plan("Should I sell my wheat now?")

    def test_mandi_keyword(self) -> None:
        assert "market" in plan("Mandi rates for rice")

    def test_disease_keywords(self) -> None:
        assert "disease" in plan("My leaves have brown spots")

    def test_pest_keyword(self) -> None:
        assert "disease" in plan("There are bugs on my crop")

    def test_dashboard_keywords(self) -> None:
        assert "dashboard" in plan("Show me my dashboard")

    def test_fertilizer_keyword(self) -> None:
        assert "dashboard" in plan("Which fertilizer should I use?")

    def test_multiple_tools(self) -> None:
        result = plan("Should I sell wheat tomorrow because of rain?")
        assert "market" in result
        assert "weather" in result

    def test_no_match_returns_defaults(self) -> None:
        result = plan("Hello there!")
        assert result == ["weather", "market"]

    def test_empty_string_returns_defaults(self) -> None:
        result = plan("")
        assert result == ["weather", "market"]

    def test_case_insensitive(self) -> None:
        result = plan("WEATHER update please")
        assert "weather" in result

    def test_hindi_keywords(self) -> None:
        result = plan("aaj mausam kaisa hai rain")
        assert "weather" in result

    def test_sell_and_price_together(self) -> None:
        result = plan("What is the price and should I sell?")
        assert "market" in result

    def test_history_keyword(self) -> None:
        assert "memory" in plan("What did I ask last time?")

    def test_government_keyword(self) -> None:
        assert "dashboard" in plan("Tell me about government schemes")
