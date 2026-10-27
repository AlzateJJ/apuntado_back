import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { filesOfProject } from 'tsarch';
import { ESLint } from 'eslint';
import ts from 'typescript';
const CONFIG = path.resolve('tsconfig.architecture.json');
const files = () => filesOfProject(CONFIG);
const sourceFiles = readdirSync('design/src',{recursive:true}).filter(f=>String(f).endsWith('.ts')).map(String);
test('FF-00 alcance no vacío: todos los módulos y ambos perfiles están presentes',()=>{
  assert.ok(sourceFiles.length >= 14);
  for (const folder of ['ui','domain','contracts','application','persistence','synchronization','variants/classic','variants/apuntado']) {
    assert.ok(sourceFiles.some(f=>f.replaceAll('\\','/').startsWith(folder+'/')),folder);
  }
});
test('FF-01 UI no accede a persistencia',async()=>{
  // Control de sensibilidad: UI sí importa contratos; el selector debe encontrar esa arista real.
  assert.ok((await files().matchingPattern('^design/src/ui/.*').shouldNot().dependOnFiles().matchingPattern('^design/src/contracts/.*').check()).length>0);
  const violations=await files().matchingPattern('^design/src/ui/.*').shouldNot().dependOnFiles().matchingPattern('^design/src/persistence/.*').check();
  assert.deepEqual(violations,[]);
});
test('FF-02 todas las dependencias de archivos están libres de ciclos',async()=>{
  assert.deepEqual(await files().matchingPattern('^design/src/.*').should().beFreeOfCycles().check(),[]);
});
test('FF-03 las dos variantes no se importan entre sí',async()=>{
  for(const [from,to] of [['classic','apuntado'],['apuntado','classic']]) {
    assert.deepEqual(await files().matchingPattern(`^design/src/variants/${from}/.*`).shouldNot().dependOnFiles().matchingPattern(`^design/src/variants/${to}/.*`).check(),[]);
  }
});
test('FF-04 matriz de dependencias internas permitidas',async()=>{
  const allowed:Record<string,string[]>={ contracts:[], domain:['contracts'], application:['contracts'],
    variants:['contracts','domain'], ui:['contracts'], persistence:['contracts'], synchronization:['contracts'] };
  for(const [from,permitted] of Object.entries(allowed)) {
    for(const to of [...Object.keys(allowed),'bootstrap']) {
      if(from===to || permitted.includes(to)) continue;
      assert.deepEqual(await files().matchingPattern(`^design/src/${from}/.*`).shouldNot().dependOnFiles().matchingPattern(`^design/src/${to}/.*`).check(),[],`${from} -> ${to}`);
    }
  }
});
test('FF-05 dominio, reglas, aplicación y UI sin imports de pg, Sequelize o transporte de servidor',()=>{
  for(const relative of sourceFiles.filter(f=>/^(domain|variants|application|ui)[/\\]/.test(f))) {
    const file=path.join('design/src',relative);
    const ast=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
    const visit=(node:ts.Node):void=>{
      if(ts.isStringLiteral(node) && /^(pg|sequelize|express|ws|socket\.io)(\/|$)/.test(node.text)) assert.fail(`${file}: dependencia externa prohibida ${node.text}`);
      ts.forEachChild(node,visit);
    };visit(ast);
  }
});
test('FF-06 todos los validadores y el coordinador tienen CC <= 10',async()=>{
  const lint=new ESLint({overrideConfigFile:'eslint.architecture.config.mjs'});
  const results=await lint.lintFiles(['design/src/domain/**/*.ts','design/src/variants/**/*.ts','design/src/application/**/*.ts']);
  assert.ok(results.length>=7); assert.equal(results.reduce((n,r)=>n+r.errorCount,0),0,JSON.stringify(results.flatMap(r=>r.messages)));
});
test('FF-07 controles negativos: se detectan UI->DB, ciclo y dependencia entre variantes',async()=>{
  const invalid=()=>filesOfProject(path.resolve('tests/fixtures/invalid/tsconfig.json'));
  assert.ok((await invalid().matchingPattern('^ui/.*').shouldNot().dependOnFiles().matchingPattern('^persistence/.*').check()).length>0);
  assert.ok((await invalid().matchingPattern('^cycle/.*').should().beFreeOfCycles().check()).length>0);
  assert.ok((await invalid().matchingPattern('^variants/classic/.*').shouldNot().dependOnFiles().matchingPattern('^variants/apuntado/.*').check()).length>0);
});
test('FF-08 control negativo: CC 11 produce error y CC 10 se admite',async()=>{
  const lint=new ESLint({overrideConfigFile:'eslint.architecture.config.mjs'});
  const code=(branches:number)=>`export function invalid(x:number){${Array.from({length:branches},(_,i)=>`if(x===${i}) return ${i};`).join('')}return -1;}`;
  const bad=await lint.lintText(code(10),{filePath:'design/src/domain/negative.ts'});
  const good=await lint.lintText(code(9),{filePath:'design/src/domain/boundary.ts'});
  assert.equal(bad[0].errorCount,1); assert.equal(good[0].errorCount,0);
});
