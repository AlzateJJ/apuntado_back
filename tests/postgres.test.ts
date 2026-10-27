import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import pg from 'pg';
import { PostgresStore } from '../design/src/persistence/postgres';
import { CloseRound } from '../design/src/application/closeRound';
import { catalog } from '../design/src/bootstrap/catalog';
import { full433, command } from './helpers';
const connectionString=process.env.ARCH_TEST_DATABASE_URL;
test('PostgreSQL: bloqueo entre conexiones, idempotencia y rollback del cierre completo',{skip:!connectionString},async()=>{
  const pool=new pg.Pool({connectionString,max:4});
  const game='10000000-0000-4000-8000-000000000001';
  const ana='10000000-0000-4000-8000-000000000002',luis='10000000-0000-4000-8000-000000000003';
  try{
    // Base efímera y exclusiva creada por CI; nunca se ejecuta contra la base del prototipo.
    await pool.query(readFileSync('database/schema.sql','utf8'));
    await pool.query('INSERT INTO player VALUES ($1,$2),($3,$4)',[ana,'Ana',luis,'Luis']);
    await pool.query("INSERT INTO game(game_id,profile_id,status,version) VALUES ($1,'apuntado-v1','active',3)",[game]);
    await pool.query('INSERT INTO participation VALUES ($1,$2,1),($1,$3,2)',[game,ana,luis]);
    await pool.query("INSERT INTO round VALUES ($1,1,'open','decision',$2)",[game,ana]);
    let id=1;
    for(const [owner,deck] of [[ana,1],[luis,2]] as const){
      let ordinal=0;
      for(const c of full433()){
        await pool.query('INSERT INTO card_copy VALUES ($1,$2,$3,$4,$5)',[game,id,deck,c.suit,c.rank]);
        await pool.query("INSERT INTO card_position VALUES ($1,1,$2,'hand',$3,$4)",[game,id,owner,ordinal++]);id++;
      }
    }
    const service=new CloseRound(new PostgresStore(pool),catalog);
    // Una falla de outbox ocurre después de escribir resultado y puntos: todo debe revertirse.
    await pool.query("CREATE FUNCTION fail_outbox() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'forced outbox failure'; END $$; CREATE TRIGGER fail_test BEFORE INSERT ON outbox FOR EACH ROW EXECUTE FUNCTION fail_outbox()");
    await assert.rejects(()=>service.execute(game,ana,command),/forced outbox/);
    assert.equal((await pool.query('SELECT * FROM score_movement')).rowCount,0);
    assert.equal((await pool.query('SELECT * FROM round_result')).rowCount,0);
    assert.equal((await pool.query('SELECT * FROM processed_operation')).rowCount,0);
    assert.equal((await pool.query('SELECT version FROM game')).rows[0].version,3);
    await pool.query('DROP TRIGGER fail_test ON outbox');
    const [a,b]=await Promise.all([service.execute(game,ana,command),service.execute(game,ana,command)]);
    assert.deepEqual(a,b);assert.equal(a.changes.find(c=>c.playerId===ana)?.delta,10);
    assert.equal((await pool.query('SELECT * FROM round_result')).rowCount,1);
    assert.equal((await pool.query('SELECT * FROM outbox')).rowCount,1);
    assert.equal((await pool.query('SELECT * FROM score_movement')).rowCount,2);
    await assert.rejects(()=>service.execute(game,ana,{...command,operationId:'another'}),/ROUND_NOT_READY/);
  } finally {await pool.end();}
});
