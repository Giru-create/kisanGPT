// ─────────────────────────────────────────────────────────────────────────────
// useWeather.test.ts
// Unit tests for useWeather hook utilities
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import {
  celsiusToFahrenheit,
  convertTemp,
  unitSymbol,
  relativeTime,
} from "../hooks/useWeather";

describe("celsiusToFahrenheit", () => {
  it("converts 0°C to 32°F", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  it("converts 100°C to 212°F", () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it("converts 30°C to 86°F", () => {
    expect(celsiusToFahrenheit(30)).toBe(86);
  });

  it("converts negative temperatures", () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  it("rounds to nearest integer", () => {
    expect(celsiusToFahrenheit(37.5)).toBe(100);
  });
});

describe("convertTemp", () => {
  it("returns celsius when unit is celsius", () => {
    expect(convertTemp(30, "celsius")).toBe(30);
  });

  it("returns fahrenheit when unit is fahrenheit", () => {
    expect(convertTemp(30, "fahrenheit")).toBe(86);
  });
});

describe("unitSymbol", () => {
  it("returns °C for celsius", () => {
    expect(unitSymbol("celsius")).toBe("°C");
  });

  it("returns °F for fahrenheit", () => {
    expect(unitSymbol("fahrenheit")).toBe("°F");
  });
});

describe("relativeTime", () => {
  it("returns 'Just now' for recent timestamps", () => {
    const now = new Date();
    expect(relativeTime(now)).toBe("Just now");
  });

  it("returns minutes ago for timestamps within the hour", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(relativeTime(fiveMinAgo)).toBe("5 min ago");
  });

  it("returns hours ago for timestamps within the day", () => {
    const twoHrAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(relativeTime(twoHrAgo)).toBe("2 hr ago");
  });

  it("returns date for older timestamps", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = relativeTime(threeDaysAgo);
    expect(result).toMatch(/\d+ \w+/);
  });
});
