# Learning Studio upgrades — 2 November 2026

All fifteen requested features are implemented in the local source. Study still shows one task, with a short explanation revealed on tap. Optional media stays inside that explanation; the timer stays in Study tools. Fresh installations contain no courses or learning records.

| Feature | Where to use it |
| --- | --- |
| Reorder topics | Course builder: drag a topic, or use its up/down buttons. Save the course to apply the order. Stable IDs keep existing progress linked. |
| Daily goal | Home: **Set goal**. Minutes come from logged sessions; task counts come from dated completions across your enrolled courses. The same target appears in My day. Per-course planning budgets remain separate. |
| Backup status | Home: last backup status and **Back up now**. Android confirms a completed save or a verified folder backup. Browser downloads are labelled **prepared**, since the app cannot verify whether the file was retained. |
| Course import preview | My courses → **Import .lw course**: preview the first three topics, authored explanations, required tasks, media counts, and readable validation messages before adding anything. |
| Compare course updates | Import a course with an installed ID. Inspect added/retired topics, order changes, and before/after fields before **Update installed course**. Retired content and its past records remain available. |
| Reading controls | Settings or Themes & sounds: text size, line spacing, letter spacing, high contrast, and larger buttons. Applies to explanations, notes, and reading text. |
| Images in explanations | Course builder → selected topic → **Add image**. PNG, JPEG, WebP and GIF are portable inside the exported .lw file. |
| Audio explanations | Course builder → selected topic → **Add audio**. The single-task explanation contains a player. |
| Voice notes | Notes → **Record voice note** → **Start recording** → **Stop & save**. Audio is stored as a notebook block and included in full backups. Closing the dialog/backgrounding the app stops recording; cancellation discards it. |
| Notes into courses | Open a notebook page → **Make a course from this page**. Review a plain topic/explanation outline, create the course, then **Save & export .lw**. The original note is kept. |
| Study/break cycles | Study → **Study tools**, or Settings. Set study, short break, long break and round lengths. Breaks start automatically. Continuing into another study round is optional. Timers never add study minutes or task completions. |
| Review snoozing | Important reviews → **Tomorrow** or **Choose date**. Only the due date changes; recall history, interval and course completion stay intact. |
| Rest-aware streaks | Settings → Your rest days. Streaks bridge planned rest days and count actual dated task completions or logged study. Rest does not add activity, time, or completions. |
| Android widget modes | Settings or Phone & backups → Choose your widget: next task, daily goal, or quick notes. Quick notes opens a fresh notebook page. The setting applies to all installed LW widgets. |
| Optional encrypted sync | Settings or Phone & backups → Optional device sync. Configure a server and pair devices with the same generated code. Offline work remains available. |

Images/audio are limited to 5 MB per file and 9 MB total per course, with at most eight items per topic. Course exports/imports are limited to 16 MB, complete backups to 150 MB, and Android workspace records to 25 MB. Notebook audio is a separate attachment, with a ten-minute/24 MB recording limit.

## Optional sync setup

Sync is off by default. No remote host or user account has been configured. The included relay stores encrypted snapshots and revision metadata, never plaintext course content or notes.

For two desktop test workspaces on the same computer:

```powershell
node tools/sync-server.mjs
```

Use `http://localhost:4318` in both app instances. Choose **Create pairing code** on the first device, connect, and copy that code to the second. The first receive shows a choice between the two workspaces. Each receive saves a local restore point first.

For phone/computer use, run the service behind a valid HTTPS endpoint, or start its built-in TLS listener:

```powershell
$env:LW_SYNC_HOST = '0.0.0.0'
$env:LW_SYNC_PORT = '4318'
$env:LW_SYNC_DATA = 'C:\LW-Sync-Data'
$env:LW_SYNC_TLS_CERT = 'C:\certificates\fullchain.pem'
$env:LW_SYNC_TLS_KEY = 'C:\certificates\private-key.pem'
node tools/sync-server.mjs
```

Use that HTTPS address in both apps. HTTP is accepted only on loopback for desktop tests. The Android wrapper permits sync traffic only to the HTTPS endpoint explicitly configured in Settings.

Pairing configuration is device-local and excluded from workspace backups and synced contents. Workspace snapshots use AES-GCM with a fresh salt/IV and a PBKDF2-derived key. Keep the pairing code on your devices; disconnecting a device removes its local connection settings.

Automatic sync runs while the app is open and online. It waits while a form field is being edited. Both devices changing independently produces a choice of whole workspaces, with revision checks against concurrent writes. Sync does not merge individual fields or notes. Choosing **Decide later** pauses automatic sync until **Sync now** is selected.

## Validation limits

The [automated tests](../README.md#tests) cover browser workflows. Android Java compiles against API 35. Microphone permissions, background behavior, home-screen widgets, and native file saves still need testing on a physical Android device.
