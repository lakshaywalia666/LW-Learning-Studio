# LW 1.4.0 — final phone test

This checklist covers the Android 1.4.0 phone-test build, version code 7. A fresh install starts with an empty workspace. To build a local APK, follow the [Android build instructions](../README.md#android-build).

On a phone with existing LW data, export a full backup first and install this APK as an update. Keep the app installed so its private data remains available. Confirm existing courses, notes, files, progress and logged time are present after opening it.

## Main checks

1. Open Settings → Interface language. Try English and Hindi, close/reopen, and confirm the choice remains. Navigation and common controls are translated; detailed messages currently have an English fallback. Course explanations and personal notes keep their original language.
2. Create or import a course. Review its lessons and any signature/update comparison before adding it. A different remembered publisher should block an update and offer a fresh copy. Check that course export includes course material rather than private notes or progress.
3. In Study, open one task’s explanation, tap Done, and try Undo. A double tap should create one completion. Check the course’s progress and all five Worlds. Logging actual study time remains separate.
4. Create a personal reminder with a phone alert and a repeat. From the notification, try Done, Snooze 10 minutes and Undo. Check the next occurrence, reopen behavior and existing Study progress. Try an alert while LW is closed and the phone is locked.
5. Add the separate LW reminders widget. Try Done, +1 day and Undo, then resize it. Short widgets show up to two reminders; taller widgets show up to three. Names and actions should remain readable at your chosen font size. With app lock enabled, widgets should hide private content and actions should require opening/unlocking LW.
6. Open a local recording in Listening. Enable background continuation, press Play, leave LW and lock the phone. Test Play/Pause/Stop and seeking through Android’s media controls. Unplug headphones during playback. Returning to a recording after notification Stop should let it play again. Playback stops when switching profiles or dismissing the app from Recents.
7. Edit a note or course draft, then act on an unrelated reminder from the widget/notification and return. The draft should remain. If the same reminder changed in both places, LW should retain the draft and offer a draft-backup action.
8. Test photo capture, English/Hindi local text recognition, scanned PDF reading, local microphone transcription and installed offline read-aloud voices. Turn off networking for these checks. Recognition quality and available audio codecs/voices depend on the device and source material.
9. In Data & recovery, use an unimportant test attachment: remove its content reference, move it to recovery, export its recovery copy and reopen that saved file to verify it. Free the device copy, then recover it using that file. A used file or mismatched recovery copy must be refused.
10. Create a calendar event and save it in the phone’s calendar app. Try notebook Print/Save PDF with tables, equations and handwriting, checking pagination and actual output. These provider interactions need the real phone.
11. Enable optional app lock with the phone’s existing unlock method. Test cancel/unlock, returning from Home, changing profiles, reopening after Android stops the process, screenshots/Recents and turning lock off. Confirm the setting covers the phone’s LW profiles.
12. Send a course to another nearby device through Android’s Bluetooth/Quick Share choice. The recipient should get a normal signed-course preview. LW uses the phone’s sharing providers; it does not automatically send to a person or device.

## Optional and performance checks

- If you have a compatible paired watch, allow LW notifications in its companion settings. Check the next-task study alert and reminder actions. LW provides a notification-based companion, rather than a separate watch application. The phone-only preference should stop mirroring new study/reminder alerts.
- Test reminder timing with Android’s precise-alarm permission allowed and denied, battery saver and a longer screen-off period. Record any manufacturer-specific delays.
- Try large system text, display scaling, portrait/landscape, a small phone and longer use. Note visible clipping, awkward keyboard placement, slow frames, warm-device behavior or memory-related restarts.
- Back up and restore a test profile, verify attachments open, and switch profiles to confirm isolation. The browser scale test already covered 5,000 notes and bounded search results, but sustained phone performance still needs this check.

## Feedback

More → Inbox & favourites → Give feedback produces a reviewed report that can be saved and shared manually. Include the phone model, Android version, feature, steps, expected result and actual result. Screenshots or a short recording are useful when a layout or animation fails.

AI tools, study groups, a hosted course library and additional sync/download/update services remain deferred. Existing optional whole-workspace sync remains available when a user configures their own server; this build does not introduce a hosted account or service.
