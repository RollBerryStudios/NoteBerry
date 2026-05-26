import { expect, test } from '@playwright/test'
import { launchNoteBerry, readSavedWorkspace, sampleWorkspace } from './helpers/noteberryApp'

test.describe('NoteBerry Electron QA', () => {
  test('renders the note workspace with a clean view/edit note workflow', async ({}, testInfo) => {
    const { app, page } = await launchNoteBerry(testInfo)
    try {
      await expect(page).toHaveTitle('NoteBerry')
      await expect(page.locator('.brand img')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Einstellungen' })).toBeVisible()
      await switchToEnglish(page)
      await expect(page.locator('.wordmark')).toHaveText('NOTEBERRY')
      await expect(page.locator('.titlebar-breadcrumb')).toContainText('Session 7: Clocktower')
      await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()
      await expect(page.locator('.note-card', { hasText: 'Session 7: Clocktower' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Session Desk' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Quick Capture' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'View' })).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Session 7', exact: true })).toBeVisible()
      await expect(page.locator('.wiki-chip', { hasText: 'Archivist Nara' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Raw note' })).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Field cards' })).toHaveCount(0)
      await expect(page.locator('.desk-card', { hasText: 'Secrets' })).toContainText('Archivist Nara')
      await expect.poll(() => page.locator('.brand img').evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
      await assertVisibleLayout(page)
      await assertNoUnexpectedOverlaps(page)
      await expect(page).toHaveScreenshot('noteberry-workspace-desktop.png', { fullPage: true })
    } finally {
      await app.close()
    }
  })

  test('opens settings with German dark defaults and keeps German templates usable', async ({}, testInfo) => {
      const { app, page } = await launchNoteBerry(testInfo)
    try {
      await expect(page.getByRole('heading', { name: 'Notizen' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Sitzungsübersicht' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Schnellerfassung' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Ansicht' })).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByRole('button', { name: 'Bearbeiten' })).toBeVisible()
      await expect(page.getByPlaceholder('Notizen, Tags, Geheimnisse suchen')).toBeVisible()
      await expect(page.getByText('Session Desk')).toHaveCount(0)
      await expect(page.getByText('Quick Capture')).toHaveCount(0)
      await expect(page.getByText('Feldkarten')).toHaveCount(0)
      await expect(page.locator('.note-card-emoji').first()).toBeVisible()
      await page.getByRole('button', { name: 'Einstellungen' }).click()
      await expect(page.getByRole('dialog', { name: 'Einstellungen' })).toBeVisible()
      await expect(page.getByLabel('Sprache')).toHaveValue('de')
      await expect(page.getByLabel('Design')).toHaveValue('dark')
      await expect(page.getByRole('button', { name: 'Exportieren' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'kontakt@rollberry.de' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'GitHub-Repository' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'RollBerry Studios auf GitHub' })).toBeVisible()
      await expect(page).toHaveScreenshot('noteberry-settings-dark-de.png', { fullPage: true })
      await page.getByLabel('Design').selectOption('light')
      await page.getByRole('button', { name: 'Schließen' }).click()
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByRole('dialog', { name: 'Notizvorlage wählen' })).toBeVisible()
      await expect(page.locator('.template-row .category-emoji').first()).toHaveText('📝')
      await expect(page.getByText('Vorlagenstruktur')).toHaveCount(0)
      await page.getByRole('dialog').getByRole('button', { name: /NSC/ }).click()
      await page.getByRole('button', { name: 'Erstellen' }).click()
      await expect(page.getByRole('button', { name: 'Bearbeiten' })).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByLabel('Titel')).toHaveValue('Neue Notiz: NSC')
      await expect(page.getByLabel('Notizinhalt')).toContainText('## Auf einen Blick')
      await assertVisibleLayout(page)
      await assertNoUnexpectedOverlaps(page)
    } finally {
      await app.close()
    }
  })

  test('searches, filters categories, tags, and visibility without losing session context', async ({}, testInfo) => {
    const { app, page } = await launchNoteBerry(testInfo)
    try {
      await switchToEnglish(page)
      await page.getByLabel('Search notes').fill('nara')
      await expect(page.locator('.note-card')).toHaveCount(2)
      await page.getByLabel('Category filter').selectOption('NPC')
      await expect(page.locator('.note-card')).toHaveCount(1)
      await expect(page.locator('.note-card')).toContainText('Archivist Nara')
      await page.getByLabel('Tag filter').selectOption('npc')
      await expect(page.locator('.note-card')).toHaveCount(1)
      await page.locator('.note-card', { hasText: 'Archivist Nara' }).click()
      await page.getByRole('button', { name: 'Edit' }).click()
      await expect(page.locator('.meta-strip select').nth(1)).toHaveValue('secret')

      await page.getByLabel('Search notes').fill('')
      await page.getByLabel('Category filter').selectOption('__all__')
      await page.getByLabel('Visibility filter').selectOption('__all__')
      await page.getByLabel('Tag filter').selectOption('clocktower')
      await expect(page.locator('.note-card')).toHaveCount(2)
      await page.getByRole('button', { name: 'View' }).click()
      await page.locator('.tag-cloud').getByRole('button', { name: 'npc' }).click()
      await expect(page.getByLabel('Tag filter')).toHaveValue('npc')
      await expect(page.locator('.note-card')).toHaveCount(1)
    } finally {
      await app.close()
    }
  })

  test('creates each VTT template and validates default category, tags, and starter structure', async ({}, testInfo) => {
    const { app, page, workspacePath } = await launchNoteBerry(testInfo)
    try {
      await switchToEnglish(page)
      const expectations = [
        { button: 'Blank note', title: 'Blank note', content: '', tag: '' },
        { button: 'Session', title: 'New Session', content: '# Session Notes', tag: 'session' },
        { button: 'NPC', title: 'New NPC', content: '## At a Glance', tag: 'npc' },
        { button: 'Location', title: 'New Location', content: '## First Impression', tag: 'location' },
        { button: 'Quest', title: 'New Quest', content: '## Hook', tag: 'quest' },
        { button: 'Item', title: 'New Item', content: '## Appearance', tag: 'item' },
        { button: 'Lore', title: 'New Lore', content: '## Truth', tag: 'lore' },
        { button: 'Rules', title: 'New Rules', content: '## Situation', tag: 'rules' },
        { button: 'Handout', title: 'New Handout', content: '## Player-Facing Text', tag: 'handout' },
      ]
      for (const item of expectations) {
        await page.getByRole('button', { name: 'New', exact: true }).click()
        await page.getByRole('dialog').locator('.template-row').getByRole('button', { name: item.button }).click()
        await page.getByRole('button', { name: 'Create' }).click()
        await expect(page.getByLabel('Title')).toHaveValue(item.title)
        if (item.button !== 'Blank note') await expect(page.locator('.title-edit select')).toHaveValue(item.button)
        await expect(page.getByLabel('Tags')).toHaveValue(item.tag)
        if (item.content) await expect(page.getByLabel('Note content')).toContainText(item.content)
        else await expect(page.getByLabel('Note content')).toHaveValue('')
        await expect(page.locator('.note-card.active .note-card-emoji')).toBeVisible()
        await assertVisibleLayout(page)
        await assertNoUnexpectedOverlaps(page)
      }
      await expect(page).toHaveScreenshot('noteberry-template-stack-desktop.png', { fullPage: true })
      await expect.poll(() => readSavedWorkspace(workspacePath).notes.length).toBe(11)
    } finally {
      await app.close()
    }
  })

  test('creates template notes, edits metadata and markdown, then persists changes', async ({}, testInfo) => {
    const { app, page, workspacePath } = await launchNoteBerry(testInfo)
    try {
      await switchToEnglish(page)
      await page.getByRole('button', { name: 'New' }).click()
      await page.getByRole('dialog').locator('.template-row').getByRole('button', { name: 'NPC' }).click()
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('Title').fill('Captain Morn')
      await page.getByLabel('Tags').fill('npc, harbor, ally')
      await page.getByLabel('Status').selectOption('active')
      await page.getByLabel('Note content').fill('## Role\n- Role: Harbor captain who knows [[Hidden Pier]].\n- TODO: Add voice cue and dock smell.\n- Trust: Trusted by sailors.')
      await expect(page.getByLabel('Note content')).toContainText('Harbor captain who knows [[Hidden Pier]].')
      await page.getByLabel('Note content').fill('## Role\n- Role: Harbor master who knows [[Hidden Pier]].\n- TODO: Add voice cue and dock smell.\n- Trust: Trusted by sailors.')
      await expect(page.getByLabel('Note content')).toContainText('Harbor master')
      await page.getByRole('button', { name: 'View' }).click()
      await expect(page.getByText('Harbor master who knows')).toBeVisible()
      await expect(page.locator('.wiki-chip', { hasText: 'Hidden Pier' })).toBeVisible()
      await assertVisibleLayout(page)
      await assertNoUnexpectedOverlaps(page)
      await expect(page).toHaveScreenshot('noteberry-field-card-edited-desktop.png', { fullPage: true })

      await expect.poll(() => {
        const saved = readSavedWorkspace(workspacePath)
        const active = saved.notes.find((note) => note.id === saved.activeNoteId)
        return {
          count: saved.notes.length,
          title: active?.title,
          tags: active?.tags,
          status: active?.status,
        }
      }).toEqual({ count: 3, title: 'Captain Morn', tags: ['npc', 'harbor', 'ally'], status: 'active' })
    } finally {
      await app.close()
    }
  })

  test('flushes pending note edits when the window closes immediately', async ({}, testInfo) => {
    const { app, page, workspacePath } = await launchNoteBerry(testInfo)
    await switchToEnglish(page)
    await page.getByRole('button', { name: 'Edit' }).click()
    await page.getByLabel('Note content').fill('Quick close field report with [[Hidden Pier]].')
    await app.close()
    expect(readSavedWorkspace(workspacePath).notes[0].content).toContain('Quick close field report')
  })

  test('updates pinning, status states, and note ordering', async ({}, testInfo) => {
    const { app, page, workspacePath } = await launchNoteBerry(testInfo)
    try {
      await switchToEnglish(page)
      await page.locator('.note-card', { hasText: 'Archivist Nara' }).click()
      await page.getByRole('button', { name: 'Edit' }).click()
      await page.getByLabel('Status').selectOption('resolved')
      await page.locator('.meta-strip .check-line input').check()
      await expect(page.locator('.note-card').first()).toContainText('Pinned: Archivist Nara')
      await page.getByLabel('Status').selectOption('archived')
      await expect(page.locator('.note-card').first()).toContainText('Archived')
      await expect(page).toHaveScreenshot('noteberry-state-ordering-desktop.png', { fullPage: true })

      await expect.poll(() => {
        const nara = readSavedWorkspace(workspacePath).notes.find((note) => note.id === 'note-nara')
        return { pinned: nara?.pinned, status: nara?.status }
      }).toEqual({ pinned: true, status: 'archived' })
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
      await switchToEnglish(page)
      await page.getByRole('button', { name: 'Edit' }).click()
      await expect(page.getByLabel('Title')).toHaveValue('Untitled Note')
      await expect(page.locator('.title-edit select')).toHaveValue('Session')
      await expect(page.locator('.meta-strip select').nth(0)).toHaveValue('draft')
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
      await switchToEnglish(page)
      await assertVisibleLayout(page)
      await assertNoUnexpectedOverlaps(page)
      await expect(page).toHaveScreenshot('noteberry-desktop-layout.png', { fullPage: true })
      await page.setViewportSize({ width: 900, height: 980 })
      await page.waitForTimeout(100)
      await assertVisibleLayout(page)
      await assertNoUnexpectedOverlaps(page)
      await expect(page).toHaveScreenshot('noteberry-responsive-layout.png', { fullPage: true })

      await page.getByRole('button', { name: 'New' }).click()
      await page.getByRole('dialog').getByRole('button', { name: /Quest/ }).click()
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('Note content').fill('## Hook\n\nA patron knows [[Old Mill]].\n- TODO: Add reward.\n- [ ] Confirm villain motive.')
      await assertVisibleLayout(page)
      await assertNoUnexpectedOverlaps(page)
      await expect(page).toHaveScreenshot('noteberry-responsive-editor-detail.png', { fullPage: true })

      await page.setViewportSize({ width: 390, height: 844 })
      await page.waitForTimeout(100)
      await assertVisibleLayout(page)
      await assertNoUnexpectedOverlaps(page)
      await expect(page).toHaveScreenshot('noteberry-mobile-390.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.08,
      })
    } finally {
      await app.close()
    }
  })
})

async function switchToEnglish(page: import('@playwright/test').Page): Promise<void> {
  await page.getByRole('button', { name: 'Einstellungen' }).click()
  await page.getByLabel('Sprache').selectOption('en')
  await page.getByRole('button', { name: 'Close' }).click()
}

async function assertVisibleLayout(page: import('@playwright/test').Page): Promise<void> {
  const failures = await page.evaluate(() => {
    const viewport = { width: window.innerWidth, height: window.innerHeight }
    const selectors = ['.titlebar', '.brand', '.note-layout', '.notes-panel', '.editor-panel', '.note-header', '.meta-strip', '.note-view-card', '.note-context-grid', '.editor-card', 'button', 'input', 'select', 'textarea']
    const result: string[] = []
    const seen = new Set<Element>()
    for (const selector of selectors) {
      for (const element of Array.from(document.querySelectorAll(selector))) {
        if (seen.has(element)) continue
        seen.add(element)
        const style = window.getComputedStyle(element)
        if (style.display === 'none' || style.visibility === 'hidden') continue
        if (hasHiddenAncestor(element)) continue
        const rect = element.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) result.push(`${selector} has empty bounds`)
        if (rect.left < -1 || rect.right > viewport.width + 1) result.push(`${selector} overflows horizontally`)
        if (element instanceof HTMLButtonElement && element.scrollWidth > element.clientWidth + 2) result.push(`button text clips: ${element.textContent?.trim()}`)
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          const visibleText = element.placeholder
          if (visibleText && element.scrollWidth > element.clientWidth + 2) result.push(`${selector} placeholder clips: ${visibleText.slice(0, 40)}`)
        }
        if (element instanceof HTMLSelectElement) {
          const optionText = element.selectedOptions[0]?.textContent?.trim() ?? ''
          const style = window.getComputedStyle(element)
          const probe = document.createElement('canvas').getContext('2d')
          const font = `${style.fontStyle} ${style.fontVariant} ${style.fontWeight} ${style.fontSize} / ${style.lineHeight} ${style.fontFamily}`
          if (probe && optionText) {
            probe.font = font
            const reserve = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 28
            if (probe.measureText(optionText).width > element.clientWidth - reserve + 1) result.push(`select text clips: ${optionText}`)
          }
        }
        if (element.matches('button, input, select, textarea') && !element.closest('.note-list, .mini-list, .structure-card')) {
          const clippedBy = clippedByHiddenAncestor(element, rect)
          if (clippedBy) result.push(`${selector} is clipped by ${clippedBy}: ${element.textContent?.trim().slice(0, 40)}`)
        }
      }
    }

    function hasHiddenAncestor(element: Element): boolean {
      for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        const style = window.getComputedStyle(parent)
        if (style.display === 'none' || style.visibility === 'hidden') return true
      }
      return false
    }

    function clippedByHiddenAncestor(element: Element, elementRect: DOMRect): string | null {
      let clip = {
        left: elementRect.left,
        right: elementRect.right,
        top: elementRect.top,
        bottom: elementRect.bottom,
      }
      for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        const style = window.getComputedStyle(parent)
        const clipsX = style.overflowX === 'hidden' || style.overflowX === 'clip'
        const clipsY = style.overflowY === 'hidden' || style.overflowY === 'clip'
        if (!clipsX && !clipsY) continue
        const parentRect = parent.getBoundingClientRect()
        clip = {
          left: clipsX ? Math.max(clip.left, parentRect.left) : clip.left,
          right: clipsX ? Math.min(clip.right, parentRect.right) : clip.right,
          top: clipsY ? Math.max(clip.top, parentRect.top) : clip.top,
          bottom: clipsY ? Math.min(clip.bottom, parentRect.bottom) : clip.bottom,
        }
        if (clip.right < elementRect.right - 2 || clip.left > elementRect.left + 2 || clip.bottom < elementRect.bottom - 2 || clip.top > elementRect.top + 2) {
          return parent.className || parent.tagName.toLowerCase()
        }
      }
      return null
    }
    return result
  })
  expect(failures).toEqual([])
}

