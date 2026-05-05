import { contextBridge, ipcRenderer } from 'electron'

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

export interface NoteBerryAPI {
  loadWorkspace: () => Promise<NoteWorkspace>
  saveWorkspace: (workspace: NoteWorkspace) => Promise<boolean>
  exportWorkspace: (workspace: NoteWorkspace) => Promise<{ success: boolean; filePath?: string; canceled?: boolean }>
  importWorkspace: () => Promise<NoteWorkspace | null>
  revealData: () => Promise<string>
  confirm: (message: string, detail?: string) => Promise<boolean>
}

const api: NoteBerryAPI = {
  loadWorkspace: () => ipcRenderer.invoke('noteberry:workspace-load'),
  saveWorkspace: (workspace) => ipcRenderer.invoke('noteberry:workspace-save', workspace),
  exportWorkspace: (workspace) => ipcRenderer.invoke('noteberry:workspace-export', workspace),
  importWorkspace: () => ipcRenderer.invoke('noteberry:workspace-import'),
  revealData: () => ipcRenderer.invoke('noteberry:reveal-data'),
  confirm: (message, detail) => ipcRenderer.invoke('noteberry:confirm', message, detail),
}

contextBridge.exposeInMainWorld('noteberry', api)
