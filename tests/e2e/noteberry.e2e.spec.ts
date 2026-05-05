import { expect, test } from '@playwright/test'
import { launchNoteBerry, readSavedWorkspace, sampleWorkspace } from './helpers/noteberryApp'

test.describe('NoteBerry Electron QA', () => {
  test('renders the note workspace, editor, preview, and intel without broken controls', async ({}, testInfo) => {
    const { app, page } = await launchNoteBerry(testInfo)
    try {
      await expect(page).toHaveTitle('NoteBerry')
      await expect(page.locator('.brand img')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()
      await expect(page.getByText('Session 7: Clocktower')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Editor' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Table Intel' })).toBeVisible()
      await expect(page.locator('.markdown-preview')).toContainText('Reveal the cracked bell clue')
      await expect(page.locator('.intel-stat', { hasText: 'Todos' })).toContainText('1')
      await expect(page.locator('.intel-stat', { hasText: 'Links' })).toContainText('1')
      await expect(page).toHaveScreenshot('noteberry-workspace-desktop.png', { fullPage: true })
    } finally {
      await app.close()
    }
  })

  test('searches, filters categories and tags, and follows backlinks', async ({}, testInfo) => {
    const { app, page } = await launchNoteBerry(testInfo)
    try {
      await page.getByLabel('Search notes').fill('nara')
      await expect(page.locator('.note-card')).toHaveCount(2)
      await page.getByLabel('Category filter').selectOption('NPC')
      await expect(page.locator('.note-card')).toHaveCount(1)
      await expect(page.locator('.note-card')).toContainText('Archivist Nara')
      await page.getByLabel('Tag filter').selectOption('npc')
      await expect(page.locator('.note-card')).toHaveCount(1)
      await page.locator('.note-card', { hasText: 'Archivist Nara' }).click()
      await expect(page.locator('.mini-list').last()).toContainText('Session 7: Clocktower')
      await expect(page.locator('.markdown-preview')).toContainText('Session 7: Clocktower')
    } finally {
      await app.close()
    }
  })

  test('creates template notes, edits metadata and markdown, then persists changes', async ({}, testInfo) => {
    const { app, page, workspacePath } = await launchNoteBerry(testInfo)
    try {
      await page.locator('.template-row').getByRole('button', { name: 'NPC' }).click()
      await page.getByLabel('Title').fill('Captain Morn')
      await page.getByLabel('Tags').fill('npc, harbor, ally')
      await page.getByLabel('Visibility').selectOption('table')
      await page.getByLabel('Status').selectOption('active')
      await page.getByLabel('Note content').fill('## Role\n\nHarbor captain who knows [[Hidden Pier]].\n- TODO: Add voice cue.')
      await expect(page.locator('.markdown-preview')).toContainText('Harbor captain')
      await expect(page.locator('.intel-stat', { hasText: 'Todos' })).toContainText('1')
      await expect(page.locator('.intel-stat', { hasText: 'Links' })).toContainText('1')

      await expect.poll(() => {
        const saved = readSavedWorkspace(workspacePath)
        const active = saved.notes.find((note) => note.id === saved.activeNoteId)
        return {
          count: saved.notes.length,
          title: active?.title,
          tags: active?.tags,
          visibility: active?.visibility,
          status: active?.status,
        }
      }).toEqual({ count: 3, title: 'Captain Morn', tags: ['npc', 'harbor', 'ally'], visibility: 'table', status: 'active' })
    } finally {
      await app.close()
    }
  })

  test('normalizes damaged workspace data before rendering and saving', async ({}, testInfo) => {
    const damaged = {
      version: 1,
      activeNoteId: 'missing',
      notes: [{
        id: 'damaged',
        title: '',
        category: '',
        content: 42,
        tags: ['npc', 'npc', 9],
        status: 'weird',
        visibility: 'unknown',
        pinned: 1,
      }],
    } as never
    const { app, page, workspacePath } = await launchNoteBerry(testInfo, { workspace: damaged })
    try {
      await expect(page.getByLabel('Title')).toHaveValue('Untitled Note')
      await expect(page.locator('.title-edit select')).toHaveValue('Session')
      await expect(page.locator('.meta-strip select').nth(0)).toHaveValue('draft')
      await expect(page.locator('.meta-strip select').nth(1)).toHaveValue('gm')
      const saved = readSavedWorkspace(workspacePath)
      expect(saved.activeNoteId).toBe('damaged')
      expect(saved.notes[0].tags).toEqual(['npc'])
    } finally {
      await app.close()
    }
  })

  test('keeps desktop and narrow layouts bounded and screenshot-stable', async ({}, testInfo) => {
    const { app, page } = await launchNoteBerry(testInfo, { workspace: sampleWorkspace() })
    try {
      await assertVisibleLayout(page)
      await expect(page).toHaveScreenshot('noteberry-desktop-layout.png', { fullPage: true })
      await page.setViewportSize({ width: 900, height: 980 })
      await page.waitForTimeout(100)
      await assertVisibleLayout(page)
      await expect(page).toHaveScreenshot('noteberry-responsive-layout.png', { fullPage: true })
    } finally {
      await app.close()
    }
  })
})

async function assertVisibleLayout(page: import('@playwright/test').Page): Promise<void> {
  const failures = await page.evaluate(() => {
    const viewport = { width: window.innerWidth, height: window.innerHeight }
    const selectors = ['.titlebar', '.brand', '.note-layout', '.notes-panel', '.editor-panel', '.editor-head', '.meta-strip', '.workbench', '.editor-card', '.preview-card', '.intel-card', 'button', 'input', 'select', 'textarea']
    const result: string[] = []
    const seen = new Set<Element>()
    for (const selector of selectors) {
      for (const element of Array.from(document.querySelectorAll(selector))) {
        if (seen.has(element)) continue
        seen.add(element)
        const style = window.getComputedStyle(element)
        if (style.display === 'none' || style.visibility === 'hidden') continue
        const rect = element.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) result.push(`${selector} has empty bounds`)
        if (rect.left < -1 || rect.right > viewport.width + 1) result.push(`${selector} overflows horizontally`)
        if (element instanceof HTMLButtonElement && element.scrollWidth > element.clientWidth + 2) result.push(`button text clips: ${element.textContent?.trim()}`)
      }
    }
    return result
  })
  expect(failures).toEqual([])
}
