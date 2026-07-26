from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.dashboard import (
    ActivityItem,
    CropFieldStatus,
    DashboardNotification,
    DashboardResponse,
    EmergencyAlert,
    FarmerProfile,
    GovtSchemeItem,
    MandiPriceItem,
    WeatherSummary,
)


class TestFarmerProfile:
    def test_valid(self) -> None:
        p = FarmerProfile(
            name="Ramesh Singh",
            greeting_prefix="Ram Ram",
            village="Karnal",
            district="Karnal",
            state="Haryana",
            active_crop="Wheat",
            crop_season="Rabi Season 2026",
            farm_size_acres=4.5,
        )
        assert p.name == "Ramesh Singh"
        assert p.farm_size_acres == 4.5


class TestEmergencyAlert:
    def test_valid_warning(self) -> None:
        a = EmergencyAlert(
            id="alert-1",
            severity="warning",
            title="Heatwave Alert",
            message="Temperature high",
            action_advice="Irrigate early",
            issued_at="2026-01-01T00:00:00Z",
        )
        assert a.severity == "warning"
        assert a.dismissible is True

    def test_valid_critical(self) -> None:
        a = EmergencyAlert(
            id="alert-2",
            severity="critical",
            title="Storm Alert",
            message="Heavy rain expected",
            action_advice="Secure livestock",
            issued_at="2026-01-01T00:00:00Z",
            dismissible=False,
        )
        assert a.severity == "critical"
        assert a.dismissible is False

    def test_invalid_severity(self) -> None:
        with pytest.raises(ValidationError):
            EmergencyAlert(
                id="alert-3",
                severity="invalid",
                title="Test",
                message="Test",
                action_advice="Test",
                issued_at="2026-01-01T00:00:00Z",
            )


class TestWeatherSummary:
    def test_valid(self) -> None:
        w = WeatherSummary(
            temperature_c=32,
            feels_like_c=35,
            condition="partly-cloudy",
            humidity=74,
            wind_speed_kmh=12,
            advisory="Safe to spray",
            advisory_safe=True,
        )
        assert w.condition == "partly-cloudy"
        assert w.advisory_safe is True

    def test_humidity_bounds(self) -> None:
        w = WeatherSummary(
            temperature_c=28,
            feels_like_c=30,
            condition="sunny",
            humidity=0,
            wind_speed_kmh=5,
            advisory="Test",
            advisory_safe=True,
        )
        assert w.humidity == 0

        w2 = WeatherSummary(
            temperature_c=28,
            feels_like_c=30,
            condition="sunny",
            humidity=100,
            wind_speed_kmh=5,
            advisory="Test",
            advisory_safe=True,
        )
        assert w2.humidity == 100


class TestCropFieldStatus:
    def test_healthy(self) -> None:
        f = CropFieldStatus(
            id="field-1",
            field_name="Main Field",
            crop_name="Wheat",
            health_percent=94,
            status="healthy",
        )
        assert f.status == "healthy"
        assert f.health_percent == 94

    def test_at_risk(self) -> None:
        f = CropFieldStatus(
            id="field-2",
            field_name="South Field",
            crop_name="Mustard",
            health_percent=78,
            status="at_risk",
            last_scan_result="Aphid signs",
            next_action="Apply neem oil",
        )
        assert f.status == "at_risk"
        assert f.last_scan_result == "Aphid signs"

    def test_invalid_status(self) -> None:
        with pytest.raises(ValidationError):
            CropFieldStatus(
                id="field-3",
                field_name="Test",
                crop_name="Test",
                health_percent=50,
                status="invalid",
            )


class TestMandiPriceItem:
    def test_valid(self) -> None:
        m = MandiPriceItem(
            id="mandi-1",
            commodity="Wheat",
            variety="PBW 550",
            mandi_name="Karnal Mandi",
            price_per_quintal=2275,
            change_amount=45,
            change_percent=2.02,
            is_rise=True,
            msp_difference=25,
            updated_at="2026-01-01T00:00:00Z",
        )
        assert m.commodity == "Wheat"
        assert m.is_rise is True


