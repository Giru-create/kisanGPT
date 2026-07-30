// ─────────────────────────────────────────────────────────────────────────────
// marketStore.test.ts
// Unit tests for market Zustand store
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach } from "vitest";
import { useMarketStore } from "../store/marketStore";
import type { Mandi } from "../types/market.types";

const mockMandi: Mandi = {
  name: "Delhi Mandi",
  district: "New Delhi",
  state: "Delhi",
};

describe("marketStore", () => {
  beforeEach(() => {
    useMarketStore.setState({
      selectedCommodity: "Wheat",
      selectedMandi: {
        name: "Karnal Mandi",
        district: "Karnal",
        state: "Haryana",
      },
      isAlertDialogOpen: false,
      alertDialogCommodity: "Wheat",
    });
  });

  it("has correct initial state", () => {
    const state = useMarketStore.getState();
    expect(state.selectedCommodity).toBe("Wheat");
    expect(state.selectedMandi.name).toBe("Karnal Mandi");
    expect(state.isAlertDialogOpen).toBe(false);
    expect(state.alertDialogCommodity).toBe("Wheat");
  });

  it("setSelectedCommodity updates commodity", () => {
    useMarketStore.getState().setSelectedCommodity("Mustard");
    expect(useMarketStore.getState().selectedCommodity).toBe("Mustard");
  });

  it("setSelectedMandi updates mandi", () => {
    useMarketStore.getState().setSelectedMandi(mockMandi);
    expect(useMarketStore.getState().selectedMandi).toEqual(mockMandi);
  });

  it("openAlertDialog opens dialog with commodity", () => {
    useMarketStore.getState().openAlertDialog("Cotton");
    const state = useMarketStore.getState();
    expect(state.isAlertDialogOpen).toBe(true);
    expect(state.alertDialogCommodity).toBe("Cotton");
  });

  it("closeAlertDialog closes dialog", () => {
    useMarketStore.getState().openAlertDialog("Cotton");
    useMarketStore.getState().closeAlertDialog();
    expect(useMarketStore.getState().isAlertDialogOpen).toBe(false);
  });

  it("reset clears all state to defaults", () => {
    useMarketStore.getState().setSelectedCommodity("Mustard");
    useMarketStore.getState().setSelectedMandi(mockMandi);
    useMarketStore.getState().openAlertDialog("Cotton");
    useMarketStore.getState().reset();
    const state = useMarketStore.getState();
    expect(state.selectedCommodity).toBe("Wheat");
    expect(state.selectedMandi.name).toBe("Karnal Mandi");
    expect(state.isAlertDialogOpen).toBe(false);
    expect(state.alertDialogCommodity).toBe("Wheat");
  });
});
