from __future__ import annotations

from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class WeatherCondition(BaseModel):
    main: str
    description: str
    icon: str


class CurrentWeather(BaseModel):
    temperature: float
    feels_like: float
    humidity: int
    pressure: int
    wind_speed: float
    wind_deg: int
    visibility: int
    clouds: int
    conditions: list[WeatherCondition]
    dt: str
    city: str
    country: str
    coordinates: Coordinates


class DailyForecast(BaseModel):
    date: str
    temp_min: float
    temp_max: float
    humidity: int
    wind_speed: float
    conditions: list[WeatherCondition]
    pop: float = Field(..., ge=0, le=1, description="Probability of precipitation")
    summary: str


class ForecastResponse(BaseModel):
    city: str
    country: str
    coordinates: Coordinates
    daily: list[DailyForecast]


class FarmingAdvice(BaseModel):
    category: str
    title: str
    message: str
    severity: str = Field(..., pattern=r"^(info|warning|danger)$")


class WeatherAdviceResponse(BaseModel):
    location: str
    generated_at: str
    current_summary: str
    advice: list[FarmingAdvice]


class WeatherQuery(BaseModel):
    lat: float | None = Field(None, ge=-90, le=90)
    lon: float | None = Field(None, ge=-180, le=180)
    city: str | None = Field(None, min_length=1, max_length=200)