async function assertNoUnexpectedOverlaps(page: import('@playwright/test').Page): Promise<void> {
  const failures = await page.evaluate(() => {
    const groups = [
      '.titlebar > *',
      '.filters > *',
      '.template-row > button',
      '.note-list > .note-card',
      '.note-header > *',
      '.title-edit > label',
      '.meta-strip > label',
      '.note-context-grid > article',
      '.tag-cloud > button',
      '.mini-list > *',
    ]
    const result: string[] = []
    function visibleRect(element: Element): DOMRect | null {
      const style = window.getComputedStyle(element)
      if (style.display === 'none' || style.visibility === 'hidden') return null
      const rect = element.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return null
      return rect
    }
    function overlap(a: DOMRect, b: DOMRect): boolean {
      return Math.max(a.left, b.left) < Math.min(a.right, b.right) - 1 && Math.max(a.top, b.top) < Math.min(a.bottom, b.bottom) - 1
    }
    for (const group of groups) {
      const items = Array.from(document.querySelectorAll(group))
        .map((element) => ({ element, rect: visibleRect(element) }))
        .filter((item): item is { element: Element; rect: DOMRect } => item.rect !== null)
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          if (overlap(items[i].rect, items[j].rect)) {
            result.push(`${group} overlap: "${items[i].element.textContent?.trim().slice(0, 30)}" with "${items[j].element.textContent?.trim().slice(0, 30)}"`)
          }
        }
      }
    }
    return result
  })
  expect(failures).toEqual([])
}
