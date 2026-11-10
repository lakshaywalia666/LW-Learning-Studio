# Offline completion and phone-test build — 5 November 2026

LW 1.4.0 / build 7 is ready for the final physical phone test. The APK is signed, alignment-verified, offline-capable and uses the existing package/signing identity. A fresh installation remains empty. The previous 1.3.0 APK and the original 4317/14331 browser content were preserved.

## Added

Phone UI polish: responsive text sizes and wrapping, non-overlapping forest labels, correctly positioned toast messages, adaptive analytics touch targets, mobile session/course-plan records and reachable sticky sheet actions. Expanded Study keeps Done above the bottom navigation, clear of Quick Add.

Personal reminder notification actions, a separate interactive reminder widget with recovery, Android background listening controls, verified-copy file cleanup/recovery, signed nearby course sharing, English/Hindi navigation and controls, a worker-based large-library index and notification-based paired-watch support. LW calendar files now preserve the app’s own advanced repeat rules on reimport. Native reminder changes merge around independent note/course drafts; conflicts retain the draft and offer a backup.

The single-task Study screen and separate Study time remain unchanged. Optional controls stay in their relevant tools/settings.

## Verification

| Check | Result |
| --- | --- |
| Automated suite | 322 passed, 0 failed, 0 skipped |
| Source | 96 application modules parse; 24 Android Java sources compile against API 35 |
| Responsive layouts | 58 routes × 320/768/1200px: 174 base checks without page overflow/empty/boot errors. Follow-up text and control boundaries at 320/393px; forest label collision/edge fix, responsive records, larger helper text and sheet actions. Dedicated wide tables and boards retain their own scroll areas; editable titles scroll within the input. |
| Large library | 5,000 synthetic notes; English and Hindi searches; 40 results per page, next/previous, typing focus retained; notebook initially 80 then 160 on request |
| Offline |Final studio46 reload and cold worker search with 14333 stopped; 40 results from 2,500 matches; no hosted search |
| Native Android 17 |Both flexible and precise alarm modes PASS. 39 JS/native recurrence cases, real Snooze PendingIntent, Done/Undo/double-tap/stale/profile/lock guards, media prepare/play/pause/seek/stop, share-provider boundaries, widget/service registration and file cleanup |
| Upgrade |Previous 1.3.0 → 1.4.0 PASS: 1 completed task, 7 fixture minutes, 4 notes and 1 attachment retained; added sections preserved |
| Browser data retention |All 5 original note pages and 11 original attachment payloads unchanged; installed course definitions unchanged; 5 completions/45 sample logged minutes unchanged. Synthetic file freed/recovered; all profiles: 0 data-health issues. |
| Signed course |Actual browser export verifies and returns to signed import preview; different remembered publisher correctly blocks an update |
| APK bytes |All 411 packaged assets match final source. Signed/aligned; 109,530,381 bytes. SHA256: 5580daa76bd70217b69076e48d5ddf738434b25b5e5c6b28feff6544a03081fa |

## Emulator UI checks

The final APK was installed on the Samsung Galaxy S22 screen profile running a Google Android 17/API 37 image. Its installed SHA256 matches the delivered file. Title entry, text wrapping and Save/Cancel above the open keyboard were inspected. The shorter Android 15/API 35 emulator also showed Study and Done within the usable screen after the upgrade test.

The installed Medium Phone API 37 emulator did not finish connecting during boot; no data was wiped. The isolated API 35 image showed a System UI startup stall before the upgrade run. Its event log identifies Android system processes, and the dialog cleared with Wait. The upgrade checks then passed; these are emulator setup limits, not a claim of physical phone performance.

## Phone-test scope

Use [PHONE-TEST-1.4.0.md](PHONE-TEST-1.4.0.md). Enabled biometric/PIN lifecycle, camera application capture, microphone quality, local voices/codecs, actual calendar save/print-PDF output, widget placement/resizing, headphones, battery/Doze timing, nearby transport, compatible watches and sustained performance need real hardware. Emulator component/API tests are evidence for those paths, rather than a claim that every provider/device combination has passed.

English/Hindi covers navigation and common controls; detailed messages use English fallback. Course and personal text retain their original language. Watch support uses Android notification mirroring, rather than a separate watch app. Nearby sharing uses the sharing providers available on the phone.

## Remaining catalogue work

Source ledger: **134 implemented, 4 partial, 22 planned**. The two phone-verification partials are print/PDF (70) and enabled app lock (117). Record-level configured-server sync (114) and verified online update discovery (149) remain partial. AI/groups/hosted library and additional online course, device-management, download/update services remain deferred. Existing optional whole-workspace sync remains available on a user-configured server. This is not a claim that all 160 items are complete, and no service or store release was deployed.

## Evidence

work/android-release/offline-finish-summary.json, offline-finish-tests.txt, offline-finish-source-check.txt, offline-finish-data-check.json, offline-finish-search-benchmark.json, offline-finish-s22/native-checks-flexible.txt and native-checks-precise.txt, offline-finish-upgrade-prepare.txt, offline-finish-upgrade-verify.txt and offline-finish-apk-assets.txt. Retained internal test archives stay under work; they are not packaged into the APK.

Android integration references: [foreground service types](https://developer.android.com/develop/background-work/services/fgs/service-types), [background media](https://developer.android.com/media/platform/mediaplayer/background), [audio focus](https://developer.android.com/media/optimize/audio-focus), [file sharing](https://developer.android.com/develop/ui/compose/sharing/send), [Wear OS notification bridging](https://developer.android.com/training/wearables/notifications).
