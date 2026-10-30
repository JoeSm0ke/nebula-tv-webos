const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
function boot() {
  const db = new Map();
  const window = { localStorage: {
    getItem: k => db.has(k) ? db.get(k) : null,
    setItem: (k, v) => db.set(k, String(v))
  }};
  window.window = window;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../src/config.js"), "utf8"), window);
  return { config: window.NebulaPublicConfig, db };
}
const {config, db} = boot();
assert.equal(config.read().shortcuts.length, 0);
const saved = config.save({ shortcuts: [
  {id:"org.example.demo", label:"Demo"},
  {id:"bad id",label:"Invalid"},
  {id:"org.example.ok",label:"Second"}
]});
assert.equal(saved.shortcuts.length, 2);
assert.equal(config.read().shortcuts.length, 2);
db.set("nebula_public_settings_v1", "{broken");
assert.equal(config.read().shortcuts.length, 0);
console.log("Nebula settings: OK");
