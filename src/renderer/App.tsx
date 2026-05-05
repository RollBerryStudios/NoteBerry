import { useEffect, useMemo, useRef, useState } from 'react'
import type { NoteStatus, NoteVisibility, NoteWorkspace, VttNote } from '../preload/preload'
import logoUrl from '../../resources/logo.png'

const CATEGORIES = ['Session', 'NPC', 'Location', 'Quest', 'Item', 'Lore', 'Rules', 'Handout']
const TEMPLATE_CONTENT: Record<string, string> = {
  NPC: '## Role\n\n## Wants\n\n## Knows\n\n## Voice\n',
  Location: '## First Impression\n\n## Points of Interest\n\n## Secrets\n',
  Quest: '## Hook\n\n## Objective\n\n## Complications\n\n## Reward\n',
  Session: '# Session Notes\n\n- Recap:\n- Scenes:\n- TODO:\n',
  Item: '## Description\n\n## Mechanics\n\n## History\n',
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function now(): string {
  return new Date().toISOString()
}

function newNote(category = 'Session'): VttNote {
  return {
    id: newId(),
    title: `New ${category}`,
    category,
    content: TEMPLATE_CONTENT[category] ?? '',
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
  const [toast, setToast] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const workspaceRef = useRef(workspace)

  const activeNote = workspace.notes.find((note) => note.id === workspace.activeNoteId) ?? workspace.notes[0]

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
      .filter((note) => !q || (noteIndex.searchById.get(note.id) ?? '').includes(q))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt))
  }, [category, noteIndex.searchById, search, tagFilter, workspace.notes])

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
    const note = newNote(nextCategory)
    setWorkspace((current) => ({ ...current, activeNoteId: note.id, notes: [note, ...current.notes] }))
  }

  async function deleteNote(): Promise<void> {
    if (!activeNote || workspace.notes.length <= 1) return
    const ok = await window.noteberry.confirm(`Delete "${activeNote.title}"?`, 'This removes the note from the local NoteBerry workspace.')
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
        notify('Import canceled or invalid')
        return
      }
      setWorkspace(imported)
      notify('Workspace imported')
    } catch {
      notify('Import failed')
    }
  }

  if (!ready || !activeNote) return <div className="loading">Loading NoteBerry...</div>

  return (
    <div className="app-shell">
      <header className="titlebar">
        <div className="brand">
          <img src={logoUrl} alt="" />
          <div>
            <strong>NoteBerry</strong>
            <span>Rich local notes for virtual tabletop preparation</span>
          </div>
        </div>
        <div className="titlebar-actions">
          <button onClick={() => window.noteberry.exportWorkspace(workspace)}>Export</button>
          <button onClick={importWorkspace}>Import</button>
          <button onClick={() => window.noteberry.revealData()}>Data Folder</button>
        </div>
      </header>

      <main className="note-layout">
        <aside className="notes-panel">
          <div className="panel-head">
            <div>
              <h2>Notes</h2>
              <p>{workspace.notes.length} entries</p>
            </div>
            <button className="primary" onClick={() => createNote(category === '__all__' ? 'Session' : category)}>New</button>
          </div>
          <div className="filters">
            <input aria-label="Search notes" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes, tags, secrets" />
            <select aria-label="Category filter" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="__all__">All categories</option>
              {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Tag filter" value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
              <option value="__all__">All tags</option>
              {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
          <div className="template-row">
            {['NPC', 'Location', 'Quest', 'Session'].map((item) => <button key={item} onClick={() => createNote(item)}>{item}</button>)}
          </div>
          <div className="note-list">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                className={`note-card ${note.id === activeNote.id ? 'active' : ''}`}
                onClick={() => setWorkspace((current) => ({ ...current, activeNoteId: note.id }))}
              >
                <span className={`visibility ${note.visibility}`}>{note.visibility.toUpperCase()}</span>
                <strong>{note.pinned ? 'Pinned: ' : ''}{note.title}</strong>
                <em>{note.category} / {note.status} / {note.tags.join(', ') || 'no tags'}</em>
              </button>
            ))}
          </div>
        </aside>

        <section className="editor-panel">
          <div className="editor-head">
            <div className="title-edit">
              <label>Title<input value={activeNote.title} onChange={(event) => updateActive({ title: event.target.value })} /></label>
              <label>Category
                <select value={activeNote.category} onChange={(event) => updateActive({ category: event.target.value })}>
                  {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <button className="danger" disabled={workspace.notes.length <= 1} onClick={deleteNote}>Delete</button>
          </div>

          <div className="meta-strip">
            <label>Status
              <select value={activeNote.status} onChange={(event) => updateActive({ status: event.target.value as NoteStatus })}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label>Visibility
              <select value={activeNote.visibility} onChange={(event) => updateActive({ visibility: event.target.value as NoteVisibility })}>
                <option value="gm">GM</option>
                <option value="table">Table</option>
                <option value="secret">Secret</option>
              </select>
            </label>
            <label>Tags<input aria-label="Tags" value={activeNote.tags.join(', ')} onChange={(event) => updateActive({ tags: parseTags(event.target.value) })} /></label>
            <label className="check-line"><input type="checkbox" checked={activeNote.pinned} onChange={(event) => updateActive({ pinned: event.target.checked })} /> Pinned</label>
          </div>

          <div className="workbench">
            <section className="editor-card">
              <h2>Editor</h2>
              <textarea aria-label="Note content" value={activeNote.content} onChange={(event) => updateActive({ content: event.target.value })} />
            </section>
            <section className="preview-card">
              <h2>Preview</h2>
              <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: renderedPreview }} />
            </section>
            <aside className="intel-card">
              <h2>Table Intel</h2>
              <div className="intel-stat"><span>Todos</span><strong>{todoCount(activeNote.content)}</strong></div>
              <div className="intel-stat"><span>Links</span><strong>{links.length}</strong></div>
              <div className="tag-cloud">
                {activeNote.tags.map((tag) => <button key={tag} onClick={() => setTagFilter(tag)}>{tag}</button>)}
              </div>
              <h3>Wiki Links</h3>
              <div className="mini-list">{links.length ? links.map((link) => <span key={link}>{link}</span>) : <em>No links</em>}</div>
              <h3>Backlinks</h3>
              <div className="mini-list">{backlinks.length ? backlinks.map((note) => <button key={note.id} onClick={() => setWorkspace((current) => ({ ...current, activeNoteId: note.id }))}>{note.title}</button>) : <em>No backlinks</em>}</div>
            </aside>
          </div>
        </section>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
