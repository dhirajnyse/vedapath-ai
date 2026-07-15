(function () {
  const root = document.querySelector("[data-session-config]");
  if (!root) return;

  const role = document.getElementById("vpSessionRole");
  const operation = document.getElementById("vpSessionOperation");
  const state = document.getElementById("vpSessionState");
  const form = document.getElementById("vpSessionForm");
  const result = document.getElementById("vpSessionResult");
  const status = document.getElementById("vpSessionStatus");
  const reset = document.getElementById("vpResetSession");

  function option(value, label) {
    const node = document.createElement("option");
    node.value = value;
    node.textContent = label;
    return node;
  }

  function show(payload, message) {
    result.hidden = false;
    result.textContent = JSON.stringify(payload, null, 2);
    status.textContent = message;
  }

  fetch(root.dataset.sessionConfig)
    .then(function (response) {
      if (!response.ok) throw new Error("Session preview data is unavailable.");
      return response.json();
    })
    .then(function (config) {
      const preview = config.session_preview;
      preview.roles.forEach(function (item) { role.appendChild(option(item.id, item.label)); });
      preview.operations.forEach(function (item) { operation.appendChild(option(item.id, item.label)); });
      preview.states.forEach(function (item) { state.appendChild(option(item.id, item.label)); });
      status.textContent = "Choose a bounded test session and evaluate one operation.";

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const selectedRole = preview.roles.find(function (item) { return item.id === role.value; });
        const selectedState = preview.states.find(function (item) { return item.id === state.value; });
        const roleAllows = selectedRole.capabilities.includes(operation.value);
        const validState = selectedState.id === "valid";
        const allowed = validState && roleAllows;
        show({
          schema: "vedapath.reviewer-session-ui-preview.v1",
          release: "v4.9.4",
          subject: "reviewer-demo-01",
          role: selectedRole.id,
          session_state: selectedState.id,
          operation: operation.value,
          signature_checked_by_ui: false,
          identity_provider_verified: false,
          preview_allowed: allowed,
          production_allowed: false,
          reason: !validState ? selectedState.reason : roleAllows ? "The valid test session carries this preview capability." : "The selected role does not carry this capability."
        }, allowed ? "Preview capability allowed. Production remains locked." : "Preview capability denied. Production remains locked.");
      });

      reset.addEventListener("click", function () {
        form.reset();
        result.hidden = true;
        result.textContent = "";
        status.textContent = "Session preview reset. No identity or token was stored.";
      });
    })
    .catch(function (error) {
      status.textContent = error.message;
    });
})();
