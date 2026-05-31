# QuestBerry QA Notes

Status legend: `[x] done`, `[~] partial`, `[ ] missing`.

## User Notes Coverage

- [x] Default demo content was removed for new workspaces.
- [x] Blank Note is available.
- [x] Templates are chosen only while creating a new note.
- [x] Switching template choices does not immediately create sidebar notes.
- [x] Table Intel and visibility controls were removed from the primary UI.
- [x] Preview was removed from the primary UI.
- [x] Editor line height is aligned to the ruled background.
- [x] Layout was compacted so the editor uses the available width.
- [~] Templates are shown as structure cards, but editing is still Markdown/raw text.
- [~] App is more DnD-focused, but not yet a best-practice structured DnD note tool.
- [~] Old visibility data remains for backward compatibility, but should not drive primary UX.
- [ ] Category templates need true editable cards/fields for NPC, Location, Quest, Item, Lore, Rules, Handout, Session.
- [ ] Tests still need a full pass after replacing legacy preview/table-intel expectations.

## Implementation Guardrails

- Blank Note must remain one click away in the create flow.
- Template selection must not persist until the user confirms creation.
- Category-specific cards should support fast editing without hiding the raw note content.
- Preserve backward compatibility with existing Markdown content.
- Validate desktop, narrow, and mobile screenshots after every layout change.
