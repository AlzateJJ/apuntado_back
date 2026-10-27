import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const checks=[
  ['TypeScript','node_modules/typescript/bin/tsc','-p','tsconfig.architecture.json'],
  ['Dominio y aplicación','node_modules/tsx/dist/cli.mjs','--test','tests/domain.test.ts'],
  ['Fitness functions','node_modules/tsx/dist/cli.mjs','--test','tests/architecture/fitness.test.ts'],
  ['Esquema SQL','node_modules/tsx/dist/cli.mjs','--test','tests/schema.test.ts'],
  ['Complejidad estática','node_modules/eslint/bin/eslint.js','--config','eslint.architecture.config.mjs','design/src'],
  ['Medición de complejidad','node_modules/tsx/dist/cli.mjs','scripts/complexity-report.ts']
];
const results=[];
for(const [name,...args] of checks){
  const start=performance.now();const r=spawnSync(process.execPath,args,{encoding:'utf8'});
  const output=(r.stdout??'')+(r.stderr??'');console.log(`\n${name}\n${output}`);
  results.push({name,exitCode:r.status,durationMs:Math.round(performance.now()-start),output});
}
mkdirSync('docs/evidence',{recursive:true});
writeFileSync('docs/evidence/verification.json',JSON.stringify({node:process.version,platform:process.platform,checks:results},null,2)+'\n');
process.exitCode=results.every(r=>r.exitCode===0)?0:1;
