# Personal image references

- Save requests now use `profile_image_id`: the `fileId` string returned by file upload, not the numeric uploaded-file table primary key or a URL.
- Detail responses retain `profileImageUrl` and add `profileImageId` (existing response camelCase convention).
- Saving a non-null unknown/blank ID returns `FILE_NOT_FOUND` (404).
- Null on update preserves the existing image, matching the previous update behavior. Null on create means no image. Explicit image removal is not added by this change.
- Reading an absent/deleted image returns a null URL; storage failures propagate as errors.
- PersonalService uses PersonalImagePort. PersonalImageAdapter invokes the upload module's FileQuery and maps its public result into a personal-owned type. No upload JPA entity crosses the module boundary.
- FileQueryService constructs the accessible URL from upload configuration and stored file metadata. The personal API mapper performs no lookup.
- For a future remote upload service, replace the local image adapter with an HTTP implementation; define timeouts and failure translation there.

## Existing database

The JPA mapping now expects `personal.profile_image_id`. Schema auto-update does not migrate URL values into IDs. The manual script in `migrations/personal-profile-image-id.sql` backfills IDs by matching legacy relative URLs with `uploaded_file.file_url` and aborts if a match is missing/ambiguous. It preserves the legacy column. Review the actual database first, particularly if its column was already renamed or stores absolute URLs. This script is not auto-executed.

This change checks file existence, not uploader ownership or actual image content; the current upload metadata does not identify the uploader.
