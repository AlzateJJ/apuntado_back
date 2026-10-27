import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const game='00000000-0000-4000-8000-000000000001';
const player='00000000-0000-4000-8000-000000000002';
test('SQL: DDL ejecutable, unicidad, FK, perfil inmutable, acumulación y rollback',async()=>{
  const db=new PGlite();
  try {
    await db.exec(readFileSync('database/schema.sql','utf8'));
    await db.query('INSERT INTO player VALUES ($1,$2)',[player,'Ana']);
    await db.query("INSERT INTO game(game_id,profile_id,status) VALUES ($1,'apuntado-v1','active')",[game]);
    await assert.rejects(()=>db.query("UPDATE game SET profile_id='classic-v1' WHERE game_id=$1",[game]));
    await db.query('INSERT INTO participation VALUES ($1,$2,1)',[game,player]);
    await db.query("INSERT INTO round VALUES ($1,1,'open','decision',$2)",[game,player]);
    await assert.rejects(()=>db.query("INSERT INTO round VALUES ($1,2,'open','decision',$2)",[game,player]));
    await assert.rejects(()=>db.exec("UPDATE rule_profile SET version=2 WHERE profile_id='apuntado-v1'"));
    await db.query("INSERT INTO card_copy VALUES ($1,1,1,'H',1)",[game]);
    await db.query("INSERT INTO card_copy VALUES ($1,2,2,'H',1)",[game]);
    await assert.rejects(()=>db.query("INSERT INTO card_copy VALUES ($1,3,1,'H',1)",[game]));
    await db.query("INSERT INTO card_position VALUES ($1,1,1,'hand',$2,0)",[game,player]);
    await assert.rejects(()=>db.query("INSERT INTO card_position VALUES ($1,1,1,'stock',NULL,0)",[game]));
    await assert.rejects(()=>db.query("INSERT INTO card_position VALUES ($1,1,99,'stock',NULL,1)",[game]));
    await db.query("INSERT INTO round_result VALUES ($1,1,$2,'combinaciones',NULL,'next-round',1)",[game,player]);
    await db.query('INSERT INTO score_movement VALUES ($1,1,$2,10)',[game,player]);
    await assert.rejects(()=>db.query('INSERT INTO score_movement VALUES ($1,1,$2,10)',[game,player]));
    await db.query("UPDATE round SET status='closed',phase='closed' WHERE game_id=$1",[game]);
    await db.query("INSERT INTO round VALUES ($1,2,'open','decision',$2)",[game,player]);
    await db.query("INSERT INTO round_result VALUES ($1,2,$2,'toque',NULL,'next-round',2)",[game,player]);
    await db.query('INSERT INTO score_movement VALUES ($1,2,$2,-5)',[game,player]);
    const score=await db.query<{score:number}>('SELECT score FROM current_score'); assert.equal(score.rows[0].score,5);
    await assert.rejects(()=>db.transaction(async tx=>{
      await tx.query('INSERT INTO processed_operation VALUES ($1,$2,$3,$4,$5)',[game,'rollback',player,'hash','{}']);
      throw new Error('forced rollback');
    }));
    assert.equal((await db.query('SELECT * FROM processed_operation')).rows.length,0);
  } finally { await db.close(); }
});
