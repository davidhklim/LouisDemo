/**
 * demoNetworkStub.js — Route-based fetch interceptor for LouisAI interactive
 * demos.
 *
 * The Investor-webpage is static — there is no backend. This module
 * monkey-patches `window.fetch` with a registry-driven router so each demo
 * can mount its own scripted responses on mount and clean them up on
 * unmount. All demo fetch calls use the `/demo/api/*` namespace, which is
 * only ever served by this stub and never escapes to the real network.
 *
 * ── Usage ────────────────────────────────────────────────────────────────
 *
 *   import {
 *     registerRoutes, unregisterRoutes,
 *     sseResponse, jsonResponse,
 *   } from "./demoNetworkStub.js";
 *
 *   useEffect(() => {
 *     const dispose = registerRoutes({
 *       "POST /demo/api/assist/rewrite": (req) => sseResponse(DEMO_PAYLOAD),
 *       "GET /demo/api/data-rooms/:id":  (req) => jsonResponse(scripted(req.params.id)),
 *     });
 *     return dispose;
 *   }, []);
 *
 * ── Route keys ───────────────────────────────────────────────────────────
 *
 *   "METHOD /path"   — e.g. "POST /demo/api/assist/rewrite"
 *   "/path"          — method defaults to GET
 *
 *   Path segments beginning with ":" are captured as params and exposed to
 *   the handler via `req.params`. Example: "GET /demo/api/data-rooms/:id"
 *   matches "/demo/api/data-rooms/abc123" and passes `{ id: "abc123" }`.
 *
 * ── Handler contract ─────────────────────────────────────────────────────
 *
 *   handler(req) → Response | Promise<Response>
 *
 *   req = {
 *     url:    string,                    // full URL string as received
 *     method: string,                    // "GET" | "POST" | ...
 *     path:   string,                    // pathname only
 *     params: Record<string,string>,     // captured path params
 *     query:  Record<string,string>,     // parsed query string
 *     headers: Headers,
 *     body:   any,                       // parsed JSON if Content-Type JSON, else raw string/null
 *     rawInit: RequestInit,              // pass-through of the original init
 *   }
 *
 * ── Helpers ──────────────────────────────────────────────────────────────
 *
 *   sseResponse(payload, { tokenDelayMs, tokenChunkSize }) — realistic token
 *   stream that ends with a `done` event carrying the full payload.
 *
 *   jsonResponse(data, { status, delayMs }) — batch JSON response.
 *
 * ── Unmatched behavior ───────────────────────────────────────────────────
 *
 *   - Unmatched `/demo/api/*` requests return a stub 404 with header
 *     `x-demo-stub: unmatched` to prevent accidental leakage to the real
 *     network.
 *   - All other paths fall through to the native fetch untouched.
 *
 * ── Composition ──────────────────────────────────────────────────────────
 *
 *   Multiple calls to registerRoutes compose in a LIFO stack. Later-
 *   registered routes win on conflict. Each call returns a disposer that
 *   removes its own routes.
 *
 * ── SSR-safe ─────────────────────────────────────────────────────────────
 *
 *   All public functions guard on `typeof window !== "undefined"`.
 */

const ORIGINAL_FETCH_KEY = "__louisDemoOriginalFetch__";
const ROUTE_GROUPS_KEY = "__louisDemoRouteGroups__";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ── Helpers: response builders ──────────────────────────────────────── */

