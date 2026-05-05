# NoteBerry Testing Process

## Current Coverage

The Playwright Electron suite covers the first production slice of NoteBerry:

- first render, title, logo, note list, editor, preview, and table intel
- transparent logo rendering in the app chrome
- category, tag, and full-text search filters
- template note creation
- all visible VTT template buttons: NPC, Location, Quest, and Session
- metadata editing for status, visibility, tags, and pin state
- pinned-note ordering
- markdown preview for headings, bullets, emphasis, code, and wiki links
- TODO counting, wiki link listing, and backlink navigation
- tag-chip filter interactions
- autosave persistence into `data/noteberry-workspace.json`
- damaged local data normalization
- desktop and narrow viewport screenshot baselines
- desktop, state-ordering, markdown-edited, template-stack, and responsive editor screenshots
- basic horizontal overflow, empty bounds, button clipping, and sibling-overlap checks

Current suite size:

- 7 Playwright Electron tests
- 7 screenshot baselines

## Commands

```bash
npm run build
npm run test:e2e
npm run test:e2e:update
npm run pack
```

## Screenshot Baselines

Stored under:

```text
tests/e2e/noteberry.e2e.spec.ts-snapshots/
```

Update them intentionally after reviewed UI changes:

```bash
npm run test:e2e:update
```

## Next Coverage Targets

- import/export dialog mocking
- keyboard navigation and editor shortcuts
- larger workspace performance tests
- attachment handling
- richer markdown and markdown bundle export
- SQLite or FTS-backed storage once the note graph grows beyond JSON
