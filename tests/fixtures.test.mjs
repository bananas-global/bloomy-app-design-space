import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import { readFileSync } from "node:fs";
const js = ts.transpileModule(
  readFileSync(new URL("../src/data/fixtures.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ES2022 } },
).outputText;
const { patients, schedules, selectSchedules } = await import(
  `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`
);
test("Todos os atendimentos resolvem um paciente da fonte compartilhada", () => {
  assert.equal(new Set(schedules.map((s) => s.id)).size, schedules.length);
  for (const s of schedules)
    assert.ok(patients.some((p) => p.id === s.patientId));
});
test("Filtrar paciente, dia e sala preserva o mesmo atendimento usado no início", () => {
  const [result] = selectSchedules("p1", 23, "sala 03");
  assert.equal(result, schedules[0]);
  assert.equal(selectSchedules("p2", 23, "sala 03").length, 0);
  assert.equal(selectSchedules("all", 23).length, 3);
});
test("Atendimento anterior tem devolutiva e dias vazios não inventam registros", () => {
  assert.ok(selectSchedules("p1", 22)[0].feedback);
  assert.equal(selectSchedules("all", 27).length, 0);
});
