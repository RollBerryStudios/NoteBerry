import { app, BrowserWindow, dialog, ipcMain, shell, session, type IpcMainInvokeEvent, type MessageBoxOptions, type OpenDialogOptions } from 'electron'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

type NoteStatus = 'draft' | 'active' | 'resolved' | 'archived'
type NoteVisibility = 'gm' | 'table' | 'secret'

interface VttNote {
  id: string
  title: string
  category: string
  content: string
  tags: string[]
  status: NoteStatus
  visibility: NoteVisibility
  pinned: boolean
  createdAt: string
  updatedAt: string
}

interface NoteWorkspace {
  version: 1
  activeNoteId: string | null
  notes: VttNote[]
}

const isDev = process.env.NODE_ENV === 'development'
const RENDERER_URL = 'http://localhost:5176'
const APP_NAME = 'NoteBerry'
const DATA_FILE = 'noteberry-workspace.json'
const isDarwin = process.platform === 'darwin'

app.setName(APP_NAME)
if (process.env.NOTEBERRY_E2E_USER_DATA) {
  app.setPath('userData', resolve(process.env.NOTEBERRY_E2E_USER_DATA))
}

let mainWindow: BrowserWindow | null = null

function appRoot(): string {
  const cwd = process.cwd()
  if (existsSync(join(cwd, 'dist/renderer')) || existsSync(join(cwd, 'package.json'))) return cwd
  return app.getAppPath()
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function userDataPath(): string {
  return app.getPath('userData')
}

function workspacePath(): string {
  const dir = join(userDataPath(), 'data')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return join(dir, DATA_FILE)
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function status(value: unknown): NoteStatus {
  return value === 'active' || value === 'resolved' || value === 'archived' ? value : 'draft'
}

function visibility(value: unknown): NoteVisibility {
  return value === 'table' || value === 'secret' ? value : 'gm'
}

function tags(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return Array.from(new Set(value.filter((tag) => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean))).slice(0, 24)
}

function normalizeNote(value: unknown): VttNote | null {
  if (!value || typeof value !== 'object') return null
  const parsed = value as Partial<VttNote>
  const now = new Date().toISOString()
  return {
    id: text(parsed.id, makeId()),
    title: text(parsed.title, 'Untitled Note').trim() || 'Untitled Note',
    category: text(parsed.category, 'Session').trim() || 'Session',
    content: text(parsed.content),
    tags: tags(parsed.tags),
    status: status(parsed.status),
    visibility: visibility(parsed.visibility),
    pinned: Boolean(parsed.pinned),
    createdAt: text(parsed.createdAt, now),
    updatedAt: text(parsed.updatedAt, now),
  }
}

function defaultWorkspace(): NoteWorkspace {
  const now = new Date().toISOString()
  const notes: VttNote[] = [
    {
      id: makeId(),
      title: 'Leere Notiz',
      category: 'Session',
      content: '',
      tags: [],
      status: 'draft',
      visibility: 'gm',
      pinned: false,
      createdAt: now,
      updatedAt: now,
    },
  ]
  return { version: 1, activeNoteId: notes[0].id, notes }
}

function normalizeWorkspace(value: unknown): NoteWorkspace {
  if (!value || typeof value !== 'object') return defaultWorkspace()
  const parsed = value as Partial<NoteWorkspace>
  if (parsed.version !== 1) return defaultWorkspace()
  const notes = Array.isArray(parsed.notes) ? parsed.notes.map(normalizeNote).filter(Boolean) as VttNote[] : []
  if (notes.length === 0) return defaultWorkspace()
  const activeNoteId = typeof parsed.activeNoteId === 'string' && notes.some((note) => note.id === parsed.activeNoteId)
    ? parsed.activeNoteId
    : notes[0].id
  return { version: 1, activeNoteId, notes }
}

function loadWorkspace(): NoteWorkspace {
  const path = workspacePath()
  if (!existsSync(path)) return defaultWorkspace()
  try {
    const normalized = normalizeWorkspace(JSON.parse(readFileSync(path, 'utf8')))
    writeFileSync(path, JSON.stringify(normalized, null, 2), 'utf8')
    return normalized
  } catch {
    return defaultWorkspace()
  }
}

function saveWorkspace(workspace: NoteWorkspace): boolean {
  writeFileSync(workspacePath(), JSON.stringify(normalizeWorkspace(workspace), null, 2), 'utf8')
  return true
}

function safeExternalUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    if (url.protocol === 'mailto:' && url.pathname === 'kontakt@rollberry.de') return url.toString()
    if (url.protocol === 'https:' && url.hostname === 'rollberry.de') return url.toString()
    return null
  } catch {
    return null
  }
}

