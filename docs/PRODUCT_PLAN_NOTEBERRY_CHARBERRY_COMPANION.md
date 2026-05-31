# QuestBerry + CharBerry Product Plan - The Local-First TTRPG Companion

Stand: 2026-05-31

Ziel: QuestBerry und CharBerry so zusammenfuehren, dass daraus das Tool entsteht, das Pen-and-Paper-Spieler und GMs wirklich lieben: Kampagnengedächtnis, Charakterbogen, Session-Flow, Spielerjournal, Handouts und Datenbesitz in einem schnellen, lokalen Workflow.

## These

Die beste Chance liegt nicht darin, QuestBerry und CharBerry einfach technisch zu verschmelzen. Die Chance liegt in einem gemeinsamen Produktversprechen:

> Ein lokaler Campaign Companion, der GMs beim Leiten hilft und Spielern das Gefuehl gibt, dass ihr Charakter, ihre Entscheidungen und ihre Erinnerungen lebendig Teil der Kampagne sind.

QuestBerry ist heute der GM-/Kampagnen-Kopf.
CharBerry ist heute der Spieler-/Charakter-Körper.
Zusammen koennen sie das werden, was viele VTTs und Wikis nicht gut loesen: die Luecke zwischen Charakter, Story, Session und Erinnerung.

## Warum Spieler das lieben wuerden

Viele Tools optimieren fuer GMs, Weltbau oder Kampfverwaltung. Spieler lieben aber andere Dinge:

- Sie wollen ihren Charakter sofort verstehen und spielen koennen.
- Sie wollen wissen, was letzte Session passiert ist.
- Sie wollen offene Quests, Beziehungen, Versprechen, Schulden und persoenliche Ziele wiederfinden.
- Sie wollen coole Momente, Loot, NPCs und Orte festhalten.
- Sie wollen Handouts und Gruppenwissen ohne Spoiler.
- Sie wollen nicht nach jedem Level-up oder jeder Notiz in drei Tools arbeiten.

Ein gemeinsames QuestBerry + CharBerry sollte deshalb nicht nur "Charakterbogen plus Notizen" sein. Es sollte die Spielrunde als lebendigen Verlauf abbilden.

## Produktpositionierung

### Arbeitstitel

RollBerry Companion

Alternativen:

- CampaignBerry
- TableBerry
- QuestBerry Companion
- CharBerry Campaign Mode

Empfehlung: nach aussen vorerst bei QuestBerry und CharBerry bleiben, aber intern ein gemeinsames "Companion"-Datenmodell aufbauen. Erst wenn der gemeinsame Workflow stark genug ist, lohnt sich ein neuer Produktname.

### Claim

Der lokale Companion fuer Pen-and-Paper-Runden: Charaktere spielen, Kampagnen erinnern, Sessions vorbereiten und Gruppenwissen sicher teilen.

### Nicht-Ziele

- Kein vollstaendiges VTT.
- Keine verpflichtende Cloud.
- Keine D&D-only App.
- Keine Worldbuilding-Publikationsplattform.
- Kein Plugin-System als Voraussetzung.
- Keine Regelautomation, die das Produkt dominiert.

### Ziele

- Spieler lieben es, weil Charakterbogen, Journal, Ziele, Loot und Recaps zusammenleben.
- GMs lieben es, weil QuestBerry Kampagnenstruktur, Geheimnisse, NPCs, Quests und Handouts sicher verwaltet.
- Gruppen lieben es, weil Table-Infos sauber geteilt werden koennen.
- Power-User lieben es, weil alles lokal, exportierbar und offen bleibt.

## Kern-Use-Cases

### 1. Vor der Session

GM:

- Waehlt aktive Session.
- Sieht relevante NPCs, Orte, Quests, Geheimnisse und Handouts.
- Sieht Party-Zustand: HP grob, Ressourcen, offene Charakterziele, wichtige Inventarobjekte.
- Bereitet ein Player Packet vor.

Spieler:

- Oeffnet Charakter.
- Sieht letzte Recap, offene Gruppenquests, persoenliche Ziele und Notizen.
- Prueft Ressourcen, Inventar, Zauber, Conditions.

### 2. Waehrend der Session

GM:

- Nutzt Session Command Center.
- Macht Quick Captures.
- Markiert Handouts/Hinweise als gezeigt.
- Verknuepft Ereignisse mit Charakteren, NPCs, Orten oder Quests.

Spieler:

- Nutzt Play Dashboard.
- Macht private oder gruppensichtbare Charakter-Notizen.
- Loggt Ressourcen, Conditions, Loot und persoenliche Momente.
- Kann "Share with GM" fuer Notizen, Ziele, Fragen oder Recap-Vorschlaege nutzen.

### 3. Nach der Session

GM:

