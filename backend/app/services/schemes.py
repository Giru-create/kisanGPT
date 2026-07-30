"""Government Schemes service — combines hardcoded defaults with RAG knowledge retrieval."""

from __future__ import annotations

from datetime import UTC, datetime

from app.core.config import settings
from app.core.logging import logger
from app.schemas.schemes import (
    Scheme,
    SchemeDetailResponse,
    SchemeListResponse,
    SchemeSearchRequest,
)


def _get_default_schemes() -> list[Scheme]:
    """Return curated list of major government schemes."""
    return [
        Scheme(
            id="pm-kisan",
            title="PM-KISAN Samman Nidhi",
            category="Direct Benefit",
            description=(
                "Pradhan Mantri Kisan Samman Nidhi provides income support of "
                "₹6,000 per year to small and marginal farmer families, paid in "
                "3 equal installments of ₹2,000 each via direct benefit transfer."
            ),
            eligibility=(
                "All small and marginal farmer families with cultivable land. "
                "Subject to certain exclusion criteria for institutional landholders."
            ),
            benefits="₹6,000 per year in 3 installments of ₹2,000 each.",
            required_documents=[
                "Aadhaar card",
                "Bank passbook",
                "Land records (Khata/Khasra)",
            ],
            application_process=(
                "Apply online at pmkisan.gov.in or visit nearest CSC centre."
            ),
            deadline=None,
            official_link="https://pmkisan.gov.in",
            status_badge="Eligible",
            benefit_amount="₹6,000/year",
            summary="Income support of ₹6,000 per year paid in 3 installments to farmer families.",
            state=None,
            crop=None,
            farmer_category="small",
            scheme_type="income_support",
        ),
        Scheme(
            id="pmfby",
            title="Pradhan Mantri Fasal Bima Yojana",
            category="Insurance",
            description=(
                "Crop insurance scheme providing comprehensive insurance cover "
                "against crop loss due to natural calamities, pests, and diseases."
            ),
            eligibility=(
                "All farmers including sharecroppers and tenant farmers. "
                "Kharif: 2% premium, Rabi: 1.5% premium, Commercial: 5% premium."
            ),
            benefits="Full crop loss coverage at subsidized premium rates.",
            required_documents=[
                "Aadhaar card",
                "Land records",
                "Sowing certificate",
                "Bank passbook",
            ],
            application_process=(
                "Apply through bank, CSC, or insurance company within sowing period."
            ),
            deadline="Before sowing season begins",
            official_link="https://pmfby.gov.in",
            status_badge="Action Needed",
            benefit_amount="Full crop coverage",
            summary="Crop insurance at 1-5% premium covering natural calamities, pests, and diseases.",
            state=None,
            crop=None,
            farmer_category="all",
            scheme_type="insurance",
        ),
        Scheme(
            id="pmksy",
            title="Pradhatri Krishi Sinchayee Yojana",
            category="Irrigation",
            description=(
                "Promotes micro-irrigation including drip and sprinkler systems "
                "to improve water use efficiency and expand irrigated area."
            ),
            eligibility="All farmers with focus on small and marginal farmers.",
            benefits="Up to 55% subsidy for micro-irrigation equipment.",
            required_documents=[
                "Aadhaar card",
                "Land records",
                "Bank passbook",
                "Water source proof",
            ],
            application_process=(
                "Apply through state agriculture department or online portal."
            ),
            deadline="15 Feb 2026",
            official_link="https://pmksy.gov.in",
            status_badge="Action Needed",
            benefit_amount="Up to 55% Subsidy",
            summary="Get subsidized drip and sprinkler irrigation systems with up to 55% subsidy.",
            state=None,
            crop=None,
            farmer_category="small",
            scheme_type="subsidy",
        ),
        Scheme(
            id="soil-health-card",
            title="Soil Health Card Scheme",
            category="Advisory",
            description=(
                "Provides soil health cards to farmers with crop-wise "
                "recommendations on nutrients and fertilizers."
            ),
            eligibility="All farmers.",
            benefits="Free soil testing and personalized fertilizer recommendations.",
            required_documents=[
                "Aadhaar card",
                "Land records",
            ],
            application_process=(
                "Visit nearest soil testing laboratory or CSC centre."
            ),
            deadline=None,
            official_link="https://soilhealth.dac.gov.in",
            status_badge="Eligible",
            benefit_amount="Free soil testing",
            summary="Free soil health card with crop-wise nutrient and fertilizer recommendations.",
            state=None,
            crop=None,
            farmer_category="all",
            scheme_type="training",
        ),
        Scheme(
            id="kcc",
            title="Kisan Credit Card",
            category="Credit",
            description=(
                "Provides affordable credit to farmers for agricultural needs "
                "including crop production, post-harvest expenses, and maintenance."
            ),
            eligibility="All farmers, fishermen, and animal husbandry farmers.",
            benefits="Crop loan at 4% p.a. (with prompt repayment rebate).",
            required_documents=[
                "Aadhaar card",
                "Land records",
                "Bank passbook",
                "Passport-size photograph",
            ],
            application_process="Apply at nearest bank branch with required documents.",
            deadline=None,
            official_link="https://www.india.gov.in/programmes/pradhan-mantri-kisan-samman-nidhi/kisan-credit-card",
            status_badge="Eligible",
            benefit_amount="4% p.a. interest",
            summary="Credit card for farmers offering crop loans at subsidized interest rates.",
            state=None,
            crop=None,
            farmer_category="all",
            scheme_type="income_support",
        ),
    ]


