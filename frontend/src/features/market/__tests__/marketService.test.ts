// ─────────────────────────────────────────────────────────────────────────────
// marketService.test.ts
// Unit tests for marketService & marketApi abstraction
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from "vitest";
import { marketService } from "../services/marketService";

describe("marketService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns market overview from mock service by default", async () => {
    const overview = await marketService.getMarketOverview();
    expect(overview).toBeDefined();
    expect(overview.top_commodities.length).toBeGreaterThan(0);
    expect(overview.top_commodities[0]?.commodity).toBe("Wheat");
  });

  it("returns commodity prices for selected commodity", async () => {
    const response = await marketService.getMarketPrices("Mustard");
    expect(response).toBeDefined();
    expect(response.commodity).toBe("Mustard");
  });

  it("returns price trend for selected commodity", async () => {
    const trendResp = await marketService.getMarketTrend("Wheat", 30);
    expect(trendResp).toBeDefined();
    expect(trendResp.commodity).toBe("Wheat");
    expect(trendResp.trend.prices.length).toBe(30);
  });

  it("returns price history for mandi and commodity", async () => {
    const history = await marketService.getMarketHistory(
      "Wheat",
      "Karnal Mandi",
    );
    expect(history).toBeDefined();
    expect(history.commodity).toBe("Wheat");
    expect(history.mandi).toBe("Karnal Mandi");
  });

  it("creates a price alert draft", async () => {
    const alert = await marketService.createMarketAlert({
      commodity: "Wheat",
      target_price: 2300,
      condition: "above",
      channels: ["sms", "whatsapp"],
    });
    expect(alert).toBeDefined();
    expect(alert.commodity).toBe("Wheat");
    expect(alert.target_price).toBe(2300);
  });
});
