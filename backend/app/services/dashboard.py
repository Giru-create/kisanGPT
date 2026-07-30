from __future__ import annotations

from datetime import UTC, datetime

from app.core.logging import logger
from app.schemas.dashboard import (
    ActivityItem,
    AIAdvisorChat,
    CropFieldStatus,
    CropHealthItem,
    DashboardNotification,
    DashboardResponse,
    EmergencyAlert,
    FarmerProfile,
    GovtSchemeItem,
    MandiPriceItem,
    MarketTrendItem,
    PriorityAlert,
    WeatherSummary,
)
from app.schemas.weather import WeatherQuery
from app.services.market import market_service
from app.services.weather import weather_service


class DashboardService:
    """Aggregates data from multiple services for the farmer dashboard."""

    async def get_dashboard(
        self,
        lat: float | None = None,
        lon: float | None = None,
        city: str | None = None,
    ) -> dict[str, object]:
        logger.info(
            "Fetching dashboard data",
            extra={"lat": lat, "lon": lon, "city": city},
        )

        profile = _get_default_profile()
        weather_summary = await self._get_weather_summary(lat, lon, city)
        mandi_prices = await self._get_mandi_prices()
        crop_fields = _get_default_crop_fields()
        crop_health_cards = _get_default_crop_health_cards()
        market_trends = _get_default_market_trends(mandi_prices)
        ai_advisor_chats = _get_default_ai_advisor_chats()
        priority_alerts = _get_default_priority_alerts(weather_summary)
        schemes = _get_default_schemes()
        activities = _get_default_activities()
        notifications = _get_default_notifications()
        emergency = _get_emergency_alert(weather_summary)

        result = DashboardResponse(
            profile=profile,
            emergency_alert=emergency,
            weather_summary=weather_summary,
            crop_fields=crop_fields,
            crop_health_cards=crop_health_cards,
            mandi_prices=mandi_prices,
            market_trends=market_trends,
            ai_advisor_chats=ai_advisor_chats,
            priority_alerts=priority_alerts,
            schemes=schemes,
            recent_activities=activities,
            notifications=notifications,
        ).model_dump(mode="json", by_alias=True)

        logger.info("Dashboard data aggregated successfully")
        return result

    async def _get_weather_summary(
        self,
        lat: float | None,
        lon: float | None,
        city: str | None,
    ) -> WeatherSummary:
        try:
            query = _build_weather_query(lat, lon, city)
            weather_data = await weather_service.get_current(query)

            temp = float(weather_data.get("temperature", 28))
            feels_like = float(weather_data.get("feels_like", temp))
            humidity = int(weather_data.get("humidity", 50))
            wind_speed = float(weather_data.get("wind_speed", 10))

            conditions = weather_data.get("conditions", [])
            condition_str = "partly-cloudy"
            if conditions and isinstance(conditions, list):
                first = conditions[0]
                if isinstance(first, dict):
                    desc = str(first.get("description", "")).lower()
                    condition_str = _map_weather_condition(desc)

            advisory, advisory_safe = _get_spray_advisory(
                temp, humidity, wind_speed, condition_str
            )

            return WeatherSummary(
                temperature_c=temp,
                feels_like_c=feels_like,
                condition=condition_str,
                humidity=humidity,
                wind_speed_kmh=wind_speed,
                advisory=advisory,
                advisory_safe=advisory_safe,
            )
        except Exception:
            logger.exception("Failed to fetch weather for dashboard")
            return _get_default_weather_summary()

    async def _get_mandi_prices(self) -> list[MandiPriceItem]:
        try:
            overview = await market_service.get_overview()
            top_commodities = overview.get("top_commodities", [])

            prices = []
            for i, c in enumerate(top_commodities):
                if not isinstance(c, dict):
                    continue
                prices.append(
                    MandiPriceItem(
                        id=f"mandi-{i}",
                        commodity=str(c.get("commodity", "")),
                        variety=str(c.get("variety", "")),
                        mandi_name=str(c.get("mandi_name", "")),
                        price_per_quintal=float(c.get("price_per_quintal", 0)),
                        change_amount=float(c.get("change_amount", 0)),
                        change_percent=float(c.get("change_percent", 0)),
                        is_rise=bool(c.get("is_rise", True)),
                        msp_difference=float(c.get("msp_difference", 0)),
                        updated_at=str(c.get("updated_at", "")),
                    )
                )
            return prices
        except Exception:
            logger.exception("Failed to fetch mandi prices for dashboard")
            return []


def _build_weather_query(
    lat: float | None, lon: float | None, city: str | None
) -> WeatherQuery:
    if lat is not None and lon is not None:
        return WeatherQuery(latitude=lat, longitude=lon)
    if city:
        return WeatherQuery(city=city)
    return WeatherQuery(latitude=29.15, longitude=76.50)


