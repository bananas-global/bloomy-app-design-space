import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import { readFileSync } from "node:fs";
const js = ts.transpileModule(
  readFileSync(new URL("../src/workbench.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ES2022 } },
).outputText;
const {
  fixtures,
  variationIds,
  variationsFor,
  parseFixture,
  initialFixture,
  dimension,
  normalizeSearch,
} = await import(
  `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`
);
test("custom fixture round trips through a shareable URL", () => {
  const data = {
    ...fixtures.reference.data,
    patient: "Amostra Silva",
    showContent: false,
  };
  const p = new URLSearchParams({
    fixture: "custom",
    data: JSON.stringify(data),
  });
  assert.deepEqual(
    initialFixture(new URLSearchParams(p.toString())).data,
    data,
  );
});
test("invalid fixture data falls back explicitly", () => {
  for (const value of [
    null,
    [],
    { ...fixtures.reference.data, showContent: "false" },
    { ...fixtures.reference.data, patient: "x".repeat(301) },
    { ...fixtures.reference.data, extra: 1 },
  ])
    assert.throws(() => parseFixture(JSON.stringify(value)));
  assert.ok(initialFixture(new URLSearchParams({ data: "{" })).error);
});
test("viewport bounds reject malformed and excessive dimensions", () => {
  assert.equal(dimension("NaN", 402, 320, 1920), 402);
  assert.equal(dimension("20000", 402, 320, 1920), 1920);
  assert.equal(dimension("-1", 402, 320, 1920), 320);
});
test("search matches Portuguese names regardless of accents", () =>
  assert.ok(
    normalizeSearch("Conteúdos educativos").includes(
      normalizeSearch("conteudos"),
    ),
  ));

test("each screen and component exposes valid contextual presets", () => {
  assert.equal(Object.keys(variationIds).length, 16);
  for (const ids of Object.values(variationIds)) {
    assert.ok(ids.length >= 2);
    assert.equal(ids[0], "reference");
    for (const id of ids)
      assert.deepEqual(
        parseFixture(JSON.stringify(fixtures[id].data)),
        fixtures[id].data,
      );
  }
  assert.ok(!variationsFor("agenda").includes("disabled"));
  assert.ok(variationsFor("CButton").includes("disabled"));
});
