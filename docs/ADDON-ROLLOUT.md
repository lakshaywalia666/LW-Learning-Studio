# Full add-on rollout

> Current phone-test build: **1.4.0/build 7**, studio46/raw-v30. 322 tests and Android 17 checks pass; final phone testing remains. See [OFFLINE-COMPLETION-1.4.0.md](OFFLINE-COMPLETION-1.4.0.md) and [PHONE-TEST-1.4.0.md](PHONE-TEST-1.4.0.md). The older entries below are historical.


> Final audit supersedes older check counts below:309 tests; Android15 native checks and upgrade retention pass. Source studio35 / raw-v19. See [FINAL-RELEASE-AUDIT.md](FINAL-RELEASE-AUDIT.md) for the current result and unfinished/phone-only checks. An internal QA APK was built for this audit; it was not promoted over the shared release.

The user approved all 160 catalogue items on 3 November 2026. This remains an active staged implementation. Current source count: 124 implemented, 8 partial and 28 planned. The latest built APK is still 1.3.0; all new source is unreleased and some device checks remain pending. Do not describe all 160 as complete. The machine-readable ledger is [feature-implementation.json](feature-implementation.json); the original definitions remain in [FEATURE-IDEAS-2026-11-03.md](FEATURE-IDEAS-2026-11-03.md).

## Unreleased offline continuation — 4 November 2026

Focus and habits, personal design, richer notebook blocks and boards, progress worlds, course signatures, data recovery, and additional reminder options were added in this checkpoint. The browser reopened successfully with the demo server stopped. See the [offline demo verification](OFFLINE-DEMO-QA.md) for evidence and remaining device checks. Online service decisions remain deferred.

## Speech, intake and app lock continuation — 4 November 2026

Adds local English/Hindi transcription, reviewed spoken reminders/navigation, reviewed shared-content intake and direct .lw preview. App lock has a native OS-credential gate and remains partial until device verification. The workflow audit fixed a shared event-helper bug that broke Calendar event and other hyphenated action namespaces. Final source: studio33 / raw-v17,403 precache paths;307 tests pass;89 application modules parse and19 Android sources compile. All58 routes fit at320/768/1200px. No APK built.

## Listening and document continuation — 4 November 2026

Adds private audio timestamps/transcripts/loops, local-only read aloud, bilingual passages, image masking, local English/Hindi photo and scanned-PDF recognition, perspective crop and reviewed scan-to-note conversion. Related recovery keeps original source files. Source also includes opt-in Android focus countdown, Quick Settings capture and calendar insertion; these require a later device check. Current suite:287 passing tests;84 application modules parse and16 Android sources compile. Source studio30 / shell raw-v14 covers390 paths. No APK was built.

## Second implementation batch — 1.3.0

Adds time blocks with conflict indicators, weekly availability and busy periods, deadline planning with an honest capacity preview, and reviewed catch-up plans. Generated blocks can be split over windows. Only unfinished required tasks are estimated; planning never records study minutes or completions. Past blocks remain and replaced upcoming blocks are recoverably archived. A planned task opens one explanation and links to Study in course order.

Adds a private question bank, mixed-subject selection, timed and untimed tests, immutable question snapshots, numerical tolerance/range/unit checking, and a mistake notebook covering tests and existing course exercises. Answers and deadlines persist through navigation and reload. Time limits finish at the next check if the app was suspended. Exact short-answer matching ignores case/extra whitespace. Units do not convert automatically. Old course attempts use current definitions when no historical snapshot exists; new attempts save the review explanation.

More → Learning → Time & deadlines; More → Library → Questions & tests. The two models live in learning.planning and learning.assessments, are profile-scoped, included in full backups and excluded from .lw exports. No online service was added.

## First implementation batch — 1.2.0

Capture inbox, global Quick Add, favourites/recent, Home arrangement/opening preference, daily briefing/reflection/carry-forward, saved searches, reminder search, natural date preview, snooze, advanced repeats/end conditions, completion-relative scheduling, independent alert dates, list colours/priorities, bulk changes, week/agenda, desktop drag rescheduling, Someday, flashcard decks/cloze/adaptive recall/hints, table-to-course import, lesson/page templates, pinned pages/backlinks, distraction capture, LW launch/adaptive/monochrome artwork, Android launcher shortcuts and reviewed feedback export.

