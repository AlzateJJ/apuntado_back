import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isMeld, points, validateHand } from '../design/src/domain/cards';
import { closesPattern, touchPenalty } from '../design/src/domain/combinations';
import { catalog } from '../design/src/bootstrap/catalog';
import { card, command, full433, full55, state, touch5 } from './helpers';
import { CloseRound } from '../design/src/application/closeRound';
import { VariantCatalog } from '../design/src/application/catalog';
import { MemoryStore } from '../design/src/persistence/memory';
import { authorizedView } from '../design/src/application/view';
import { dispatchPending } from '../design/src/synchronization/dispatch';
import { requestClose } from '../design/src/ui/navigation';

test('A vale 10; escaleras A23 y QKA válidas, KA2 inválida',()=>{
  assert.equal(points(card(1,'H')),10); assert.equal(points(card(13,'H')),10);
  assert.ok(isMeld([1,2,3].map(n=>card(n,'H')))); assert.ok(isMeld([12,13,1].map(n=>card(n,'H'))));
  assert.equal(isMeld([13,1,2].map(n=>card(n,'H'))),false);
});
test('duplicados entre mazos válidos; misma carta física no se reutiliza',()=>{
  assert.ok(isMeld([card(1,'C'),card(1,'C',2),card(1,'H')]));
  const hand=full433(); hand[0]=hand[1]; assert.throws(()=>validateHand(hand),/REUSED/);
});
test('4-3-3 y 5-5 independientes del orden visual',()=>{
  assert.ok(closesPattern(full433().reverse(),[[4,3,3]])); assert.ok(closesPattern(full55(),[[5,5]]));
  assert.equal(closesPattern(full55(),[[4,3,3]]),false);
});
test('toque inclusivo de cinco y frontera de autoeliminación',()=>{
  assert.equal(touchPenalty(touch5(),-95),5); assert.throws(()=>touchPenalty(touch5(),-96),/INVALID_TOUCH/);
});
test('toque 2+2 y 2+3; rechazo de 3+3 y de ocho pintas sin combinaciones',()=>{
  const eight=[7,9].flatMap(n=>['C','D','H','S'].map(s=>card(n,s as 'C')));
  assert.equal(touchPenalty([...eight,card(2,'H'),card(2,'H',2)],0),4);
  assert.equal(touchPenalty([...eight,card(2,'H'),card(3,'H')],0),5);
  assert.throws(()=>touchPenalty([...eight,card(3,'H'),card(3,'H',2)],0));
  const sparse=[1,3,5,7,9,11,13].map(n=>card(n,'H')).concat(card(1,'H',2),card(2,'D'),card(2,'S'));
  assert.throws(()=>touchPenalty(sparse,0));
});
test('nueve pintas admiten toque; diez pintas dan +25 sin apilar +10',()=>{
  const nine=[1,2,4,5,7,8,10,11,13].map(n=>card(n,'H'));
  assert.equal(touchPenalty([...nine,card(5,'S')],0),5);
  const s=state('apuntado',Array.from({length:10},(_,i)=>card(i+1,'H')));
  const r=catalog.get('apuntado',1).settle({state:s,actorId:'ana',closure:'pintas'});
  assert.equal(r.changes[0].delta,25);
});
test('Clásica termina en home sin movimientos de puntos',async()=>{
  const service=new CloseRound(new MemoryStore(state('classic')),catalog);
  const result=await service.execute('game-1','ana',command);
  assert.equal(result.winnerId,'ana'); assert.equal(result.next,'home'); assert.deepEqual(result.changes,[]);
  const route=await requestClose({close:async()=>result},'game-1',command); assert.equal(route,'/');
});
test('Apuntado conserva descuento aprobado y continúa con dos activos',async()=>{
  const service=new CloseRound(new MemoryStore(state('apuntado',touch5(),-95)),catalog);
  const r=await service.execute('game-1','ana',{...command,closure:'toque'});
  assert.deepEqual(r.changes[0],{playerId:'ana',before:-95,delta:-5,after:-100}); assert.equal(r.next,'next-round');
});
test('+51 gana; único activo gana',()=>{
  assert.equal(catalog.get('apuntado',1).settle({state:state('apuntado',full433(),41),actorId:'ana',closure:'combinaciones'}).winnerId,'ana');
  const s=state(); const losing={...s,players:[s.players[0],{...s.players[1],score:-100,hand:touch5().map(c=>({...c,deck:2 as const,id:`x-${c.id}`}))}]};
  const r=catalog.get('apuntado',1).settle({state:losing,actorId:'ana',closure:'combinaciones'});
  assert.deepEqual(r.eliminated,['luis']); assert.equal(r.winnerId,'ana');
});
test('reintento concurrente produce un acta y un evento',async()=>{
  const store=new MemoryStore(state()); const service=new CloseRound(store,catalog);
  const [a,b]=await Promise.all([service.execute('game-1','ana',command),service.execute('game-1','ana',command)]);
  assert.deepEqual(a,b); assert.equal(store.operationCount(),1); assert.equal((await store.pending()).length,1);
  assert.deepEqual(a,JSON.parse(JSON.stringify(a)),'La respuesta sobrevive al round-trip JSON sin -0');
  assert.equal(store.state.phase,'closed');
  for (const change of a.changes) assert.equal(store.state.players.find(p=>p.id===change.playerId)?.score,change.after);
});
test('dos cierres distintos: solo uno se confirma',async()=>{
  const store=new MemoryStore(state()); const service=new CloseRound(store,catalog);
  const r=await Promise.allSettled([service.execute('game-1','ana',command),service.execute('game-1','ana',{...command,operationId:'op-2'})]);
  assert.equal(r.filter(x=>x.status==='fulfilled').length,1);
});
test('rechaza identidad ajena, turno incorrecto, versión antigua y cambio de payload',async()=>{
  const service=new CloseRound(new MemoryStore(state()),catalog);
  await assert.rejects(()=>service.execute('game-1','intruso',command),/NOT_MEMBER/);
  await assert.rejects(()=>service.execute('game-1','luis',command),/NOT_YOUR_TURN/);
  await assert.rejects(()=>service.execute('game-1','ana',{...command,expectedVersion:2}),/STALE/);
  await service.execute('game-1','ana',command);
  await assert.rejects(()=>service.execute('game-1','ana',{...command,closure:'pintas'}),/IDEMPOTENCY_CONFLICT/);
});
test('fallo previo al commit revierte estado, operación y outbox',async()=>{
  const store=new MemoryStore(state());store.failBeforeCommit=true;
  await assert.rejects(()=>new CloseRound(store,catalog).execute('game-1','ana',command),/STORAGE_FAILURE/);
  assert.equal(store.state.status,'open'); assert.equal(store.operationCount(),0); assert.equal((await store.pending()).length,0);
});
test('toque rechazado no revela manos ni cambia puntos',async()=>{
  const store=new MemoryStore(state('apuntado',touch5(),-96));
  await assert.rejects(()=>new CloseRound(store,catalog).execute('game-1','ana',{...command,closure:'toque'}));
  const view=authorizedView(store.state,'ana'); assert.equal(view.players[1].hand,undefined); assert.equal(view.players[0].score,-96);
  assert.throws(()=>authorizedView(store.state,'extraño'),/NOT_MEMBER/);
});
test('outbox permanece pendiente si falla envío; reintento conserva eventId',async()=>{
  const store=new MemoryStore(state()); await new CloseRound(store,catalog).execute('game-1','ana',command);
  const initial=await store.pending();
  await assert.rejects(()=>dispatchPending(store,{publish:async()=>{throw new Error('offline');}}));
  assert.deepEqual(await store.pending(),initial);
  const sent:string[]=[];await dispatchPending(store,{publish:async e=>{sent.push(e.id);}});
  assert.deepEqual(sent,[initial[0].id]); assert.equal((await store.pending()).length,0);
});
test('tercera estrategia de prueba se registra sin modificar CloseRound',async()=>{
  const variant={key:'test-extension',version:1,settle:()=>({changes:[],eliminated:[],winnerId:'ana',next:'home' as const})};
  const service=new CloseRound(new MemoryStore(state('test-extension')),new VariantCatalog([variant]));
  assert.equal((await service.execute('game-1','ana',command)).winnerId,'ana');
  assert.throws(()=>catalog.get('apuntado',99),/UNKNOWN_RULES/);
  assert.throws(()=>new VariantCatalog([variant,variant]),/DUPLICATE_VARIANT/);
});