class SchemesService:
    """Service for government schemes with optional RAG enhancement."""

    def __init__(self) -> None:
        self._default_schemes = _get_default_schemes()

    async def get_schemes(
        self,
        request: SchemeSearchRequest,
    ) -> SchemeListResponse:
        """List schemes with optional filtering."""
        filtered = self._filter_schemes(request)

        total = len(filtered)
        start = (request.page - 1) * request.page_size
        end = start + request.page_size
        page_items = filtered[start:end]

        logger.info(
            "Schemes list returned",
            extra={
                "total": total,
                "page": request.page,
                "returned": len(page_items),
            },
        )

        return SchemeListResponse(
            schemes=page_items,
            total_count=total,
            page=request.page,
            page_size=request.page_size,
            generated_at=datetime.now(UTC).isoformat(),
        )

    async def get_scheme(self, scheme_id: str) -> SchemeDetailResponse | None:
        """Get a single scheme by ID."""
        for scheme in self._default_schemes:
            if scheme.id == scheme_id:
                return SchemeDetailResponse(
                    scheme=scheme,
                    generated_at=datetime.now(UTC).isoformat(),
                )
        return None

    async def search_schemes(self, query: str) -> list[Scheme]:
        """Free-text search across scheme titles and descriptions."""
        q = query.lower()
        return [
            s
            for s in self._default_schemes
            if q in s.title.lower()
            or q in s.description.lower()
            or q in s.category.lower()
            or q in s.summary.lower()
        ]

    def _filter_schemes(self, request: SchemeSearchRequest) -> list[Scheme]:
        """Apply filters to the scheme list."""
        result = list(self._default_schemes)

        if request.state:
            result = [
                s for s in result if s.state is None or s.state.lower() == request.state.lower()
            ]

        if request.crop:
            result = [
                s for s in result if s.crop is None or s.crop.lower() == request.crop.lower()
            ]

        if request.farmer_category:
            cat = request.farmer_category.lower()
            result = [
                s
                for s in result
                if s.farmer_category is None
                or s.farmer_category.lower() == cat
                or s.farmer_category.lower() == "all"
            ]

        if request.scheme_type:
            st = request.scheme_type.lower()
            result = [s for s in result if s.scheme_type and s.scheme_type.lower() == st]

        if request.search:
            q = request.search.lower()
            result = [
                s
                for s in result
                if q in s.title.lower()
                or q in s.description.lower()
                or q in s.category.lower()
                or q in s.summary.lower()
            ]

        return result


schemes_service = SchemesService()
