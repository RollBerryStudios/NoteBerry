import type { NoteStatus, NoteVisibility } from '../preload/preload'

export type Locale = 'en' | 'de'
export type NoteCategory = 'Session' | 'NPC' | 'Location' | 'Quest' | 'Item' | 'Lore' | 'Rules' | 'Handout'

export const CATEGORIES: NoteCategory[] = ['Session', 'NPC', 'Location', 'Quest', 'Item', 'Lore', 'Rules', 'Handout']

const CATEGORY_EMOJIS: Record<NoteCategory, string> = {
  Session: '🗓️',
  NPC: '🧑',
  Location: '🗺️',
  Quest: '⚔️',
  Item: '🎒',
  Lore: '📜',
  Rules: '🎲',
  Handout: '📣',
}

export type NoteCopy = {
  language: string
  settings: string
  helpTitle: string
  appearance: string
  theme: string
  darkMode: string
  lightMode: string
  community: string
  rollberryTitle: string
  rollberryInfo: string
  rollberryWebsite: string
  close: string
  tagline: string
  export: string
  import: string
  fileActions: string
  createNote: string
  chooseTemplate: string
  useTemplate: string
  notes: string
  entries: string
  new: string
  search: string
  allCategories: string
  allTags: string
  allVisibility: string
  blank: string
  blankHint: string
  blankTitle: string
  pinned: string
  noTags: string
  title: string
  category: string
  delete: string
  status: string
  visibility: string
  tags: string
  pinnedLabel: string
  editor: string
  preview: string
  links: string
  wikiLinks: string
  backlinks: string
  noLinks: string
  noBacklinks: string
  searchNotes: string
  categoryFilter: string
  tagFilter: string
  visibilityFilter: string
  noteContent: string
  sessionDesk: string
  sessionDeskHint: string
  quickCapture: string
  quickCapturePlaceholder: string
  capture: string
  tableReady: string
  gmOnly: string
  secrets: string
  openThreads: string
  recentNotes: string
  activeNote: string
  details: string
  showNotes: string
  showSession: string
  showEditor: string
  noDeskItems: string
  captureEmpty: string
  importInvalid: string
  workspaceImported: string
  importFailed: string
  deleteConfirm: (title: string) => string
  deleteDetail: string
  newTitle: (category: string) => string
}

