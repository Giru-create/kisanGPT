"""Pydantic schemas for Government Schemes API."""

from __future__ import annotations

from pydantic import BaseModel, Field


class Scheme(BaseModel):
    """A government scheme or subsidy."""

    id: str = Field(..., description="Unique scheme identifier.")
    title: str = Field(..., description="Scheme name.")
    category: str = Field(..., description="Category (Direct Benefit, Insurance, Irrigation, etc.).")
    description: str = Field(default="", description="Full description of the scheme.")
    eligibility: str = Field(default="", description="Who is eligible.")
    benefits: str = Field(default="", description="What the farmer receives.")
    required_documents: list[str] = Field(default_factory=list, description="Documents needed to apply.")
    application_process: str = Field(default="", description="How to apply.")
    deadline: str | None = Field(default=None, description="Application deadline if any.")
    official_link: str = Field(default="", description="Official application URL.")
    status_badge: str = Field(
        ...,
        pattern=r"^(Eligible|Action Needed|Applied|Approved)$",
        description="Status badge for UI.",
    )
    benefit_amount: str = Field(default="", description="Short benefit summary for card display.")
    summary: str = Field(default="", description="One-line summary for card display.")
    state: str | None = Field(default=None, description="Applicable state, or null for all-India.")
    crop: str | None = Field(default=None, description="Applicable crop, or null for all crops.")
    farmer_category: str | None = Field(
        default=None,
        description="Target farmer category (small, marginal, all).",
    )
    scheme_type: str | None = Field(
        default=None,
        description="Scheme type (subsidy, insurance, income_support, training).",
    )


class SchemeListResponse(BaseModel):
    """Response for scheme listing endpoint."""

    schemes: list[Scheme]
    total_count: int
    page: int
    page_size: int
    generated_at: str


class SchemeDetailResponse(BaseModel):
    """Response for single scheme detail endpoint."""

    scheme: Scheme
    generated_at: str


class SchemeSearchRequest(BaseModel):
    """Query parameters for scheme search."""

    state: str | None = Field(default=None, max_length=100)
    crop: str | None = Field(default=None, max_length=100)
    farmer_category: str | None = Field(default=None, max_length=100)
    scheme_type: str | None = Field(default=None, max_length=100)
    search: str | None = Field(default=None, max_length=200)
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
