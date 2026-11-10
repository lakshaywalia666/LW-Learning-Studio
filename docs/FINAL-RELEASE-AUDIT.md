# Final release audit — 4 November 2026

> Current phone-test build: **1.4.0/build 7**, studio46/raw-v30. 322 tests and Android 17 checks pass; final phone testing remains. See [OFFLINE-COMPLETION-1.4.0.md](OFFLINE-COMPLETION-1.4.0.md) and [PHONE-TEST-1.4.0.md](PHONE-TEST-1.4.0.md). The older entries below are historical.


The implemented core passed the checks below. The entire requested catalogue is still incomplete: **124 source implementations,8 partial,28 planned**, including the user-deferred online services. This is a checked preview for controlled testing, not certification that all160 features or every Android device scenario work.

The normal4317 workspace and the user’s14331 content were not replaced or seeded. A read-only baseline archive was exported first. Mutable browser tests ran on14332, and native tests ran on a new LWFinalAudit emulator. The previous shared1.3.0 APK is unchanged.

## Fixes from this audit

- Custom light colours under a scheduled dark theme produced unreadable dark panels. Custom surfaces now keep text/accent contrast across panels, controls and navigation; muted text and boundaries follow the same palette. High-contrast reading takes priority. Native bar mode follows the effective custom light/dark mode. Two regression tests added.
- Direct .lw opening missed dotted/uppercase filenames and providers with opaque URI paths. Content MIME resolution now reaches the receiving activity, which still checks the displayed .lw filename and uses the normal signature/import preview. Non-.lw direct opening, remote/file URIs, stale profiles and automatic import are refused. Generic binary/JSON files may offer LW in Android’s chooser; only .lw filenames proceed.
- Corrected singular Worlds labels and cleaned the About text so an installed phone app does not call itself a browser preview.

## Verification

| Check | Result | Practical scope |
| --- | --- | --- |
| Automated suite | **309 pass,0 fail,0 skipped** | Model/integration tests across all existing test files. |
| Source parsing / Android compilation | **89 modules /19 Java sources pass** | Java compiled and DEX packaged against API35. |
| Route layouts | **58 routes ×320/768/1200px,0 overflow/empty/error pages** | All routes at functional-fix checkpoint34; final35 only changes About wording/cache version and was reopened. This is layout coverage. |
| Browser logs | No warning/error during final connected route sweep | The audit copy is separate from the user’s demo tabs. |
| Offline | Final35 reloaded and recognized “open notes” with14332 stopped | Local English pack cold-started; no microphone or hosted recognizer used. |
| Study | One completion after a double tap; Undo restored the previous task | Queue returned to1/5 complete. |
| Reminders | Daily repeat generated next occurrence; Reopen removed untouched generated repeat | Separate from Study; fixture reminder added only in14332. |
| Worlds | All five scenes retained5 completed topics; zoom and course inspector worked | Includes links back to Study. |
| Author tools | Multi-task variant chooser selected task2; reader preview showed its beginner text | Draft changes did not install or manufacture progress. |
| Signing/profiles | Signed file verifies; key fingerprint survived profile switch | New profile had0 files/progress and0 health issues. |
| Personal design | Schedule, named-look restore, shortcut navigation, typing guard, high-contrast priority passed | Disabling custom colours restored theme surfaces. |
| Focus/help | Scratchpad survived reload; help flag saved and resolved | No Study time/completion added. |
| Assessment | Numerical answer with unit survived reload and graded1/1 | Independent test results, no Study change. |
| Backups/retention | End-of-audit archives rehearse with0 issues | All original5 notebook pages and11 attachment data URLs unchanged; Study totals remain5 tasks/45 logged sample minutes. |
| Android native | Both flexible and precise alarm modes **PASS** | Startup, assets/icons/shortcuts, notifications, focus countdown post/cancel, profile/file isolation, stale writes/revisions, capture provider boundary, shared intake, direct file association, read-only other-profile archive. |
| In-place upgrade | **PASS** over the previous APK | Existing1 completion,7 fixture minutes,4 notes and1 attachment retained; new sections added. Fresh emulator only. |
| Packaged bytes | **403/403 assets match final source** | Final35 DEX, manifest and resources equal the native-tested34 payload; final differences are public About text/cache version. |

## Android build

The internal QA APK is 109.49MB, signed and alignment-verified, with403 packaged assets. It is stored under work/android-release, not promoted over the shared release. SHA256: 8d6c2fa6cfba3a37b210bef2be2be7a26437fc636f17489deb4c5dc772c54517. It intentionally retains the baseline version/code for internal testing; the final tester/release artifact still needs its own version step.

