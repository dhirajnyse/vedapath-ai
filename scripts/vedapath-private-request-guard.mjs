import { createHash } from "node:crypto";

function bucket(value, salt) {
  return createHash("sha256").update(salt + ":" + String(value || "anonymous")).digest("hex").slice(0, 12);
}

function safePath(value) {
  const path = String(value || "/").split("?")[0];
  return ["/health", "/sources", "/search", "/source"].includes(path) ? path : "/other";
}

function statusGroup(value) {
  const status = Number(value || 0);
  return status >= 500 ? "5xx" : status >= 400 ? "4xx" : status >= 300 ? "3xx" : "2xx";
}

export function createPrivacySafeRequestGuard(options = {}) {
  const limit = Math.max(1, Number(options.limit || 12));
  const windowMs = Math.max(1000, Number(options.windowMs || 60_000));
  const now = typeof options.now === "function" ? options.now : Date.now;
  const salt = String(options.salt || "vedapath-private-preview");
  const counters = new Map();
  const events = [];

  function before(input = {}) {
    const timestamp = now();
    const windowStart = Math.floor(timestamp / windowMs) * windowMs;
    const clientBucket = bucket(input.clientToken, salt);
    const key = clientBucket + ":" + windowStart;
    const count = (counters.get(key) || 0) + 1;
    counters.set(key, count);
    for (const oldKey of counters.keys()) {
      const oldWindow = Number(oldKey.split(":").pop());
      if (oldWindow < windowStart - windowMs) counters.delete(oldKey);
    }
    return {
      allowed: count <= limit,
      limit,
      remaining: Math.max(0, limit - count),
      retry_after_seconds: Math.max(1, Math.ceil((windowStart + windowMs - timestamp) / 1000)),
      client_bucket: clientBucket,
      time_bucket: new Date(windowStart).toISOString()
    };
  }

  function record(input = {}) {
    events.push({
      time_bucket: String(input.time_bucket || new Date(Math.floor(now() / windowMs) * windowMs).toISOString()),
      client_bucket: String(input.client_bucket || bucket("anonymous", salt)),
      method: String(input.method || "GET").toUpperCase().slice(0, 8),
      path: safePath(input.pathname),
      status_group: statusGroup(input.status),
      outcome: ["served", "rejected", "limited"].includes(input.outcome) ? input.outcome : "rejected"
    });
    if (events.length > 100) events.splice(0, events.length - 100);
  }

  function snapshot() {
    const totals = { served: 0, rejected: 0, limited: 0 };
    events.forEach(function (event) { totals[event.outcome] += 1; });
    return {
      schema: "vedapath.privacy-monitor.v1",
      release: "v4.8.8",
      persistence: "instance-memory-only",
      retention_events: events.length,
      totals,
      events: events.map(function (event) { return { ...event }; })
    };
  }

  function reset() {
    counters.clear();
    events.splice(0, events.length);
  }

  return { before, record, snapshot, reset, policy: Object.freeze({ limit, window_ms: windowMs, durable: false }) };
}

export const privacyMonitorBoundary = Object.freeze({
  release: "v4.8.8",
  stores_raw_question: false,
  stores_raw_ip: false,
  stores_user_agent: false,
  stores_referrer: false,
  durable: false,
  production_monitoring: "not-ready"
});

