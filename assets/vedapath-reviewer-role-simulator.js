(function () {
  "use strict";

  const workspace = document.querySelector("[data-config]");
  const form = document.getElementById("vpRoleForm");
  if (!workspace || !form) return;

  const role = document.getElementById("vpReviewerRole");
  const operation = document.getElementById("vpReviewerOperation");
  const result = document.getElementById("vpRoleResult");
  const capabilityList = document.getElementById("vpRoleCapabilities");
  const status = document.getElementById("vpRoleStatus");
  let config = null;

  function selectedRole() {
    return config.roles.find(function (item) { return item.id === role.value; }) || config.roles[0];
  }

  function renderCapabilities() {
    const selected = selectedRole();
    capabilityList.replaceChildren();
    selected.capabilities.forEach(function (capability) {
      const item = document.createElement("li");
      item.textContent = capability.replace(/-/g, " ");
      capabilityList.append(item);
    });
  }

  function evaluate() {
    const selected = selectedRole();
    const requested = operation.value;
    const forbidden = config.forbidden_operations.includes(requested);
    const allowed = !forbidden && selected.capabilities.includes(requested);
    const packet = {
      schema: "vedapath.reviewer-capability.v1",
      release: config.release,
      role: selected.id,
      operation: requested,
      identity_verified: false,
      preview_allowed: allowed,
      production_allowed: false,
      reason: forbidden
        ? "This operation is locked in every prototype role."
        : allowed
          ? "This role may simulate the operation in page memory only."
          : "This prototype role does not carry the requested capability."
    };
    result.hidden = false;
    result.textContent = JSON.stringify(packet, null, 2);
    status.textContent = allowed
      ? "Preview capability available. Real authentication and production permission are still absent."
      : "Capability denied. No state changed.";
  }

  role.addEventListener("change", function () {
    renderCapabilities();
    result.hidden = true;
    status.textContent = "Role changed. No identity has been verified.";
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    evaluate();
  });

  fetch(workspace.dataset.config, { cache: "no-store" }).then(function (response) {
    if (!response.ok) throw new Error("config unavailable");
    return response.json();
  }).then(function (value) {
    config = value;
    value.roles.forEach(function (item) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      role.append(option);
    });
    value.operations.forEach(function (item) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      operation.append(option);
    });
    renderCapabilities();
    status.textContent = "Ready. This is a policy simulator, not sign-in.";
  }).catch(function () {
    status.textContent = "The role contract could not load. Reload before evaluating a capability.";
    form.querySelector("button[type=submit]").disabled = true;
  });
})();