class TestGovtSchemeItem:
    def test_eligible(self) -> None:
        s = GovtSchemeItem(
            id="scheme-1",
            title="PM-KISAN",
            category="Direct Benefit",
            benefit_amount="₹2,000",
            status_badge="Eligible",
            summary="Income support",
        )
        assert s.status_badge == "Eligible"

    def test_action_needed(self) -> None:
        s = GovtSchemeItem(
            id="scheme-2",
            title="Drip Irrigation",
            category="Irrigation",
            benefit_amount="55% Subsidy",
            status_badge="Action Needed",
            deadline="15 Feb 2026",
            summary="Get subsidized drip irrigation",
        )
        assert s.status_badge == "Action Needed"
        assert s.deadline == "15 Feb 2026"

    def test_invalid_status(self) -> None:
        with pytest.raises(ValidationError):
            GovtSchemeItem(
                id="scheme-3",
                title="Test",
                category="Test",
                benefit_amount="Test",
                status_badge="Invalid",
                summary="Test",
            )


class TestActivityItem:
    def test_valid_scan(self) -> None:
        a = ActivityItem(
            id="act-1",
            type="scan",
            title="Leaf Scan",
            description="No disease detected",
            timestamp="2026-01-01T00:00:00Z",
        )
        assert a.type == "scan"

    def test_valid_chat(self) -> None:
        a = ActivityItem(
            id="act-2",
            type="chat",
            title="AI Chat",
            description="Asked about fertilizer",
            timestamp="2026-01-01T00:00:00Z",
            target_href="/chat",
        )
        assert a.type == "chat"
        assert a.target_href == "/chat"

    def test_invalid_type(self) -> None:
        with pytest.raises(ValidationError):
            ActivityItem(
                id="act-3",
                type="invalid",
                title="Test",
                description="Test",
                timestamp="2026-01-01T00:00:00Z",
            )


class TestDashboardNotification:
    def test_valid_unread(self) -> None:
        n = DashboardNotification(
            id="notif-1",
            category="reminder",
            title="Irrigation",
            message="Field needs water",
            timestamp="2026-01-01T00:00:00Z",
        )
        assert n.read is False

    def test_valid_read(self) -> None:
        n = DashboardNotification(
            id="notif-2",
            category="update",
            title="PM-KISAN",
            message="e-KYC update",
            timestamp="2026-01-01T00:00:00Z",
            read=True,
        )
        assert n.read is True

    def test_invalid_category(self) -> None:
        with pytest.raises(ValidationError):
            DashboardNotification(
                id="notif-3",
                category="invalid",
                title="Test",
                message="Test",
                timestamp="2026-01-01T00:00:00Z",
            )


class TestDashboardResponse:
    def test_valid(self) -> None:
        r = DashboardResponse(
            profile=FarmerProfile(
                name="Test",
                greeting_prefix="Hi",
                village="Village",
                district="District",
                state="State",
                active_crop="Wheat",
                crop_season="Rabi",
                farm_size_acres=2.0,
            ),
            weather_summary=WeatherSummary(
                temperature_c=30,
                feels_like_c=32,
                condition="sunny",
                humidity=50,
                wind_speed_kmh=10,
                advisory="Safe",
                advisory_safe=True,
            ),
            crop_fields=[],
            mandi_prices=[],
            schemes=[],
            recent_activities=[],
            notifications=[],
        )
        assert r.profile.name == "Test"
        assert r.emergency_alert is None

    def test_with_emergency(self) -> None:
        r = DashboardResponse(
            profile=FarmerProfile(
                name="Test",
                greeting_prefix="Hi",
                village="Village",
                district="District",
                state="State",
                active_crop="Wheat",
                crop_season="Rabi",
                farm_size_acres=2.0,
            ),
            emergency_alert=EmergencyAlert(
                id="alert-1",
                severity="warning",
                title="Heatwave",
                message="High temp",
                action_advice="Irrigate",
                issued_at="2026-01-01T00:00:00Z",
            ),
            weather_summary=WeatherSummary(
                temperature_c=42,
                feels_like_c=45,
                condition="heatwave",
                humidity=30,
                wind_speed_kmh=5,
                advisory="Avoid spraying",
                advisory_safe=False,
            ),
            crop_fields=[],
            mandi_prices=[],
            schemes=[],
            recent_activities=[],
            notifications=[],
        )
        assert r.emergency_alert is not None
        assert r.emergency_alert.severity == "warning"
