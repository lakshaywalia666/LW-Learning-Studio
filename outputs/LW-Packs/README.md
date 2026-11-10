# Reusable formats

This folder contains the .lw JSON course schema, validator, and a theme example. No courses or topics are installed by default. Create or import courses in the app when you are ready.

Generic testing content is kept under ../Cyberpath/tests/fixtures and is excluded from runtime assets.

Topics may include optional `lessonMedia` entries: `{id, kind: "image" | "audio", name, dataURL}`. Use the builder to add them and export a portable course. Media uses embedded base64 PNG/JPEG/WebP/GIF or audio; the validator limits eight items per topic, 5 MB per file, and 9 MB total per course. Full .lw files must stay under 16 MB. Personal voice notes belong in workspace backups, not course exports.

PDF worksheets use `lessonMedia` entries with `kind: "pdf"` and a base64 `application/pdf` data URL. Topics may include `recall: {question, answer}` for an optional self-check. Private quick notes and recall responses remain in workspace backups.
