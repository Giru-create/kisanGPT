"""Open-Meteo weather provider — free, no API key required.

Implements the WeatherProvider ABC from app.agents.weather so it
can be injected into WeatherService without changing the service interface.

API docs: https://open-meteo.com/en/docs
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import TYPE_CHECKING

import httpx

from app.agents.weather import WeatherProvider

if TYPE_CHECKING:
    from app.schemas.weather import WeatherQuery

# WMO Weather interpretation codes → human-readable descriptions
WMO_CODES: dict[int, tuple[str, str]] = {
    0: ("Clear", "clear sky"),
    1: ("Mainly Clear", "mainly clear"),
    2: ("Partly Cloudy", "partly cloudy"),
    3: ("Overcast", "overcast"),
    45: ("Fog", "fog"),
    48: ("Rime Fog", "rime fog"),
    51: ("Light Drizzle", "light drizzle"),
    53: ("Moderate Drizzle", "moderate drizzle"),
    55: ("Dense Drizzle", "dense drizzle"),
    61: ("Slight Rain", "slight rain"),
    63: ("Moderate Rain", "moderate rain"),
    65: ("Heavy Rain", "heavy rain"),
    71: ("Slight Snow", "slight snow"),
    73: ("Moderate Snow", "moderate snow"),
    75: ("Heavy Snow", "heavy snow"),
    80: ("Slight Showers", "slight rain showers"),
    81: ("Moderate Showers", "moderate rain showers"),
    82: ("Violent Showers", "violent rain showers"),
    85: ("Slight Snow Showers", "slight snow showers"),
    86: ("Heavy Snow Showers", "heavy snow showers"),
    95: ("Thunderstorm", "thunderstorm"),
    96: ("Thunderstorm with Hail", "thunderstorm with slight hail"),
    99: ("Thunderstorm with Heavy Hail", "thunderstorm with heavy hail"),
}


def _wmo_to_condition(code: int) -> dict[str, str]:
    main, desc = WMO_CODES.get(code, ("Unknown", "unknown"))
    return {"main": main, "description": desc, "icon": str(code)}


class OpenMeteoProvider(WeatherProvider):
    """Open-Meteo provider — no API key required.

    Supports:
    - Current weather (temperature, humidity, wind, pressure, clouds)
    - Daily forecast (min/max temp, precipitation, wind, weather codes)
    - Geocoding via Open-Meteo geocoding API
    """

    BASE_URL = "https://api.open-meteo.com/v1"
    GEO_URL = "https://geocoding-api.open-meteo.com/v1/search"

    def __init__(self, base_url: str | None = None, timeout: float = 10.0) -> None:
        self._base_url = (base_url or self.BASE_URL).rstrip("/")
        self._timeout = timeout

    async def _get(self, url: str, params: dict[str, object]) -> dict[str, object]:
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            return resp.json()  # type: ignore[no-any-return]

    # ------------------------------------------------------------------
    # Geocoding
    # ------------------------------------------------------------------

    async def resolve_coordinates(self, query: WeatherQuery) -> dict[str, float]:
        if query.lat is not None and query.lon is not None:
            return {"lat": query.lat, "lon": query.lon}

        if not query.city:
            raise ValueError("Either lat/lon or city must be provided")

        data = await self._get(
            self.GEO_URL,
            {"name": query.city, "count": 1, "language": "en"},
        )
        results = data.get("results", [])
        if not results:
            raise ValueError(f"City not found: {query.city}")

        return {"lat": results[0]["latitude"], "lon": results[0]["longitude"]}

    # ------------------------------------------------------------------
    # Current weather
    # ------------------------------------------------------------------

    async def get_current(self, query: WeatherQuery) -> dict[str, object]:
        coords = await self.resolve_coordinates(query)

        data = await self._get(
            f"{self._base_url}/forecast",
            {
                "latitude": coords["lat"],
                "longitude": coords["lon"],
                "current": (
                    "temperature_2m,relative_humidity_2m,apparent_temperature,"
                    "surface_pressure,wind_speed_10m,wind_direction_10m,"
                    "cloud_cover,weather_code"
                ),
            },
        )

        current = data.get("current", {})
        weather_code = int(current.get("weather_code", 0))
        condition = _wmo_to_condition(weather_code)

        return {
            "temperature": float(current.get("temperature_2m", 0)),
            "feels_like": float(current.get("apparent_temperature", 0)),
            "humidity": int(current.get("relative_humidity_2m", 0)),
            "pressure": int(current.get("surface_pressure", 0)),
            "wind_speed": float(current.get("wind_speed_10m", 0)),
            "wind_deg": int(current.get("wind_direction_10m", 0)),
            "visibility": 10000,
            "clouds": int(current.get("cloud_cover", 0)),
            "conditions": [condition],
            "dt": datetime.now(UTC).isoformat(),
            "city": query.city or "",
            "country": "",
            "coordinates": coords,
        }

    # ------------------------------------------------------------------
    # Daily forecast
    # ------------------------------------------------------------------

    async def get_forecast(
        self, query: WeatherQuery, days: int = 7
    ) -> list[dict[str, object]]:
        coords = await self.resolve_coordinates(query)

        data = await self._get(
            f"{self._base_url}/forecast",
            {
                "latitude": coords["lat"],
                "longitude": coords["lon"],
                "daily": (
                    "temperature_2m_max,temperature_2m_min,"
                    "precipitation_probability_max,wind_speed_10m_max,"
                    "weather_code"
                ),
                "forecast_days": days,
            },
        )

        daily = data.get("daily", {})
        dates: list[str] = daily.get("time", [])
        t_maxs: list[float] = daily.get("temperature_2m_max", [])
        t_mins: list[float] = daily.get("temperature_2m_min", [])
        pops: list[float] = daily.get("precipitation_probability_max", [])
        winds: list[float] = daily.get("wind_speed_10m_max", [])
        codes: list[int] = daily.get("weather_code", [])

        results: list[dict[str, object]] = []
        for i, date_str in enumerate(dates):
            code = codes[i] if i < len(codes) else 0
            condition = _wmo_to_condition(code)
            t_min = t_mins[i] if i < len(t_mins) else 0
            t_max = t_maxs[i] if i < len(t_maxs) else 0
            pop = (pops[i] if i < len(pops) else 0) / 100.0

            parts = [
                f"{condition['description'].capitalize()}, "
                f"{t_min:.0f}-{t_max:.0f}\u00b0C"
            ]
            if pop > 0.5:
                parts.append(f"high chance of rain ({pop:.0%})")
            elif pop > 0.2:
                parts.append(f"possible rain ({pop:.0%})")

            results.append(
                {
                    "date": date_str,
                    "temp_min": t_min,
                    "temp_max": t_max,
                    "humidity": 0,
                    "wind_speed": winds[i] if i < len(winds) else 0,
                    "conditions": [condition],
                    "pop": pop,
                    "summary": ". ".join(parts),
                }
            )

        return results
