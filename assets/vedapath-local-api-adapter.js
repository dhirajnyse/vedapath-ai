(function () {
  const defaultBaseUrl = "http://127.0.0.1:8787";
  const contractVersion = "vedapath.source.v1";

  function traceId(question) {
    const slug = String(question || "query").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "query";
    return "vp-browser-" + slug;
  }

  function buildUrl(pathname, params, options) {
    const baseUrl = (options && options.baseUrl) || defaultBaseUrl;
    const url = new URL(pathname, baseUrl);
    Object.keys(params || {}).forEach(function (key) {
      const value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
    return url.toString();
  }

  function buildSourceUrl(question, options) {
    return buildUrl("/source", { question: String(question || "") }, options);
  }

  function fallbackPacket(question, reason, detail) {
    return {
      contract: contractVersion,
      trace_id: traceId(question),
      query: String(question || ""),
      source_found: false,
      primary_source_id: null,
      citation: "No local source response",
      family: "Local API unavailable",
      confidence: 0,
      reviewer_state: "unavailable",
      rights_state: "not-requested",
      answer_boundary: "Do not answer from memory when the local Source API is unavailable.",
      summary: "The local source server did not return a usable packet. Keep the boundary visible.",
      no_source_reason: reason || "local-server-unavailable",
      next_action: "start local source api or use reviewed preview",
      adapter_detail: detail || null
    };
  }

  function fetchWithTimeout(url, options) {
    const settings = options || {};
    const controller = new AbortController();
    const timer = setTimeout(function () {
      controller.abort();
    }, settings.timeoutMs || 1800);
    return fetch(url, {
      method: settings.method || "GET",
      headers: {
        "accept": "application/json",
        "x-vedapath-request-id": settings.requestId || traceId(settings.question || "request"),
        ...(settings.headers || {})
      },
      body: settings.body,
      signal: controller.signal,
      cache: "no-store"
    }).finally(function () {
      clearTimeout(timer);
    });
  }

  async function readJson(response) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  function responseReason(response, payload) {
    if (payload && payload.error && payload.error.code) return payload.error.code;
    return "local-api-status-" + response.status;
  }

  function validPacket(payload) {
    return Boolean(payload &&
      payload.contract === contractVersion &&
      typeof payload.source_found === "boolean" &&
      typeof payload.answer_boundary === "string" &&
      typeof payload.next_action === "string");
  }

  async function querySourcePacket(question, options) {
    const settings = options || {};
    try {
      const response = await fetchWithTimeout(buildSourceUrl(question, settings), {
        timeoutMs: settings.timeoutMs || 1800,
        question: question
      });
      const payload = await readJson(response);
      if (!response.ok) {
        return fallbackPacket(question, responseReason(response, payload), payload && payload.error ? payload.error.message : null);
      }
      if (!validPacket(payload)) {
        return fallbackPacket(question, "invalid-source-contract", "The local API response did not match " + contractVersion + ".");
      }
      return payload;
    } catch (error) {
      return fallbackPacket(
        question,
        error.name === "AbortError" ? "local-api-timeout" : "local-server-unavailable",
        error.message
      );
    }
  }

  async function checkHealth(options) {
    const settings = options || {};
    try {
      const response = await fetchWithTimeout(buildUrl("/health", {}, settings), {
        timeoutMs: settings.timeoutMs || 1200,
        question: "health"
      });
      const payload = await readJson(response);
      return {
        ok: Boolean(response.ok && payload && payload.ok && payload.contract === contractVersion),
        status: response.status,
        payload: payload
      };
    } catch (error) {
      return {
        ok: false,
        status: 0,
        payload: null,
        reason: error.name === "AbortError" ? "local-api-timeout" : "local-server-unavailable"
      };
    }
  }

  window.VedaPathLocalApiAdapter = {
    contractVersion: contractVersion,
    defaultBaseUrl: defaultBaseUrl,
    buildSourceUrl: buildSourceUrl,
    fallbackPacket: fallbackPacket,
    validPacket: validPacket,
    querySourcePacket: querySourcePacket,
    checkHealth: checkHealth
  };
})();
