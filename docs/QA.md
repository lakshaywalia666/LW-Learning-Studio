> Final audit, 4 November 2026: 309 tests pass; 89 application modules parse; 19 Android sources build; 403 assets match the QA APK. Android15 emulator checks pass in flexible/precise modes and in-place data retention passes. Source studio35 / raw-v19. The catalogue remains124 implemented source items,8 partial,28 planned. [Final audit and limits](FINAL-RELEASE-AUDIT.md). The internal QA APK is not a promoted release; the previous shared1.3.0 remains unchanged.

> Current phone-test build: **1.4.0/build 7**, studio46/raw-v30. 322 tests and Android 17 checks pass; final phone testing remains. See [OFFLINE-COMPLETION-1.4.0.md](OFFLINE-COMPLETION-1.4.0.md) and [PHONE-TEST-1.4.0.md](PHONE-TEST-1.4.0.md). The older entries below are historical.


# Workflow audit — 2 November 2026

## Current feedback release — 3 November 2026 — 1.3.0

The 160-addition rollout is active: 44 implemented, 2 partial, 114 planned. Online AI/services, shared groups and a hosted course library remain deferred by the user. This release is a tested checkpoint; it does not claim the entire catalogue is complete.

Final signed/non-debuggable APK: outputs/releases/LW-Learning-Studio-1.3.0.apk, code 6, 4677381 bytes, 274 offline assets. SHA-256: `954999ee34b565d79aa16154f92a6a110ed2829e2a6396631e89345c247f80e6`. Package and signing identity are retained. It installed over the existing 1.2.0 emulator app without clearing data. Prior APKs and source checkpoints remain available.

- **Automated:** all 214 tests pass. New planning tests cover merged windows, busy-block subtraction, overlaps, boundaries, genuine completion exclusion, no invented progress/time, current-day capacity, shortfalls, stale previews, catch-up history, active-plan uniqueness and private backup/course-export boundaries. New practice tests cover filters/archive, immutable question keys, mixed selection, exact short answers, number/range/tolerance/unit checks, original timer deadlines, late answers, idempotent expiry, retry recovery, old course attempts, self-assessment labels and private backups. All 51 root modules parse; the inventory includes 46 screens.
- **Browser navigation:** all 46 routes at 393 px rendered without boot errors, app console errors or horizontal overflow. Evidence: work/android-release/offline-routes.json. Time blocks, availability, bank and results also fit 320/768/1200 px (12 observations, offline-sizes.json). New explanations and question text were verified at 20 px using the real reading-preference control; planned-task explanations also computed 20 px with zero checkboxes.
- **Planning workflow:** created a busy block on 4 Nov, 18:00–18:30, and a Wednesday 18:00–19:00 study window. The two unfinished course tasks needed 50 minutes. Preview placed 30 minutes and reported the 20-minute shortfall. Extending the deadline to 13 Nov placed all 50 minutes. Revising archived the two earlier upcoming blocks. A manually colliding activity showed two overlaps. Open task showed only its explanation; Open Study retained Task 2 of 3, one expandable task, zero checkboxes, and 1/3 original completions.
- **Practice workflow:** created a Drawing choice question and a Measurements numerical question. Ran a one-minute mixed test. The 3.15 m answer was accepted for 3.14 ± 0.01 m; Square was rejected for the three-sided shape question. Reload retained both answers and a decreasing original deadline. The live timer finished automatically at expiry with 1/2 correct. Retrying the missed question recorded recovery and both attempts. A quiz created through the existing Exercises screen also appeared in Mistakes, linked to its evidence page, and recovered after retry. No real study minutes or additional course completions were added.
- **Backup restoration:** exported through Home and restored through Settings/file-picker/preview/confirmation on the isolated QA origin. The last file contained 1 course, 1 weekly window, 7 blocks, 1 deadline plan, 2 private questions, 2 tests, 2 legacy exercise attempts and 4 notebook pages. Both recovered mistake histories and evidence links survived. Copies: work/android-release/offline-complete-backup.json and offline-planning-practice-backup.json. This QA data is not seeded into the app or included in the APK.
- **Android 15/API 35:** native checks pass in flexible and precise alarm modes on the final APK. Checks include local asset/startup availability, version, adaptive icon/launcher shortcut extras, planning/test shell assets, actual notification posting/cancellation, next-alarm scheduling, snooze/independent alert date, revision conflicts, stale-profile rejection, file/profile isolation and preservation of the primary workspace. Reports: native-checks-flexible.txt and native-checks-precise.txt. Delivery is invoked directly in the test; it does not establish long-duration Doze/OEM timing.
- **Packaging:** alignment/signatures/version/assets are verified by tools/build_apk.mjs. The APK excludes signing keys, test helpers, source checkpoints and user/QA workspaces. The newly changed source assets were compared with their packaged copies. Original 1.2.0 checkpoint SHA-256: `0dad09e9d647dc44614d832762617dea84b0b6b56f61ef4c5a11a361f98c6cdb`.

