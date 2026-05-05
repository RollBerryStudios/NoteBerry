<p align="center">
  <img src="resources/logo.png" alt="NoteBerry Logo" width="220">
</p>

<h1 align="center">NoteBerry</h1>

<p align="center">
  <strong>Rich local note taking designed for virtual tabletop preparation and play.</strong>
</p>

<p align="center">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow.svg">
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.1-blue.svg">
  <img alt="Electron" src="https://img.shields.io/badge/Electron-41-47848F?logo=electron&logoColor=white">
  <img alt="Local First" src="https://img.shields.io/badge/local--first-offline-brightgreen.svg">
</p>

NoteBerry is a free, local-first Electron app for campaign notes, session prep,
NPC records, locations, quests, lore, rules, handouts, and table secrets. It is
built for tabletop workflows: fast search, structured templates, tags,
visibility states, markdown preview, TODO tracking, wiki links, and backlinks.

It is intentionally standalone: use it beside an analog table, another VTT, or
any campaign workflow where you want focused notes without a full tabletop
suite.

## Features

| Area | Included |
| --- | --- |
| Note Workspace | Create, edit, select, search, filter, pin, and delete local notes |
| VTT Categories | Session, NPC, Location, Quest, Item, Lore, Rules, and Handout |
| Templates | One-click NPC, Location, Quest, and Session note starters |
| Tags | Comma-based tag editing and tag filters |
| Visibility | GM, Table, and Secret note states with a dedicated visibility filter |
| Markdown Preview | Headings, bullets, emphasis, code, and wiki link highlighting |
| Table Intel | TODO counter, wiki links, tag chips, and backlinks |
| Multilingual UI | English and German interface |
| Persistence | Autosaved local JSON workspace with import/export |
| Responsive UI | Desktop and narrow viewport layouts covered by Playwright screenshots |

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run pack
npm run dist
```

The GitHub release workflow builds Windows `.exe`, Linux `.AppImage`/`.deb`,
and macOS `.dmg`/`.zip` artifacts.

## Test

```bash
npm run test:e2e
```

The E2E suite launches Electron with isolated test data and validates:

- first render and core UI
- search, category filters, tag filters, and visibility filters
- template note creation
- markdown preview and table intel
- edit persistence
- damaged data normalization
- desktop and responsive screenshot stability
- basic overlap and clipping checks

See [`docs/TESTING.md`](docs/TESTING.md) for the current QA process and next
coverage targets.

## Data

NoteBerry stores data inside the operating system's Electron app data folder:

```text
data/noteberry-workspace.json
```

The workspace is normalized on load so malformed or outdated local data cannot
break the UI.

## Project Structure

```text
src/main/       Electron main process and local persistence
src/preload/    Safe renderer API bridge
src/renderer/   React note workspace UI
tests/e2e/      Playwright Electron QA suite
resources/      Logo and app icons
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Desktop | Electron |
| Renderer | React + TypeScript |
| Bundler | Vite |
| Tests | Playwright |
| Packaging | electron-builder |

## License

MIT