def _map_weather_condition(desc: str) -> str:
    desc_lower = desc.lower()
    if "thunder" in desc_lower:
        return "thunderstorm"
    if "heavy rain" in desc_lower or "very heavy" in desc_lower:
        return "heavy-rain"
    if "rain" in desc_lower or "drizzle" in desc_lower:
        return "rain"
    if "snow" in desc_lower:
        return "snow"
    if "fog" in desc_lower or "mist" in desc_lower:
        return "fog"
    if "overcast" in desc_lower:
        return "cloudy"
    if "cloud" in desc_lower:
        return "partly-cloudy"
    if "clear" in desc_lower:
        return "sunny"
    if "wind" in desc_lower:
        return "windy"
    return "partly-cloudy"


def _get_spray_advisory(
    temp: float, humidity: int, wind_speed: float, condition: str
) -> tuple[str, bool]:
    if condition in ("rain", "heavy-rain", "thunderstorm"):
        return ("Avoid spraying — rain will wash away pesticides.", False)
    if wind_speed > 20:
        return ("Avoid spraying — high wind causes drift.", False)
    if temp > 40:
        return ("Avoid spraying — extreme heat reduces effectiveness.", False)
    if humidity > 85:
        return (
            "High humidity — spray early morning for best results.",
            True,
        )
    if temp < 10:
        return ("Low temperature — pesticides work slowly.", True)
    return ("Safe to spray. Ideal conditions for pesticide application.", True)


def _get_emergency_alert(
    weather: WeatherSummary,
) -> EmergencyAlert | None:
    if weather.condition == "heatwave" or weather.temperature_c >= 42:
        return EmergencyAlert(
            id="emergency-heatwave",
            severity="critical",
            title="Heatwave Alert",
            message=(
                f"Temperature expected to reach {weather.temperature_c:.0f}C. "
                "Avoid field work during peak hours."
            ),
            action_advice=(
                "Irrigate fields early morning. Provide shade for livestock."
            ),
            issued_at=datetime.now(UTC).isoformat(),
            dismissible=True,
        )
    if weather.condition in ("heavy-rain", "thunderstorm"):
        return EmergencyAlert(
            id="emergency-storm",
            severity="warning",
            title="Heavy Rain Alert",
            message="Heavy rainfall expected. Secure equipment and livestock.",
            action_advice="Drain field water. Avoid chemical spraying.",
            issued_at=datetime.now(UTC).isoformat(),
            dismissible=True,
        )
    return None


def _get_default_profile() -> FarmerProfile:
    return FarmerProfile(
        name="Ramesh Singh",
        greeting_prefix="Ram Ram",
        village="Karnal",
        district="Karnal",
        state="Haryana",
        active_crop="Wheat",
        crop_season="Rabi Season 2026",
        farm_size_acres=4.5,
    )


def _get_default_weather_summary() -> WeatherSummary:
    return WeatherSummary(
        temperature_c=32,
        feels_like_c=35,
        condition="partly-cloudy",
        humidity=74,
        wind_speed_kmh=12,
        advisory="Safe to spray. Ideal conditions for pesticide application.",
        advisory_safe=True,
    )


def _get_default_crop_fields() -> list[CropFieldStatus]:
    return [
        CropFieldStatus(
            id="field-1",
            field_name="Main Field (North)",
            crop_name="Wheat",
            health_percent=94,
            status="healthy",
            last_scan_result="No disease detected",
            last_scan_date=datetime.now(UTC).isoformat(),
            next_action="Next scan in 3 days",
        ),
        CropFieldStatus(
            id="field-2",
            field_name="Secondary Field (South)",
            crop_name="Mustard",
            health_percent=78,
            status="at_risk",
            last_scan_result="Early signs of aphid infestation",
            last_scan_date=datetime.now(UTC).isoformat(),
            next_action="Apply neem oil spray within 24 hours",
        ),
    ]


def _get_default_schemes() -> list[GovtSchemeItem]:
    return [
        GovtSchemeItem(
            id="scheme-1",
            title="PM-KISAN 17th Installment",
            category="Direct Benefit",
            benefit_amount="₹2,000 Direct Transfer",
            status_badge="Eligible",
            deadline="30 Jan 2026",
            summary=(
                "Income support of ₹6,000 per year paid in 3 installments "
                "to small and marginal farmer families."
            ),
        ),
        GovtSchemeItem(
            id="scheme-2",
            title="Subsidized Drip Irrigation",
            category="Irrigation",
            benefit_amount="Up to 55% Subsidy",
            status_badge="Action Needed",
            deadline="15 Feb 2026",
            summary=(
                "Get subsidized drip irrigation systems under "
                "Pradhatri Krishi Sinchayee Yojana."
            ),
        ),
    ]