Physical-phone keyboard and file-provider variations, microphone permissions, widgets, background alert timing and sustained motion still need device feedback. Timed tests use wall-clock deadlines and finish on the next check after suspension; they are personal practice tools. Numerical units require exact matches. Older exercise attempts without snapshots use available current course content. These are explicit implementation limits.


The app starts empty. Upgrade testing used disposable workspaces on ports 14322–14324. Test courses were not installed in the normal port 4317 workspace. The recording harness used a mock microphone, without acquiring the user's microphone.

## Checks

- 148 automated tests pass, with no failures or skips. All app-owned JavaScript passes syntax checks; the route inventory retains 39 screens.
- Tests cover existing progress/recovery rules plus reordering, goal totals, media validation, reading/widget/rest preferences, comparisons, note outlines, snoozing, cycle transitions, honest backup status and actual activity in streaks.
- Recorder tests cover Start/Save/Cancel, released tracks, denied permission, and cancellation while permission is pending.
- Sync tests use a real local relay and two clients: encryption/tampering, endpoint validation, metadata exclusion, upload/download, divergent edits, concurrent revisions, local edits during a pull, disconnect, and offline recovery.
- All Android Java sources compile with Windows JDK 17 against API 35 and the existing resource class. Microphone permissions, widget modes/actions and the HTTPS endpoint allowlist compile successfully.

## Browser results

| Workflow | Result |
| --- | --- |
| Empty setup → Home goal → preferences | Pass; no courses or activity seeded |
| All 36 main navigation links plus Welcome, Reader and Search | Pass; all 39 routes rendered with no console errors |
| Name/plain topics → builder → .lw export | Pass; no manual IDs or JSON |
| Topic reordering after completion | Pass; progress retained and next task follows saved order |
| PNG/WAV inside an explanation | Pass; portable export validates; one-second audio plays without error |
| Import comparison and installed update | Pass; added/retired/changed/order preview, completed work and retired content retained |
| Single-task Study | One expandable task, zero checkboxes, optional media inside the explanation |
| Reading controls | Rendered 20px text, 0.8px tracking, white/black high contrast, 48px button minimum verified |
| Notebook outline → course | Pass; editable preview and original note retained |
| Review snoozing | Tomorrow and custom date passed without adding recall results |
| Study/break cycle | Live countdown → automatic break → paused Ready state; zero invented minutes |
| Home full backup | Parsed independently; browser status honestly reads Prepared |
| Mock voice recording | Local notebook audio saved, played, survived reload and full backup restoration |
| Manual sync | Two browser origins paired, previewed conflicts, received content, exchanged a changed goal |
| Automatic foreground sync | Changed goal reached the second workspace without pressing Sync now |
| Narrow layout | No horizontal overflow at observed 600px width; browser did not apply the requested 390px test override |

The earlier baseline also verified empty navigation, task Undo, all five worlds, note/image recovery, PDF reading/bookmarks/annotations, notebook search and populated → empty → populated backups. Those model regressions still pass.

Issues caught and fixed include unstable settings references, browser fetch binding, the recurring timer hookup, edits arriving during sync, microphone cleanup while permission is pending, and high-contrast styles being overridden by theme variables.

## Remaining device checks

Android installation, real microphone permission/grant/denial, process death, background behavior, home-screen widgets, native pickers and confirmed file/folder backups, reminders, haptics and sustained performance need a physical Android device. Compilation does not prove those behaviors.

The sync implementation and local relay work. No public HTTPS sync service or production deployment has been configured; phone/TLS behavior needs the chosen host. A physical 390px phone layout remains unverified. No new APK was generated.

See [UPGRADES.md](UPGRADES.md) for controls and sync setup. Assets use studio20 and shell cache raw-v5. The checkpoint remains in work/before-all-upgrades-20261102.

The final media regression verifies that topics sharing a task ID still show only their own images/audio. Browser verification confirmed zero media on a second topic while the first topic retained attachments. Course updates flush pending edits/recordings before swapping workspaces.

## Single-task additions and learner profiles — 2 November 2026

All eight additional upgrades are implemented. New QA used port 14325 and did not seed the normal port 4317 workspace.