- Sieht After-Session-Review:
  - neue Charakterereignisse.
  - gefundene Hinweise.
  - gezeigte Handouts.
  - Questupdates.
  - offene Fragen.
- Generiert Recap-Entwurf.
- Schickt Player Packet.

Spieler:

- Bekommt Recap.
- Markiert persoenliche Ziele als erledigt/offen.
- Fuegt Erinnerungen und Highlights zum Charakterjournal hinzu.

## Das Produkt, das daraus entsteht

### Gemeinsame App-Idee

Ein Hauptfenster mit zwei Modi:

- **GM Mode**: QuestBerry-Fokus mit Campaign Desk, NPCs, Orte, Quests, Secrets, Player Packets.
- **Player Mode**: CharBerry-Fokus mit Charakterbogen, Play Dashboard, Journal, Quests, Handouts.

Beide Modi nutzen dieselbe Kampagne, aber andere Sichtbarkeiten.

### Wenn getrennte Apps bleiben

Auch dann muss es sich verbunden anfuehlen:

- Gemeinsames Linkformat.
- Gemeinsame Exportpakete.
- QuestBerry kann CharBerry-Charaktere referenzieren.
- CharBerry kann QuestBerry-Session-/Quest-/Handout-Daten anzeigen.
- Gemeinsame UI-Begriffe und Statusmodelle.

Empfehlung: erst getrennte Apps mit gemeinsamem Datenvertrag. Danach entscheiden, ob eine vereinte App-Shell sinnvoll ist.

## Gemeinsames Datenmodell

### Kampagne

```ts
interface CampaignRecord {
  id: string
  name: string
  system: 'dnd5e' | 'pf2e' | 'generic' | string
  activeSessionId: string | null
  noteWorkspaceRef: string | null
  characterLibraryRef: string | null
  createdAt: string
  updatedAt: string
}
```

### Charakter-Referenz in QuestBerry

```ts
interface CampaignCharacterRef {
  id: string
  characterId: string
  displayName: string
  playerName: string
  role: 'pc' | 'npc' | 'companion'
  visibility: 'gm' | 'table' | 'secret'
  charberryRef: string | null
  noteId: string | null
}
```

### Gemeinsamer Session Log

```ts
interface CampaignEvent {
  id: string
  sessionId: string
  type:
    | 'event'
    | 'character-moment'
    | 'clue'
    | 'quest'
    | 'loot'
    | 'ruling'
    | 'npc'
    | 'location'
    | 'question'
    | 'recap'
  body: string
  linkedNoteIds: string[]
  linkedCharacterIds: string[]
  visibility: 'gm' | 'table' | 'secret' | 'private'
  createdBy: 'gm' | 'player' | 'system'
  createdAt: string
}
```

### Player-facing Kampagnenwissen

```ts
interface PlayerPacket {
  id: string
  sessionId: string
  title: string
  recap: string
  visibleNoteIds: string[]
  visibleCharacterIds: string[]
  questIds: string[]
  handoutIds: string[]
  createdAt: string
}
```

### Charakterziele

```ts
interface CharacterGoal {
  id: string
  characterId: string
  title: string
  body: string
  status: 'open' | 'active' | 'completed' | 'failed' | 'paused'
  visibility: 'private' | 'gm' | 'table'
  linkedNoteIds: string[]
  createdAt: string
  updatedAt: string
}
```

## Roadmap

### Phase 1 - Gemeinsamer Datenvertrag und Links

Ziel: QuestBerry und CharBerry koennen sich gegenseitig sinnvoll referenzieren, ohne sofort ein Repo zu werden.

Features:

- RollBerry Linkformat:
  - `rollberry://questberry/note/<noteId>`
  - `rollberry://charberry/character/<characterId>`
  - `rollberry://charberry/character/<characterId>/note/<sessionNoteId>`
  - `rollberry://campaign/<campaignId>/session/<sessionId>`
- QuestBerry bekommt "Characters" als Kampagnenreferenzen.
- CharBerry bekommt "Campaign Links" fuer aktive Kampagne, Quests, Handouts und Recaps.
- Export/Import eines gemeinsamen `campaign-companion.json`.
- Gemeinsame IDs und defensive Migration.

Erfolgskriterium:

- Eine QuestBerry-Session kann CharBerry-Charaktere anzeigen und ein CharBerry-Charakter kann zu relevanten QuestBerry-Notizen springen.

### Phase 2 - Player Journal und GM Inbox

Ziel: Spieler koennen beitragen, ohne GM-Secrets zu sehen und ohne die Kampagnendaten zu zerlegen.

Features:

- CharBerry: Player Journal mit Eintraegen:
  - private.
  - share with GM.
  - share with table.
- QuestBerry: GM Inbox:
  - Spielerfragen.
  - Recap-Vorschlaege.
  - Charakterziele.
  - Loot-/Quest-Notizen.
