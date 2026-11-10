
# App interface

Updated 3 November 2026 for 1.3.0 (version code 6). The Android app uses an iPhone-inspired control layer, with its existing offline JavaScript/Java architecture.

## Offline capture, planning and practice

Quick Add opens capture, reminders, notebook creation and everyday actions. Inbox includes favourites, recent destinations and saved searches. Home cards can be reordered/hidden, with a chosen opening screen, daily briefing and reflection.

More → Learning → Time & deadlines opens Day, Deadlines, Availability and Archive. Time blocks show duration and conflicts. Weekly windows plus busy periods determine capacity. Deadline/catch-up previews show exactly what fits and what does not; saving retains prior suggestions in Archive. A planned task opens one explanation, then Study continues in course order. Agenda also shows time blocks.

More → Library → Flashcards opens one recall card, hints and ratings. Questions & tests provides the private question bank, a one-question test screen, countdown, results and mistakes. Tests can mix subjects and check choice, exact short answers or numerical values/units. Mistakes link to old course exercises and their evidence pages; retries preserve history. Tests and planning never award Study progress/time.

Notebook More actions include reusable text templates, pinning, page links and backlinks. Builder tools provide a two-column topic import and lesson templates. The original glass LW identity is used on launch, install icons and Android shortcuts. New screens use the saved design/reading preferences and the same control sizes as the rest of the app.

## Design and reminders

Settings → Customize opens a live preview with Liquid Glass / Soft / Solid styles, Rounded / Pill / Square buttons, five accent presets plus Match theme, Compact / Comfortable / Large sizing, light/dark appearance and Off / Gentle / Full animation options. Save design applies the preview; Reset design returns Pearl, standard sizing and device-aware gentle motion. The profile's design and existing appearance preferences persist together. Reading, high contrast, reduced-motion and larger-target controls still apply.

Primary navigation is Home · Study · Reminders · Notes · More. Worlds are available in More → Library and on Home. Reminders provides Today, Upcoming, Completed and recoverable Archived views, plus a 42-cell month calendar and any-date jump. A separate Home card shows today's personal reminders. Reminder Done has a short completion animation and Undo; it never affects Study progress, minutes or worlds. Lists render 40 cards initially and expand through Show more.

Optional Android phone alerts report permission, next alert and timing status. Precise timing opens Android's special alarm access only when tapped. Flexible scheduling remains supported without that access. Profiles, full backups and restore previews include personal reminders and saved design. Course exports exclude them.

## Layout and sizing

`mobile-app.css` defines the base sizing; `organizer.css` applies saved design presets. Default phone layouts use 20 px side gutters (16 px on the smallest screens), consistent card padding, 28 px primary card corners, 16 px standard control corners, and 32 px sheet corners. Standard buttons default to 48 px tall, primary Home actions 52 px, icon controls at least 44 px, and Study Done 56 px. The floating tab group and More control both measure 68 px; the smallest layout uses 64 px. Compact keeps touch targets at least 44 px. Large adds spacing and larger controls. Buttons grow for wrapped labels and existing larger-touch-target preferences. Square controls retain a small 4 px corner radius; Pill uses a fully rounded end.

Home keeps one next step, a real daily-goal ring, shortcuts and course progress. Study keeps exactly one expandable task and Done. No sample content is installed. Fresh installations use Pearl; saved themes stay selected.

More opens a native-style bottom sheet with quick destinations and grouped tools. Notebook Read, Block, Attach and More controls fit without clipping. Voice recording and Make a course are inside More page actions; an empty notebook still offers recording directly.

## Materials and motion

`liquid-glass.css` adds translucent control backgrounds, restrained highlights, optical edges, shadows and spring-like sheet transitions. Reading surfaces stay solid. `app-motion.js` owns the sliding active-tab indicator, press feedback and staggered screen entrances. Route entrances run only when the route changes, so saving or editing a form does not restart them. Scrolling cancels press effects. Backgrounding pauses the decorative book animation.

The existing reduced-motion setting and device preference suppress these effects. High contrast and Smooth display mode use solid controls. Soft and Solid design presets reduce or remove glass treatments. A keyboard-aware tab bar hides only when an editing viewport actually shrinks and returns when the keyboard closes. Native startup uses the saved light/dark appearance to avoid a light flash in a dark workspace.

The design reference is [Apple's material guidance](https://developer.apple.com/design/human-interface-guidelines/materials). These are locally implemented visual effects, rather than Apple's native rendering APIs.

## Verification

The [automated checks](../README.md#tests) cover workspace and study behavior. Physical-device validation includes motion, keyboards, permissions, widgets, and background timing.