export const COPY: Record<Locale, NoteCopy> = {
  en: {
    language: 'Language',
    settings: 'Settings',
    helpTitle: 'Help and shortcuts',
    appearance: 'Appearance',
    theme: 'Theme',
    darkMode: 'Dark',
    lightMode: 'Light',
    community: 'Community',
    rollberryTitle: 'RollBerry Studios',
    rollberryInfo: 'Local-first tabletop tools for game masters and players.',
    rollberryWebsite: 'rollberry.de',
    close: 'Close',
    tagline: 'Fast D&D notes for prep and play',
    export: 'Export',
    import: 'Import',
    fileActions: 'File',
    createNote: 'Create note',
    chooseTemplate: 'Choose a note template',
    useTemplate: 'Create',
    notes: 'Notes',
    entries: 'entries',
    new: 'New',
    search: 'Search notes, tags, secrets',
    allCategories: 'All categories',
    allTags: 'All tags',
    allVisibility: 'All visibility',
    blank: 'Blank note',
    blankHint: 'Empty page',
    blankTitle: 'Blank note',
    pinned: 'Pinned: ',
    noTags: 'no tags',
    title: 'Title',
    category: 'Category',
    delete: 'Delete',
    status: 'Status',
    visibility: 'Visibility',
    tags: 'Tags',
    pinnedLabel: 'Pinned',
    editor: 'Edit',
    preview: 'View',
    links: 'Links',
    wikiLinks: 'Wiki Links',
    backlinks: 'Backlinks',
    noLinks: 'No links',
    noBacklinks: 'No backlinks',
    searchNotes: 'Search notes',
    categoryFilter: 'Category filter',
    tagFilter: 'Tag filter',
    visibilityFilter: 'Visibility filter',
    noteContent: 'Note content',
    sessionDesk: 'Session Desk',
    sessionDeskHint: 'Run tonight from the notes that matter now.',
    quickCapture: 'Quick Capture',
    quickCapturePlaceholder: 'NPC, clue, ruling, location, open question...',
    capture: 'Capture',
    tableReady: 'Table ready',
    gmOnly: 'GM only',
    secrets: 'Secrets',
    openThreads: 'Open threads',
    recentNotes: 'Recent',
    activeNote: 'Active note',
    details: 'Details',
    showNotes: 'Notes',
    showSession: 'Session',
    showEditor: 'Editor',
    noDeskItems: 'Nothing here yet',
    captureEmpty: 'Write something to capture first',
    importInvalid: 'Import canceled or invalid',
    workspaceImported: 'Workspace imported',
    importFailed: 'Import failed',
    deleteConfirm: (title) => `Delete "${title}"?`,
    deleteDetail: 'This removes the note from the local QuestBerry workspace.',
    newTitle: (category) => `New ${category}`,
  },
  de: {
    language: 'Sprache',
    settings: 'Einstellungen',
    helpTitle: 'Hilfe und Tastaturkürzel',
    appearance: 'Darstellung',
    theme: 'Design',
    darkMode: 'Dunkel',
    lightMode: 'Hell',
    community: 'Community',
    rollberryTitle: 'RollBerry Studios',
    rollberryInfo: 'Lokale Tabletop-Tools für Spielleitungen und Spieler.',
    rollberryWebsite: 'rollberry.de',
    close: 'Schließen',
    tagline: 'Schnelle D&D-Notizen für Vorbereitung und Spiel',
    export: 'Exportieren',
    import: 'Importieren',
    fileActions: 'Datei',
    createNote: 'Notiz erstellen',
    chooseTemplate: 'Notizvorlage wählen',
    useTemplate: 'Erstellen',
    notes: 'Notizen',
    entries: 'Einträge',
    new: 'Neu',
    search: 'Notizen, Tags, Geheimnisse suchen',
    allCategories: 'Alle Kategorien',
    allTags: 'Alle Tags',
    allVisibility: 'Alle Sichtbarkeiten',
    blank: 'Leere Notiz',
    blankHint: 'Ohne Vorlage',
    blankTitle: 'Leere Notiz',
    pinned: 'Angepinnt: ',
    noTags: 'keine Tags',
    title: 'Titel',
    category: 'Kategorie',
    delete: 'Löschen',
    status: 'Status',
    visibility: 'Sichtbarkeit',
    tags: 'Tags',
    pinnedLabel: 'Angepinnt',
    editor: 'Bearbeiten',
    preview: 'Ansicht',
    links: 'Links',
    wikiLinks: 'Wiki-Links',
    backlinks: 'Backlinks',
    noLinks: 'Keine Links',
    noBacklinks: 'Keine Backlinks',
    searchNotes: 'Notizen suchen',
    categoryFilter: 'Kategorie-Filter',
    tagFilter: 'Tag-Filter',
    visibilityFilter: 'Sichtbarkeits-Filter',
    noteContent: 'Notizinhalt',
    sessionDesk: 'Sitzungsübersicht',
    sessionDeskHint: 'Alles Wichtige für die laufende Runde.',
    quickCapture: 'Schnellerfassung',
    quickCapturePlaceholder: 'NSC, Hinweis, Regelung, Ort, offene Frage...',
    capture: 'Erfassen',
    tableReady: 'Tischbereit',
    gmOnly: 'Nur SL',
    secrets: 'Geheimnisse',
    openThreads: 'Offene Fäden',
    recentNotes: 'Zuletzt',
    activeNote: 'Aktive Notiz',
    details: 'Details',
    showNotes: 'Notizen',
    showSession: 'Runde',
    showEditor: 'Editor',
    noDeskItems: 'Noch nichts vorhanden',
    captureEmpty: 'Erst etwas für die Erfassung schreiben',
    importInvalid: 'Import abgebrochen oder ungültig',
    workspaceImported: 'Arbeitsbereich importiert',
    importFailed: 'Import fehlgeschlagen',
    deleteConfirm: (title) => `"${title}" löschen?`,
    deleteDetail: 'Diese Notiz wird aus dem lokalen QuestBerry-Arbeitsbereich entfernt.',
    newTitle: (category) => `Neue Notiz: ${categoryLabel('de', category)}`,
  },
}

