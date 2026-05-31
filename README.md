<p align="center">
  <img src="resources/logo.png" alt="QuestBerry Logo" width="220">
</p>

> **Weiterführung:** NoteBerry wird nicht mehr als eigenständige App fortgeführt.
> Die App geht gemeinsam mit CharBerry in **QuestBerry** auf:
> https://github.com/RollBerryStudios/QuestBerry

<h1 align="center">QuestBerry</h1>

<p align="center">
  <strong>Lokale Kampagnen-Notizen für Pen-&amp;-Paper-Runden</strong><br>
  <em>Local-first campaign notes for tabletop RPG sessions</em>
</p>

<p align="center">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow.svg">
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.13-blue.svg">
  <img alt="Electron" src="https://img.shields.io/badge/Electron-41-47848F?logo=electron&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white">
  <img alt="Local First" src="https://img.shields.io/badge/local--first-offline-brightgreen.svg">
</p>

<p align="center">
  <a href="#deutsch">Deutsch</a> &nbsp;|&nbsp; <a href="#english">English</a>
</p>

---

## Deutsch

QuestBerry ist eine **kostenlose, lokale Desktop-App für Kampagnen-Notizen,
Vorbereitung und Spielleitung**. Sie ist für Gruppen gedacht, die ihre Notizen
neben einer analogen Karte, einem anderen VTT oder einem leichten Online-Setup
organisieren wollen.

- **Standalone-Notizarbeitsbereich** - keine Kampagne oder Cloud-Anmeldung nötig
- **VTT-Kategorien** - Sitzungen, NSCs, Orte, Aufträge, Gegenstände, Weltwissen, Regeln und Handouts
- **Sichtbarkeit** - SL-, Tisch- und Geheim-Notizen mit eigenem Filter
- **Sitzungsübersicht** - tischbereite Handouts, SL-Notizen, Geheimnisse und offene Fäden
- **Schnellerfassung** - Einfälle, Hinweise und neue NSCs ohne Kontextwechsel aufnehmen
- **Markdown-Vorschau** - schnelle Struktur für Vorbereitung und Spieltisch
- **Mehrsprachig** - Benutzeroberfläche auf Deutsch und Englisch
- **Einheitliche Navigation** - kompakte BoltBerry-App-Chrome mit Wordmark, Notiz-Breadcrumb und separater Aktionsleiste

Gebaut mit Electron, React, TypeScript und Vite. Läuft auf macOS, Windows und
Linux.

### Aktueller Release

Aktuelle Version: **0.1.13**

