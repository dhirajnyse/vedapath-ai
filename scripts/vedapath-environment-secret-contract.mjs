const allowedKeys = Object.freeze([
  "environment",
  "public_origin",
  "api_origin",
  "secret_refs",
  "telemetry",
  "write_routes",
  "deployment"
]);

const environments = Object.freeze(["local", "preview", "pilot"]);
const requiredPilotRefs = Object.freeze([
  "VEDAPATH_SESSION_SIGNING_SECRET",
  "VEDAPATH_REVIEWER_STORE_KEY"
]);

function validUrl(value, environment) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" || (environment === "local" && ["localhost", "127.0.0.1"].includes(url.hostname));
  } catch (error) {
    return false;
  }
}

function validSecretRef(value) {
  return /^[A-Z][A-Z0-9_]{2,63}$/.test(String(value || ""));
}

export function validateEnvironmentSecretContract(input = {}) {
  const errors = [];
  const unknownKeys = Object.keys(input).filter(function (key) { return !allowedKeys.includes(key); });
  if (unknownKeys.length) errors.push("Unknown or unsafe keys: " + unknownKeys.join(", ") + ".");

  const environment = environments.includes(input.environment) ? input.environment : "";
  if (!environment) errors.push("Environment must be local, preview, or pilot.");
  if (!validUrl(input.public_origin, environment)) errors.push("Public origin must be a valid HTTPS URL, except local loopback previews.");
  if (!validUrl(input.api_origin, environment)) errors.push("API origin must be a valid HTTPS URL, except local loopback previews.");

  const secretRefs = Array.isArray(input.secret_refs) ? input.secret_refs.map(String) : [];
  if (secretRefs.some(function (ref) { return !validSecretRef(ref); })) errors.push("Secret references must be environment variable names, never values.");
  if (new Set(secretRefs).size !== secretRefs.length) errors.push("Secret references must be unique.");
  if (environment === "pilot") {
    for (const ref of requiredPilotRefs) if (!secretRefs.includes(ref)) errors.push("Pilot config is missing secret reference " + ref + ".");
  }

  if (input.telemetry !== "privacy-safe-aggregate-only") errors.push("Telemetry must remain privacy-safe aggregate only.");
  if (!Array.isArray(input.write_routes) || input.write_routes.length !== 0) errors.push("The first pilot environment must expose zero write routes.");
  if (input.deployment !== "not-activated") errors.push("This contract cannot activate deployment.");

  return {
    schema: "vedapath.environment-secret-validation.v1",
    release: "v4.9.3",
    ok: errors.length === 0,
    errors,
    safe_summary: {
      environment: environment || "invalid",
      public_origin: validUrl(input.public_origin, environment) ? String(input.public_origin) : "invalid",
      api_origin: validUrl(input.api_origin, environment) ? String(input.api_origin) : "invalid",
      secret_refs: secretRefs.filter(validSecretRef),
      secret_values_present: false,
      telemetry: input.telemetry === "privacy-safe-aggregate-only" ? input.telemetry : "invalid",
      write_route_count: Array.isArray(input.write_routes) ? input.write_routes.length : -1,
      deployment: "not-activated"
    }
  };
}

export const environmentSecretBoundary = Object.freeze({
  release: "v4.9.3",
  accepts_secret_values: false,
  serializes_secret_values: false,
  required_pilot_secret_refs: requiredPilotRefs.slice(),
  deployment: "not-activated",
  write_routes: Object.freeze([]),
  public_launch: "blocked"
});
