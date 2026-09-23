import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, readFileSync, existsSync } from "node:fs";
// Token is used only by pub, never compiled into Dart or exposed as VITE_*.
const env = { ...process.env };
if (existsSync(".env"))
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^GITEA_PUB_TOKEN=(.*)$/);
    if (m) env.GITEA_PUB_TOKEN = m[1].replace(/^['"]|['"]$/g, "");
  }
const run = (args) =>
  execFileSync("flutter", args, {
    cwd: "flutter_preview",
    env,
    stdio: "inherit",
  });
run(["pub", "get"]);
run([
  "build",
  "web",
  "--no-pub",
  "--no-wasm-dry-run",
  "--no-tree-shake-icons",
  "--base-href",
  "/flutter/",
]);
rmSync("public/flutter", { recursive: true, force: true });
mkdirSync("public/flutter", { recursive: true });
cpSync("flutter_preview/build/web", "public/flutter", { recursive: true });
