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
