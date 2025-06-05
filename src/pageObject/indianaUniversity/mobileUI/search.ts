import { Page, Locator, expect } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'

export class ProductSearchPage {
  readonly page: Page
  readonly commonFunctions: CommonUtils

  readonly searchBox: Locator
  readonly filterAndSortButton: Locator
  readonly closeFilterPanelButton: Locator

  readonly sizeSectionButton: Locator
  readonly productTypeSectionButton: Locator
  readonly sportSectionButton: Locator
  readonly brandSectionButton: Locator
  readonly sortBySectionTray: Locator

  readonly xSmallSizeFacet: Locator
  readonly smallSizeFacet: Locator
  readonly selectedXSmallTag: Locator
  readonly pageTop: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunctions = new CommonUtils(page)

    // Search and panel
    this.searchBox = page.getByRole('combobox', { name: 'Search' })
    this.filterAndSortButton = page.getByRole('button', { name: 'Filter and Sort' })
    this.closeFilterPanelButton = page.locator('div:has-text("Filter and Sort") button')

    // Filter section buttons
    this.sizeSectionButton = page.getByRole('button', { name: 'Size' })
    this.productTypeSectionButton = page.getByRole('button', { name: 'Product Type' })
    this.sportSectionButton = page.getByRole('button', { name: 'Sport' })
    this.brandSectionButton = page.getByRole('button', { name: 'Brand' })
    this.sortBySectionTray = page.getByText('Relevancy', { exact: true })

    // Filter option checkboxes
    this.xSmallSizeFacet = page.locator(
      '[id="headlessui-dialog-panel-\\:rp\\:"] #optionsSize_X-Small',
    )
    this.smallSizeFacet = page.locator('[id="headlessui-dialog-panel-\\:rp\\:"] #optionsSize_Small')

    // Tags & sections after selection
    this.selectedXSmallTag = page
      .locator('div')
      .filter({ hasText: /^X-Small$/ })
      .nth(1)
    this.pageTop = page.locator('#page-top')
  }

  async triggerBlankSearch() {
    await this.searchBox.click()
    await this.searchBox.press('Enter')
  }

  //opening filter and sort tray
  async openFilterAndSortPanel() {
    await this.filterAndSortButton.click()
  }

  // clossing filter and sort tray
  async closeFilterAndSortPanel() {
    await this.page
      .locator('div')
      .filter({ hasText: /^Filter and Sort48 Products$/ })
      .getByRole('button')
      .click()
  }

  //check filter and sort tray is opening
  async toggleFilterSection() {
    await this.commonFunctions.handleCookieBanner()

    const filterOptions = [
      this.sizeSectionButton,
      this.productTypeSectionButton,
      this.sportSectionButton,
      this.brandSectionButton,
      this.sortBySectionTray,
    ]

    for (const filter of filterOptions) {
      await this.openFilterAndSortPanel()
      await filter.waitFor({ state: 'visible' })
      await filter.click()
      await this.closeFilterAndSortPanel()
    }
  }

  //add filter
  async addFilterFacetOnSize() {
    await this.commonFunctions.handleCookieBanner()
    await this.openFilterAndSortPanel()
    await this.sizeSectionButton.waitFor({ state: 'visible' })
    await this.sizeSectionButton.click()
    await this.xSmallSizeFacet.check()
    await this.smallSizeFacet.check()
    await this.closeFilterAndSortPanel()

    await expect(this.pageTop).toContainText('X-Small')
    await expect(this.pageTop).toContainText('Small')
  }

  //remove selected filter
  async removeSizeFilter() {
    await this.selectedXSmallTag.click()
    await expect(this.selectedXSmallTag).toHaveCount(0)
  }
}
