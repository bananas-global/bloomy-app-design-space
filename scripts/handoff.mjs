import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  copyFileSync,
  openSync,
  closeSync,
} from "node:fs";
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
if (git("status", "--porcelain"))
  throw new Error("Salve as alterações em um commit antes de gerar a entrega.");
const commit = git("rev-parse", "HEAD");
const base = git(
  "rev-parse",
  "--verify",
  `${process.argv[2] || "baseline"}^{commit}`,
);
const dir = `handoff/${commit.slice(0, 12)}`;
mkdirSync(dir, { recursive: true });
writeFileSync(
  `${dir}/version.json`,
  JSON.stringify(
    {
      commit,
      base,
      status: "candidate",
      approval: null,
      sourceCommit: "a61a468a3339d1f64c64cc5fbd02e0e786f8600f",
    },
    null,
    2,
  ),
);
const patchFile = openSync(`${dir}/changes.patch`, "w");
try {
  execFileSync("git", ["diff", "--binary", base, commit], {
    stdio: ["ignore", patchFile, "inherit"],
  });
} finally {
  closeSync(patchFile);
}
writeFileSync(`${dir}/changes.txt`, git("diff", "--stat", base, commit) + "\n");
copyFileSync("HANDOFF.md", `${dir}/HANDOFF.md`);
execFileSync("git", [
  "archive",
  "--format=zip",
  `--output=${dir}/source.zip`,
  commit,
]);
console.log(
  `Entrega local: ${dir}\nCommit: ${commit}\nBase: ${base}\nStatus: candidata, sem aprovação.`,
);
