import { _electron as electron, type ElectronApplication, type Page, type TestInfo } from '@playwright/test'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

export type NoteStatus = 'draft' | 'active' | 'resolved' | 'archived'
export type NoteVisibility = 'gm' | 'table' | 'secret'

export interface VttNote {
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

export interface NoteWorkspace {
  version: 1
  activeNoteId: string | null
  notes: VttNote[]
}

export interface LaunchedNoteBerry {
  app: ElectronApplication
  page: Page
  userDataDir: string
  workspacePath: string
}

const APP_ENTRY = resolve(process.cwd(), 'dist/main/main.js')

function ensureDir(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true })
}

export function sampleWorkspace(): NoteWorkspace {
  const notes: VttNote[] = [
    {
      id: 'note-session',
      title: 'Session 7: Clocktower',
      category: 'Session',
      content: '# Session 7\n\n- Meet [[Archivist Nara]] in the tower.\n- TODO: Reveal the cracked bell clue.\n\nSecret: The bell is a prison key.',
      tags: ['session', 'clocktower'],
      status: 'active',
      visibility: 'gm',
      pinned: true,
      createdAt: '2026-05-05T10:00:00.000Z',
      updatedAt: '2026-05-05T10:00:00.000Z',
    },
    {
      id: 'note-nara',
      title: 'Archivist Nara',
      category: 'NPC',
      content: 'Keeps index cards in color order. References [[Session 7: Clocktower]].',
      tags: ['npc', 'clocktower'],
      status: 'active',
      visibility: 'secret',
      pinned: false,
      createdAt: '2026-05-05T10:05:00.000Z',
      updatedAt: '2026-05-05T10:05:00.000Z',
    },
  ]
  return { version: 1, activeNoteId: 'note-session', notes }
}

export function prepareUserData(userDataDir: string, workspace: NoteWorkspace = sampleWorkspace()): string {
  rmSync(userDataDir, { recursive: true, force: true })
  const dataDir = join(userDataDir, 'data')
  ensureDir(dataDir)
  const workspacePath = join(dataDir, 'noteberry-workspace.json')
  writeFileSync(workspacePath, JSON.stringify(workspace, null, 2), 'utf8')
  return workspacePath
}

export async function launchNoteBerry(testInfo: TestInfo, options: { workspace?: NoteWorkspace; viewport?: { width: number; height: number } } = {}): Promise<LaunchedNoteBerry> {
  const userDataDir = join(testInfo.outputDir, 'user-data')
  const workspacePath = prepareUserData(userDataDir, options.workspace ?? sampleWorkspace())
  const app = await electron.launch({
    args: [APP_ENTRY],
    env: {
      ...process.env,
      NOTEBERRY_E2E_USER_DATA: userDataDir,
    },
  })
  const page = await app.firstWindow()
  await page.setViewportSize(options.viewport ?? { width: 1440, height: 940 })
  await page.waitForSelector('.app-shell')
  await page.addStyleTag({ content: '* { caret-color: transparent !important; transition: none !important; animation: none !important; }' })
  return { app, page, userDataDir, workspacePath }
}

export function readSavedWorkspace(workspacePath: string): NoteWorkspace {
  return JSON.parse(readFileSync(workspacePath, 'utf8')) as NoteWorkspace
}