## Remaining before claiming the full release

Real-phone checks remain for enabled biometric/PIN lock and lifecycle, camera application capture, microphone and native speech/codec behavior, tile placement, calendar save, native print/PDF output, battery/Doze timing and sustained performance. Default-off app lock status and its policy tests do not prove a real biometric flow. Provider round-trip tests do not prove a camera app capture. Emulator notification/API checks do not guarantee delivery timing on every manufacturer’s phone.

Unfinished offline additions include reminder notification/widget actions103–105, native background playback79, nearby sending132, interface languages141, indexing/progressive rendering145 and physical storage cleanup118. Watch110 needs a supported companion platform/device. Optional downloads144 and device/sync/update service work remain separate. The AI/groups/hosted-library decision stays deferred.

## Catalogue audit

Every catalogue entry is listed below. “Implemented” is a source classification, not a claim that each item received every possible UI/device test in this pass. Area-level test evidence is above and in OFFLINE-DEMO-QA.md. Partial/planned entries are not counted as passed.

| ID | Feature | Source status | Scope / verification note |
| --- | --- | --- | --- |
| 1 | Capture inbox | implemented | Current source classification; see area checks and earlier QA. |
| 2 | Quick Add anywhere | implemented | Current source classification; see area checks and earlier QA. |
| 3 | Home favourites | implemented | Current source classification; see area checks and earlier QA. |
| 4 | Rearrange Home | implemented | Current source classification; see area checks and earlier QA. |
| 5 | Choose the opening screen | implemented | Current source classification; see area checks and earlier QA. |
| 6 | Morning briefing | implemented | Current source classification; see area checks and earlier QA. |
| 7 | Evening wrap-up | implemented | Current source classification; see area checks and earlier QA. |
| 8 | Recently opened | implemented | Current source classification; see area checks and earlier QA. |
| 9 | Saved searches | implemented | Current source classification; see area checks and earlier QA. |
| 10 | Search personal reminders | implemented | Current source classification; see area checks and earlier QA. |
| 11 | Type dates naturally | implemented | Current source classification; see area checks and earlier QA. |
| 12 | Reminder snooze | implemented | Current source classification; see area checks and earlier QA. |
| 13 | Advanced repeat rules | implemented | Current source classification; see area checks and earlier QA. |
| 14 | Repeat end conditions | implemented | Current source classification; see area checks and earlier QA. |
| 15 | Repeat after completion | implemented | Current source classification; see area checks and earlier QA. |
| 16 | Separate deadline and alert | implemented | Current source classification; see area checks and earlier QA. |
| 17 | Multiple alerts | implemented | 1–4 early alerts with separate alert date and snooze. Browser/model checks pass; new native scheduler compiles, physical alert timing awaits next APK. |
| 18 | Reminder organization | implemented | Current source classification; see area checks and earlier QA. |
| 19 | Reminder attachments | implemented | Local image/PDF/audio attachments and links; browser attachment open/export passed. Full backups retain files. |
| 20 | Bulk reminder actions | implemented | Current source classification; see area checks and earlier QA. |
| 21 | Week and agenda views | implemented | Current source classification; see area checks and earlier QA. |
| 22 | Drag to reschedule | implemented | Current source classification; see area checks and earlier QA. |
| 23 | Someday list | implemented | Current source classification; see area checks and earlier QA. |
| 24 | Time blocks | implemented | Activities have durations and overlap indicators; manual blocks archive/restore. |
| 25 | Availability schedule | implemented | Weekly study windows are merged; busy blocks subtract capacity. |
| 26 | Plan toward an exam date | implemented | Unfinished required task estimates are distributed through the inclusive deadline; shortfalls remain explicit. |
| 27 | Catch-up preview | implemented | Reviewed catch-up replaces only upcoming generated blocks, archives old suggestions, keeps past blocks and actual progress; stale previews are rejected. |
| 28 | Calendar file exchange | partial | Local/UTC/IANA zones, common repeat rules, end conditions, exclusions and alerts round-trip. Month-end, working-day-filtered and completion-relative export is one current occurrence; advanced recurrence imports request individual events. |
| 29 | Time-zone choices | implemented | Local or IANA fixed time zone; DST overlap/gap model cases pass and native java.time scheduling matches the policy. |
| 30 | Working-day repeat rules | implemented | Weekday and holiday filters on subsequent repeats; model checks preserve independent progress. |
| 31 | Two-minute start | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 32 | Personal time estimates | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 33 | Session intention | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 34 | End-of-session reflection | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 35 | Need help flag | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 36 | Layered explanations | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 37 | Study beside a document | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 38 | Temporary lesson scratchpad | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 39 | Practise a completed task | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 40 | Rotate between courses | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 41 | Flashcard decks | implemented | Current source classification; see area checks and earlier QA. |
| 42 | Fill-the-gap cards | implemented | Current source classification; see area checks and earlier QA. |
| 43 | Image masking | implemented | Local image cards with 1–30 opaque covers, pointer drawing, precise percentage fields, answers/reveal and independent recall history. Original images remain unchanged. Browser create/draw/save/reveal passed; backups and invalid edits tested. |
| 44 | Adaptive card scheduling | implemented | Current source classification; see area checks and earlier QA. |
| 45 | Progressive hints | implemented | Current source classification; see area checks and earlier QA. |
| 46 | Question banks | implemented | Private question bank with subject, skill, difficulty and recoverable archive. |
| 47 | Timed mock exams | implemented | Timed tests persist answers and their original deadline, resume on reload and finish on expiry checks. |
| 48 | Mixed-topic tests | implemented | Randomized mixed-subject selections with filters and immutable question snapshots. |
| 49 | Mistake notebook | implemented | Test and existing course-exercise mistakes show responses, expected answers, explanations, evidence links, recovery state and retry history. New course attempts retain a review snapshot; old attempts fall back to available course definitions. |
| 50 | Numerical answer checks | implemented | Numerical checks support inclusive ranges, absolute tolerance, scientific notation and exact case-sensitive units. |
| 51 | Blank course recipes | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 52 | Table-to-course import | implemented | Current source classification; see area checks and earlier QA. |
| 53 | Bulk media matching | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 54 | Reusable lesson templates | implemented | Current source classification; see area checks and earlier QA. |
| 55 | Lesson variants | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 56 | Preview as a reader | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 57 | Author revision history | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 58 | Optional learning branches | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 59 | Follow course updates | planned | Current source classification; see area checks and earlier QA. |
| 60 | Publisher signatures | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 61 | Reusable page templates | implemented | Current source classification; see area checks and earlier QA. |
| 62 | Pinned pages | implemented | Current source classification; see area checks and earlier QA. |
| 63 | Smart note collections | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 64 | Page backlinks | implemented | Current source classification; see area checks and earlier QA. |
| 65 | Handwriting and stylus | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 66 | Table blocks | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 67 | Equation blocks | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 68 | Connected idea boards | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 69 | Visual note comparisons | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 70 | Print-ready note export | partial | A4 HTML export with tables/math/ink verified; Print/Save PDF source and native bridge exist. Actual PDF provider/device checks pending. |
| 71 | Search scanned text | implemented | Bundled English/Hindi Tesseract recognition of images and individual scanned PDF pages, editable reviewed text, global search and notebook conversion. Browser English/Hindi/PDF cases passed, including fresh Hindi recognition with the demo server stopped. |
| 72 | Document scanner | implemented | Four-corner perspective crop, rotation and colour/grayscale/paper previews, preserving original and processed images. Browser imported image/PDF cases pass; Android camera intent with narrowly granted temporary JPEG provider compiles, physical camera check awaits APK. |
| 73 | Audio timestamp links | implemented | Private, hash-bound recording notes with timestamp seek links. Browser loop/seek/reload/global search passed. |
| 74 | Editable voice transcripts | implemented | Bundled local English/Hindi Vosk transcription of reviewed recordings/files up to three minutes; manual text for longer audio. Explicit microphone dictation is capped at 60 seconds. English file and saved-note recording→review→private transcript passed. Hindi synthetic phrase passed; no human Hindi accuracy claim. Real microphone/Android performance still needs device checks. |
| 75 | Spoken reminder entry | implemented | Recognized words open an editable reminder preview with suggested date/time; save is explicit and alerts default off. Actual English WAV→review→tomorrow 18:00→save passed. Separate personal reminder; no Study completion. |
| 76 | Video explanations | implemented | Inline MP4/WebM accepted in bulk matching and standard player markup; real video/codec testing still pending. |
| 77 | Read aloud | implemented | Read aloud offers installed local voices only, bounded speed, chunking and immediate Stop. Browser play/stop and missing Hindi-voice fallback passed. Android TextToSpeech helper compiles; physical voice check awaits APK. |
| 78 | Loop a short audio section | implemented | Explicit play and loop range controls, no autoplay; stale play requests cannot restart stopped audio. Browser 0.1–0.4 second WAV loop and timestamp jump passed. |
| 79 | Background audio controls | partial | Browser Media Session and an in-app dock support explicit background continuation, reopen and Stop. Browser dock checks passed. Android foreground media service/background playback is not implemented. |
| 80 | Bilingual reading | implemented | Private copied source and user-written translation with language choices, side-by-side/wrapped phone reading, local read aloud and search. English/Hindi browser save/read passed. No hosted translation. |
| 81 | Independent habit tracker | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 82 | Flexible habit targets | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 83 | Habit chains | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 84 | Focus routine presets | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 85 | Interruption records | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 86 | Distraction parking place | implemented | Current source classification; see area checks and earlier QA. |
| 87 | Ambient sound mixer | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 88 | Keep screen awake | implemented | Optional browser wake-lock and native keep-awake bridge. Platform behavior requires supported-device testing. |
| 89 | Persistent focus countdown | implemented | Opt-in Android system chronometer notification reads active focus goal, opens reflection and cancels when finished/disabled or active profile changes. No progress/time writes. API35 source compile passes; notification/Doze/device timing check awaits APK. |
| 90 | Match study to available time | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 91 | Choose navigation tabs | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 92 | One-handed layout | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 93 | Named design presets | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 94 | Scheduled appearance | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 95 | Glass intensity controls | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 96 | Haptic customization | implemented | Pattern choices and native bridge exist; physical haptics await next APK/device. |
| 97 | Animation speed control | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 98 | Resizable workspace panes | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 99 | Custom-colour contrast check | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 100 | Branded launch screen | implemented | Current source classification; see area checks and earlier QA. |
| 101 | Adaptive LW launcher icon | implemented | Current source classification; see area checks and earlier QA. |
| 102 | Long-press app shortcuts | implemented | Current source classification; see area checks and earlier QA. |
| 103 | Notification Done and Snooze | planned | Current source classification; see area checks and earlier QA. |
| 104 | Personal reminder widget | planned | Current source classification; see area checks and earlier QA. |
| 105 | Interactive widget actions | planned | Current source classification; see area checks and earlier QA. |
| 106 | Share to LW | implemented | Source includes bounded profile-owned Android ACTION_SEND intake for text, links, pictures, PDFs, recordings and .lw courses, with a reviewed keep step. Browser shared-thought→Inbox and picture→Notes passed. Native share-sheet/process-recreation checks await the next APK. Android15 component checks now pass for profile-owned text/file intake, opaque content-provider URI, stale-profile refusal and no automatic import. Real share-sheet/provider UX remains a phone check. |
| 107 | Open .lw files directly | implemented | Source includes content-URI .lw ACTION_VIEW intake into the normal signed-course preview/comparison. Signed course reached verified update preview; tampered signed course was blocked. Native file-manager resolution awaits APK/device; provider MIME/path matching can vary. Android15 query/receiver checks exposed and fixed uppercase/dotted/opaque URI association. Generic content MIME associations are validated again by displayed .lw filename and normal import preview; non-.lw direct opening is refused. |
| 108 | Quick Settings tile | implemented | Android Quick Settings quick-note tile, unlock-and-open action and add-tile request on supported versions. Source compiles; phone-panel interaction awaits APK. |
| 109 | Device calendar connection | implemented | Review a single reminder occurrence then open an editable device-calendar event via ACTION_INSERT. Due time/zone and all-day dates are tested. No calendar read/write permission or busy-period import. Native provider/save checks await APK. |
| 110 | Watch companion | planned | Current source classification; see area checks and earlier QA. |
| 111 | Selective restore | implemented | Selective notes/courses/reminders with explicit conflict choices, attachment-ID remapping and linked recurrence chains. Browser selected-note recovery passed. |
| 112 | All-profile backup | implemented | Two-profile browser archive exported and inspected: rich Demo profile plus an empty isolated profile. Read-only native archive bridge compiles; device check pending. |
| 113 | Encrypted backup files | implemented | AES-GCM/PBKDF2-310000 encrypted full backup; correct/wrong passwords and tampering covered. Browser export/unlock passed. |
| 114 | Merge individual changes | partial | Offline per-record backup recovery exists. Configured-server record-level synchronization remains unimplemented. |
| 115 | Paired-device management | planned | Current source classification; see area checks and earlier QA. |
| 116 | Clearer sync activity | planned | Current source classification; see area checks and earlier QA. |
| 117 | Optional app lock | partial | Default-off native gate implemented with OS strong biometrics/device credential (Android 11+) and system screen-lock fallback on older supported versions. Opaque startup/resume gate, recent-view/screenshot hiding while enabled, authenticated enable/disable and stale/expired-callback checks. Pure Java session tests and API35 compile pass. Actual enable/cancel/unlock/background/process-recreation on a physical device is required before marking complete. Fresh Android15 install confirms default off and OS status. Enabled biometric/PIN lifecycle remains unverified on a real phone. |
| 118 | Storage manager | partial | Usage, missing-file diagnostics and reversible unused-file archive exist. Archived bytes are retained; physical storage cleanup is not implemented. |
| 119 | Data-upgrade preview | implemented | Backup format normalization/added sections shown before import; real restore creates a recovery point. No destructive migration. |
| 120 | Backup rehearsal | implemented | Separate in-memory rehearsal opened saved courses and notes, including tables/math/ink. The live workspace is untouched except a rehearsal timestamp. |
| 121 | Explain more simply | planned | Current source classification; see area checks and earlier QA. |
| 122 | Guided tutoring hints | planned | Current source classification; see area checks and earlier QA. |
| 123 | Draft practice material | planned | Current source classification; see area checks and earlier QA. |
| 124 | Draft a course outline | planned | Current source classification; see area checks and earlier QA. |
| 125 | Summarize long notes | planned | Current source classification; see area checks and earlier QA. |
| 126 | Suggest weak-topic practice | planned | Current source classification; see area checks and earlier QA. |
| 127 | Search by meaning | planned | Current source classification; see area checks and earlier QA. |
| 128 | Source-linked generated answers | planned | Current source classification; see area checks and earlier QA. |
| 129 | Explain a diagram | planned | Current source classification; see area checks and earlier QA. |
| 130 | Detect content overlap | planned | Current source classification; see area checks and earlier QA. |
| 131 | Course preview links | planned | Current source classification; see area checks and earlier QA. |
| 132 | Nearby course transfer | planned | Current source classification; see area checks and earlier QA. |
| 133 | Private study groups | planned | Current source classification; see area checks and earlier QA. |
| 134 | Chosen accountability updates | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 135 | Teacher assignments | planned | Current source classification; see area checks and earlier QA. |
| 136 | Review and feedback | planned | Current source classification; see area checks and earlier QA. |
| 137 | Collaborative notebooks | planned | Current source classification; see area checks and earlier QA. |
| 138 | Curated course library | planned | Current source classification; see area checks and earlier QA. |
| 139 | Course author pages | planned | Current source classification; see area checks and earlier QA. |
| 140 | Course issue reports | planned | Current source classification; see area checks and earlier QA. |
| 141 | App language choices | planned | Current source classification; see area checks and earlier QA. |
| 142 | Accessible authoring checks | implemented | Structural validation plus missing image-description and media-transcript suggestions; reader preview provided. Not an accessibility certification. |
| 143 | In-app tester feedback | implemented | Current source classification; see area checks and earlier QA. |
| 144 | Optional downloadable packs | planned | Current source classification; see area checks and earlier QA. |
| 145 | Large-library performance | partial | Reminders and cards render in batches; whole-library indexing and virtualization remain. |
| 146 | Data health dashboard | implemented | Page/course/file, reminder attachment and board-node health checks; source/model and browser zero-issue demo scan passed. |
| 147 | Custom keyboard shortcuts | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 148 | Voice navigation | implemented | Explicit English/Hindi destination commands use an exact allowlist and a second review click. Actual “open notes” recording→preview→Open Notes passed; Done/completion commands are refused. No OS/cloud recognizer used. |
| 149 | Update centre | partial | Installed baseline and preview notes shown offline. Verified online update discovery/install is not implemented. |
| 150 | Interactive first-use tour | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 151 | Optional world companion | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 152 | Personal avatar | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 153 | Decorate a world | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 154 | Seasonal world collections | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 155 | Personal achievement rules | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 156 | Course challenges | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 157 | Memory capsules | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 158 | Progress share cards | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 159 | Completed-course gallery | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |
| 160 | Personal reward menu | implemented | Implemented in the unreleased offline demo source. Model tests cover persistence/progress isolation; see OFFLINE-DEMO-WORK.md for browser checks and device limitations. |

Evidence: work/android-release/final-audit-summary.json, final-audit-tests.txt, final-audit-native/native-checks-flexible.txt, native-checks-precise.txt, final-audit-upgrade-prepare.txt, final-audit-upgrade-verify.txt, final-audit-apk-assets.txt and the protected before/after profile archives.
