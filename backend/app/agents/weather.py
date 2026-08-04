from __future__ import annotations

import abc
from typing import TYPE_CHECKING

import httpx

if TYPE_CHECKING:
    from app.schemas.weather import WeatherQuery


class WeatherProvider(abc.ABC):
    """Abstract base class for weather data providers."""

    @abc.abstractmethod
    async def get_current(self, query: WeatherQuery) -> dict[str, object]: ...

    @abc.abstractmethod
    async def get_forecast(
        self, query: WeatherQuery, days: int = 7
    ) -> list[dict[str, object]]: ...

    @abc.abstractmethod
    async def resolve_coordinates(self, query: WeatherQuery) -> dict[str, float]: ...


class OpenWeatherMapProvider(WeatherProvider):
    """OpenWeatherMap provider (Current Weather + 5-day Forecast)."""

    BASE_URL = "https://api.openweathermap.org/data/2.5"
    GEO_URL = "https://api.openweathermap.org/geo/1.0"

    def __init__(self, api_key: str, timeout: float = 10.0) -> None:
        self._api_key = api_key
        self._timeout = timeout

    async def _request(self, url: str, params: dict[str, object]) -> dict[str, object]:
        params["appid"] = self._api_key
        params.setdefault("units", "metric")

        async with httpx.AsyncClient(timeout=self._timeout) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()  # type: ignore[no-any-return]

    async def resolve_coordinates(self, query: WeatherQuery) -> dict[str, float]:
        if query.lat is not None and query.lon is not None:
            return {"lat": query.lat, "lon": query.lon}

        if not query.city:
            raise ValueError("Either lat/lon or city must be provided")

        data = await self._request(
            f"{self.GEO_URL}/direct",
            {"q": query.city, "limit": 1},
        )

        if not data:
            raise ValueError(f"City not found: {query.city}")

        return {"lat": data[0]["lat"], "lon": data[0]["lon"]}

    async def get_current(self, query: WeatherQuery) -> dict[str, object]:
        coords = await self.resolve_coordinates(query)

        data = await self._request(
            f"{self.BASE_URL}/weather",
            {"lat": coords["lat"], "lon": coords["lon"]},
        )

        from datetime import UTC, datetime

        conditions = [
            {
                "main": c["main"],
                "description": c["description"],
                "icon": c["icon"],
            }
            for c in data.get("weather", [])
        ]

        return {
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "wind_speed": data["wind"]["speed"],
            "wind_deg": data["wind"]["deg"],
            "visibility": data.get("visibility", 0),
            "clouds": data.get("clouds", {}).get("all", 0),
            "conditions": conditions,
            "dt": datetime.fromtimestamp(data["dt"], tz=UTC).isoformat(),
            "city": data.get("name", ""),
            "country": data.get("sys", {}).get("country", ""),
            "coordinates": coords,
        }

    async def get_forecast(
        self, query: WeatherQuery, days: int = 7
    ) -> list[dict[str, object]]:
        coords = await self.resolve_coordinates(query)

        data = await self._request(
            f"{self.BASE_URL}/forecast",
            {"lat": coords["lat"], "lon": coords["lon"]},
        )

        from collections import defaultdict

        daily_map: dict[str, dict[str, object]] = defaultdict(
            lambda: {
                "temps": [],
                "humidities": [],
                "winds": [],
                "pops": [],
                "conditions": [],
            }
        )

        for entry in data.get("list", []):
            date_str = entry["dt_txt"].split(" ")[0]
            bucket = daily_map[date_str]
            bucket["temps"].append(entry["main"]["temp_min"])
            bucket["temps"].append(entry["main"]["temp_max"])
            bucket["humidities"].append(entry["main"]["humidity"])
            bucket["winds"].append(entry["wind"]["speed"])
            bucket["pops"].append(entry.get("pop", 0))

            if entry.get("weather"):
                w = entry["weather"][0]
                bucket["conditions"] = [
                    {
                        "main": w["main"],
                        "description": w["description"],
                        "icon": w["icon"],
                    }
                ]

        results: list[dict[str, object]] = []
        for date_str, bucket in sorted(daily_map.items()):
            temps = bucket["temps"]  # type: ignore[var-annotated]
            pops = bucket["pops"]  # type: ignore[var-annotated]
            conds = bucket["conditions"]  # type: ignore[var-annotated]
            humidities = bucket["humidities"]  # type: ignore[var-annotated]
            winds = bucket["winds"]  # type: ignore[var-annotated]

            desc = conds[0]["description"] if conds else "clear sky"
            t_min = min(temps)  # type: ignore[arg-type]
            t_max = max(temps)  # type: ignore[arg-type]
            pop_max = max(pops)  # type: ignore[arg-type]

            parts = [f"{desc.capitalize()}, {t_min:.0f}-{t_max:.0f}°C"]
            if pop_max > 0.5:
                parts.append(f"high chance of rain ({pop_max:.0%})")
            elif pop_max > 0.2:
                parts.append(f"possible rain ({pop_max:.0%})")
            summary = ". ".join(parts)

            results.append(
                {
                    "date": date_str,
                    "temp_min": t_min,
                    "temp_max": t_max,
                    "humidity": int(
                        sum(humidities) / len(humidities)  # type: ignore[arg-type]
                    ),
                    "wind_speed": max(winds),  # type: ignore[arg-type]
                    "conditions": conds,
                    "pop": pop_max,
                    "summary": summary,
                }
            )

        return results[:days]
