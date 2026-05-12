import { useEffect, useMemo, useRef, useState } from 'react'
import type { NoteStatus, NoteVisibility, NoteWorkspace, VttNote } from '../preload/preload'
import { CATEGORIES, COPY, categoryEmoji, categoryHint, categoryLabel, statusLabel, templateContent, visibilityLabel, type Locale, type NoteCategory } from './i18n'
import logoUrl from '../../resources/logo.png'

type Theme = 'dark' | 'light'
type NoteField = { lineIndex: number; label: string; value: string }
type NoteFieldSection = { title: string; fields: NoteField[]; body: string[] }
type MobileMode = 'notes' | 'session' | 'editor' | 'details'

const GITHUB_URL = 'https://github.com/RollBerryStudios/NoteBerry'
const ROLLBERRY_URL = 'https://github.com/RollBerryStudios'
const CONTACT_EMAIL = 'kontakt@rollberry.de'
const CONTACT_URL = `mailto:${CONTACT_EMAIL}`

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function now(): string {
  return new Date().toISOString()
}

function newNote(category = 'Session', locale: Locale = 'en', blank = false): VttNote {
  return {
    id: newId(),
    title: blank ? COPY[locale].blankTitle : COPY[locale].newTitle(category),
    category,
    content: blank ? '' : templateContent(locale, category),
    tags: blank ? [] : [category.toLowerCase()],
    status: 'draft',
    visibility: 'gm',
    pinned: false,
    createdAt: now(),
    updatedAt: now(),
  }
}

function emptyWorkspace(): NoteWorkspace {
  const note = newNote('Session', 'de', true)
  return { version: 1, activeNoteId: note.id, notes: [note] }
}

function parseTags(value: string): string[] {
  return Array.from(new Set(value.split(',').map((tag) => tag.trim()).filter(Boolean))).slice(0, 24)
}

function wikiLinks(content: string): string[] {
  return Array.from(content.matchAll(/\[\[([^\]]+)\]\]/g)).map((match) => match[1].trim()).filter(Boolean)
}

function noteSections(content: string): Array<{ title: string; lines: string[] }> {
  const sections: Array<{ title: string; lines: string[] }> = []
  for (const line of content.split('\n')) {
    if (line.startsWith('## ')) {
      sections.push({ title: line.slice(3).trim(), lines: [] })
      continue
    }
    if (!sections.length && line.trim() && !line.startsWith('# ')) sections.push({ title: 'Notiz', lines: [] })
    if (sections.length && line.trim() && !line.startsWith('# ')) sections[sections.length - 1].lines.push(line.replace(/^- /, ''))
  }
  return sections.slice(0, 8)
}

function noteFieldSections(content: string): NoteFieldSection[] {
  const sections: NoteFieldSection[] = []
  const lines = content.split('\n')
  lines.forEach((line, lineIndex) => {
    if (line.startsWith('## ')) {
      sections.push({ title: line.slice(3).trim(), fields: [], body: [] })
      return
    }
    if (!sections.length && line.trim() && !line.startsWith('# ')) sections.push({ title: 'Notiz', fields: [], body: [] })
    if (!sections.length || !line.trim() || line.startsWith('# ')) return
    const normalized = line.replace(/^- /, '')
    const match = normalized.match(/^([^:]{2,42}):\s*(.*)$/)
    if (match) {
      sections[sections.length - 1].fields.push({ lineIndex, label: match[1].trim(), value: match[2] })
    } else {
      sections[sections.length - 1].body.push(normalized)
    }
  })
  return sections.filter((section) => section.fields.length || section.body.length).slice(0, 8)
}

function updateFieldLine(content: string, field: NoteField, value: string): string {
  const lines = content.split('\n')
  const current = lines[field.lineIndex] ?? ''
  const prefix = current.match(/^(\s*-?\s*[^:]+:\s*)/)?.[1] ?? `- ${field.label}: `
  lines[field.lineIndex] = `${prefix}${value}`
  return lines.join('\n')
}

