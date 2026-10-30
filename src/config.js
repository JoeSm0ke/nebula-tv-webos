(function (root) {
  "use strict";
  // No dependency on any other app or PC.
  var KEY = "nebula_public_settings_v1";
  function read() {
    var item = {};
    try { item = JSON.parse(root.localStorage.getItem(KEY) || "{}"); } catch (e) {}
    if (!item || typeof item !== "object") item = {};
    return {
      startView: "home",
      shortcuts: Array.isArray(item.shortcuts) ? item.shortcuts.filter(function (x) {
        return x && typeof x.id === "string" && /^[a-zA-Z0-9._-]{1,100}$/.test(x.id) &&
               typeof x.label === "string" && x.label.length <= 80;
      }).slice(0, 40) : []
    };
  }
  function save(value) {
    var clean = { startView: "home", shortcuts: readFrom(value) };
    root.localStorage.setItem(KEY, JSON.stringify(clean));
    return clean;
  }
  function readFrom(item) {
    var rows = item && Array.isArray(item.shortcuts) ? item.shortcuts : [];
    return rows.filter(function (x) {
      return x && typeof x.id === "string" && /^[a-zA-Z0-9._-]{1,100}$/.test(x.id) &&
        typeof x.label === "string" && x.label.length <= 80;
    }).slice(0, 40).map(function (x) { return { id: x.id, label: x.label }; });
  }
  root.NebulaPublicConfig = { read: read, save: save };
})(typeof window !== "undefined" ? window : globalThis);
