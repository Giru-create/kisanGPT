// ─────────────────────────────────────────────────────────────────────────────
// schemesStore.test.ts
// Unit tests for government schemes Zustand store
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach } from "vitest";
import { useSchemesStore } from "../store/schemesStore";
import type { Scheme } from "../types/schemes.types";

const mockScheme: Scheme = {
  id: "pm-kisan",
  title: "PM-KISAN Samman Nidhi",
  category: "Direct Benefit",
  description: "Income support scheme",
  eligibility: "All small farmers",
  benefits: "₹6,000/year",
  requiredDocuments: ["Aadhaar"],
  applicationProcess: "Apply online",
  deadline: null,
  officialLink: "https://pmkisan.gov.in",
  statusBadge: "Eligible",
  benefitAmount: "₹6,000/year",
  summary: "Income support",
  state: null,
  crop: null,
  farmerCategory: "small",
  schemeType: "income_support",
};

describe("schemesStore", () => {
  beforeEach(() => {
    useSchemesStore.setState({
      filters: {
        state: null,
        crop: null,
        farmerCategory: null,
        schemeType: null,
        search: "",
        page: 1,
        pageSize: 20,
      },
      selectedScheme: null,
      isDetailOpen: false,
    });
  });

  it("has correct initial state", () => {
    const state = useSchemesStore.getState();
    expect(state.filters.state).toBeNull();
    expect(state.filters.crop).toBeNull();
    expect(state.filters.search).toBe("");
    expect(state.filters.page).toBe(1);
    expect(state.selectedScheme).toBeNull();
    expect(state.isDetailOpen).toBe(false);
  });

  it("setState updates state filter and resets page", () => {
    useSchemesStore.getState().setPage(3);
    useSchemesStore.getState().setState("Haryana");
    const state = useSchemesStore.getState();
    expect(state.filters.state).toBe("Haryana");
    expect(state.filters.page).toBe(1);
  });

  it("setCrop updates crop filter", () => {
    useSchemesStore.getState().setCrop("Wheat");
    expect(useSchemesStore.getState().filters.crop).toBe("Wheat");
  });

  it("setFarmerCategory updates farmer category filter", () => {
    useSchemesStore.getState().setFarmerCategory("small");
    expect(useSchemesStore.getState().filters.farmerCategory).toBe("small");
  });

  it("setSchemeType updates scheme type filter", () => {
    useSchemesStore.getState().setSchemeType("insurance");
    expect(useSchemesStore.getState().filters.schemeType).toBe("insurance");
  });

  it("setSearch updates search and resets page", () => {
    useSchemesStore.getState().setPage(5);
    useSchemesStore.getState().setSearch("PM-KISAN");
    const state = useSchemesStore.getState();
    expect(state.filters.search).toBe("PM-KISAN");
    expect(state.filters.page).toBe(1);
  });

  it("setPage updates page", () => {
    useSchemesStore.getState().setPage(3);
    expect(useSchemesStore.getState().filters.page).toBe(3);
  });

  it("resetFilters clears all filters", () => {
    useSchemesStore.getState().setState("Haryana");
    useSchemesStore.getState().setCrop("Wheat");
    useSchemesStore.getState().setSearch("test");
    useSchemesStore.getState().resetFilters();
    const state = useSchemesStore.getState();
    expect(state.filters.state).toBeNull();
    expect(state.filters.crop).toBeNull();
    expect(state.filters.search).toBe("");
    expect(state.filters.page).toBe(1);
  });

  it("openDetail sets selected scheme and opens panel", () => {
    useSchemesStore.getState().openDetail(mockScheme);
    const state = useSchemesStore.getState();
    expect(state.selectedScheme).toEqual(mockScheme);
    expect(state.isDetailOpen).toBe(true);
  });

  it("closeDetail clears selected scheme and closes panel", () => {
    useSchemesStore.getState().openDetail(mockScheme);
    useSchemesStore.getState().closeDetail();
    const state = useSchemesStore.getState();
    expect(state.selectedScheme).toBeNull();
    expect(state.isDetailOpen).toBe(false);
  });

  it("reset clears all state", () => {
    useSchemesStore.getState().setState("Haryana");
    useSchemesStore.getState().openDetail(mockScheme);
    useSchemesStore.getState().reset();
    const state = useSchemesStore.getState();
    expect(state.filters.state).toBeNull();
    expect(state.selectedScheme).toBeNull();
    expect(state.isDetailOpen).toBe(false);
  });
});
