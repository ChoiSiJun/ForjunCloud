BEGIN;
CREATE TABLE IF NOT EXISTS profile_summary (
    user_id varchar(255) PRIMARY KEY,
    published boolean NOT NULL DEFAULT false,
    content jsonb NOT NULL
);
COMMIT;
