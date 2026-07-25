from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.weather import (
    Coordinates,
    CurrentWeather,
    DailyForecast,
    FarmingAdvice,
    WeatherCondition,
    WeatherQuery,
)


class TestCoordinates:
    def test_valid(self) -> None:
        coords = Coordinates(latitude=28.6139, longitude=77.2090)
        assert coords.latitude == 28.6139
        assert coords.longitude == 77.2090

    def test_boundary_values(self) -> None:
        coords = Coordinates(latitude=-90, longitude=-180)
        assert coords.latitude == -90
        coords2 = Coordinates(latitude=90, longitude=180)
        assert coords2.longitude == 180

    def test_invalid_latitude(self) -> None:
        with pytest.raises(ValidationError):
            Coordinates(latitude=91, longitude=0)

    def test_invalid_longitude(self) -> None:
        with pytest.raises(ValidationError):
            Coordinates(latitude=0, longitude=181)


class TestWeatherCondition:
    def test_valid(self) -> None:
        cond = WeatherCondition(
            main="Rain",
            description="light rain",
            icon="10d",
        )
        assert cond.main == "Rain"
        assert cond.description == "light rain"


class TestWeatherQuery:
    def test_lat_lon(self) -> None:
        q = WeatherQuery(lat=28.6, lon=77.2)
        assert q.lat == 28.6
        assert q.lon == 77.2
        assert q.city is None

    def test_city(self) -> None:
        q = WeatherQuery(city="Delhi")
        assert q.city == "Delhi"
        assert q.lat is None

    def test_empty_city_rejected(self) -> None:
        with pytest.raises(ValidationError):
            WeatherQuery(city="")

    def test_city_too_long(self) -> None:
        with pytest.raises(ValidationError):
            WeatherQuery(city="x" * 201)


class TestCurrentWeather:
    def test_valid(self) -> None:
        w = CurrentWeather(
            temperature=30.5,
            feels_like=32.0,
            humidity=65,
            pressure=1013,
            wind_speed=5.2,
            wind_deg=180,
            visibility=10000,
            clouds=20,
            conditions=[
                WeatherCondition(
                    main="Clear",
                    description="clear sky",
                    icon="01d",
                )
            ],
            dt="2025-01-01T12:00:00Z",
            city="Delhi",
            country="IN",
            coordinates=Coordinates(latitude=28.6, longitude=77.2),
        )
        assert w.temperature == 30.5
        assert w.city == "Delhi"


class TestDailyForecast:
    def test_valid(self) -> None:
        f = DailyForecast(
            date="2025-01-01",
            temp_min=15.0,
            temp_max=25.0,
            humidity=50,
            wind_speed=3.0,
            conditions=[
                WeatherCondition(
                    main="Clouds",
                    description="scattered clouds",
                    icon="03d",
                )
            ],
            pop=0.3,
            summary="Scattered clouds, 15-25\u00b0C",
        )
        assert f.pop == 0.3
        assert f.temp_max == 25.0


class TestFarmingAdvice:
    def test_valid(self) -> None:
        a = FarmingAdvice(
            category="heat",
            title="High Temperature",
            message="Increase irrigation",
            severity="warning",
        )
        assert a.severity == "warning"

    def test_invalid_severity(self) -> None:
        with pytest.raises(ValidationError):
            FarmingAdvice(
                category="heat",
                title="High",
                message="msg",
                severity="critical",
            )
