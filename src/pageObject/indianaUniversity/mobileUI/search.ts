import { Locator, Page } from '@playwright/test'

export class ProductSearchPage {
  private page: Page

  readonly searchBox: Locator
  readonly filterSortButton: Locator
  readonly filterPanel: Locator
  readonly closeButton: Locator

  constructor(page: Page) {
    this.page = page
    this.searchBox = page.getByRole('combobox', { name: 'Search' })
    this.filterSortButton = page.getByRole('button', { name: 'Filter and Sort' })
    this.filterPanel = page.locator('[id^="headlessui-dialog-panel"]', {
      hasText: 'Filter and Sort',
    })
    this.closeButton = page.getByRole('button').filter({ hasText: /^$/ })
  }

  async performSearch(query: string = ' ') {
    await this.searchBox.click()
    await this.searchBox.fill(query)
    await this.searchBox.press('Enter')
  }

  async closePrivacyDialogIfVisible() {
    const privacyDialog = this.page.getByRole('dialog', { name: 'Privacy' })
    try {
      await privacyDialog.waitFor({ state: 'visible', timeout: 3000 })
      await privacyDialog.getByLabel('Close').click()
    } catch {
      // Dialog not visible
    }
  }

  async openFilterTray() {
    await this.filterSortButton.click()
  }

  async expandFacet(facetName: string) {
    await this.openFilterTray()
    await this.page.getByRole('button', { name: facetName }).click()
  }

  async applySizeFilter(size: string = 'X-Small', autoApply = true) {
    await this.expandFacet('Size')

    const checkbox = this.filterPanel.locator(`#optionsSize_${size}`)
    await checkbox.scrollIntoViewIfNeeded()
    await checkbox.check()

    if (autoApply) {
      const applyButton = this.getSizeFacetApplyButton()
      await applyButton.waitFor({ state: 'visible' })
      await applyButton.click()
    }
  }

  async applySort(sortOption: string) {
    await this.openFilterTray()
    await this.page
      .locator('div')
      .filter({ hasText: /^Sort By/ })
      .locator('svg')
      .click()
    await this.page.getByRole('option', { name: sortOption }).click()
    await this.getMainApplyButton().click()
  }

  getSizeFilterButton() {
    return this.page.getByRole('button', { name: 'Size' })
  }

  getSortByDropdown() {
    return this.page.getByRole('combobox')
  }

  getFacetOption(facetText: string) {
    return this.filterPanel.getByText(facetText)
  }

  getSizeOptions() {
    return this.filterPanel.locator('label:has-text("(")')
  }

  getRemoveFacetButton(facet: string) {
    return this.page.getByRole('button', { name: `Remove ${facet}` })
  }

  /** Returns the main Filter & Sort tray "Apply" button */
  getMainApplyButton() {
    return this.page
      .locator('[id^="headlessui-dialog-panel"] dl')
      .getByRole('button', { name: 'Apply' })
      .first()
  }

  /** Returns the Size facet-specific "Apply" button */
  getSizeFacetApplyButton() {
    return this.page
      .locator('[id^="headlessui-dialog-panel"] dl')
      .getByRole('button', { name: 'Apply' })
      .filter({ has: this.page.locator('input[type="checkbox"]:checked') }) // optional heuristic
      .first() // fallback to first visible
  }

  getFacetLabel(facet: string) {
    return this.page.getByText(facet)
  }

  getFacetCheckbox(label: string) {
    return this.page.getByLabel(new RegExp(`^${label}`))
  }
}
