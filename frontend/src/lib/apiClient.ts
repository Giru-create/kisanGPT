// ─────────────────────────────────────────────────────────────────────────────
// apiClient.ts
// KisanGPT — Typed HTTP client wrapper around native fetch
// ─────────────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

// ---------------------------------------------------------------------------
// Centralised token provider
// ---------------------------------------------------------------------------
// Call `setTokenGetter(fn)` once at app startup (e.g. from an AuthProvider)
// so that every apiClient request automatically includes a fresh token.
// Individual requests can still override via the explicit `token` option.

type TokenGetter = () => Promise<string | null>;

let _tokenGetter: TokenGetter | null = null;

export function setTokenGetter(getter: TokenGetter): void {
  _tokenGetter = getter;
}

async function _resolveToken(explicit?: string): Promise<string | undefined> {
  if (explicit) return explicit;
  if (_tokenGetter) {
    try {
      return (await _tokenGetter()) ?? undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  token?: string;
  retry?: number;
  retryDelay?: number;
}

const RETRYABLE_METHODS = new Set(["GET", "HEAD"]);
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    params,
    body,
    token: explicitToken,
    headers: customHeaders,
    retry = 0,
    retryDelay = 1000,
    ...customInit
  } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(customHeaders as Record<string, string>),
  };

  const token = await _resolveToken(explicitToken);
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    ...customInit,
    headers,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const method = init.method?.toUpperCase() ?? "GET";
  let lastError: Error | null = null;
  const maxAttempts = RETRYABLE_METHODS.has(method) ? retry + 1 : 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(url, init);

      if (!response.ok) {
        if (
          RETRYABLE_STATUS_CODES.has(response.status) &&
          attempt < maxAttempts - 1
        ) {
          await sleep(retryDelay * 2 ** attempt);
          continue;
        }

        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        const message =
          typeof errorData === "object" && errorData && "detail" in errorData
            ? String((errorData as { detail: unknown }).detail)
            : `Request failed with status ${response.status}`;
        throw new ApiError(message, response.status, errorData);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (error instanceof ApiError) throw error;
      if (attempt < maxAttempts - 1) {
        await sleep(retryDelay * 2 ** attempt);
      }
    }
  }

  throw lastError ?? new Error("Request failed");
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: "GET",
      retry: options?.retry ?? 3,
    }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
      retry: options?.retry ?? 0,
    }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
      retry: options?.retry ?? 0,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: "DELETE",
      retry: options?.retry ?? 0,
    }),
};
