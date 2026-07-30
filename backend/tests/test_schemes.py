"""Tests for Government Schemes API endpoints and service."""

from __future__ import annotations

import pytest

from app.schemas.schemes import Scheme, SchemeSearchRequest
from app.services.schemes import SchemesService


class TestSchemesService:
    def setup_method(self) -> None:
        self.service = SchemesService()

    @pytest.mark.asyncio
    async def test_get_schemes_returns_all(self) -> None:
        request = SchemeSearchRequest()
        result = await self.service.get_schemes(request)
        assert result.total_count > 0
        assert len(result.schemes) == result.total_count

    @pytest.mark.asyncio
    async def test_get_schemes_filters_by_crop(self) -> None:
        request = SchemeSearchRequest(crop="Wheat")
        result = await self.service.get_schemes(request)
        for scheme in result.schemes:
            assert scheme.crop is None or scheme.crop.lower() == "wheat"

    @pytest.mark.asyncio
    async def test_get_schemes_filters_by_scheme_type(self) -> None:
        request = SchemeSearchRequest(scheme_type="insurance")
        result = await self.service.get_schemes(request)
        assert result.total_count >= 1
        for scheme in result.schemes:
            assert scheme.scheme_type == "insurance"

    @pytest.mark.asyncio
    async def test_get_schemes_filters_by_search(self) -> None:
        request = SchemeSearchRequest(search="PM-KISAN")
        result = await self.service.get_schemes(request)
        assert result.total_count >= 1
        assert any("pm-kisan" in s.id.lower() for s in result.schemes)

    @pytest.mark.asyncio
    async def test_get_schemes_pagination(self) -> None:
        request = SchemeSearchRequest(page=1, page_size=2)
        result = await self.service.get_schemes(request)
        assert len(result.schemes) <= 2
        assert result.page == 1
        assert result.page_size == 2

    @pytest.mark.asyncio
    async def test_get_scheme_by_id(self) -> None:
        result = await self.service.get_scheme("pm-kisan")
        assert result is not None
        assert result.scheme.id == "pm-kisan"
        assert "PM-KISAN" in result.scheme.title

    @pytest.mark.asyncio
    async def test_get_scheme_not_found(self) -> None:
        result = await self.service.get_scheme("nonexistent")
        assert result is None

    @pytest.mark.asyncio
    async def test_search_schemes(self) -> None:
        results = await self.service.search_schemes("insurance")
        assert len(results) >= 1
        assert any("insurance" in s.category.lower() for s in results)

    @pytest.mark.asyncio
    async def test_search_schemes_no_match(self) -> None:
        results = await self.service.search_schemes("xyznonexistent")
        assert len(results) == 0


class TestSchemeModel:
    def test_valid_scheme(self) -> None:
        s = Scheme(
            id="test-1",
            title="Test Scheme",
            category="Test",
            status_badge="Eligible",
            summary="Test summary",
        )
        assert s.id == "test-1"
        assert s.status_badge == "Eligible"
        assert s.state is None
        assert s.crop is None

    def test_invalid_status_badge(self) -> None:
        with pytest.raises(Exception):
            Scheme(
                id="test-2",
                title="Test",
                category="Test",
                status_badge="Invalid",
                summary="Test",
            )

    def test_scheme_with_all_fields(self) -> None:
        s = Scheme(
            id="test-3",
            title="Full Scheme",
            category="Insurance",
            description="Full description",
            eligibility="All farmers",
            benefits="50% subsidy",
            required_documents=["Aadhaar", "Land records"],
            application_process="Apply online",
            deadline="31 Dec 2026",
            official_link="https://example.com",
            status_badge="Action Needed",
            benefit_amount="50% Subsidy",
            summary="Short summary",
            state="Haryana",
            crop="Wheat",
            farmer_category="small",
            scheme_type="insurance",
        )
        assert s.state == "Haryana"
        assert s.crop == "Wheat"
        assert s.required_documents == ["Aadhaar", "Land records"]
