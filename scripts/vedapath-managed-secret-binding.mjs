const REQUIRED_BINDINGS = new Map([
  ["VEDAPATH_SESSION_SIGNING_SECRET", "session-signing"],
  ["VEDAPATH_REVIEWER_STORE_KEY", "reviewer-store"],
  ["VEDAPATH_QUEUE_HASH_KEY", "queue-integrity"]
]);
const ALLOWED_KEYS = new Set(["name", "ref", "scope", "owner", "rotationDays", "environment", "redacted"]);

export function validateManagedSecretBindings(bindings = []) {
  const errors = [];
  const names = new Set();
  const refs = new Set();

  if (!Array.isArray(bindings)) {
    return {
      schema: "vedapath.managed-secret-binding-plan.v1",
      valid: false,
      errors: ["bindings-must-be-an-array"],
      safeBindings: [],
      secretValuesSerialized: 0,
      bindingsApplied: false,
      providerConnected: false,
      publicLaunch: "blocked"
    };
  }

  for (const [index, binding] of bindings.entries()) {
    if (!binding || typeof binding !== "object" || Array.isArray(binding)) {
      errors.push(`binding-invalid:${index}`);
      continue;
    }
    for (const key of Object.keys(binding)) {
      if (!ALLOWED_KEYS.has(key)) errors.push(`unknown-or-value-bearing-key:${index}:${key}`);
    }
    if (!REQUIRED_BINDINGS.has(binding.name)) errors.push(`binding-name-not-allowed:${index}`);
    if (names.has(binding.name)) errors.push(`binding-name-duplicate:${binding.name}`);
    names.add(binding.name);
    if (typeof binding.ref !== "string" || !/^secret:\/\/[a-z0-9][a-z0-9/_-]{4,120}$/i.test(binding.ref)) {
      errors.push(`secret-reference-invalid:${binding.name || index}`);
    }
    if (refs.has(binding.ref)) errors.push(`secret-reference-duplicate:${binding.ref}`);
    refs.add(binding.ref);
    if (binding.scope !== REQUIRED_BINDINGS.get(binding.name)) errors.push(`scope-invalid:${binding.name || index}`);
    if (typeof binding.owner !== "string" || !/^owner:[a-z0-9-]{3,40}$/i.test(binding.owner)) errors.push(`owner-invalid:${binding.name || index}`);
    if (!Number.isInteger(binding.rotationDays) || binding.rotationDays < 1 || binding.rotationDays > 90) errors.push(`rotation-invalid:${binding.name || index}`);
    if (binding.environment !== "pilot") errors.push(`environment-invalid:${binding.name || index}`);
    if (binding.redacted !== true) errors.push(`redaction-required:${binding.name || index}`);
  }

  for (const name of REQUIRED_BINDINGS.keys()) {
    if (!names.has(name)) errors.push(`required-binding-missing:${name}`);
  }

  const valid = errors.length === 0 && bindings.length === REQUIRED_BINDINGS.size;
  return {
    schema: "vedapath.managed-secret-binding-plan.v1",
    valid,
    status: valid ? "binding-plan-valid-not-applied" : "binding-plan-blocked",
    errors,
    safeBindings: valid
      ? bindings.map(({ name, scope, owner, rotationDays, environment }) => ({ name, scope, owner, rotationDays, environment }))
      : [],
    secretValuesSerialized: 0,
    bindingsApplied: false,
    providerConnected: false,
    deploymentActivated: false,
    publicLaunch: "blocked"
  };
}

export function secretBindingPacket(result) {
  if (!result || result.schema !== "vedapath.managed-secret-binding-plan.v1") {
    throw new TypeError("A VedaPath managed secret binding result is required.");
  }
  return [
    "VedaPath Managed Secret Binding Plan",
    `Status: ${result.status}`,
    `Bindings: ${result.safeBindings.length}/${REQUIRED_BINDINGS.size}`,
    `Errors: ${result.errors.length ? result.errors.join(", ") : "none"}`,
    "Secret values serialized: 0",
    "Bindings applied: false",
    "Provider connected: false",
    "Public launch: blocked"
  ].join("\n");
}