def _get_default_activities() -> list[ActivityItem]:
    now = datetime.now(UTC)
    return [
        ActivityItem(
            id="activity-1",
            type="scan",
            title="Leaf Scan Completed",
            description="Wheat field scanned — no disease detected",
            timestamp=now.isoformat(),
            target_href="/disease",
        ),
        ActivityItem(
            id="activity-2",
            type="chat",
            title="AI Chat — Urea Dosage",
            description="Asked about urea application for wheat",
            timestamp=now.isoformat(),
            target_href="/chat",
        ),
        ActivityItem(
            id="activity-3",
            type="mandi",
            title="Mandi Rates Checked",
            description="Wheat price at Karnal APMC: ₹2,275/qtl",
            timestamp=now.isoformat(),
            target_href="/market",
        ),
    ]


def _get_default_notifications() -> list[DashboardNotification]:
    now = datetime.now(UTC)
    return [
        DashboardNotification(
            id="notif-1",
            category="reminder",
            title="Irrigation Reminder",
            message="Secondary field needs irrigation — soil moisture low",
            timestamp=now.isoformat(),
            read=False,
        ),
        DashboardNotification(
            id="notif-2",
            category="alert",
            title="Weather Update",
            message="Humidity above 80% — spray advisory active",
            timestamp=now.isoformat(),
            read=False,
        ),
        DashboardNotification(
            id="notif-3",
            category="update",
            title="PM-KISAN e-KYC Update",
            message="Complete your e-KYC for 17th installment",
            timestamp=now.isoformat(),
            read=True,
        ),
    ]


def _get_default_crop_health_cards() -> list[CropHealthItem]:
    return [
        CropHealthItem(
            id="crop-1",
            crop_name="Wheat",
            block_name="Block A",
            days_since_sown=15,
            status="healthy",
            moisture_percent=78,
        ),
        CropHealthItem(
            id="crop-2",
            crop_name="Cotton",
            block_name="Block B",
            days_since_sown=42,
            status="alert",
            moisture_percent=45,
            alert_message="Pest Alert: Pink Bollworm detected via satellite infra.",
            recommendation="Recommended: Organic pesticide application.",
        ),
    ]


def _get_default_market_trends(
    mandi_prices: list[MandiPriceItem],
) -> list[MarketTrendItem]:
    if mandi_prices:
        return [
            MarketTrendItem(
                id=f"trend-{i}",
                commodity=p.commodity,
                price=f"₹{p.price_per_quintal:,.0f}",
                change_percent=p.change_percent,
                is_rise=p.is_rise,
            )
            for i, p in enumerate(mandi_prices[:5], start=1)
        ]
    return [
        MarketTrendItem(
            id="trend-1",
            commodity="Wheat (Dara)",
            price="₹2,450",
            change_percent=2.4,
            is_rise=True,
        ),
        MarketTrendItem(
            id="trend-2",
            commodity="Basmati Rice",
            price="₹4,200",
            change_percent=-0.8,
            is_rise=False,
        ),
        MarketTrendItem(
            id="trend-3",
            commodity="Cotton (Long Staple)",
            price="₹7,820",
            change_percent=1.2,
            is_rise=True,
        ),
    ]


def _get_default_ai_advisor_chats() -> list[AIAdvisorChat]:
    return [
        AIAdvisorChat(
            id="chat-1",
            title="Optimizing Drip Irrigation",
            description=(
                "Calculated water requirement for Block C based on ET0 values..."
            ),
            timestamp="2 Hours Ago",
            icon_type="water",
        ),
        AIAdvisorChat(
            id="chat-2",
            title="Pest Identification: Aphids",
            description=(
                "Visual scan confirmed stage 1 infestation. Recommended Neem oil..."
            ),
            timestamp="Yesterday",
            icon_type="pest",
        ),
    ]


def _get_default_priority_alerts(
    weather: WeatherSummary,
) -> list[PriorityAlert]:
    alerts: list[PriorityAlert] = []
    if weather.temperature_c < 10:
        alerts.append(
            PriorityAlert(
                id="priority-frost",
                title="Frost Warning",
                description=(
                    f"Temperatures expected to drop below "
                    f"{weather.temperature_c:.0f}°C in 48 hours."
                ),
                type="frost",
                border_color="border-red-500",
            )
        )
    alerts.append(
        PriorityAlert(
            id="priority-2",
            title="New Subsidy: PM-Kisan Update",
            description=(
                "New solar pump subsidy application window open for your district."
            ),
            type="subsidy",
            border_color="border-emerald-500",
        )
    )
    return alerts


dashboard_service = DashboardService()