- GM kann Eintraege akzeptieren:
  - als Session Log.
  - als Questupdate.
  - als Charakterbeziehung.
  - als Table-Note.
- Keine Echtzeit-Sync-Pflicht: Start mit Export/Import oder lokalem gemeinsamen Workspace.

Erfolgskriterium:

- Spieler koennen aktiv zum Kampagnengedächtnis beitragen, aber der GM behaelt Kontrolle ueber Kanon und Secrets.

### Phase 3 - Unified Session Desk

Ziel: Eine Session-Ansicht, die GM- und Spielerrealitaet verbindet.

GM sieht:

- aktive Session.
- Party-Liste mit Charakterstatus.
- relevante Charakterziele.
- NPCs, Orte, Quests, Handouts, Secrets.
- GM Inbox.
- Session Log.

Spieler sieht:

- aktive Session.
- eigener Charakter.
- Table Recap.
- sichtbare Quests und Handouts.
- persoenliche Ziele.
- eigene Notizen.

Features:

- QuestBerry Session Desk um Party Strip erweitern.
- CharBerry Play Dashboard um Campaign Panel erweitern.
- "Mark as shown" fuer Handouts und Hinweise.
- "Mention character" in QuestBerry: `@Aria` verlinkt PC/NPC.
- Session Recap aus GM Log plus akzeptierten Player Journal Entries.

Erfolgskriterium:

- Vor, waehrend und nach einer Session gibt es genau eine Stelle, die sagt: "Das ist gerade wichtig."

### Phase 4 - Player Packet und Character Packet

Ziel: Teilen wird sicher, nuetzlich und emotional belohnend.

Features:

- Player Packet:
  - Recap.
  - sichtbare Quests.
  - sichtbare NPCs/Orte.
  - gezeigte Handouts.
  - Gruppenloot.
- Character Packet:
  - persoenliche Recap.
  - Charakterziele.
  - relevante NPC-Beziehungen.
  - erhaltene Items.
  - offene Fragen.
- Export als HTML/PDF/Markdown.
- Secret Safety Audit:
  - prueft GM/Secret-Inhalte vor Export.

Erfolgskriterium:

- Nach jeder Session kann die Gruppe ein schoenes, sicheres Paket bekommen, das sich wie ein Kampagnen-Tagebuch anfuehlt.

### Phase 5 - Gemeinsame App-Shell

Ziel: Entscheiden, ob QuestBerry und CharBerry als Module in einer App zusammengehen.

Option A: Getrennte Apps bleiben

- Geringeres Risiko.
- Bestehende Releases bleiben klar.
- Nutzer koennen nur das installieren, was sie brauchen.
- Gemeinsame Daten und Links reichen fuer viele Workflows.

Option B: Neue Companion-App

- Eine App mit GM Mode und Player Mode.
- QuestBerry und CharBerry werden Module.
- Ein gemeinsamer Workspace.
- Besseres Onboarding und staerkeres Produktversprechen.
- Hoeherer Migrations- und Release-Aufwand.

Empfehlung:

1. Erst Phase 1-4 als getrennte Apps mit gemeinsamem Workspace/Export bauen.
2. Danach Nutzertests: Verstehen Menschen QuestBerry + CharBerry als Bundle?
3. Wenn ja, Companion-App als neue Shell bauen, nicht blind beide Codebases zusammenkopieren.

### Phase 6 - System-Agnostic und Templates

Ziel: D&D funktioniert gut, aber das Produkt gehoert Pen-and-Paper-Spielern allgemein.

Features:

- Systemprofil:
  - Generic.
  - D20/SRD.
  - Pathfinder-like.
  - Custom.
- CharBerry abstrahiert:
  - Stats.
  - Resources.
  - Conditions.
  - Rolls.
  - Inventory.
- QuestBerry Templates passen sich an:
  - Fantasy Kampagne.
  - Investigativ/Mystery.
  - Sci-Fi.
  - Horror.
  - Sandbox.
- Keine proprietaeren Regelinhalte.

Erfolgskriterium:

- Eine Nicht-D&D-Gruppe kann das Tool nutzen, ohne gegen die UI anzukaempfen.

## Killer Features

### 1. Campaign Memory

Alles, was passiert, wird als Event gespeichert und kann an Charaktere, Orte, NPCs, Quests und Handouts gebunden werden.

Warum Spieler es lieben:

- "Was hat mein Charakter damals versprochen?"
- "Wer schuldet uns noch einen Gefallen?"
- "Woher haben wir dieses Amulett?"

### 2. Character Moments

Spieler koennen besondere Momente direkt im Charakter speichern und optional mit GM/Table teilen.

Warum Spieler es lieben:

- Der Charakterbogen wird nicht nur Mathe, sondern Erinnerung.

### 3. GM Inbox

