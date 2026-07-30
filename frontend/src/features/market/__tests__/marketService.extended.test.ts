// ─────────────────────────────────────────────────────────────────────────────
// marketService.extended.test.ts
// Extended unit tests for marketService including recommendation endpoint
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { marketService } from "../services/marketService";

describe("marketService (extended)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns market recommendation from mock service by default", async () => {
    const response = await marketService.getMarketRecommendation("Wheat");
    expect(response).toBeDefined();
    expect(response.commodity).toBe("Wheat");
    expect(response.recommendation).toBeDefined();
    expect(response.recommendation.type).toBe("sell_now");
    expect(response.recommendation.confidence).toBe(91);
    expect(response.recommendation.headline).toBeTruthy();
    expect(response.recommendation.rationale).toBeTruthy();
  });

  it("returns market overview from mock service", async () => {
    const overview = await marketService.getMarketOverview();
    expect(overview).toBeDefined();
    expect(overview.top_commodities.length).toBeGreaterThan(0);
    expect(overview.generated_at).toBeTruthy();
  });

  it("returns market prices from mock service", async () => {
    const response = await marketService.getMarketPrices("Wheat");
    expect(response).toBeDefined();
    expect(response.commodity).toBe("Wheat");
    expect(response.prices).toBeDefined();
    expect(response.total_count).toBeGreaterThanOrEqual(0);
  });

  it("returns market trend from mock service", async () => {
    const response = await marketService.getMarketTrend("Wheat", 30);
    expect(response).toBeDefined();
    expect(response.commodity).toBe("Wheat");
    expect(response.trend).toBeDefined();
    expect(response.trend.prices.length).toBe(30);
  });

  it("returns market history from mock service", async () => {
    const response = await marketService.getMarketHistory(
      "Wheat",
      "Karnal Mandi",
    );
    expect(response).toBeDefined();
    expect(response.commodity).toBe("Wheat");
    expect(response.mandi).toBe("Karnal Mandi");
    expect(response.history).toBeDefined();
  });

  it("returns market advice from mock service", async () => {
    const response = await marketService.getMarketAdvice("Wheat");
    expect(response).toBeDefined();
    expect(response.commodity).toBe("Wheat");
    expect(response.advice).toBeDefined();
  });

  it("creates market alert from mock service", async () => {
    const alert = await marketService.createMarketAlert({
      commodity: "Wheat",
      target_price: 2300,
      condition: "above",
      channels: ["sms"],
    });
    expect(alert).toBeDefined();
    expect(alert.commodity).toBe("Wheat");
    expect(alert.target_price).toBe(2300);
    expect(alert.condition).toBe("above");
    expect(alert.is_active).toBe(true);
  });

  it("returns empty alerts from mock service", async () => {
    const alerts = await marketService.getMarketAlerts();
    expect(alerts).toBeDefined();
    expect(Array.isArray(alerts)).toBe(true);
  });

  it("deletes alert from mock service", async () => {
    const result = await marketService.deleteMarketAlert("alert-123");
    expect(result).toBeDefined();
    expect(result.detail).toBe("Alert deleted");
  });
});
