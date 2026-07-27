from __future__ import annotations

from pydantic import BaseModel, Field


class CommodityPrice(BaseModel):
    commodity: str
    variety: str
    mandi_name: str
    district: str
    state: str
    price_per_quintal: float = Field(..., gt=0)
    change_amount: float = Field(default=0)
    change_percent: float = Field(default=0)
    is_rise: bool = Field(default=True)
    msp: float = Field(default=0, description="Minimum Support Price per quintal")
    msp_difference: float = Field(
        default=0, description="Difference from MSP (positive = above MSP)"
    )
    updated_at: str


class PriceTrend(BaseModel):
    commodity: str
    dates: list[str]
    prices: list[float]
    trend_direction: str = Field(..., pattern=r"^(rising|falling|stable|volatile)$")
    avg_price: float
    min_price: float
    max_price: float
    price_range: float


class MarketPriceResponse(BaseModel):
    commodity: str
    prices: list[CommodityPrice]
    total_count: int
    generated_at: str


class MarketTrendResponse(BaseModel):
    commodity: str
    trend: PriceTrend


class PriceAlert(BaseModel):
    id: str
    commodity: str
    target_price: float
    condition: str = Field(..., pattern=r"^(above|below)$")
    is_active: bool = True
    created_at: str
    triggered_at: str | None = None


class PriceAlertCreate(BaseModel):
    commodity: str = Field(..., min_length=1, max_length=100)
    target_price: float = Field(..., gt=0)
    condition: str = Field(..., pattern=r"^(above|below)$")


class PriceAlertResponse(BaseModel):
    alerts: list[PriceAlert]
    total_count: int


class MarketOverview(BaseModel):
    top_commodities: list[CommodityPrice]
    rising: list[CommodityPrice]
    falling: list[CommodityPrice]
    generated_at: str


class PriceHistoryItem(BaseModel):
    date: str
    price: float
    mandi_name: str


class MarketHistoryResponse(BaseModel):
    commodity: str
    mandi: str
    history: list[PriceHistoryItem]
    total_count: int


class MarketAdvice(BaseModel):
    category: str
    title: str
    message: str
    severity: str = Field(..., pattern=r"^(info|warning|danger)$")


class MarketAdviceResponse(BaseModel):
    commodity: str
    current_price: float
    msp: float
    trend: str
    advice: list[MarketAdvice]
    generated_at: str


# ---------------------------------------------------------------------------
# Forecast (7-day price prediction)
# ---------------------------------------------------------------------------


class ForecastPoint(BaseModel):
    date: str
    predicted_price: float
    confidence_low: float
    confidence_high: float
    factors: list[str]


class MarketForecast(BaseModel):
    commodity: str
    current_price: float
    msp: float
    forecast: list[ForecastPoint]
    summary: str
    generated_at: str


class MarketForecastResponse(BaseModel):
    commodity: str
    current_price: float
    msp: float
    forecast: list[ForecastPoint]
    summary: str
    generated_at: str


# ---------------------------------------------------------------------------
# AI Market Recommendation
# ---------------------------------------------------------------------------


class Recommendation(BaseModel):
    type: str = Field(..., pattern=r"^(sell_now|hold|wait|switch_mandi)$")
    commodity: str
    confidence: int = Field(..., ge=0, le=100)
    headline: str
    rationale: str
    potential_gain: float
    risk_level: str = Field(..., pattern=r"^(low|medium|high)$")
    suggested_action: str
    generated_at: str


class MarketRecommendationResponse(BaseModel):
    commodity: str
    current_price: float
    msp: float
    recommendation: Recommendation
    generated_at: str


# ---------------------------------------------------------------------------
# Aggregated Market Response
# ---------------------------------------------------------------------------


class MarketResponse(BaseModel):
    overview: MarketOverview
    forecast: MarketForecast | None = None
    recommendation: Recommendation | None = None
    generated_at: str
