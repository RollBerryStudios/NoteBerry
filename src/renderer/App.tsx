import { useEffect, useMemo, useRef, useState } from 'react'
import type { NoteStatus, NoteVisibility, NoteWorkspace, VttNote } from '../preload/preload'
import { CATEGORIES, COPY, categoryEmoji, categoryHint, categoryLabel, statusLabel, templateContent, type Locale, visibilityLabel } from './i18n'
import logoUrl from '../../resources/logo.png'

type Theme = 'dark' | 'light'

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

function newNote(category = 'Session', locale: Locale = 'en'): VttNote {
  return {
    id: newId(),
    title: COPY[locale].newTitle(category),
    category,
    content: templateContent(locale, category),
    tags: [category.toLowerCase()],
    status: 'draft',
    visibility: 'gm',
    pinned: false,
    createdAt: now(),
    updatedAt: now(),
  }
}

function emptyWorkspace(): NoteWorkspace {
  const note = newNote()
  return { version: 1, activeNoteId: note.id, notes: [note] }
}

function parseTags(value: string): string[] {
  return Array.from(new Set(value.split(',').map((tag) => tag.trim()).filter(Boolean))).slice(0, 24)
}

function wikiLinks(content: string): string[] {
  return Array.from(content.matchAll(/\[\[([^\]]+)\]\]/g)).map((match) => match[1].trim()).filter(Boolean)
}

function todoCount(content: string): number {
  return content.split('\n').filter((line) => /\bTODO\b|^- \[ \]/i.test(line.trim())).length
}

function formatInline(line: string): string {
  return line
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[\[([^\]]+)\]\]/g, '<mark>$1</mark>')
}