- Skip, chosen-task resume and all-skipped waiting states passed. Skips survived reload and never counted as completion.
- Quick notes saved during navigation, were found by global search, and remained accessible after completion.
- Duplicating a completed topic preserved the original and produced an unfinished copy with new IDs.
- Export suggestions were visible; invalid recall fields prevented export. A fake PDF was rejected without adding an attachment.
- A portable two-page PDF opened from Study, retained a bookmark, and remained in only its learner's reading shelf.
- Full-screen Study hid both navigation and the header and provided an exit. Optional recall saved a separate self-check without minutes.
- First learner backup: four topics, one completed task, one private task note, one recall result, one PDF asset and a 90-minute goal. Second learner backup: three topics, three completed tasks, no private notes/recall/files, and a 20-minute goal. The course ID was the same across profiles.
- Restoring the second learner's backup kept the first learner's workspace intact. Two tabs retained different learners after switching and reload; a goal changed to 95 in the first tab while the second stayed at 20.
- A fresh two-task course completed in exactly two Done actions. Buttons stay disabled during completion transitions.
- All 39 routes rendered again without console errors. All 148 tests and 36 app module syntax checks pass. Android Java, including profile storage guards, compiles against API 35.

Native profile folders preserve the original learner's paths. New folders, preferences, browser databases, local note drafts, recovery keys, broadcasts and sync pairing are scoped by learner. Android reads/writes require the page's expected learner identity. Profiles are organization features, not password-protected accounts.

See [STUDY-PROFILES.md](STUDY-PROFILES.md) for usage and recovery rules. Real Android profile switching, background jobs and widgets still need physical-device testing. No APK or public deployment was produced at this checkpoint.

## Signed APK and wording cleanup — 2 November 2026

The current shareable feedback build is `outputs/releases/LW-Learning-Studio-1.0.1.apk`, version code 2. It is signed with the existing key and explicitly non-debuggable. The package contains 252 offline asset entries and no seeded courses, user data, test code or signing keys. Windows ZIP entry separators were normalized so nested PDF assets resolve on Android. Signature, ZIP alignment and version checks pass. Build metadata and SHA-256 are beside the APK.

UI copy now uses Profiles, Switch profile, Profile name, Active profile, My profile, and Open my studio. Default legacy Learner labels are normalized while IDs, storage namespaces, selected profiles and learning records are retained. Browser-only recovery text was removed from the installed-app error screen. Assets use studio21 / raw-v6.

- All 150 automated tests and 37 JavaScript module syntax checks passed; route inventory matches 39 screens.
- All 39 screens rendered at isolated origin `localhost:14326` with no app console errors, no legacy Learner labels and no horizontal page overflow at the observed browser size.
- Fresh setup, zero-course Home, simple two-topic creation, one-task explanation with zero checkboxes, Done advancement, Undo, Skip, reload, selected-task resume and private note preservation passed. The exported two-topic/two-task `.lw` file passed the independent validator.
- The final APK installed as an update on an Android 15/API 35 x86_64 emulator and cold-started successfully. Native instrumentation passed offline startup, workspace initialization, nested PDF engine availability, profile-specific attachment/state access, rejection of stale-profile writes and revision conflicts, and primary workspace preservation.
- The normal origin `localhost:4317` was refreshed to the clean Home without adding test courses. Temporary browser and emulator data stayed isolated.

Physical-device microphone permissions, native file-provider pickers, reminder delivery, widgets, background behavior, and sustained performance remain tester checks. See the [phone-test checklist](PHONE-TEST-1.4.0.md).

Build reproduction uses `node tools/build_apk.mjs --tools work/android-release/tools.json`; `node tools/run_android_smoke.mjs` builds a separate test-only instrumentation APK for the private emulator on adb port 5038. These tools and test artifacts are excluded from the shared APK.

## iPhone-inspired interface, glass and precise sizing — 3 November 2026

The current feedback release is 1.0.2, version code 3. Source details and the sizing system are in [INTERFACE.md](INTERFACE.md). Assets use studio23 / raw-v7. The APK retains the prior package and signing identity and contains 256 offline assets with no seeded courses or user data.

