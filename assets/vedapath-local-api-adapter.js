(function () {
  const defaultBaseUrl = "http://127.0.0.1:8787";

  function traceId(question) {
    const slug = String(question || "query").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "query";
    return "vp-browser-" + slug;
  }

  function buildSourceUrl(question, options) {
    const baseUrl = (options && options.baseUrl) || defaultBaseUrl;
    const url = new URL("/source", baseUrl);
    url.searchParams.set("question", String(question || ""));
    return url.toString();
  }

  function fallbackPacket(question, reason) {
    return {
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
      summary: "The local source server did not return a packet. Keep the UI calm and show the boundary.",
      no_source_reason: reason || "local-server-unavailable",
      next_action: "start local source api or use static fixture view"
    };
  }

  function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(function () {
      controller.abort();
    }, timeoutMs || 1500);
    return fetch(url, { signal: controller.signal, cache: "no-store" }).finally(function () {
      clearTimeout(timer);
    });
  }

  async function querySourcePacket(question, options) {
    const settings = options || {};
    try {
      const response = await fetchWithTimeout(buildSourceUrl(question, settings), settings.timeoutMs || 1500);
      if (!response.ok) throw new Error("local api status " + response.status);
      return await response.json();
    } catch (error) {
      return fallbackPacket(question, error.name === "AbortError" ? "local-api-timeout" : "local-server-unavailable");
    }
  }

  window.VedaPathLocalApiAdapter = {
    buildSourceUrl: buildSourceUrl,
    fallbackPacket: fallbackPacket,
    querySourcePacket: querySourcePacket
  };
})();
