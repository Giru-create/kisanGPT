// ─────────────────────────────────────────────────────────────────────────────
// weatherMock.ts
// KisanGPT — Weather Intelligence Mock Service
// Provides fallback data when backend endpoints are unavailable
// ─────────────────────────────────────────────────────────────────────────────

import { MOCK_WEATHER_DATA } from "../constants/weather.constants";
import type { WeatherData } from "../types/weather.types";

const mockDelay = (ms: number = 1800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const weatherMockService = {
  getWeatherData: async (): Promise<WeatherData> => {
    await mockDelay(1800);
    return MOCK_WEATHER_DATA;
  },
};
