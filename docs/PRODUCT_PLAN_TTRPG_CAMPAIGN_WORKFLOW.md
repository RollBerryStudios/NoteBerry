# QuestBerry Product Plan - Best Local-First TTRPG Campaign Workspace

Stand: 2026-05-31

Ziel: QuestBerry soll das beste Tool fuer Pen-and-Paper- und Tabletop-Kampagnen werden: schnell am Spieltisch, stark in Vorbereitung und Nachbereitung, sicher bei Geheimnissen, offen bei Daten und bewusst leichter als grosse Worldbuilding-Suiten.

## Ausgangslage

QuestBerry ist heute bereits stark bei:

- Local-first Desktop-App ohne Cloud- oder Account-Zwang.
- Kategorien: Session, NPC, Location, Quest, Item, Lore, Rules, Handout.
- Sichtbarkeit: GM, Table, Secret.
- Status: Draft, Active, Resolved, Archived.
- Session Desk mit Table-ready, GM-only, Secrets, Open Threads und Recent Notes.
- Quick Capture fuer Ideen, Hinweise, neue NPCs und offene Fragen.
- Markdown-Vorschau, Templates, Tags, Suche, Import/Export.
- Erste Wiki-Link- und Backlink-Logik ueber `[[...]]`.
- Deutsch/Englisch und Playwright-abgesicherte Desktop-/Responsive-UI.

Die groesste Chance liegt jetzt darin, QuestBerry von "gute Notizen" zu "Kampagnen-Gedaechtnis und Spielleitungs-Workflow" zu bringen.

## Produktpositionierung

### Claim

QuestBerry ist der lokale Kampagnen-Schreibtisch fuer GMs, die ihre Runde vorbereiten, leiten und nachhalten wollen, ohne ihre Daten in eine Cloud-Suite oder ein Plugin-Labyrinth zu sperren.

### Nicht-Ziele

- Kein vollstaendiges VTT.
- Keine Regelautomation als Kernprodukt.
- Keine D&D-only Ausrichtung.
- Keine Publikationsplattform wie World Anvil.
- Keine Plugin-Bastelei wie Obsidian als Voraussetzung.
- Keine KI als Hauptversprechen.

### Ziele

- Beste Session-to-session UX: Was ist heute wichtig, was ist offen, was wurde den Spielern gezeigt?
- Beste Secret-Sicherheit: GM sieht alles, Spieler-/Table-Pakete enthalten nur Freigegebenes.
- Beste lokale Datenkontrolle: Markdown/JSON/HTML/PDF Export statt Lock-in.
- Beste TTRPG-Struktur ohne Formularlast: Kategorien, Status, Links, Beziehungen und Templates helfen, ohne zu bremsen.
- Beste Bruecke zu Karten/VTTs: Notizen koennen auf MapBerry, Foundry, Fantasy Grounds, Roll20 oder externe Links zeigen.

## Wettbewerbs-Learnings

### Von Alkemion Studio

Uebernehmen:

- Abenteuer bestehen aus Beziehungen: NPCs, Orte, Hinweise, Events, Gefahren und Handouts gehoeren sichtbar zusammen.
- Visuelles Denken ist wertvoll, aber nicht jeder GM will ein Board als einzigen Eingabemodus.
- Scratchpad und Player Action Logging sind starke Live-Spiel-Funktionen.
- Markdown Import, Export, Offline, Version History und Foundry-/Obsidian-Bruecken sind wichtige Vertrauenssignale.

Fuer QuestBerry:

- Erst Beziehungen und Session-Log bauen, dann optional Board/Graph.
- Editor bleibt Hauptarbeitsflaeche, Graph/Board wird eine Ansicht auf vorhandene Notizen.

### Von LegendKeeper

Uebernehmen:

- Schnelle, elegante Wiki-UX.
- Auto-/Mentions, starke Suche, Templates und Spielerfreigaben.
- "Keine 30 Stunden Tutorials" als implizites UX-Ziel.
- Import/Export und Datenbesitz sichtbar machen.

Fuer QuestBerry:

- Weniger Felder als Kanka, aber bessere Kampagnenstruktur als Obsidian out of the box.

### Von Kanka

Uebernehmen:

- Strukturierte Entities, Rollen-/Sichtbarkeitsdenken, Quests, Journals, Timelines, Calendars, Relations.
- Kampagnendashboard als Homebase.

