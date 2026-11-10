# Study, authoring and learner profiles

These eight features extend the earlier upgrades. A fresh studio still contains no courses or progress.

| Feature | How to use it |
| --- | --- |
| Skip for now | Study → Study tools → Skip for now. The task stays unfinished and the next available task appears. Skipped tasks lets you return to one task or all of them. If every remaining task is skipped, Study shows a waiting state instead of claiming completion. |
| Quick task notes | Open a task explanation → My note. Notes save automatically for the current learner. They are searchable and remain readable from the topic details after completion. |
| Duplicate a topic | Course builder → Duplicate this topic. The copy receives fresh topic, task, checkbox and media IDs. Explanations and links are copied; learning progress and personal notes are separate. Save the course to apply it. |
| Check before export | Save & export .lw previews validation errors, missing explanations, attachments and file size. Errors must be fixed before export. Suggestions can be reviewed or exported as-is. Check course before export offers the same report without saving. |
| Full-screen Study | Study tools → Full-screen Study hides app navigation. Exit full-screen Study, Escape, or Android Back returns to the normal view. Leaving Study also exits the mode. |
| Optional recall question | In the builder, expand Optional recall question and provide a question and suggested answer. After the topic's required tasks finish, the learner can open the question from Study tools or the completion toast. Got it / Practise again records a self-check in Learning insights. It does not change completion or log time. |
| PDF worksheets | Builder → Add PDF worksheet. Open worksheet in the task explanation opens the offline PDF reader, with bookmarks, annotations and a Return to Study link. The PDF travels in the .lw course. |
| Multiple learner profiles | Home → Switch learner, or Settings → Learner profiles. Create a named profile or switch to an existing one. New profiles start empty. |

Worksheets share the existing media limits: 5 MB per file, eight attachments per topic and 9 MB total attached content per course. Course files must fit within 16 MB. Quick notes support up to 10,000 characters each.

## Profile data and recovery

Each learner has a separate workspace, progress, personal notes, recall results, reading shelf, files, activity history, recovery points and sync pairing. Tabs retain their selected learner through reloads; switching another tab does not redirect existing saves.

The original learner retains the original browser database, recovery keys and Android folders. No previous workspace is deleted or moved during migration. New learner storage has its own namespace. Android storage requests include the expected learner ID so a stale page cannot save into the newly selected learner.

On Android, reminders, folder-backup preferences and widget selections use the current learner. Widgets display the active learner's workspace. A profile switch waits for saves, recordings and any current sync exchange to finish before reopening the app.

Full backups contain the current learner only. Export each learner separately. Restore replaces the selected learner's workspace with a validated backup and keeps a restore point; it does not replace the profile registry or another learner's data. Course exports exclude personal quick notes and recall answers.

Profiles organize a shared device; anyone using the app can switch them. They are not password-protected accounts. Device sync remains optional and must be paired separately for each learner.

Run the [automated checks](../README.md#tests) to verify profile and workspace behavior. Physical-device checks cover profile switching, widgets, lifecycle behavior, and file operations.