Spielernotizen landen nicht automatisch im Kanon, sondern in einer pruefbaren Inbox.

Warum GMs es lieben:

- Beteiligung ohne Chaos.

### 4. Safe Player Packet

Ein Klick erzeugt sichere Gruppeninfos ohne GM-Secrets.

Warum Gruppen es lieben:

- Niemand muss Discord, Google Docs und Chatverlauf durchsuchen.

### 5. Party Dashboard

GM sieht grob Party-Zustand und Charakterziele, ohne in jeden Bogen abzutauchen.

Warum es am Tisch hilft:

- Bessere Spotlight-Verteilung.
- Mehr persoenliche Hooks.
- Weniger vergessene Ressourcen und Ziele.

## UX-Prinzipien

- Spieler zuerst: CharBerry darf nicht wie GM-Verwaltung aussehen.
- GM-Kontrolle bleibt: Spielerbeitraege sind Vorschlaege, bis sie akzeptiert werden.
- Kein Spoiler-Risiko: Sichtbarkeit ist ueberall ein erster Klasse Begriff.
- Lokale Daten sind ein Feature, nicht ein technisches Detail.
- Quick Capture ueberall: Im Zweifel lieber schnell erfassen als perfekt einordnen.
- Export immer mitdenken.
- Optional tiefer, nie zwangsweise komplexer.

## Erste konkrete Issues

### QuestBerry

1. `CharacterRef` Datenstruktur im Workspace ergaenzen.
2. "Party" Bereich im Session Desk bauen.
3. `@`-Mention Resolver auf CharacterRefs erweitern.
4. GM Inbox Datenstruktur und UI-Skeleton bauen.
5. Player Packet Export fuer Table-Notizen vorbereiten.

### CharBerry

1. Campaign-Link-Feld je Charakter ergaenzen.
2. Player Journal als Erweiterung von Session Notes bauen.
3. Visibility je Journal Entry: private, GM, table.
4. "Share with GM" Exportformat bauen.
5. Campaign Panel im Play Dashboard bauen.

### Gemeinsame Arbeit

1. `campaign-companion.json` Schema definieren.
2. RollBerry Linkformat finalisieren.
3. Gemeinsame TypeScript-Typen dupliziert oder als kleines Shared-Package pflegen.
4. Import/Export-Konfliktregeln definieren.
5. Testfixtures fuer QuestBerry + CharBerry gemeinsam anlegen.

## MVP-Schnitt

Der kleinste starke MVP:

- QuestBerry Session Desk zeigt Party aus CharBerry.
- CharBerry Charakter kann Player Journal Entries als GM/Table markieren.
- QuestBerry importiert diese Entries in eine GM Inbox.
- GM akzeptiert Entry als Session Log oder Note.
- Player Packet exportiert Recap + sichtbare Quests/Handouts.

Das ist klein genug, um baubar zu sein, aber stark genug, um sich wie ein neues Produkt anzufuehlen.

## Technische Empfehlung

Kurzfristig:

- Repos getrennt lassen.
- Schema-Dateien bewusst identisch halten.
- Export/Import als Bruecke.
- Deep Links vorbereiten.

Mittelfristig:

- Shared Package pruefen:
  - `@rollberry/companion-schema`
  - `@rollberry/ui-tokens`
  - `@rollberry/markdown-export`
- Gemeinsamer Workspace optional.

Langfristig:

- Companion-App nur bauen, wenn der kombinierte Workflow in Nutzertests klar gewinnt.
- Dann neue Shell statt harter Repo-Merge:
  - Module: Campaign, Characters, Sessions, Player Packets.
  - bestehende Apps koennen als Standalone-Varianten weiterleben.

## QA-Anforderungen

- QuestBerry importiert CharBerry CharacterRefs ohne Datenverlust.
- CharBerry exportiert Player Journal Entries mit korrekter Sichtbarkeit.
- Private Journal Entries erscheinen nie im Player Packet.
- GM-only QuestBerry Secrets erscheinen nie in CharBerry Player Mode.
- Akzeptierter Player Entry wird im Session Log gespeichert.
- Charakter-Umbenennung bricht Links nicht.
- Export/Import ist idempotent.
- Deutsch/Englisch bleiben konsistent.
- 390 px, 700 px, 900 px, 1280 px und 1440 px ohne UI-Überlappungen.

## Entscheidungsregel

Wir legen QuestBerry und CharBerry erst dann wirklich in eine App zusammen, wenn drei Dinge wahr sind:

1. Der gemeinsame Workflow ist in getrennten Apps validiert.
2. Nutzer verstehen den Mehrwert ohne lange Erklaerung.
3. Die gemeinsame Shell reduziert Reibung statt nur Code zu zentralisieren.

Bis dahin bauen wir so, dass sich die Apps fuer Spieler und GMs bereits wie ein gemeinsames Tool anfuehlen.