const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    Session: 'Session',
    NPC: 'NPC',
    Location: 'Location',
    Quest: 'Quest',
    Item: 'Item',
    Lore: 'Lore',
    Rules: 'Rules',
    Handout: 'Handout',
  },
  de: {
    Session: 'Sitzung',
    NPC: 'NSC',
    Location: 'Ort',
    Quest: 'Auftrag',
    Item: 'Gegenstand',
    Lore: 'Weltwissen',
    Rules: 'Regeln',
    Handout: 'Handout',
  },
}

const CATEGORY_HINTS: Record<Locale, Record<NoteCategory, string>> = {
  en: {
    Session: 'Prep flow',
    NPC: 'People',
    Location: 'Places',
    Quest: 'Hooks',
    Item: 'Treasure',
    Lore: 'Secrets',
    Rules: 'Rulings',
    Handout: 'Player text',
  },
  de: {
    Session: 'Ablauf',
    NPC: 'Figuren',
    Location: 'Orte',
    Quest: 'Aufträge',
    Item: 'Schätze',
    Lore: 'Geheimnisse',
    Rules: 'Regeln',
    Handout: 'Spielertext',
  },
}

const STATUS_LABELS: Record<Locale, Record<NoteStatus, string>> = {
  en: { draft: 'Draft', active: 'Active', resolved: 'Resolved', archived: 'Archived' },
  de: { draft: 'Entwurf', active: 'Aktiv', resolved: 'Erledigt', archived: 'Archiviert' },
}

const VISIBILITY_LABELS: Record<Locale, Record<NoteVisibility, string>> = {
  en: { gm: 'GM', table: 'Table', secret: 'Secret' },
  de: { gm: 'SL', table: 'Tisch', secret: 'Geheim' },
}

