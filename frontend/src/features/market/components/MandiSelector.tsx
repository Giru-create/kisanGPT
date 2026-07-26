// ─────────────────────────────────────────────────────────────────────────────
// MandiSelector.tsx
// KisanGPT — Mandi selection dropdown for Market Intelligence
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMarket } from "../hooks/useMarket";
import { AVAILABLE_MANDIS } from "../store/marketStore";
import { announceToScreenReader } from "@/utils/a11y";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MandiSelector() {
  const { selectedMandi, selectMandi } = useMarket();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const mandi = AVAILABLE_MANDIS.find((m) => m.name === e.target.value);
    if (mandi) {
      selectMandi(mandi);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="mandi-selector"
        className="text-sm font-medium text-green-900"
      >
        Select Mandi
      </label>
      <select
        id="mandi-selector"
        value={selectedMandi.name}
        onChange={handleChange}
        className="rounded-lg border border-green-300 bg-white px-4 py-2.5 text-sm text-green-900 shadow-sm transition-colors hover:border-green-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        aria-label={`Select mandi. Current: ${selectedMandi.name}`}
        onFocus={() =>
          announceToScreenReader(
            `Mandi selector. ${selectedMandi.name} selected.`,
          )
        }
      >
        {AVAILABLE_MANDIS.map((mandi) => (
          <option key={mandi.name} value={mandi.name}>
            {mandi.name} — {mandi.district}, {mandi.state}
          </option>
        ))}
      </select>
    </div>
  );
}
