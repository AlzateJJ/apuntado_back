BEGIN;
CREATE TABLE rule_profile (
  profile_id text PRIMARY KEY, mode text NOT NULL, version integer NOT NULL CHECK (version > 0),
  deck_count smallint NOT NULL CHECK (deck_count = 2), hand_size smallint NOT NULL CHECK (hand_size = 10),
  max_players smallint NOT NULL CHECK (max_players BETWEEN 2 AND 6),
  UNIQUE (mode, version)
);
CREATE FUNCTION freeze_profile() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Un perfil publicado es inmutable; cree otra versión'; END $$;
CREATE TRIGGER immutable_profile BEFORE UPDATE ON rule_profile FOR EACH ROW EXECUTE FUNCTION freeze_profile();
CREATE TABLE player (player_id uuid PRIMARY KEY, display_name varchar(60) NOT NULL);
CREATE TABLE game (
  game_id uuid PRIMARY KEY, profile_id text NOT NULL REFERENCES rule_profile,
  status text NOT NULL CHECK (status IN ('waiting','active','finished')),
  version integer NOT NULL DEFAULT 0 CHECK (version >= 0), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE FUNCTION freeze_game_profile() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.profile_id <> OLD.profile_id THEN RAISE EXCEPTION 'El perfil de la partida es inmutable'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER immutable_game_profile BEFORE UPDATE ON game FOR EACH ROW EXECUTE FUNCTION freeze_game_profile();
CREATE TABLE participation (
  game_id uuid NOT NULL REFERENCES game, player_id uuid NOT NULL REFERENCES player,
  seat smallint NOT NULL CHECK (seat BETWEEN 1 AND 6),
  PRIMARY KEY (game_id, player_id), UNIQUE (game_id, seat)
);
CREATE TABLE round (
  game_id uuid NOT NULL REFERENCES game, round_no integer NOT NULL CHECK (round_no > 0),
  status text NOT NULL CHECK (status IN ('open','closed')),
  phase text NOT NULL CHECK (phase IN ('draw','discard','decision','closed')),
  turn_player_id uuid NOT NULL,
  PRIMARY KEY (game_id, round_no),
  FOREIGN KEY (game_id, turn_player_id) REFERENCES participation (game_id, player_id),
  CHECK ((status = 'closed') = (phase = 'closed'))
);
CREATE UNIQUE INDEX one_open_round ON round(game_id) WHERE status = 'open';
CREATE TABLE card_copy (
  game_id uuid NOT NULL REFERENCES game, card_no smallint NOT NULL CHECK (card_no BETWEEN 1 AND 104),
  deck smallint NOT NULL CHECK (deck IN (1,2)), suit char(1) NOT NULL CHECK (suit IN ('C','D','H','S')),
  rank smallint NOT NULL CHECK (rank BETWEEN 1 AND 13),
  PRIMARY KEY (game_id, card_no), UNIQUE (game_id, deck, suit, rank)
);
CREATE TABLE card_position (
  game_id uuid NOT NULL, round_no integer NOT NULL, card_no smallint NOT NULL,
  zone text NOT NULL CHECK (zone IN ('hand','stock','discard')),
  owner_id uuid, ordinal smallint NOT NULL CHECK (ordinal BETWEEN 0 AND 103),
  PRIMARY KEY (game_id, round_no, card_no),
  FOREIGN KEY (game_id, round_no) REFERENCES round,
  FOREIGN KEY (game_id, card_no) REFERENCES card_copy,
  FOREIGN KEY (game_id, owner_id) REFERENCES participation (game_id, player_id),
  UNIQUE NULLS NOT DISTINCT (game_id, round_no, zone, owner_id, ordinal),
  CHECK ((zone = 'hand') = (owner_id IS NOT NULL))
);
CREATE TABLE round_result (
  game_id uuid NOT NULL, round_no integer NOT NULL, actor_id uuid NOT NULL,
  closure text NOT NULL CHECK (closure IN ('combinaciones','pintas','toque')),
  winner_id uuid, next_action text NOT NULL CHECK (next_action IN ('home','next-round')),
  committed_version integer NOT NULL CHECK (committed_version > 0),
  PRIMARY KEY (game_id, round_no), UNIQUE (game_id, committed_version),
  FOREIGN KEY (game_id, round_no) REFERENCES round,
  FOREIGN KEY (game_id, actor_id) REFERENCES participation (game_id, player_id),
  FOREIGN KEY (game_id, winner_id) REFERENCES participation (game_id, player_id),
  CHECK ((winner_id IS NOT NULL) = (next_action = 'home'))
);
CREATE TABLE score_movement (
  game_id uuid NOT NULL, round_no integer NOT NULL, player_id uuid NOT NULL,
  delta integer NOT NULL CHECK (delta BETWEEN -100 AND 25),
  PRIMARY KEY (game_id, round_no, player_id),
  FOREIGN KEY (game_id, round_no) REFERENCES round_result,
  FOREIGN KEY (game_id, player_id) REFERENCES participation (game_id, player_id)
);
CREATE TABLE processed_operation (
  game_id uuid NOT NULL REFERENCES game, operation_id varchar(128) NOT NULL,
  actor_id uuid NOT NULL, fingerprint text NOT NULL, response jsonb NOT NULL,
  PRIMARY KEY (game_id, operation_id),
  FOREIGN KEY (game_id, actor_id) REFERENCES participation (game_id, player_id)
);
CREATE TABLE outbox (
  event_id text PRIMARY KEY, game_id uuid NOT NULL REFERENCES game, version integer NOT NULL,
  event_type text NOT NULL CHECK (event_type = 'RoundClosed'),
  created_at timestamptz NOT NULL DEFAULT now(), delivered_at timestamptz,
  UNIQUE (game_id, version, event_type)
);
CREATE VIEW current_score AS
SELECT p.game_id, p.player_id, COALESCE(SUM(m.delta), 0)::integer AS score
FROM participation p LEFT JOIN score_movement m USING (game_id, player_id)
GROUP BY p.game_id, p.player_id;
INSERT INTO rule_profile VALUES ('classic-v1','classic',1,2,10,6),('apuntado-v1','apuntado',1,2,10,6);
COMMIT;