Vermeiden:

- Zu viele Module und Verwaltungsoberflaechen.
- Das Gefuehl, erst eine Datenbank pflegen zu muessen, bevor man spielen kann.

### Von World Anvil

Uebernehmen:

- Tiefere Templates, Timelines, Karten-/Artikel-Links, TODOs, Access Control.

Vermeiden:

- Publikations- und Showcase-Fokus.
- Paywall-/Abo-Gefuehl.
- Schwergewichtige Lernkurve.

### Von Obsidian

Uebernehmen:

- Local-first, Markdown, Links, Backlinks, Graph-Denken, portable Daten.

Vermeiden:

- Plugin-Overload.
- Nutzer muessen ihre Kampagnenstruktur selbst erfinden.
- Zu viel Metadatenpflege.

## Zielbild

Eine typische QuestBerry-Runde sollte so funktionieren:

1. GM oeffnet den Session Desk und sieht aktive Quests, wichtige NPCs, Orte, Geheimnisse, Handouts und offene Threads.
2. GM schreibt oder importiert Prep als Markdown.
3. QuestBerry erkennt `@`-Mentions/`[[Links]]`, erstellt Backlinks und schlaegt neue Notizen vor.
4. Waehrend der Runde landen spontane Infos im Quick Capture oder Session Log.
5. Geheimnisse, Hinweise und Handouts werden gezielt als "Table" markiert.
6. Nach der Runde erzeugt QuestBerry aus Session Log und geaenderten Notizen eine Nachbereitungsansicht.
7. GM exportiert ein Player Packet, Markdown Vault oder Backup, ohne Lock-in.

## Roadmap

### Phase 1 - Links, Mentions und Beziehungen

Ziel: QuestBerry wird vom Notizarchiv zum Kampagnennetz.

Features:

- `@`-Mention-Autocomplete fuer existierende Notizen.
- Inline-Link-Erstellung: aus `@Neuer NPC` oder `[[Neuer Ort]]` direkt neue Notiz anlegen.
- Backlinks robuster machen:
  - nicht nur nach Titelstring, sondern nach stabiler Note-ID.
  - Titelumbenennung bricht Links nicht.
- Relationship Panel:
  - "verlinkt zu", "erwaehnt in", "offene Verweise".
  - Beziehungstypen: appears in, located at, allied with, opposed to, clue for, owns, part of, custom.
- Sichtbarkeit pro Beziehung:
  - GM-only Beziehungen duerfen nicht ins Player Packet.

Erfolgskriterium:

- Ein GM kann NPC, Ort, Quest und Hinweis in wenigen Sekunden verknuepfen und spaeter aus jeder Richtung wiederfinden.

### Phase 2 - Session Command Center

Ziel: Der Session Desk wird zur zentralen Ansicht fuer "heute Abend leiten".

Features:

- Aktive Session waehlen oder erstellen.
- Session Agenda:
  - Szenen/Beats.
  - relevante NPCs.
  - relevante Orte.
  - vorbereitete Handouts.
  - Geheimnisse/Hinweise.
  - offene Fragen.
- Session Log:
  - schnelle Live-Eintraege.
  - Eintrag optional mit Notiz verknuepfen.
  - Typen: event, clue, ruling, npc, loot, quest, question, recap.
- "After Session" Ansicht:
  - neue Notizen aus Quick Capture.
  - geaenderte Quests.
  - gefundene/gezeigte Geheimnisse.
  - offene Threads.
  - Recap-Entwurf als Markdown.

Erfolgskriterium:

- Eine laufende Runde laesst sich aus einer Ansicht heraus leiten, ohne zwischen Suche, Editor und Listen zu springen.

### Phase 3 - Statusmodelle je Kategorie

Ziel: Notizen bekommen TTRPG-nativen Zustand, ohne eine schwere Datenbank zu werden.

Features:

- Bestehenden `status` beibehalten, aber pro Kategorie feinere Felder ergaenzen.
- Quest:
  - open, active, blocked, resolved, failed.
  - giver, reward, stakes, next step.
- NPC:
  - unknown, known, ally, neutral, rival, enemy, dead/gone.
  - current location, faction, attitude.
- Location:
  - unexplored, known, visited, changed, destroyed.
- Handout:
  - prepared, shown, archived.
- Clue/Secret als neues Konzept:
  - seeded, discovered, missed, resolved.