- [Neueste Release herunterladen](https://github.com/RollBerryStudios/QuestBerry/releases/latest)
- [Alle Releases anzeigen](https://github.com/RollBerryStudios/QuestBerry/releases)
- Direkter Tag: [v0.1.13](https://github.com/RollBerryStudios/QuestBerry/releases/tag/v0.1.13)

| Plattform | Artefakt in der Release |
|---|---|
| Windows x64 | `QuestBerry.Setup.0.1.13.exe` |
| Linux x64 | `QuestBerry-0.1.13.AppImage`, `questberry_0.1.13_amd64.deb` |
| macOS x64 | `QuestBerry-0.1.13.dmg`, `QuestBerry-0.1.13-mac.zip` |
| macOS Apple Silicon | `QuestBerry-0.1.13-arm64.dmg`, `QuestBerry-0.1.13-arm64-mac.zip` |

### Features

| Kategorie | Funktion |
|---|---|
| **Notizarbeitsbereich** | Notizen erstellen, bearbeiten, suchen, filtern, pinnen und löschen |
| **VTT-Kategorien** | Sitzung, NSC, Ort, Auftrag, Gegenstand, Weltwissen, Regeln und Handout |
| **Templates** | Starter für NSC-, Orts-, Auftrags- und Sitzungsnotizen |
| **Tags** | Komma-basierte Tags und Tag-Filter |
| **Sichtbarkeit** | SL, Tisch und Geheim mit eigenem Sichtbarkeitsfilter |
| **Sitzungsübersicht** | Tischbereit, Nur SL, Geheimnisse und offene Fäden auf einen Blick |
| **Schnellerfassung** | Neue Notizen direkt aufnehmen, kategorisieren und mit Sichtbarkeit speichern |
| **Markdown-Vorschau** | Überschriften, Listen, Betonung und Code für lesbare Vorbereitung |
| **Autosave** | Lokaler JSON-Arbeitsbereich mit Import/Export und Daten-Normalisierung |
| **Responsive UI** | Desktop- und schmale Layouts per Playwright-Screenshots abgesichert |
| **App-Chrome** | Kompakte BoltBerry-inspirierte Titelleiste mit einheitlicher Navigation und DPI-sicherem Fensterkontroll-Abstand |

### Bedienung

1. **Notizen organisieren** - erstelle Notizen nach Kategorie, Sichtbarkeit und Tags und finde sie über Suche oder Filter wieder.
2. **Sitzung vorbereiten** - nutze Sitzungsübersicht und Schnellerfassung für tischbereite Handouts, SL-Notizen, Geheimnisse und offene Fäden.
3. **Inhalte schreiben** - arbeite im Editor mit Markdown, Templates und Vorschau für NSCs, Orte, Aufträge, Regeln und Handouts.
4. **Daten sichern** - exportiere den Arbeitsbereich, importiere bestehende JSON-Daten oder öffne den lokalen Datenordner.
5. **Shortcuts nachschlagen** - öffne die Hilfe über den Info-Button, `?` oder `F1`; `Escape` schließt Hilfe, Einstellungen und Dialoge.

### Schnellstart

**Voraussetzungen:** Node.js 20+ und npm 10+

```bash
git clone https://github.com/RollBerryStudios/QuestBerry.git
cd QuestBerry
npm install
npm run dev
```

### Builds erstellen

```bash
npm run build      # TypeScript + Preload + Renderer kompilieren
npm run pack       # Entpacktes App-Verzeichnis für die aktuelle Plattform
npm run dist       # Installer/Distributionspakete für die aktuelle Plattform
```

### Qualitätssicherung

```bash
npm run test:e2e          # Build + Playwright/Electron E2E-Suite
npm run test:e2e:headed   # Gleiche Suite mit sichtbarem Fenster
npm run test:e2e:update   # Screenshot-Baselines nach absichtlichen UI-Änderungen aktualisieren
```

Die E2E-Suite startet QuestBerry mit isolierten Testdaten und prüft Rendering,
Suche, Kategorie-/Tag-/Sichtbarkeitsfilter, Templates, Markdown-Vorschau,
Sitzungsübersicht, Schnellerfassung, Persistenz, Normalisierung beschädigter Daten sowie Desktop- und
Responsive-Screenshots ohne Überlappungen.

### Lokale Daten

QuestBerry speichert lokal im Electron-AppData-Verzeichnis:

```text
data/questberry-workspace.json
```

Der Arbeitsbereich wird beim Laden normalisiert, damit beschädigte oder veraltete
Daten die Oberfläche nicht brechen.

### Projektstruktur

```text
src/
  main/          Electron Main-Prozess, IPC und lokale Persistenz
  preload/       Sichere Context Bridge für die Renderer-API
  renderer/      React-App, Notizworkspace, Markdown, i18n
tests/e2e/       Playwright Electron QA-Suite
resources/       Logo und App-Icons
```

### Tech-Stack

| Technologie | Verwendung |
|---|---|
| Electron 41 | Desktop-Shell und native Dialoge |
| React 18 | Benutzeroberfläche |
| TypeScript 5.9 | Typisierte App-Logik |
| Vite 6 | Renderer-Bundling |
| Playwright | Electron E2E und Screenshot-Validierung |
| electron-builder | Packaging für macOS, Windows und Linux |

### CI/CD & Releases

Fertige Builds werden als [GitHub Releases](https://github.com/RollBerryStudios/QuestBerry/releases)
veröffentlicht. Die Release-Seite enthält Windows-, Linux- und macOS-Artefakte.
Lokale Builds sind unsigned; notarized macOS-Releases oder signierte
Windows-Installer brauchen eigene Zertifikate und Secrets.

### Lizenz

App-Code: [MIT](LICENSE) (c) 2026 RollBerry Studios.

---

## English

QuestBerry is a **free, local-first desktop app for campaign notes, prep, and
table management**. It is built for groups that want focused notes beside an
analog map, another VTT, or a lightweight online setup.

- **Standalone note workspace** - no campaign suite or cloud account required
- **VTT categories** - sessions, NPCs, locations, quests, items, lore, rules, and handouts
- **Visibility** - GM, table, and secret notes with a dedicated filter
- **Session Desk** - table-ready handouts, GM notes, secrets, and open threads
- **Quick Capture** - capture ideas, clues, and new NPCs without losing context
- **Markdown preview** - quick structure for prep and live play
- **Multilingual** - English and German interface
- **Unified navigation** - compact BoltBerry-style app chrome with wordmark, note breadcrumb, and separate action bar

Built with Electron, React, TypeScript, and Vite. Runs on macOS, Windows, and
Linux.

### Current Release

Current version: **0.1.13**

- [Download the latest release](https://github.com/RollBerryStudios/QuestBerry/releases/latest)
- [View all releases](https://github.com/RollBerryStudios/QuestBerry/releases)
- Direct tag: [v0.1.13](https://github.com/RollBerryStudios/QuestBerry/releases/tag/v0.1.13)

| Platform | Release artifact |
|---|---|
| Windows x64 | `QuestBerry.Setup.0.1.13.exe` |
| Linux x64 | `QuestBerry-0.1.13.AppImage`, `questberry_0.1.13_amd64.deb` |
| macOS x64 | `QuestBerry-0.1.13.dmg`, `QuestBerry-0.1.13-mac.zip` |
| macOS Apple Silicon | `QuestBerry-0.1.13-arm64.dmg`, `QuestBerry-0.1.13-arm64-mac.zip` |

### Features

| Category | What you get |
|---|---|
| **Note Workspace** | Create, edit, search, filter, pin, and delete notes |
| **VTT Categories** | Session, NPC, Location, Quest, Item, Lore, Rules, and Handout |
| **Templates** | Starters for NPC, Location, Quest, and Session notes |
| **Tags** | Comma-based tags and tag filters |
| **Visibility** | GM, Table, and Secret with a dedicated visibility filter |
| **Session Desk** | Table-ready, GM-only, secret, and open-thread notes at a glance |
| **Quick Capture** | Capture, categorize, and save new notes with visibility in one flow |
| **Markdown Preview** | Headings, lists, emphasis, and code for readable prep |
| **Autosave** | Local JSON workspace with import/export and data normalization |
| **Responsive UI** | Desktop and narrow layouts covered by Playwright screenshots |
| **App Chrome** | Compact BoltBerry-inspired title bar with unified navigation and DPI-safe native-control spacing |

### Usage

1. **Organize notes** - create notes by category, visibility, and tags, then find them through search or filters.
2. **Prepare sessions** - use Session Desk and Quick Capture for table-ready handouts, GM notes, secrets, and open threads.
3. **Write content** - work in the editor with Markdown, templates, and preview for NPCs, locations, quests, rules, and handouts.
4. **Control your data** - export the workspace, import existing JSON data, or open the local data folder.
5. **Check shortcuts** - open help with the info button, `?`, or `F1`; `Escape` closes help, settings, and dialogs.

### Getting Started

**Prerequisites:** Node.js 20+ and npm 10+

```bash
git clone https://github.com/RollBerryStudios/QuestBerry.git
cd QuestBerry
npm install
npm run dev
```

### Building

```bash
npm run build      # Compile TypeScript, preload, and renderer
npm run pack       # Build an unpacked app directory for the current platform
npm run dist       # Build distributable packages for the current platform
```

### Quality Assurance

```bash
npm run test:e2e          # Build + Playwright/Electron E2E suite
npm run test:e2e:headed   # Same suite with a visible window
npm run test:e2e:update   # Refresh screenshot baselines after intentional UI changes
```

The E2E suite launches QuestBerry with isolated test data and validates
rendering, search, category/tag/visibility filters, templates, markdown
preview, Session Desk, Quick Capture, persistence, damaged data normalization, and
desktop/responsive screenshots without layout overlaps.

### Local Data

QuestBerry stores its local data in the Electron app data folder:

```text
data/questberry-workspace.json
```

The workspace is normalized on load so damaged or outdated data cannot break
the UI.

### Project Structure

```text
src/
  main/          Electron main process, IPC, and local persistence
  preload/       Safe context bridge for the renderer API
  renderer/      React app, note workspace, markdown, i18n
tests/e2e/       Playwright Electron QA suite
resources/       Logo and app icons
```

### Tech Stack

| Technology | Usage |
|---|---|
| Electron 41 | Desktop shell and native dialogs |
| React 18 | User interface |
| TypeScript 5.9 | Typed app logic |
| Vite 6 | Renderer bundling |
| Playwright | Electron E2E and screenshot validation |
| electron-builder | Packaging for macOS, Windows, and Linux |

### CI/CD & Releases

Ready-to-use builds are published as [GitHub Releases](https://github.com/RollBerryStudios/QuestBerry/releases).
The release page contains Windows, Linux, and macOS artifacts. Local builds are
unsigned; notarized macOS releases or signed Windows installers require your
own certificates and secrets.

### License

App code: [MIT](LICENSE) (c) 2026 RollBerry Studios.
