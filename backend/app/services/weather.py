from __future__ import annotations

from datetime import UTC, datetime
from typing import TYPE_CHECKING

from app.cache.memory import TTLCache
from app.core.config import settings
from app.core.logging import logger
from app.schemas.weather import (
    FarmingAdvice,
    ForecastResponse,
    WeatherAdviceResponse,
    WeatherQuery,
)

if TYPE_CHECKING:
    from app.agents.weather import WeatherProvider


class WeatherService:
    """Orchestrates weather data fetching, caching, and advice."""

    def __init__(self, provider: WeatherProvider | None = None) -> None:
        if provider is not None:
            self._provider = provider
        elif settings.OPENWEATHERMAP_API_KEY:
            from app.agents.weather import OpenWeatherMapProvider

            self._provider = OpenWeatherMapProvider(
                api_key=settings.OPENWEATHERMAP_API_KEY,
                timeout=settings.WEATHER_TIMEOUT,
            )
        else:
            from app.providers.weather.open_meteo import OpenMeteoProvider

            self._provider = OpenMeteoProvider(
                base_url=settings.OPEN_METEO_BASE_URL,
                timeout=settings.WEATHER_TIMEOUT,
            )
        self._cache = TTLCache(default_ttl=settings.WEATHER_CACHE_TTL)

    async def get_current(self, query: WeatherQuery) -> dict[str, object]:
        cache_key = self._build_cache_key("current", query)
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info("Weather cache hit", extra={"key": cache_key})
            return cached  # type: ignore[return-value]

        try:
            weather = await self._provider.get_current(query)
        except Exception:
            logger.exception("Failed to fetch current weather")
            raise

        self._cache.set(cache_key, weather)
        return weather

    async def get_forecast(
        self, query: WeatherQuery, days: int = 7
    ) -> dict[str, object]:
        cache_key = self._build_cache_key("forecast", query, str(days))
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info("Forecast cache hit", extra={"key": cache_key})
            return cached  # type: ignore[return-value]

        try:
            daily = await self._provider.get_forecast(query, days=days)
        except Exception:
            logger.exception("Failed to fetch forecast")
            raise

        coords_raw = await self._provider.resolve_coordinates(query)
        from app.schemas.weather import Coordinates

        coords = Coordinates(
            latitude=coords_raw["lat"],
            longitude=coords_raw["lon"],
        )
        result = ForecastResponse(
            city=daily[0].get("date", "") if daily else "",
            country="",
            coordinates=coords,
            daily=daily,  # type: ignore[arg-type]
        ).model_dump(mode="json")

        self._cache.set(cache_key, result)
        return result

    async def get_advice(self, query: WeatherQuery) -> dict[str, object]:
        try:
            current = await self._provider.get_current(query)
            forecast = await self._provider.get_forecast(query, days=3)
        except Exception:
            logger.exception("Failed to generate weather advice")
            raise

        conditions = current.get("conditions", [])
        conditions_str = ", ".join(c["description"] for c in conditions)
        city = current.get("city", "")
        country = current.get("country", "")
        if city:
            location_label = f"{city}, {country}"
        else:
            coords = current.get("coordinates", {})
            location_label = f"{coords.get('lat', 0):.2f}, {coords.get('lon', 0):.2f}"

        advice_items = _generate_farming_advice(
            temp=current["temperature"],
            humidity=current["humidity"],
            wind_speed=current["wind_speed"],
            conditions=conditions_str,
            forecast=forecast,
        )

        return WeatherAdviceResponse(
            location=location_label,
            generated_at=datetime.now(UTC).isoformat(),
            current_summary=(
                f"{current['temperature']:.1f}°C, "
                f"{conditions_str}, "
                f"{current['humidity']}% humidity"
            ),
            advice=advice_items,
        ).model_dump(mode="json")

    @staticmethod
    def _build_cache_key(*parts: object) -> str:
        return ":".join(str(p) for p in parts)


def _generate_farming_advice(
    temp: float,
    humidity: int,
    wind_speed: float,
    conditions: str,
    forecast: list[dict[str, object]],
) -> list[FarmingAdvice]:
    advice: list[FarmingAdvice] = []

    if temp > 40:
        advice.append(
            FarmingAdvice(
                category="heat",
                title="Extreme Heat Warning",
                message=(
                    "Temperature exceeds 40°C. Ensure "
                    "adequate irrigation, provide shade for "
                    "livestock, and avoid field operations "
                    "during peak heat hours."
                ),
                severity="danger",
            )
        )
    elif temp > 35:
        advice.append(
            FarmingAdvice(
                category="heat",
                title="High Temperature Advisory",
                message=(
                    "Temperature above 35°C. Increase "
                    "irrigation frequency and monitor crops "
                    "for heat stress."
                ),
                severity="warning",
            )
        )
    elif temp < 5:
        advice.append(
            FarmingAdvice(
                category="cold",
                title="Cold Weather Alert",
                message=(
                    "Temperature below 5°C. Protect "
                    "sensitive crops with covers. Monitor "
                    "livestock for cold stress."
                ),
                severity="danger",
            )
        )
    elif temp < 10:
        advice.append(
            FarmingAdvice(
                category="cold",
                title="Cool Weather Notice",
                message=(
                    "Temperature below 10°C. Delay sowing "
                    "of warm-season crops. Good conditions "
                    "for wheat and mustard."
                ),
                severity="info",
            )
        )

    if humidity > 90:
        advice.append(
            FarmingAdvice(
                category="humidity",
                title="Very High Humidity",
                message=(
                    "Humidity above 90%. Risk of fungal "
                    "diseases increases. Ensure good air "
                    "circulation and apply preventive "
                    "fungicide if needed."
                ),
                severity="warning",
            )
        )
    elif humidity < 30:
        advice.append(
            FarmingAdvice(
                category="humidity",
                title="Low Humidity Alert",
                message=(
                    "Humidity below 30%. Increase irrigation. "
                    "Crops may experience moisture stress. "
                    "Consider mulching."
                ),
                severity="warning",
            )
        )

    if wind_speed > 15:
        advice.append(
            FarmingAdvice(
                category="wind",
                title="Strong Wind Advisory",
                message=(
                    "Wind speed above 15 m/s. Secure "
                    "greenhouse structures and avoid "
                    "pesticide spraying. Protect young "
                    "seedlings."
                ),
                severity="warning",
            )
        )

    has_rain = any(
        f.get("pop", 0) > 0.3  # type: ignore[union-attr]
        for f in forecast
    )
    if has_rain:
        advice.append(
            FarmingAdvice(
                category="rain",
                title="Rain Expected in Forecast",
                message=(
                    "Rain expected in coming days. Delay "
                    "harvesting operations. Ensure proper "
                    "field drainage. Plan sowing after rain."
                ),
                severity="info",
            )
        )

    if not advice:
        advice.append(
            FarmingAdvice(
                category="general",
                title="Favorable Conditions",
                message=(
                    "Weather conditions are favorable for "
                    "most farming activities. Good time for "
                    "sowing, irrigation, and field "
                    "operations."
                ),
                severity="info",
            )
        )

    return advice


weather_service = WeatherService()