const TEMPLATE_CONTENT: Record<Locale, Partial<Record<NoteCategory, string>>> = {
  en: {
    Session: `# Session Notes

## Prep Snapshot
- Date:
- Party level:
- Recap:
- Character spotlight:
- Strong start:

## Run List
- Scenes:
- Secrets and clues:
- Fantastic locations:
- Important NPCs:
- Monsters / encounters:
- Rewards:

## During Play
- Decisions:
- Clues revealed:
- Improvised names:
- New questions:

## After Play
- XP or milestone:
- Faction changes:
- Loose threads:
`,
    NPC: `# NPC

## At a Glance
- Role:
- Pronouns:
- Species / class:
- Appearance:
- Avatar image:
- Voice or mannerism:
- First line:

## Motivation
- Wants:
- Fears:
- Secret:
- Leverage:

## At the Table
- Knows:
- Quest hook:
- Stat block:
- Relationship to party:
- TODO:
`,
    Location: `# Location

## First Impression
- Sight:
- Sound:
- Smell:
- Mood:
- Map or image:

## Fantastic Aspects
- Aspect 1:
- Aspect 2:
- Aspect 3:

## At the Table
- Points of interest:
- NPCs:
- Encounters:
- Secrets and clues:
- Hazards:
- Treasure:
- Exits:
`,
    Quest: `# Quest

## Hook
- Patron / source:
- Why now:
- What the party sees first:

## Objective
- Goal:
- Stakes:
- Deadline:
- Failure consequence:

## Clue Path
- Clue 1:
- Clue 2:
- Clue 3:
- Complication or twist:

## Reward
- Gold / item:
- Favor:
- New lead:
`,
    Item: `# Item

## Appearance
- Description:
- Avatar image:
- Owner:
- Tell:

## Mechanics
- Rarity:
- Attunement:
- Effect:
- Charges / limits:
- Curse or cost:

## Story
- Origin:
- Who wants it:
- Clue it reveals:
`,
    Lore: `# Lore

## Truth
- What is true:
- What people believe:
- What is hidden:
- Why it matters:

## Reveal Plan
- Clue:
- Source:
- Related notes:
- Consequence if ignored:
`,
    Rules: `# Rule / Ruling

## Situation
- Trigger:
- Source:
- Table ruling:

## Use at the Table
- Quick version:
- Edge cases:
- Example:
- Revisit after:
`,
    Handout: `# Handout

## Player-Facing Text


## GM Notes
- Delivery:
- Hidden meaning:
- Image or prop:
- Related quest:
- What changes after reading:
`,
  },
  de: {
    Session: `# Sitzungsnotizen

## Prep-Snapshot
- Datum:
- Gruppenstufe:
- Rückblick:
- Charakterfokus:
- Starker Einstieg:

## Laufzettel
- Szenen:
- Geheimnisse und Hinweise:
- Fantastische Orte:
- Wichtige NSCs:
- Monster / Begegnungen:
- Belohnungen:

## Während des Spiels
- Entscheidungen:
- Enthüllte Hinweise:
- Improvisierte Namen:
- Neue Fragen:

## Nach dem Spiel
- EP oder Meilenstein:
- Fraktionsänderungen:
- Offene Fäden:
`,
    NPC: `# NSC

## Auf einen Blick
- Rolle:
- Pronomen:
- Spezies / Klasse:
- Erscheinung:
- Avatar-Bild:
- Stimme oder Eigenart:
- Erster Satz:

## Motivation
- Will:
- Fürchtet:
- Geheimnis:
- Druckmittel:

## Am Tisch
- Weiß:
- Quest-Aufhänger:
- Statblock:
- Beziehung zur Gruppe:
- TODO:
`,
    Location: `# Ort

## Erster Eindruck
- Anblick:
- Geräusch:
- Geruch:
- Stimmung:
- Karte oder Bild:

## Fantastische Aspekte
- Aspekt 1:
- Aspekt 2:
- Aspekt 3:

## Am Tisch
- Interessante Punkte:
- NSCs:
- Begegnungen:
- Geheimnisse und Hinweise:
- Gefahren:
- Schätze:
- Ausgänge:
`,
    Quest: `# Quest

## Aufhänger
- Auftraggeber / Quelle:
- Warum jetzt:
- Was die Gruppe zuerst sieht:

## Ziel
- Aufgabe:
- Einsatz:
- Frist:
- Folge bei Scheitern:

## Hinweis-Pfad
- Hinweis 1:
- Hinweis 2:
- Hinweis 3:
- Komplikation oder Wendung:

## Belohnung
- Gold / Gegenstand:
- Gefallen:
- Neue Spur:
`,
    Item: `# Gegenstand

## Erscheinung
- Beschreibung:
- Avatar-Bild:
- Besitzer:
- Wiedererkennungsmerkmal:

## Mechanik
- Seltenheit:
- Einstimmung:
- Effekt:
- Ladungen / Grenzen:
- Fluch oder Preis:

## Geschichte
- Ursprung:
- Wer ihn will:
- Welchen Hinweis er liefert:
`,
    Lore: `# Lore

## Wahrheit
- Was stimmt:
- Was die Leute glauben:
- Was verborgen ist:
- Warum es wichtig ist:

## Enthüllung
- Hinweis:
- Quelle:
- Verknüpfte Notizen:
- Folge, wenn ignoriert:
`,
    Rules: `# Regel / Entscheidung

## Situation
- Auslöser:
- Quelle:
- Tischentscheidung:

## Am Tisch nutzen
- Kurzfassung:
- Sonderfälle:
- Beispiel:
- Nachbesprechen nach:
`,
    Handout: `# Handout

## Text für die Spieler


## SL-Notizen
- Übergabe:
- Versteckte Bedeutung:
- Bild oder Requisite:
- Verknüpfte Quest:
- Was sich danach ändert:
`,
  },
}

export function categoryLabel(locale: Locale, category: string): string {
  return CATEGORY_LABELS[locale][category] ?? category
}

export function categoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category as NoteCategory] ?? '📝'
}

export function categoryHint(locale: Locale, category: string): string {
  const noteCategory = CATEGORIES.includes(category as NoteCategory) ? category as NoteCategory : 'Session'
  return CATEGORY_HINTS[locale][noteCategory]
}

export function statusLabel(locale: Locale, status: NoteStatus): string {
  return STATUS_LABELS[locale][status]
}

export function visibilityLabel(locale: Locale, visibility: NoteVisibility): string {
  return VISIBILITY_LABELS[locale][visibility]
}

export function templateContent(locale: Locale, category: string): string {
  const noteCategory = CATEGORIES.includes(category as NoteCategory) ? category as NoteCategory : 'Session'
  return TEMPLATE_CONTENT[locale][noteCategory] ?? TEMPLATE_CONTENT.en[noteCategory] ?? ''
}