const encodeSse = (eventType, data) =>
  `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;

/**
 * Build a realistic token-streaming SSE response. Emits a synthetic "rag"
 * event for the reference banner, then chunked "token" events, then a
 * final "done" event with the full payload.
 *
 * @param {object} payload  Full batch JSON payload for the streamed response
 * @param {object} [opts]
 * @param {number} [opts.tokenDelayMs=45]   Delay between token chunks.
 * @param {number} [opts.tokenChunkSize]    Fixed chunk size. If omitted, varies 4-7 chars.
 * @param {number} [opts.initialDelayMs]    "AI thinking" delay before first byte.
 */
export const sseResponse = (payload, opts = {}) => {
  const {
    tokenDelayMs = 45,
    tokenChunkSize,
    initialDelayMs = 650 + Math.floor(Math.random() * 350),
  } = opts;

  const answerText =
    payload?.suggestedReplacement?.text ??
    payload?.variants?.[0]?.text ??
    "";

  const chunks = [];
  {
    let i = 0;
    while (i < answerText.length) {
      const size =
        typeof tokenChunkSize === "number" && tokenChunkSize > 0
          ? tokenChunkSize
          : 4 + Math.floor(Math.random() * 4);
      const next = Math.min(answerText.length, i + size);
      chunks.push(answerText.slice(i, next));
      i = next;
    }
  }

  const encoder = new TextEncoder();

  const body = new ReadableStream({
    async start(controller) {
      if (initialDelayMs > 0) await delay(initialDelayMs);
      controller.enqueue(
        encoder.encode(
          encodeSse("rag", {
            references: [
              { id: "demo-ref-1" },
              { id: "demo-ref-2" },
              { id: "demo-ref-3" },
            ],
          }),
        ),
      );

      for (const chunk of chunks) {
        await delay(tokenDelayMs);
        controller.enqueue(encoder.encode(encodeSse("token", { text: chunk })));
      }

      await delay(80);
      controller.enqueue(encoder.encode(encodeSse("done", payload)));
      controller.close();
    },
  });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

/**
 * Build a batched JSON response with optional pre-response delay.
 * @param {any} data
 * @param {object} [opts]
 * @param {number} [opts.status=200]
 * @param {number} [opts.delayMs=0]
 * @param {object} [opts.headers]
 */
export const jsonResponse = async (data, opts = {}) => {
  const { status = 200, delayMs = 0, headers = {} } = opts;
  if (delayMs > 0) await delay(delayMs);
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
};

/* ── Route parsing & matching ────────────────────────────────────────── */

const DEFAULT_METHOD = "GET";

/**
 * Parse a route key into { method, pattern, paramNames }.
 *
 * "POST /demo/api/foo/:id" → { method: "POST", pattern: /^\/demo\/api\/foo\/([^/]+)$/, paramNames: ["id"] }
 * "/demo/api/foo"          → { method: "GET",  pattern: /^\/demo\/api\/foo$/,        paramNames: [] }
 */
const compileRoute = (routeKey) => {
  const trimmed = routeKey.trim();
  let method = DEFAULT_METHOD;
  let path = trimmed;
  const spaceIdx = trimmed.indexOf(" ");
  if (spaceIdx !== -1) {
    method = trimmed.slice(0, spaceIdx).toUpperCase();
    path = trimmed.slice(spaceIdx + 1).trim();
  }

  const segments = path.split("/").filter(Boolean);
  const paramNames = [];
  const segmentPatterns = segments.map((seg) => {
    if (seg.startsWith(":")) {
      paramNames.push(seg.slice(1));
      return "([^/]+)";
    }
    // Escape regex special chars in literal segments.
    return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });
  const pattern = new RegExp(`^/${segmentPatterns.join("/")}$`);
  return { method, pattern, paramNames };
};

const parseQuery = (searchParams) => {
  const query = {};
  for (const [k, v] of searchParams.entries()) query[k] = v;
  return query;
};

const coerceUrlString = (input) => {
  try {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.href;
    return input?.url ?? String(input);
  } catch {
    return String(input);
  }
};

const resolveToUrl = (urlString) => {
  // Handle protocol-relative / absolute / relative URLs uniformly.
  try {
    return new URL(urlString, window.location?.href ?? "http://localhost/");
  } catch {
    return null;
  }
};

const isJsonContentType = (headers) => {
  const ct = headers.get("content-type") || "";
  return /application\/json/i.test(ct);
};

const buildRequest = async (url, init, match) => {
  const method = (init?.method || DEFAULT_METHOD).toUpperCase();
  const headers = new Headers(init?.headers || {});

  let body = null;
  const raw = init?.body;
  if (raw != null) {
    if (typeof raw === "string") {
      if (isJsonContentType(headers) && raw.length) {
        try {
          body = JSON.parse(raw);
        } catch {
          body = raw;
        }
      } else {
        body = raw;
      }
    } else {
      body = raw;
    }
  }

  return {
    url: url.href,
    method,
    path: url.pathname,
    params: match.params,
    query: parseQuery(url.searchParams),
    headers,
    body,
    rawInit: init || {},
  };
};

/**
 * Find the first matching handler across all registered groups.
 * Groups are searched newest-first so later registrations win on conflict.
 */
const findMatch = (url, method) => {
  if (typeof window === "undefined") return null;
  const groups = window[ROUTE_GROUPS_KEY] || [];
  for (let i = groups.length - 1; i >= 0; i -= 1) {
    const group = groups[i];
    for (const route of group.compiled) {
      if (route.method !== method) continue;
      const m = route.pattern.exec(url.pathname);
      if (!m) continue;
      const params = {};
      route.paramNames.forEach((name, idx) => {
        params[name] = decodeURIComponent(m[idx + 1]);
      });
      return { handler: route.handler, params };
    }
  }
  return null;
};

/* ── Install / uninstall the fetch patch ─────────────────────────────── */

const ensureInstalled = () => {
  if (typeof window === "undefined") return;
  if (window[ORIGINAL_FETCH_KEY]) return; // already installed

  const originalFetch = window.fetch.bind(window);
  window[ORIGINAL_FETCH_KEY] = originalFetch;
  window[ROUTE_GROUPS_KEY] = window[ROUTE_GROUPS_KEY] || [];

  window.fetch = async (input, init = {}) => {
    const urlString = coerceUrlString(input);
    const url = resolveToUrl(urlString);

    // Fall-through for non-demo paths (videos, static assets, etc).
    // The demo router only intercepts the `/demo/api/*` namespace. Any
    // bare `/api/*` request (defensive: should not occur in this bundle)
    // is also caught so it cannot leak to the real network.
    if (!url || !/^\/(?:demo\/)?api(\/|$)/.test(url.pathname)) {
      return originalFetch(input, init);
    }

    const method = (init?.method || DEFAULT_METHOD).toUpperCase();
    const match = findMatch(url, method);

    if (!match) {
      // Stub 404 — prevents accidental leakage to the real network.
      return new Response(
        JSON.stringify({
          error: "demo-stub-unmatched",
          method,
          path: url.pathname,
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "x-demo-stub": "unmatched",
          },
        },
      );
    }

    const req = await buildRequest(url, init, match);
    try {
      const result = match.handler(req);
      return result instanceof Promise ? await result : result;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[demoNetworkStub] handler threw:", err);
      return new Response(
        JSON.stringify({ error: "demo-stub-handler-error", message: String(err?.message || err) }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "x-demo-stub": "error",
          },
        },
      );
    }
  };
};

const maybeUninstall = () => {
  if (typeof window === "undefined") return;
  const groups = window[ROUTE_GROUPS_KEY] || [];
  if (groups.length > 0) return; // still in use by another caller
  const original = window[ORIGINAL_FETCH_KEY];
  if (original) {
    window.fetch = original;
    delete window[ORIGINAL_FETCH_KEY];
  }
};

/* ── Public API ──────────────────────────────────────────────────────── */

/**
 * Register a group of routes. Returns a disposer function that removes
 * exactly this group when called.
 *
 * @param {Record<string, (req: any) => Response | Promise<Response>>} routes
 * @returns {() => void} disposer
 */
export const registerRoutes = (routes) => {
  if (typeof window === "undefined") return () => {};
  ensureInstalled();

  const compiled = Object.entries(routes || {}).map(([key, handler]) => {
    const { method, pattern, paramNames } = compileRoute(key);
    return { key, method, pattern, paramNames, handler };
  });

  const group = { id: Symbol("demoRouteGroup"), compiled };
  window[ROUTE_GROUPS_KEY].push(group);

  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    const groups = window[ROUTE_GROUPS_KEY] || [];
    const idx = groups.indexOf(group);
    if (idx !== -1) groups.splice(idx, 1);
    maybeUninstall();
  };
};

/**
 * Remove every currently-registered route group and restore native fetch.
 * Use only in tests or at teardown — prefer the disposer returned by
 * registerRoutes for per-component cleanup.
 */
export const unregisterRoutes = () => {
  if (typeof window === "undefined") return;
  window[ROUTE_GROUPS_KEY] = [];
  maybeUninstall();
};
