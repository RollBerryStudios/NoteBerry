/// <reference types="vite/client" />
import type { NoteBerryAPI } from '../preload/preload'

declare global {
  interface Window {
    noteberry: NoteBerryAPI
  }
}