- All 150 automated tests and 39 JavaScript module syntax checks passed.
- All 39 routes rendered at an observed 393 px width with no app console errors, boot errors or horizontal overflow.
- Home, Study, Notes, builder, Settings and courses also rendered without horizontal overflow at 320, 768 and 1200 px.
- Real DOM measurements confirmed 20 px phone gutters, 44 px Home icon targets, a 52 px Home primary action, and matched 68 px tab and More surfaces. The selected tab and glass highlight have matching bounds and zero center-point offset.
- Created a two-topic course through the new bottom sheet. Study rendered one explanation and zero task checkboxes. Done advanced once; Undo restored the task. A named notebook page and text persisted through navigation.
- The notebook toolbar was corrected to keep every control inside its card. Voice recording and notebook-to-course controls are reachable through More page actions. The recording dialog opens with the microphone off.
- Reduced motion was saved and applied. High-contrast Study rendered 20 px explanation text in the requested contrast. Larger-target preferences remained supported, then the isolated QA profile was restored to ordinary reading settings.
- A focused editor plus a simulated viewport reduction hid the tab bar; restoring viewport height brought it back while the editor retained focus.
- Android 15 emulator installation as an update and native instrumentation passed workspace startup, nested PDF assets, profile/file isolation, stale-profile-write rejection, revision conflicts and primary workspace preservation. APK signing and alignment checks passed.

Only the disposable origin 14327 contained the drawing course and notebook test data. The normal origin 4317 retained its content and was shown in Pearl. Native microphone permissions, real IME/provider behavior, notification delivery, widgets and sustained motion performance remain real-device feedback items.

## Design controls and personal reminders — 3 November 2026

Release 1.1.0 (code 4), assets studio24 / raw-v8. The final signed APK has 260 offline asset entries and SHA-256 `295e77295150e8be03c26880d064950f16b04f857d5c4b81746d823f2c6d095b`. Existing package, signing identity, profile/storage IDs and course records are retained. The pre-change source checkpoint is `work/before-design-reminders-20261103-112220`.

- All 163 automated tests and 42 module syntax checks pass; route inventory matches 41 screens. New model regressions cover old-workspace defaults, design validation, real dates, atomic invalid edits, private export boundaries, daily/weekly/monthly/yearly recurrence, leap years, the 31st anchor, ancient overdue dates, year overflow, double completion, protected Undo, archive/restore, malformed backup history and cycle detection.
- All 41 routes rendered at an observed 393 px width without app console errors, boot errors or horizontal overflow. Results are in `work/android-release/reminders-routes.json`. Reminders, Design, Settings and Study were also checked at 320, 768 and 1200 px. Compact/Square/Solid and Large controls were checked; the 320 px calendar and all five navigation destinations fit. Default design was restored after testing.
- Browser QA used disposable origin 14328. Created a weekly timed reminder for today, completed it, inspected Completed and used Undo. Its untouched generated next occurrence was removed. Archived and restored the reminder through the UI.
- Jumped to 31 January 2027 in the calendar, created a monthly reminder and completed it early. The next occurrence was 28 February 2027 while the completed January history remained intact. Reminder date/time/note controls and calendar date selection were reachable on narrow screens.
- Design preview changed before saving. Soft/Pill/Green/Large/Dark/Off persisted after Save and reload, including measured pill radii and dark accent. A second profile retained its own empty reminder list/default design. Switching back restored the first profile's design and three reminder records. Reset design returned the defaults.
- A downloaded full backup was independently parsed and contained the saved design and three reminder records. A separate 1,000-item stress backup was imported through the normal file picker and validated restore preview, then rendered 40 rows and 80 after Show more. The original three-record backup was restored through the UI. No direct storage injection was used.
- Created and completed a one-task drawing course. Study still showed one explanation and zero task checkboxes; personal reminder states did not change. Full backups include private reminders/design; portable course exports exclude them.
- Final APK installed as an update on Android 15/API 35. Separate instrumentation runs with exact alarm access disabled and enabled both passed. Reports are `work/android-release/native-checks-flexible.txt` and `native-checks-precise.txt`; each reports the expected timing mode, actual notification posting/cancellation and pending-alarm rescheduling. Offline startup/assets, profile/file isolation, stale writes, revision guards and preservation of the primary workspace also pass. The test calls the delivery handler directly to verify notifications; long-duration Doze/OEM delivery remains a physical-device check.
- Final APK signature, alignment and packaged inventory pass. Test instrumentation, signing keys and test data are excluded from the shared APK. The normal 4317 workspace was opened with zero courses and no seeded reminders; the new Reminders preview is left open.

Physical-phone battery/OEM timing, permission denial/regrant, clock changes, real IME/file-provider variations, microphone, widgets and sustained motion performance remain feedback items. Optional Precise timing uses user-granted Android alarm access; flexible alarms remain supported without it. Only the active profile schedules personal alerts. No sync relay or remote production deployment was configured.
