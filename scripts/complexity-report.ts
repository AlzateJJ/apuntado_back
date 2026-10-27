import { ESLint } from 'eslint';
import { mkdirSync, writeFileSync } from 'node:fs';
async function main(){
  const lint=new ESLint({overrideConfigFile:'eslint.architecture.config.mjs',overrideConfig:{rules:{complexity:['error',{max:0,variant:'classic'}]}}});
  const results=await lint.lintFiles(['design/src/domain/**/*.ts','design/src/variants/**/*.ts','design/src/application/**/*.ts']);
  const functions=results.flatMap(r=>r.messages.filter(m=>m.ruleId==='complexity').map(m=>({file:r.filePath.replaceAll('\\','/').split('/repositorio/').at(-1),line:m.line,complexity:Number(m.message.match(/complexity of (\d+)/)?.[1]),description:m.message.split(' has a complexity')[0]})));
  if(!functions.length || functions.some(f=>!Number.isFinite(f.complexity))) throw new Error('No se pudo medir el alcance');
  const report={node:process.version,threshold:10,variant:'classic',maximum:Math.max(...functions.map(f=>f.complexity)),functions};
  mkdirSync('docs/evidence',{recursive:true});writeFileSync('docs/evidence/complexity.json',JSON.stringify(report,null,2)+'\n');
  console.log(`Complejidad: ${functions.length} funciones; máximo ${report.maximum}; límite 10`);
  if(report.maximum>10) process.exitCode=1;
}main();
