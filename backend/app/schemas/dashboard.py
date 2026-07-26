from __future__ import annotations

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Farmer Profile
# ---------------------------------------------------------------------------


class FarmerProfile(BaseModel):
    name: str
    greeting_prefix: str = Field(..., alias="greetingPrefix")
    village: str
    district: str
    state: str
    active_crop: str = Field(..., alias="activeCrop")
    crop_season: str = Field(..., alias="cropSeason")
    farm_size_acres: float = Field(..., alias="farmSizeAcres")

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# Emergency Alert
# ---------------------------------------------------------------------------


class EmergencyAlert(BaseModel):
    id: str
    severity: str = Field(..., pattern=r"^(warning|critical)$")
    title: str
    message: str
    action_advice: str = Field(..., alias="actionAdvice")
    issued_at: str = Field(..., alias="issuedAt")
    dismissible: bool = True

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# Weather Summary (for dashboard)
# ---------------------------------------------------------------------------


class WeatherSummary(BaseModel):
    temperature_c: float = Field(..., alias="temperatureC")
    feels_like_c: float = Field(..., alias="feelsLikeC")
    condition: str = Field(
        ...,
        pattern=r"^(sunny|partly-cloudy|cloudy|rain|heavy-rain|thunderstorm|fog|snow|windy|heatwave)$",
    )
    humidity: int = Field(..., ge=0, le=100)
    wind_speed_kmh: float = Field(..., alias="windSpeedKmh", ge=0)
    advisory: str
    advisory_safe: bool = Field(..., alias="advisorySafe")

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# Crop Field Status
# ---------------------------------------------------------------------------


class CropFieldStatus(BaseModel):
    id: str
    field_name: str = Field(..., alias="fieldName")
    crop_name: str = Field(..., alias="cropName")
    health_percent: int = Field(..., alias="healthPercent", ge=0, le=100)
    status: str = Field(..., pattern=r"^(healthy|at_risk|action_required)$")
    last_scan_result: str | None = Field(None, alias="lastScanResult")
    last_scan_date: str | None = Field(None, alias="lastScanDate")
    next_action: str | None = Field(None, alias="nextAction")

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# Mandi Price Item (for dashboard)
# ---------------------------------------------------------------------------


class MandiPriceItem(BaseModel):
    id: str
    commodity: str
    variety: str
    mandi_name: str = Field(..., alias="mandiName")
    price_per_quintal: float = Field(..., alias="pricePerQuintal")
    change_amount: float = Field(..., alias="changeAmount")
    change_percent: float = Field(..., alias="changePercent")
    is_rise: bool = Field(..., alias="isRise")
    msp_difference: float = Field(..., alias="mspDifference")
    updated_at: str = Field(..., alias="updatedAt")

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# Government Scheme
# ---------------------------------------------------------------------------


class GovtSchemeItem(BaseModel):
    id: str
    title: str
    category: str
    benefit_amount: str = Field(..., alias="benefitAmount")
    status_badge: str = Field(
        ..., alias="statusBadge", pattern=r"^(Eligible|Action Needed|Applied|Approved)$"
    )
    deadline: str | None = None
    summary: str

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# Recent Activity
# ---------------------------------------------------------------------------


class ActivityItem(BaseModel):
    id: str
    type: str = Field(..., pattern=r"^(scan|chat|mandi|scheme|irrigation)$")
    title: str
    description: str
    timestamp: str
    target_href: str | None = Field(None, alias="targetHref")

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# Dashboard Notification
# ---------------------------------------------------------------------------


class DashboardNotification(BaseModel):
    id: str
    category: str = Field(..., pattern=r"^(reminder|alert|update)$")
    title: str
    message: str
    timestamp: str
    read: bool = False


# ---------------------------------------------------------------------------
# Aggregated Dashboard Response
# ---------------------------------------------------------------------------


class DashboardResponse(BaseModel):
    profile: FarmerProfile
    emergency_alert: EmergencyAlert | None = Field(None, alias="emergencyAlert")
    weather_summary: WeatherSummary = Field(..., alias="weatherSummary")
    crop_fields: list[CropFieldStatus] = Field(..., alias="cropFields")
    mandi_prices: list[MandiPriceItem] = Field(..., alias="mandiPrices")
    schemes: list[GovtSchemeItem]
    recent_activities: list[ActivityItem] = Field(..., alias="recentActivities")
    notifications: list[DashboardNotification]

    model_config = {"populate_by_name": True}