function renderMarkdown(content: string): string {
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
    .split('\n')
    .map((line) => {
      if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
      if (line.startsWith('- ')) return `<p class="bullet">${formatInline(line.slice(2))}</p>`
      if (!line.trim()) return '<br />'
      return `<p>${formatInline(line)}</p>`
    })
    .join('')
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

export default function App() {
  const [workspace, setWorkspace] = useState<NoteWorkspace>(emptyWorkspace)
  const [ready, setReady] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('__all__')
  const [tagFilter, setTagFilter] = useState('__all__')
  const [visibilityFilter, setVisibilityFilter] = useState<'__all__' | NoteVisibility>('__all__')
  const [toast, setToast] = useState<string | null>(null)
  const [locale, setLocaleState] = useState<Locale>(() => localStorage.getItem('noteberry-locale') === 'en' ? 'en' : 'de')
  const [theme, setThemeState] = useState<Theme>(() => localStorage.getItem('noteberry-theme') === 'light' ? 'light' : 'dark')
  const [settingsOpen, setSettingsOpen] = useState(false)
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
  const links = activeNote ? noteIndex.linksById.get(activeNote.id) ?? [] : []
  const backlinks = useMemo(() => {
    if (!activeNote) return []
    return workspace.notes.filter((note) => note.id !== activeNote.id && (noteIndex.linksById.get(note.id) ?? []).includes(activeNote.title))
  }, [activeNote, noteIndex.linksById, workspace.notes])
  const renderedPreview = useMemo(() => renderMarkdown(activeNote?.content ?? ''), [activeNote?.content])

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

  function createNote(nextCategory = 'Session'): void {
    const note = newNote(nextCategory, locale)
    setWorkspace((current) => ({ ...current, activeNoteId: note.id, notes: [note, ...current.notes] }))
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
          <button onClick={() => setSettingsOpen(true)}>{c.settings}</button>
          <button onClick={() => window.noteberry.exportWorkspace(workspace)}>{c.export}</button>
          <button onClick={importWorkspace}>{c.import}</button>
          <button onClick={() => window.noteberry.revealData()}>{c.dataFolder}</button>
        </div>
      </header>

      <main className="note-layout">
        <aside className="notes-panel">
          <div className="panel-head">
            <div>
              <h2>{c.notes}</h2>
              <p>{workspace.notes.length} {c.entries}</p>
            </div>
            <button className="primary" onClick={() => createNote(category === '__all__' ? 'Session' : category)}>{c.new}</button>
          </div>
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
            <select aria-label={c.visibilityFilter} value={visibilityFilter} onChange={(event) => setVisibilityFilter(event.target.value as '__all__' | NoteVisibility)}>
              <option value="__all__">{c.allVisibility}</option>
              <option value="gm">{visibilityLabel(locale, 'gm')}</option>
              <option value="table">{visibilityLabel(locale, 'table')}</option>
              <option value="secret">{visibilityLabel(locale, 'secret')}</option>
            </select>
          </div>
          <div className="template-block">
            <h3>{c.templates}</h3>
            <div className="template-row">
              {CATEGORIES.map((item) => (
                <button key={item} aria-label={categoryLabel(locale, item)} onClick={() => createNote(item)}>
                  <span><span className="category-emoji" aria-hidden="true">{categoryEmoji(item)}</span>{categoryLabel(locale, item)}</span>
                  <small>{categoryHint(locale, item)}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="note-list">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                className={`note-card ${note.id === activeNote.id ? 'active' : ''}`}
                onClick={() => setWorkspace((current) => ({ ...current, activeNoteId: note.id }))}
              >
                <span className="note-card-emoji" aria-hidden="true">{categoryEmoji(note.category)}</span>
                <span className={`visibility ${note.visibility}`}>{visibilityLabel(locale, note.visibility).toUpperCase()}</span>
                <strong>{note.pinned ? c.pinned : ''}{note.title}</strong>
                <em>{categoryLabel(locale, note.category)} / {statusLabel(locale, note.status)} / {note.tags.join(', ') || c.noTags}</em>
              </button>
            ))}
          </div>
        </aside>

        <section className="editor-panel">
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
                <option value="gm">{visibilityLabel(locale, 'gm')}</option>
                <option value="table">{visibilityLabel(locale, 'table')}</option>
                <option value="secret">{visibilityLabel(locale, 'secret')}</option>
              </select>
            </label>
            <label>{c.tags}<input aria-label="Tags" value={activeNote.tags.join(', ')} onChange={(event) => updateActive({ tags: parseTags(event.target.value) })} /></label>
            <label className="check-line"><input type="checkbox" checked={activeNote.pinned} onChange={(event) => updateActive({ pinned: event.target.checked })} /> {c.pinnedLabel}</label>
          </div>

          <div className="workbench">
            <section className="editor-card">
              <h2>{c.editor}</h2>
              <textarea aria-label={c.noteContent} value={activeNote.content} onChange={(event) => updateActive({ content: event.target.value })} />
            </section>
            <section className="preview-card">
              <h2>{c.preview}</h2>
              <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: renderedPreview }} />
            </section>
            <aside className="intel-card">
              <h2>{c.intel}</h2>
              <div className="intel-stat"><span>{c.todos}</span><strong>{todoCount(activeNote.content)}</strong></div>
              <div className="intel-stat"><span>{c.links}</span><strong>{links.length}</strong></div>
              <div className="tag-cloud">
                {activeNote.tags.map((tag) => <button key={tag} onClick={() => setTagFilter(tag)}>{tag}</button>)}
              </div>
              <h3>{c.wikiLinks}</h3>
              <div className="mini-list">{links.length ? links.map((link) => <span key={link}>{link}</span>) : <em>{c.noLinks}</em>}</div>
              <h3>{c.backlinks}</h3>
              <div className="mini-list">{backlinks.length ? backlinks.map((note) => <button key={note.id} onClick={() => setWorkspace((current) => ({ ...current, activeNoteId: note.id }))}>{note.title}</button>) : <em>{c.noBacklinks}</em>}</div>
            </aside>
          </div>
        </section>
      </main>
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
                <label>{c.language}
                  <select aria-label={c.language} value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
                    <option value="de">Deutsch</option>
                    <option value="en">English</option>
                  </select>
                </label>
                <label>{c.theme}
                  <select aria-label={c.theme} value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
                    <option value="dark">{c.darkMode}</option>
                    <option value="light">{c.lightMode}</option>
                  </select>
                </label>
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
