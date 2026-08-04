// ─────────────────────────────────────────────────────────────────────────────
// authHeaders.ts
// KisanGPT — Shared auth-header helper for raw fetch() calls
// ─────────────────────────────────────────────────────────────────────────────
//
// Some API files (disease, voice STT) use raw `fetch()` instead of
// `apiClient` because they send FormData.  This module provides a
// reusable helper so those calls can also include the Firebase ID token
// once auth is wired up.

import { setTokenGetter } from "./apiClient";

// The getter is set once from the auth provider.  See providers.tsx.
let _tokenGetter: (() => Promise<string | null>) | null = null;

/**
 * Register a token getter function.  Call this from your auth provider
 * (e.g. Firebase onAuthStateChanged → currentUser.getIdToken()).
 *
 * @example
 *   import { registerTokenGetter } from "@/lib/authHeaders";
 *   import { getAuth } from "firebase/auth";
 *
 *   registerTokenGetter(async () => {
 *     const user = getAuth().currentUser;
 *     return user ? user.getIdToken() : null;
 *   });
 */
export function registerTokenGetter(
  getter: () => Promise<string | null>,
): void {
  _tokenGetter = getter;
  // Also wire it into apiClient so all apiClient calls benefit
  setTokenGetter(getter);
}

/**
 * Build an Authorization header from the currently registered token getter.
 * Returns an empty object when no token is available.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  if (!_tokenGetter) return {};
  try {
    const token = await _tokenGetter();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}
