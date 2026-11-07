-- Manual PostgreSQL migration. Run before deploying the new personal mapping.
-- Assumes the previous profile_image_url column contains relative file URLs.
-- If the column was already renamed manually, reconcile that schema first.
BEGIN;
ALTER TABLE personal ADD COLUMN IF NOT EXISTS profile_image_id varchar(255);

-- Abort rather than silently discard unmatched or ambiguous legacy references.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM personal p
        WHERE p.profile_image_id IS NULL
          AND NULLIF(p.profile_image_url, '') IS NOT NULL
          AND (SELECT count(*) FROM uploaded_file f WHERE f.file_url = p.profile_image_url) <> 1
    ) THEN
        RAISE EXCEPTION 'Unmatched or ambiguous profile URLs: reconcile uploaded_file before migrating';
    END IF;
END $$;

UPDATE personal p SET profile_image_id = f.file_id
FROM uploaded_file f
WHERE p.profile_image_id IS NULL AND p.profile_image_url = f.file_url;
-- Keep the old column for verification/rollback; the new application does not use it.
COMMIT;
