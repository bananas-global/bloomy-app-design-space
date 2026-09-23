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
  componentGroupsFor,
  controlDisabledReason,
  patchComponent,
  sectionState,
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
    ...fixtures.default.data,
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
    { ...fixtures.default.data, showContent: "false" },
    { ...fixtures.default.data, patient: "x".repeat(301) },
    { ...fixtures.default.data, extra: 1 },
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
  assert.equal(Object.keys(variationIds).length, 30);
  for (const [target, ids] of Object.entries(variationIds)) {
    assert.ok(ids.length >= (target === "settings" ? 1 : 2));
    assert.equal(ids[0], "default");
    for (const id of ids)
      assert.deepEqual(
        parseFixture(JSON.stringify(fixtures[id].data)),
        fixtures[id].data,
      );
  }
  assert.ok(!variationsFor("agenda").includes("disabled"));
  assert.ok(variationsFor("CButton").includes("disabled"));
});

test("component changes preserve independent section state and survive URLs", () => {
  const mixed = patchComponent(fixtures.loading.data, {
    feedState: "ready",
    feedCount: "3",
  });
  assert.equal(sectionState(mixed, "schedule"), "loading");
  assert.equal(sectionState(mixed, "feed"), "ready");
  const photo = patchComponent(mixed, { headerPhoto: true });
  assert.equal(photo.feedCount, "3");
  assert.equal(photo.scheduleState, "loading");
  assert.deepEqual(
    initialFixture(new URLSearchParams({ data: JSON.stringify(photo) })).data,
    photo,
  );
  assert.deepEqual(
    componentGroupsFor("home")[0],
    componentGroupsFor("CAppBarUser2")[0],
  );
  assert.deepEqual(
    componentGroupsFor("home")[2],
    componentGroupsFor("CCardFeed")[0],
  );
  for (const invalid of [
    { feedCount: "4" },
    { scheduleState: "unknown" },
    { headerPhoto: "yes" },
  ])
    assert.throws(() => parseFixture(JSON.stringify({ ...photo, ...invalid })));
  assert.equal(
    initialFixture(new URLSearchParams({ fixture: "reference" })).id,
    "default",
  );
});

test("every catalog item has contextual controls with valid values", () => {
  for (const target of Object.keys(variationIds)) {
    const groups = componentGroupsFor(target);
    assert.ok(target === "settings" || groups.length > 0, target);
    for (const group of groups) {
      if (group.component) assert.ok(variationIds[group.component], group.component);
      for (const control of group.controls) {
        for (const [value] of control.options) {
          const patch = { [control.field]: typeof fixtures.default.data[control.field] === 'boolean' ? value === 'true' : value };
          const data = patchComponent(fixtures.default.data, patch);
          assert.deepEqual(parseFixture(JSON.stringify(data)), data);
        }
      }
    }
  }
});

 test("dependent controls retain values and respect their preview context", () => {
   const base = { ...fixtures.populated.data, hasProfessional: false, professionalPhoto: true, hasSupervisor: true };
   for (const target of ["home", "agenda", "AppointmentsSection", "CTileScheduleParent"]) {
     for (const field of ["professionalPhoto", "hasSupervisor"])
       assert.ok(controlDisabledReason(target, "CTileScheduleParent", field, base));
   }
   const restored = patchComponent(base, { hasProfessional: true });
   assert.equal(restored.professionalPhoto, true);
   assert.equal(restored.hasSupervisor, true);
   assert.equal(controlDisabledReason("CTileScheduleParent", "CTileScheduleParent", "professionalPhoto", restored), undefined);
   for (const state of ["empty", "loading", "error"]) {
     const data = { ...base, feedState: state, scheduleState: state };
     assert.ok(controlDisabledReason("home", "FeedSection", "feedCount", data));
     assert.ok(controlDisabledReason("FeedSection", "CCardFeed", "postText", data));
     assert.ok(controlDisabledReason("agenda", "CTileScheduleParent", "scheduleStatus", data));
     assert.equal(controlDisabledReason("CCardFeed", "CCardFeed", "postText", data), undefined);
     assert.equal(controlDisabledReason("CTileScheduleParent", "CTileScheduleParent", "scheduleStatus", data), undefined);
     assert.equal(controlDisabledReason("home", "FeedSection", "feedState", data), undefined);
   }
   assert.ok(controlDisabledReason("contents", "CTileParentContent", "contentTitle", { ...base, state: "loading" }));
   assert.ok(controlDisabledReason("CTileParentContent", "CTileParentContent", "contentType", { ...base, showContent: false }));
   assert.equal(controlDisabledReason("CTileParentContent", "CTileParentContent", "showContent", { ...base, showContent: false }), undefined);
 });

test("nested component links retain the selected instance", () => {
  const nested = componentGroupsFor("CTileScheduleParent").filter(group => group.nested);
  assert.deepEqual([...new Set(nested.map(group => group.component))].sort(), ["CAvatar", "CChip", "CDivider"]);
  for (const group of nested) {
    assert.ok(variationIds[group.component]);
    const data = patchComponent(fixtures.populated.data, group.previewData);
    assert.deepEqual(parseFixture(JSON.stringify(data)), data);
  }
  const data = {...fixtures.populated.data, avatarRole: "supervisor", chipRole: "room"};
  assert.ok(controlDisabledReason("CAvatar", "", "professionalPhoto", data));
  assert.equal(controlDisabledReason("CAvatar", "", "supervisorInitials", data), undefined);
  assert.ok(controlDisabledReason("CChip", "", "scheduleStatus", data));
  assert.equal(controlDisabledReason("CChip", "", "scheduleRoom", data), undefined);
});

test("home does not expose a feed count override", () => {
  assert.ok(!componentGroupsFor("home").flatMap(g => g.controls).some(c => c.field === "feedCount"));
  assert.ok(componentGroupsFor("feed").flatMap(g => g.controls).some(c => c.field === "feedCount"));
});
