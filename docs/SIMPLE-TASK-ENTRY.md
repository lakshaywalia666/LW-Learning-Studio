# Direct task entry — 6 November 2026

The source preview now creates and edits courses directly in the app. The normal course screens no longer ask people to import, export, sign or understand a `.lw` file. Existing course data, stable IDs, backups and legacy incoming-file readers remain compatible.

## Use it

1. Open My courses and choose Create a course. Enter a name; optionally paste tasks immediately.
2. In the course editor, use **Add task** for one name and explanation, or **Paste a list** for many tasks.
3. A bulk list accepts one task per line. Use `Task name: What to learn`, two tab-separated spreadsheet columns, or `Task name | What to learn`. Plain names, bullets and numbered lists also work.
4. Choose the course section and estimated minutes. Preview the parsed tasks, edit the list if needed, then choose **Add N tasks**.
5. Single and bulk additions save directly to the course. Study presents one task; Done advances it and updates the existing stairs/progress engine. Use Save course after editing an existing explanation, name or estimate.

Example:

```
Read the idea: Explain it in your own words.
Try an example: Practise with a small example.
Review: Recall the result without your notes.
```

Preview is read-only. A bad line identifies its original line number and adds nothing. Input errors appear inside the form. Checkbox-looking pasted text is treated as task text, never as completed progress. Each new simple task creates one internal topic with one required activity and no required checkbox list.

The editor searches all tasks and initially displays 50 matching task rows, with Show more. A course supports at most 10,000 topics; names support 160 characters and explanations 20,000. Estimates must be whole minutes from 1 to 1440. These are input/storage limits, not a promise of performance for every maximum-size device/workspace.

Existing multi-activity lessons remain available in the detailed editor. Course tools, media, recall, ordering, private notes, reminders and full workspace backups remain available. No online hosting, account service or paid service was provisioned.

## Verification

- 330 automated tests pass, including mixed-format/Hindi lists, selected sections, atomic invalid batches, a 1000-task batch, course capacity, existing progress, stairs, Undo and full workspace restore.
- 96 application JavaScript modules parse.
- Browser: blank course → single task saved → explanation read in Study → Done → three tasks previewed, edited and saved → reload retained 1 of 4 completed and opened task 2.
- Invalid line 2 displayed an inline error and retained the four existing tasks.
- Editor and modal had no page horizontal overflow at widths 320 and 393 pixels. Browser error log was empty.
- Browser testing used a separate local workspace with generic demo data.
