BEGIN;
CREATE TABLE IF NOT EXISTS public_page_view (
    event_id varchar(32) PRIMARY KEY,
    owner_id bigint NOT NULL,
    view_date date NOT NULL,
    personal boolean NOT NULL
);
CREATE INDEX IF NOT EXISTS public_page_view_owner_date_idx
    ON public_page_view (owner_id, view_date);
COMMIT;
