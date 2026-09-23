import ts from 'typescript';import {readFileSync,writeFileSync} from 'node:fs';
const js=ts.transpileModule(readFileSync('src/workbench.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;
const {fixtures,variationIds}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
writeFileSync('flutter_preview/test/variation_cases.json',JSON.stringify(Object.entries(variationIds).flatMap(([target,ids])=>ids.map(id=>({target,id,data:fixtures[id].data}))),null,2)+'\n');