function ownerWindow(event: IpcMainInvokeEvent): BrowserWindow | null {
  return BrowserWindow.fromWebContents(event.sender) ?? mainWindow
}

function registerIpc(): void {
  ipcMain.handle('noteberry:workspace-load', () => loadWorkspace())
  ipcMain.handle('noteberry:workspace-save', (_event, workspace: NoteWorkspace) => saveWorkspace(workspace))
  ipcMain.on('noteberry:workspace-save-sync', (event, workspace: NoteWorkspace) => {
    try {
      event.returnValue = saveWorkspace(workspace)
    } catch {
      event.returnValue = false
    }
  })
  ipcMain.handle('noteberry:workspace-export', async (event, workspace: NoteWorkspace) => {
    const options = {
      title: 'Export NoteBerry workspace',
      defaultPath: 'noteberry-workspace.json',
      filters: [{ name: 'NoteBerry Workspace', extensions: ['json'] }],
    }
    const owner = ownerWindow(event)
    const result = owner ? await dialog.showSaveDialog(owner, options) : await dialog.showSaveDialog(options)
    if (result.canceled || !result.filePath) return { canceled: true, success: false }
    writeFileSync(result.filePath, JSON.stringify(normalizeWorkspace(workspace), null, 2), 'utf8')
    return { success: true, filePath: result.filePath }
  })
  ipcMain.handle('noteberry:workspace-import', async (event) => {
    const options = {
      title: 'Import NoteBerry workspace',
      properties: ['openFile'],
      filters: [{ name: 'NoteBerry Workspaces', extensions: ['json'] }],
    } as OpenDialogOptions
    const owner = ownerWindow(event)
    const result = owner ? await dialog.showOpenDialog(owner, options) : await dialog.showOpenDialog(options)
    if (result.canceled || !result.filePaths[0]) return null
    try {
      return normalizeWorkspace(JSON.parse(readFileSync(result.filePaths[0], 'utf8')))
    } catch {
      return null
    }
  })
  ipcMain.handle('noteberry:reveal-data', async () => shell.openPath(userDataPath()))
  ipcMain.handle('noteberry:open-external', async (_event, url: string) => {
    const safeUrl = safeExternalUrl(url)
    if (!safeUrl) return false
    await shell.openExternal(safeUrl)
    return true
  })
  ipcMain.handle('noteberry:confirm', async (event, message: string, detail?: string) => {
    const options = {
      type: 'question',
      buttons: ['Cancel', 'Delete'],
      cancelId: 0,
      defaultId: 1,
      title: APP_NAME,
      message,
      detail,
    } as MessageBoxOptions
    const owner = ownerWindow(event)
    const result = owner ? await dialog.showMessageBox(owner, options) : await dialog.showMessageBox(options)
    return result.response === 1
  })
}

function contentSecurityPolicy(): string {
  const dev = "default-src 'self' http://localhost:5176 ws://localhost:5176; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5176; style-src 'self' 'unsafe-inline' http://localhost:5176; img-src 'self' data: http://localhost:5176; font-src 'self' data:; connect-src 'self' ws://localhost:5176 http://localhost:5176; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'"
  const prod = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'"
  return isDev ? dev : prod
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 980,
    minHeight: 720,
    title: APP_NAME,
    backgroundColor: '#151713',
    frame: false,
    titleBarStyle: isDarwin ? 'hiddenInset' : 'hidden',
    ...(isDarwin ? { trafficLightPosition: { x: 16, y: 10 } } : { titleBarOverlay: { color: '#14161b', symbolColor: '#3f9f6b', height: 36 } }),
    webPreferences: {
      preload: join(appRoot(), 'dist/preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      nodeIntegrationInWorker: false,
      webviewTag: false,
    },
  })
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  mainWindow.webContents.on('will-attach-webview', (event) => event.preventDefault())
  if (isDev) void mainWindow.loadURL(RENDERER_URL)
  else void mainWindow.loadFile(join(appRoot(), 'dist/renderer/index.html'))
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({ responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': [contentSecurityPolicy()] } })
  })
  session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false))
  registerIpc()
  createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
