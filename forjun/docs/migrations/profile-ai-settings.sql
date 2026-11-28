BEGIN;
CREATE TABLE IF NOT EXISTS profile_ai_settings (
    user_id bigint PRIMARY KEY,
    base_url varchar(512) NOT NULL,
    model varchar(200) NOT NULL,
    encrypted_key text NOT NULL
);
COMMIT;
