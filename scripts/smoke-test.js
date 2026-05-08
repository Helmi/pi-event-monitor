#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const extensionPath = resolve(root, "extensions/index.ts");
const packagePath = resolve(root, "package.json");

function run(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(error?.stdout?.toString?.() || "");
    console.error(error?.stderr?.toString?.() || error?.message || error);
    process.exitCode = 1;
  }
}

run("extension parses", () => {
  execFileSync(process.execPath, ["--check", extensionPath], { cwd: root, stdio: "pipe" });
});

run("package manifest is a pi package", () => {
  const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
  if (!pkg.keywords?.includes("pi-package")) throw new Error("missing pi-package keyword");
  if (!Array.isArray(pkg.pi?.extensions) || pkg.pi.extensions.length === 0) throw new Error("missing pi.extensions");
});

run("extension avoids optional runtime UI/AI imports", () => {
  const source = readFileSync(extensionPath, "utf8");
  for (const forbidden of ["@earendil-works/pi-ai", "@earendil-works/pi-tui", "@mariozechner/pi-ai", "@mariozechner/pi-tui"]) {
    if (source.includes(forbidden)) throw new Error(`forbidden runtime import: ${forbidden}`);
  }
});

run("security and monitor panel affordances are present", () => {
  const source = readFileSync(extensionPath, "utf8");
  for (const required of ["Start background shell monitor?", "monitor-panel", "showMonitorPanel", "suppressWakeups"]) {
    if (!source.includes(required)) throw new Error(`missing expected affordance: ${required}`);
  }
});

run("npm package dry-run succeeds", () => {
  execFileSync("npm", ["pack", "--dry-run", "--json"], { cwd: root, stdio: "pipe" });
});
