import ts from 'typescript';
import { readFileSync, writeFileSync } from 'node:fs';
const js = ts.transpileModule(readFileSync('src/workbench.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { fixtures, variationIds, componentGroupsFor, patchComponent } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const cases = Object.entries(variationIds).flatMap(([target, ids]) => [
  ...ids.map(id => ({ target, id, data: fixtures[id].data })),
  ...componentGroupsFor(target).flatMap(group => group.controls.flatMap(control => control.options.map(([value], index) => ({
    target,
    id: `control-${control.field}-${index}`,
    data: patchComponent(fixtures.populated.data, { [control.field]: typeof fixtures.default.data[control.field] === 'boolean' ? value === 'true' : value }),
  })))),
]);
writeFileSync('flutter_preview/test/variation_cases.json', JSON.stringify(cases, null, 2) + '\n');