function buildNoteIndex(notes: VttNote[]) {
  const tagSet = new Set<string>()
  const linksById = new Map<string, string[]>()
  const searchById = new Map<string, string>()
  for (const note of notes) {
    for (const tag of note.tags) tagSet.add(tag)
    linksById.set(note.id, wikiLinks(note.content))
    searchById.set(note.id, `${note.title} ${note.category} ${note.content} ${note.tags.join(' ')}`.toLowerCase())
  }
  return {
    allTags: Array.from(tagSet).sort(),
    linksById,
    searchById,
  }
}

function noteSnippet(note: VttNote): string {
  return note.content
    .split('\n')
    .map((line) => line.replace(/^#+\s*/, '').replace(/^- /, '').trim())
    .find(Boolean) ?? ''
}

export default function App() {
  const [workspace, setWorkspace] = useState<NoteWorkspace>(emptyWorkspace)
  const [ready, setReady] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('__all__')
  const [tagFilter, setTagFilter] = useState('__all__')
  const [visibilityFilter, setVisibilityFilter] = useState('__all__')
  const [mobileMode, setMobileMode] = useState<MobileMode>('session')
  const [quickText, setQuickText] = useState('')
  const [quickCategory, setQuickCategory] = useState<NoteCategory>('Session')
  const [quickVisibility, setQuickVisibility] = useState<NoteVisibility>('gm')
  const [toast, setToast] = useState<string | null>(null)
  const [locale, setLocaleState] = useState<Locale>(() => localStorage.getItem('noteberry-locale') === 'en' ? 'en' : 'de')
  const [theme, setThemeState] = useState<Theme>(() => localStorage.getItem('noteberry-theme') === 'light' ? 'light' : 'dark')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)
  const [draftCategory, setDraftCategory] = useState<NoteCategory>('Session')
  const [draftBlank, setDraftBlank] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const workspaceRef = useRef(workspace)

  const activeNote = workspace.notes.find((note) => note.id === workspace.activeNoteId) ?? workspace.notes[0]
  const c = COPY[locale]

  function setLocale(next: Locale): void {
    setLocaleState(next)
    localStorage.setItem('noteberry-locale', next)
  }

  function setTheme(next: Theme): void {
    setThemeState(next)
    localStorage.setItem('noteberry-theme', next)
  }

  useEffect(() => {
    void window.noteberry.loadWorkspace().then((loaded) => {
      setWorkspace(loaded)
      setReady(true)
    })
  }, [])

  useEffect(() => {
    workspaceRef.current = workspace
  }, [workspace])

  function flushWorkspaceSave(): void {
    if (!ready) return
    if (saveTimer.current) {
      clearTimeout(saveTimer.current)
      saveTimer.current = null
    }
    window.noteberry.saveWorkspaceSync(workspaceRef.current)
  }

  useEffect(() => {
    if (!ready) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null
      void window.noteberry.saveWorkspace(workspace)
    }, 250)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [workspace, ready])

  useEffect(() => {
    if (!ready) return
    const flush = () => flushWorkspaceSave()
    const flushWhenHidden = () => { if (document.visibilityState === 'hidden') flushWorkspaceSave() }
    window.addEventListener('beforeunload', flush)
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', flushWhenHidden)
    return () => {
      flushWorkspaceSave()
      window.removeEventListener('beforeunload', flush)
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', flushWhenHidden)
    }
  }, [ready])

  const noteIndex = useMemo(() => buildNoteIndex(workspace.notes), [workspace.notes])
  const allTags = noteIndex.allTags
  const activeSections = useMemo(() => noteSections(activeNote?.content ?? ''), [activeNote?.content])
  const activeFieldSections = useMemo(() => noteFieldSections(activeNote?.content ?? ''), [activeNote?.content])
  const draftContent = draftBlank ? '' : templateContent(locale, draftCategory)
  const draftSections = useMemo(() => noteSections(draftContent), [draftContent])
  const deskNotes = useMemo(() => {
    const visible = workspace.notes.filter((note) => note.status !== 'archived')
    const byUpdate = [...visible].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return {
      table: byUpdate.filter((note) => note.visibility === 'table').slice(0, 4),
      gm: byUpdate.filter((note) => note.visibility === 'gm' || note.pinned).slice(0, 4),
      secrets: byUpdate.filter((note) => note.visibility === 'secret').slice(0, 4),
      threads: byUpdate.filter((note) => note.status === 'active' || note.category === 'Quest').slice(0, 5),
      recent: byUpdate.slice(0, 5),
    }
  }, [workspace.notes])

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase()
    return workspace.notes
      .filter((note) => category === '__all__' || note.category === category)
      .filter((note) => tagFilter === '__all__' || note.tags.includes(tagFilter))
      .filter((note) => visibilityFilter === '__all__' || note.visibility === visibilityFilter)
      .filter((note) => !q || (noteIndex.searchById.get(note.id) ?? '').includes(q))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt))
  }, [category, noteIndex.searchById, search, tagFilter, visibilityFilter, workspace.notes])

  function notify(message: string): void {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }

  function updateActive(patch: Partial<VttNote>): void {
    if (!activeNote) return
    setWorkspace((current) => ({
      ...current,
      notes: current.notes.map((note) => note.id === activeNote.id ? { ...note, ...patch, updatedAt: now() } : note),
    }))
  }

  function updateActiveField(field: NoteField, value: string): void {
    if (!activeNote) return
    updateActive({ content: updateFieldLine(activeNote.content, field, value) })
  }

  function openNote(id: string): void {
    setWorkspace((current) => ({ ...current, activeNoteId: id }))
    setMobileMode('editor')
  }

  function createNote(nextCategory = 'Session', blank = false): void {
    const note = newNote(nextCategory, locale, blank)
    setWorkspace((current) => ({ ...current, activeNoteId: note.id, notes: [note, ...current.notes] }))
  }

  function createSelectedTemplate(): void {
    createNote(draftCategory, draftBlank)
    setTemplateOpen(false)
    setMobileMode('editor')
  }

  function captureQuickNote(): void {
    const value = quickText.trim()
    if (!value) {
      notify(c.captureEmpty)
      return
    }
    const [firstLine, ...rest] = value.split('\n')
    const title = firstLine.slice(0, 72).trim() || c.newTitle(quickCategory)
    const body = rest.join('\n').trim()
    const note: VttNote = {
      ...newNote(quickCategory, locale, true),
      title,
      content: body ? `# ${title}\n\n${body}` : `# ${title}\n\n- `,
      tags: [quickCategory.toLowerCase()],
      status: 'active',
      visibility: quickVisibility,
      pinned: quickCategory === 'Session',
    }
    setWorkspace((current) => ({ ...current, activeNoteId: note.id, notes: [note, ...current.notes] }))
    setQuickText('')
    setMobileMode('session')
  }

  async function deleteNote(): Promise<void> {
    if (!activeNote || workspace.notes.length <= 1) return
    const ok = await window.noteberry.confirm(c.deleteConfirm(activeNote.title), c.deleteDetail)
    if (!ok) return
    setWorkspace((current) => {
      const notes = current.notes.filter((note) => note.id !== activeNote.id)
      return { ...current, notes, activeNoteId: notes[0]?.id ?? null }
    })
  }

  async function importWorkspace(): Promise<void> {
    try {
      const imported = await window.noteberry.importWorkspace()
      if (!imported) {
        notify(c.importInvalid)
        return
      }
      setWorkspace(imported)
      notify(c.workspaceImported)
    } catch {
      notify(c.importFailed)
    }
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTemplateOpen(false)
        setSettingsOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!ready || !activeNote) return <div className="loading">Loading NoteBerry...</div>

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="titlebar">
        <div className="brand">
          <img src={logoUrl} alt="" />
          <div>
            <strong>NoteBerry</strong>
            <span>{c.tagline}</span>
          </div>
        </div>
        <div className="titlebar-actions">
          <button className="icon-button settings-trigger" aria-label={c.settings} title={c.settings} onClick={() => setSettingsOpen(true)}>⚙</button>
        </div>
      </header>

      <nav className="mobile-mode-nav" aria-label="NoteBerry sections">
        {[
          { id: 'notes', label: c.showNotes },
          { id: 'session', label: c.showSession },
          { id: 'editor', label: c.showEditor },
          { id: 'details', label: c.showDetails },
        ].map((item) => (
          <button key={item.id} className={mobileMode === item.id ? 'active' : ''} onClick={() => setMobileMode(item.id as MobileMode)}>
            {item.label}
          </button>
        ))}
      </nav>

      <main className="note-layout">
        <aside className={`notes-panel ${mobileMode === 'notes' ? 'mobile-active' : ''}`}>
          <div className="panel-head">
            <div>
              <h2>{c.notes}</h2>
              <p>{workspace.notes.length} {c.entries}</p>
            </div>
            <button className="primary" onClick={() => {
              setDraftCategory((category === '__all__' ? 'Session' : category) as NoteCategory)
              setDraftBlank(false)
              setTemplateOpen(true)
            }}>{c.new}</button>
          </div>
          <section className="quick-capture" aria-label={c.quickCapture}>
            <div className="section-line">
              <h3>{c.quickCapture}</h3>
              <button className="primary" onClick={captureQuickNote}>{c.capture}</button>
            </div>
            <textarea value={quickText} onChange={(event) => setQuickText(event.target.value)} placeholder={c.quickCapturePlaceholder} />
            <div className="quick-capture-controls">
              <select aria-label={c.category} value={quickCategory} onChange={(event) => setQuickCategory(event.target.value as NoteCategory)}>
                {CATEGORIES.map((item) => <option key={item} value={item}>{categoryLabel(locale, item)}</option>)}
              </select>
              <select aria-label={c.visibility} value={quickVisibility} onChange={(event) => setQuickVisibility(event.target.value as NoteVisibility)}>
                {(['gm', 'table', 'secret'] as const).map((item) => <option key={item} value={item}>{visibilityLabel(locale, item)}</option>)}
              </select>
            </div>
          </section>
          <div className="filters">
            <input aria-label={c.searchNotes} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={c.search} />
            <select aria-label={c.categoryFilter} value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="__all__">{c.allCategories}</option>
              {CATEGORIES.map((item) => <option key={item} value={item}>{categoryLabel(locale, item)}</option>)}
            </select>
            <select aria-label={c.tagFilter} value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
              <option value="__all__">{c.allTags}</option>
              {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            <select aria-label={c.visibilityFilter} value={visibilityFilter} onChange={(event) => setVisibilityFilter(event.target.value)}>
              <option value="__all__">{c.allVisibility}</option>
              {(['gm', 'table', 'secret'] as const).map((item) => <option key={item} value={item}>{visibilityLabel(locale, item)}</option>)}
            </select>
          </div>
          <div className="note-list">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                className={`note-card ${note.id === activeNote.id ? 'active' : ''}`}
                onClick={() => openNote(note.id)}
              >
                <span className="note-card-emoji" aria-hidden="true">{categoryEmoji(note.category)}</span>
                <strong>{note.pinned ? c.pinned : ''}{note.title}</strong>
                <em>{categoryLabel(locale, note.category)} / {visibilityLabel(locale, note.visibility)} / {statusLabel(locale, note.status)}</em>
              </button>
            ))}
          </div>
        </aside>

        <section className={`editor-panel ${mobileMode === 'session' || mobileMode === 'editor' || mobileMode === 'details' ? 'mobile-active' : ''}`}>
          <section className={`session-desk ${mobileMode === 'session' ? 'mobile-active' : ''}`}>
            <div className="desk-head">
              <div>
                <h2>{c.sessionDesk}</h2>
                <p>{c.sessionDeskHint}</p>
              </div>
              <span>{workspace.notes.filter((note) => note.status === 'active').length} {statusLabel(locale, 'active')}</span>
            </div>
            <div className="desk-grid">
              <DeskColumn title={c.tableReady} notes={deskNotes.table} locale={locale} empty={c.noDeskItems} onOpen={openNote} />
              <DeskColumn title={c.gmOnly} notes={deskNotes.gm} locale={locale} empty={c.noDeskItems} onOpen={openNote} />
              <DeskColumn title={c.secrets} notes={deskNotes.secrets} locale={locale} empty={c.noDeskItems} onOpen={openNote} />
              <DeskColumn title={c.openThreads} notes={deskNotes.threads} locale={locale} empty={c.noDeskItems} onOpen={openNote} />
            </div>
          </section>

          <div className={`editor-workspace ${mobileMode === 'editor' ? 'mobile-active' : ''}`}>
          <div className="editor-head">
            <div className="title-edit">
              <label>{c.title}<input value={activeNote.title} onChange={(event) => updateActive({ title: event.target.value })} /></label>
              <label>{c.category}
                <select value={activeNote.category} onChange={(event) => updateActive({ category: event.target.value })}>
                  {CATEGORIES.map((item) => <option key={item} value={item}>{categoryLabel(locale, item)}</option>)}
                </select>
              </label>
            </div>
            <button className="danger" disabled={workspace.notes.length <= 1} onClick={deleteNote}>{c.delete}</button>
          </div>

          <div className="meta-strip">
            <label>{c.status}
              <select value={activeNote.status} onChange={(event) => updateActive({ status: event.target.value as NoteStatus })}>
                <option value="draft">{statusLabel(locale, 'draft')}</option>
                <option value="active">{statusLabel(locale, 'active')}</option>
                <option value="resolved">{statusLabel(locale, 'resolved')}</option>
                <option value="archived">{statusLabel(locale, 'archived')}</option>
              </select>
            </label>
            <label>{c.visibility}
              <select value={activeNote.visibility} onChange={(event) => updateActive({ visibility: event.target.value as NoteVisibility })}>
                {(['gm', 'table', 'secret'] as const).map((item) => <option key={item} value={item}>{visibilityLabel(locale, item)}</option>)}
              </select>
            </label>
            <label>{c.tags}<input aria-label="Tags" value={activeNote.tags.join(', ')} onChange={(event) => updateActive({ tags: parseTags(event.target.value) })} /></label>
            <label className="check-line"><input type="checkbox" checked={activeNote.pinned} onChange={(event) => updateActive({ pinned: event.target.checked })} /> {c.pinnedLabel}</label>
          </div>

          <div className="workbench">
            <section className="editor-card">
              <h2>{c.rawEditor}</h2>
              <textarea aria-label={c.noteContent} value={activeNote.content} onChange={(event) => updateActive({ content: event.target.value })} />
            </section>
            <aside className={`structure-card ${mobileMode === 'details' ? 'mobile-active' : ''}`}>
              <h2>{c.fieldCards}</h2>
              {activeFieldSections.length ? (
                <div className="template-card-grid field-card-grid">
                  {activeFieldSections.map((section) => (
                    <article className="template-card field-card" key={section.title}>
                      <h3>{section.title}</h3>
                      <div className="field-grid">
                        {section.fields.map((field) => (
                          <label key={`${field.lineIndex}-${field.label}`}>
                            <span>{field.label}</span>
                            <input aria-label={field.label} value={field.value} onChange={(event) => updateActiveField(field, event.target.value)} />
                          </label>
                        ))}
                      </div>
                      {section.body.slice(0, 3).map((line) => <p key={line}>{line}</p>)}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-fields">{c.noTemplateFields}</div>
              )}
              <h2>{c.noteStructure}</h2>
              <div className="template-card-grid outline-card-grid">
                {(activeSections.length ? activeSections : []).map((section) => (
                  <article className="template-card outline-card" key={section.title}>
                    <h3>{section.title}</h3>
                    {section.lines.slice(0, 6).map((line) => <p key={line}>{line}</p>)}
                  </article>
                ))}
              </div>
              <div className="tag-cloud">
                {activeNote.tags.map((tag) => <button key={tag} onClick={() => setTagFilter(tag)}>{tag}</button>)}
              </div>
              <h3>{c.recentNotes}</h3>
              <div className="mini-list">{deskNotes.recent.map((note) => <button key={note.id} onClick={() => openNote(note.id)}>{note.title}</button>)}</div>
            </aside>
          </div>
          </div>
        </section>
      </main>
      {templateOpen && (
        <div className="modal-backdrop" onClick={() => setTemplateOpen(false)}>
          <section className="template-modal" role="dialog" aria-modal="true" aria-label={c.chooseTemplate} onClick={(event) => event.stopPropagation()}>
            <header>
              <div>
                <h2>{c.chooseTemplate}</h2>
                <p>{c.blankHint}</p>
              </div>
              <button aria-label={c.close} onClick={() => setTemplateOpen(false)}>×</button>
            </header>
            <div className="template-modal-body">
              <div className="template-row modal-template-row">
                <button className={draftBlank ? 'active' : ''} aria-label={c.blank} onClick={() => setDraftBlank(true)}>
                  <span><span className="category-emoji" aria-hidden="true">📝</span>{c.blank}</span>
                  <small>{c.blankHint}</small>
                </button>
                {CATEGORIES.map((item) => (
                  <button key={item} className={!draftBlank && draftCategory === item ? 'active' : ''} aria-label={categoryLabel(locale, item)} onClick={() => { setDraftCategory(item); setDraftBlank(false) }}>
                    <span><span className="category-emoji" aria-hidden="true">{categoryEmoji(item)}</span>{categoryLabel(locale, item)}</span>
                    <small>{categoryHint(locale, item)}</small>
                  </button>
                ))}
              </div>
              <section className="template-preview">
                <h3>{c.templatePreview}</h3>
                <div className="template-card-grid">
                  {(draftBlank ? [] : draftSections).map((section) => (
                    <article className="template-card" key={section.title}>
                      <h3>{section.title}</h3>
                      {section.lines.slice(0, 6).map((line) => <p key={line}>{line}</p>)}
                    </article>
                  ))}
                  {draftBlank && <article className="template-card empty-template"><h3>{c.blank}</h3><p>{c.blankHint}</p></article>}
                </div>
              </section>
            </div>
            <footer>
              <button onClick={() => setTemplateOpen(false)}>{c.close}</button>
              <button className="primary" onClick={createSelectedTemplate}>{c.useTemplate}</button>
            </footer>
          </section>
        </div>
      )}
      {settingsOpen && (
        <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <section className="settings-modal" role="dialog" aria-modal="true" aria-label={c.settings} onClick={(event) => event.stopPropagation()}>
            <header>
              <div>
                <h2>{c.settings}</h2>
                <p>{c.rollberryTitle}</p>
              </div>
              <button aria-label={c.close} onClick={() => setSettingsOpen(false)}>x</button>
            </header>
            <div className="settings-grid">
              <section>
                <h3>{c.appearance}</h3>
                <SegmentedChoice
                  label={c.language}
                  value={locale}
                  options={[
                    { value: 'de', label: 'Deutsch' },
                    { value: 'en', label: 'English' },
                  ]}
                  onChange={(value) => setLocale(value as Locale)}
                />
                <SegmentedChoice
                  label={c.theme}
                  value={theme}
                  options={[
                    { value: 'dark', label: c.darkMode },
                    { value: 'light', label: c.lightMode },
                  ]}
                  onChange={(value) => setTheme(value as Theme)}
                />
              </section>
              <section>
                <h3>{c.fileActions}</h3>
                <button onClick={() => window.noteberry.exportWorkspace(workspace)}>{c.export}</button>
                <button onClick={importWorkspace}>{c.import}</button>
              </section>
              <section>
                <h3>{c.community}</h3>
                <p>{c.rollberryInfo}</p>
                <button onClick={() => window.noteberry.openExternal(CONTACT_URL)}>{CONTACT_EMAIL}</button>
                <button onClick={() => window.noteberry.openExternal(GITHUB_URL)}>{c.githubRepo}</button>
                <button onClick={() => window.noteberry.openExternal(ROLLBERRY_URL)}>{c.rollberryGithub}</button>
              </section>
            </div>
          </section>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function SegmentedChoice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
}) {
  return (
    <label className="setting-choice">
      <span>{label}</span>
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <span className="segmented-control" role="group">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={option.value === value ? 'active' : ''}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </span>
    </label>
  )
}

function DeskColumn({
  title,
  notes,
  locale,
  empty,
  onOpen,
}: {
  title: string
  notes: VttNote[]
  locale: Locale
  empty: string
  onOpen: (id: string) => void
}) {
  return (
    <section className="desk-card">
      <h3>{title}</h3>
      <div className="desk-list">
        {notes.length ? notes.map((note) => (
          <button key={note.id} onClick={() => onOpen(note.id)}>
            <strong>{note.title}</strong>
            <span>{categoryLabel(locale, note.category)} / {statusLabel(locale, note.status)}</span>
            {noteSnippet(note) && <em>{noteSnippet(note)}</em>}
          </button>
        )) : <p>{empty}</p>}
      </div>
    </section>
  )
}