Umsetzung:

- Nicht sofort acht neue Detailformulare bauen.
- Erst "Smart Fields" im Details-Panel: kleine optionale Felder je Kategorie.
- Templates schreiben diese Felder als Frontmatter oder strukturierte JSON-Felder.

Erfolgskriterium:

- Session Desk kann aktive Quests, nicht gezeigte Handouts und ungelöste Hinweise automatisch hervorheben.

### Phase 4 - Player Packet und Secret Safety

Ziel: GMs koennen Spielerinformationen sicher teilen.

Features:

- Player Preview:
  - zeigt nur Table-Notizen.
  - Secrets und GM-Notizen werden ausgeschlossen.
  - Warnung, wenn Secret-Keywords oder GM-only Blöcke in Table-Notizen stehen.
- Player Packet Export:
  - HTML fuer Browser/Upload.
  - PDF fuer Druck.
  - Markdown fuer Obsidian/Discord/Git.
- Paketquellen:
  - aktuelle Session.
  - alle Table-Notizen.
  - ausgewaehlte Handouts.
  - Recap.
  - aktive Quests.
- "Mark as shown":
  - Handout/Hinweis wurde am Tisch gezeigt.
  - wird automatisch im Recap/Player Packet beruecksichtigt.

Erfolgskriterium:

- GM kann vor der Runde sicher pruefen, was Spieler sehen werden, und nach der Runde ein sauberes Paket exportieren.

### Phase 5 - Import/Export und Datenvertrauen

Ziel: QuestBerry wird die vertrauenswuerdige lokale Alternative zu Cloud-Wikis.

Features:

- Markdown Export:
  - eine Datei pro Notiz.
  - Frontmatter fuer Kategorie, Tags, Status, Sichtbarkeit.
  - relative Links.
- Obsidian Vault Export:
  - Ordner je Kategorie.
  - `[[Links]]` kompatibel.
  - Assets/Handouts vorbereitet.
- Markdown Import:
  - Ordner importieren.
  - Frontmatter lesen, fallback ueber Ordner/Kopfzeile.
- HTML/PDF Export:
  - Player Packet.
  - Campaign Archive.
- Automatische Snapshots:
  - lokale Versionshistorie vor Import, Export, groesseren Migrationen.
  - Restore UI.

Erfolgskriterium:

- Nutzer koennen QuestBerry ausprobieren, produktiv nutzen und wieder verlassen, ohne Datenverlust oder proprietaere Sackgasse.

### Phase 6 - MapBerry/VTT Bridge

Ziel: QuestBerry ist das Kampagnengedächtnis, MapBerry oder andere VTTs sind die Spieloberfläche.

Features:

- Gemeinsames RollBerry-Linkformat:
  - `rollberry://questberry/note/<noteId>`
  - `rollberry://mapberry/map/<mapId>/pin/<pinId>`
- Externe Links sicher erlauben:
  - Foundry Journal/Scene Links.
  - Fantasy Grounds/Roll20 URLs.
  - lokale Datei-/Asset-Referenzen nur kontrolliert.
- Note-to-Map Workflow:
  - Location oder Handout als MapBerry-Pin vorschlagen.
  - MapBerry Session Log als QuestBerry Session importieren.
- "Related Maps" Feld fuer Locations/Sessions.

Erfolgskriterium:

- GM kann QuestBerry neben jedem VTT nutzen und wichtige Kampagneninfos von Karten/Scenes aus erreichen.

### Phase 7 - Optional Graph/Board

Ziel: Alkemion-artige Uebersicht, aber auf QuestBerry-Daten aufgebaut.

Features:

- Graph View:
  - Notizen als Nodes.
  - Links/Relationships als Kanten.
  - Filter nach Kategorie, Status, Sichtbarkeit, Session.
- Session Board:
  - nur relevante Notizen fuer die aktive Session.
  - Spalten: Prep, Live, Revealed, After Session.
- Mystery/Clue Board:
  - Hinweise, Quellen, Zielinformationen, Entdeckungsstatus.
- Board bleibt optional.

Erfolgskriterium:

- Visuelle GMs bekommen Struktur, ohne dass textorientierte GMs ihren Workflow verlieren.

## Datenmodell-Vorschlag

Kurzfristige Erweiterungen:

```ts
type NoteCategory = 'Session' | 'NPC' | 'Location' | 'Quest' | 'Item' | 'Lore' | 'Rules' | 'Handout' | 'Clue'

type RelationshipKind =
  | 'appears-in'
  | 'located-at'
  | 'allied-with'
  | 'opposed-to'
  | 'clue-for'
  | 'owns'
  | 'part-of'
  | 'custom'

interface NoteRelationship {
  id: string
  sourceNoteId: string
  targetNoteId: string
  kind: RelationshipKind
  label: string
  visibility: NoteVisibility
  createdAt: string
  updatedAt: string
}

interface SessionLogEntry {
  id: string
  sessionNoteId: string
  type: 'event' | 'clue' | 'ruling' | 'npc' | 'loot' | 'quest' | 'question' | 'recap'
  body: string
  linkedNoteIds: string[]
  visibility: NoteVisibility
  createdAt: string
}

interface NoteSmartFields {
  questStatus?: 'open' | 'active' | 'blocked' | 'resolved' | 'failed'
  npcRole?: 'ally' | 'neutral' | 'rival' | 'enemy' | 'unknown'
  locationStatus?: 'unknown' | 'known' | 'visited' | 'changed'
  handoutStatus?: 'prepared' | 'shown' | 'archived'
  clueStatus?: 'seeded' | 'discovered' | 'missed' | 'resolved'
  relatedMapRefs?: string[]
}
```

Workspace spaeter:

```ts
interface NoteWorkspace {
  version: 2
  activeNoteId: string | null
  activeSessionId: string | null
  notes: VttNote[]
  relationships: NoteRelationship[]
  sessionLog: SessionLogEntry[]
}
```

Migrationsregel:

- Version 1 Libraries defensiv nach Version 2 normalisieren.
- Bestehende `[[Title]]` Links beim Laden nicht zerstoeren.
- Neue stabile Links duerfen Markdown-Export weiterhin lesbar halten.

## Erste konkrete Issues

1. Workspace-Version 2 mit `relationships`, `sessionLog`, `activeSessionId` einfuehren.
2. Link-Resolver bauen: Titel, Alias und stabile IDs.
3. `@`-/`[[`-Autocomplete im Editor bauen.
4. "Create missing linked note" Flow bauen.
5. Relationship Panel fuer aktive Notiz bauen.
6. Session Command Center mit aktiver Session und Log-Skeleton bauen.
7. Session Log Quick Capture erweitern.
8. Player Preview fuer Table-Notizen bauen.
9. Markdown Export mit Frontmatter bauen.
10. Obsidian Vault Export Proof of Concept bauen.

## Prioritaet fuer den naechsten Sprint

Der groesste Hebel liegt in dieser Reihenfolge:

1. Robuste Links und Mentions.
2. Relationship Panel.
3. Aktive Session im Session Desk.
4. Session Log / After Session Recap.
5. Player Preview fuer Table-Notizen.

Das macht QuestBerry sofort deutlich besser fuer reale Kampagnen, ohne grosse UI-Komplexitaet einzufuehren.

## QA-Anforderungen

Neue E2E-Tests:

- Version-1-Workspace wird nach Version 2 migriert.
- `[[Alter Titel]]` bleibt nutzbar.
- Umbenannte Notiz bricht stabile Links nicht.
- `@`-Autocomplete findet NPCs, Orte, Quests und Handouts.
- Missing Link kann als neue Notiz erstellt werden.
- Relationship Panel zeigt Forward Links und Backlinks korrekt.
- Secret-Beziehungen erscheinen nicht in Player Preview.
- Session Log speichert Eintraege und verknuepfte Notizen.
- Player Packet enthaelt Table-Notizen, aber keine GM-/Secret-Notizen.
- Markdown Export enthaelt Frontmatter und relative Links.

Visuelle Checks:

- Desktop Dark/Light: Session Command Center.
- Schmale Breite: Quick Capture + aktive Session.
- Grosse Kampagne mit 200 Notizen: Suche, Links und Session Desk bleiben bedienbar.

## Leitprinzip

QuestBerry gewinnt, wenn es sich anfühlt wie ein guter GM-Assistent:

- Es merkt sich alles.
- Es verrät nichts aus Versehen.
- Es findet Verbindungen schneller als Papier.
- Es bleibt lokal und exportierbar.
- Es hilft bei der nächsten Session, nicht nur beim perfekten Wiki.