All new data is profile-scoped and included in full backups. Private data remains excluded from .lw courses. Single-task Study and real progress remain independent. A fresh app remains empty. Asset generation used the built-in tool for the original glass logo. Small-size native marks are clean vector adaptations; unsuccessful transparent cutouts are excluded.

## Delivery rules

Keep the ordinary Study screen simple and group optional tools in their existing sections. Update the ledger when a workflow is implemented and record verification separately. Preserve the package and signing identity, existing profiles, files, and progress.

Online AI, shared groups and a hosted course library need a service choice. The user selected: Decide later; continue offline features. No live external service is configured or deployed.

## Historical 1.3.0 validation

214 model/integration tests pass. All 51 JavaScript modules parse and the route inventory contains 46 screens. Every route fits at 393 px without app console errors or overflow; new scheduling/practice views also fit at 320/768/1200 px. Browser tests verified busy-block subtraction, partial/full deadline previews, catch-up archive, one-task links, test reload/expiry, grading, recovered mistakes and existing-exercise retry/evidence. Full backup restoration was checked. Android 15 checks pass in flexible and precise modes on the final 1.3.0 APK, including upgrade installation, assets/startup, alerts, icons, shortcuts, profiles and revision guards. See QA.md for completed evidence.

## Item status

| ID | Addition | Status |
| --- | --- | --- |
| 1 | Capture inbox | implemented |
| 2 | Quick Add anywhere | implemented |
| 3 | Home favourites | implemented |
| 4 | Rearrange Home | implemented |
| 5 | Choose the opening screen | implemented |
| 6 | Morning briefing | implemented |
| 7 | Evening wrap-up | implemented |
| 8 | Recently opened | implemented |
| 9 | Saved searches | implemented |
| 10 | Search personal reminders | implemented |
| 11 | Type dates naturally | implemented |
| 12 | Reminder snooze | implemented |
| 13 | Advanced repeat rules | implemented |
| 14 | Repeat end conditions | implemented |
| 15 | Repeat after completion | implemented |
| 16 | Separate deadline and alert | implemented |
| 17 | Multiple alerts | implemented |
| 18 | Reminder organization | implemented |
| 19 | Reminder attachments | implemented |
| 20 | Bulk reminder actions | implemented |
| 21 | Week and agenda views | implemented |
| 22 | Drag to reschedule | implemented |
| 23 | Someday list | implemented |
| 24 | Time blocks | implemented |
| 25 | Availability schedule | implemented |
| 26 | Plan toward an exam date | implemented |
| 27 | Catch-up preview | implemented |
| 28 | Calendar file exchange | partial |
| 29 | Time-zone choices | implemented |
| 30 | Working-day repeat rules | implemented |
| 31 | Two-minute start | implemented |
| 32 | Personal time estimates | implemented |
| 33 | Session intention | implemented |
| 34 | End-of-session reflection | implemented |
| 35 | Need help flag | implemented |
| 36 | Layered explanations | implemented |
| 37 | Study beside a document | implemented |
| 38 | Temporary lesson scratchpad | implemented |
| 39 | Practise a completed task | implemented |
| 40 | Rotate between courses | implemented |
| 41 | Flashcard decks | implemented |
| 42 | Fill-the-gap cards | implemented |
| 43 | Image masking | implemented |
| 44 | Adaptive card scheduling | implemented |
| 45 | Progressive hints | implemented |
| 46 | Question banks | implemented |
| 47 | Timed mock exams | implemented |
| 48 | Mixed-topic tests | implemented |
| 49 | Mistake notebook | implemented |
| 50 | Numerical answer checks | implemented |
| 51 | Blank course recipes | implemented |
| 52 | Table-to-course import | implemented |
| 53 | Bulk media matching | implemented |
| 54 | Reusable lesson templates | implemented |
| 55 | Lesson variants | implemented |
| 56 | Preview as a reader | implemented |
| 57 | Author revision history | implemented |
| 58 | Optional learning branches | implemented |
| 59 | Follow course updates | planned |
| 60 | Publisher signatures | implemented |
| 61 | Reusable page templates | implemented |
| 62 | Pinned pages | implemented |
| 63 | Smart note collections | implemented |
| 64 | Page backlinks | implemented |
| 65 | Handwriting and stylus | implemented |
| 66 | Table blocks | implemented |
| 67 | Equation blocks | implemented |
| 68 | Connected idea boards | implemented |
| 69 | Visual note comparisons | implemented |
| 70 | Print-ready note export | partial |
| 71 | Search scanned text | implemented |
| 72 | Document scanner | implemented |
| 73 | Audio timestamp links | implemented |
| 74 | Editable voice transcripts | implemented |
| 75 | Spoken reminder entry | implemented |
| 76 | Video explanations | implemented |
| 77 | Read aloud | implemented |
| 78 | Loop a short audio section | implemented |
| 79 | Background audio controls | partial |
| 80 | Bilingual reading | implemented |
| 81 | Independent habit tracker | implemented |
| 82 | Flexible habit targets | implemented |
| 83 | Habit chains | implemented |
| 84 | Focus routine presets | implemented |
| 85 | Interruption records | implemented |
| 86 | Distraction parking place | implemented |
| 87 | Ambient sound mixer | implemented |
| 88 | Keep screen awake | implemented |
| 89 | Persistent focus countdown | implemented |
| 90 | Match study to available time | implemented |
| 91 | Choose navigation tabs | implemented |
| 92 | One-handed layout | implemented |
| 93 | Named design presets | implemented |
| 94 | Scheduled appearance | implemented |
| 95 | Glass intensity controls | implemented |
| 96 | Haptic customization | implemented |
| 97 | Animation speed control | implemented |
| 98 | Resizable workspace panes | implemented |
| 99 | Custom-colour contrast check | implemented |
| 100 | Branded launch screen | implemented |
| 101 | Adaptive LW launcher icon | implemented |
| 102 | Long-press app shortcuts | implemented |
| 103 | Notification Done and Snooze | planned |
| 104 | Personal reminder widget | planned |
| 105 | Interactive widget actions | planned |
| 106 | Share to LW | implemented |
| 107 | Open .lw files directly | implemented |
| 108 | Quick Settings tile | implemented |
| 109 | Device calendar connection | implemented |
| 110 | Watch companion | planned |
| 111 | Selective restore | implemented |
| 112 | All-profile backup | implemented |
| 113 | Encrypted backup files | implemented |
| 114 | Merge individual changes | partial |
| 115 | Paired-device management | planned |
| 116 | Clearer sync activity | planned |
| 117 | Optional app lock | partial |
| 118 | Storage manager | partial |
| 119 | Data-upgrade preview | implemented |
| 120 | Backup rehearsal | implemented |
| 121 | Explain more simply | planned |
| 122 | Guided tutoring hints | planned |
| 123 | Draft practice material | planned |
| 124 | Draft a course outline | planned |
| 125 | Summarize long notes | planned |
| 126 | Suggest weak-topic practice | planned |
| 127 | Search by meaning | planned |
| 128 | Source-linked generated answers | planned |
| 129 | Explain a diagram | planned |
| 130 | Detect content overlap | planned |
| 131 | Course preview links | planned |
| 132 | Nearby course transfer | planned |
| 133 | Private study groups | planned |
| 134 | Chosen accountability updates | implemented |
| 135 | Teacher assignments | planned |
| 136 | Review and feedback | planned |
| 137 | Collaborative notebooks | planned |
| 138 | Curated course library | planned |
| 139 | Course author pages | planned |
| 140 | Course issue reports | planned |
| 141 | App language choices | planned |
| 142 | Accessible authoring checks | implemented |
| 143 | In-app tester feedback | implemented |
| 144 | Optional downloadable packs | planned |
| 145 | Large-library performance | partial |
| 146 | Data health dashboard | implemented |
| 147 | Custom keyboard shortcuts | implemented |
| 148 | Voice navigation | implemented |
| 149 | Update centre | partial |
| 150 | Interactive first-use tour | implemented |
| 151 | Optional world companion | implemented |
| 152 | Personal avatar | implemented |
| 153 | Decorate a world | implemented |
| 154 | Seasonal world collections | implemented |
| 155 | Personal achievement rules | implemented |
| 156 | Course challenges | implemented |
| 157 | Memory capsules | implemented |
| 158 | Progress share cards | implemented |
| 159 | Completed-course gallery | implemented |
| 160 | Personal reward menu | implemented |
