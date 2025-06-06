import { Page, Locator } from 'playwright/test'

export class Navigation {
  readonly page: Page
  readonly catalog: Locator
  readonly processes: Locator
  readonly navImports: Locator
  readonly navProducts: Locator
  readonly navCategories: Locator

  constructor(page: Page) {
    this.page = page
    this.catalog = page.getByText('Catalog', { exact: true })
    this.processes = page.getByText('Processes')
    this.navImports = page.getByRole('link', { name: 'Imports' })
    this.navProducts = page.locator('.tw-text-sm', { hasText: 'Products' })
    this.navCategories = page.locator('.tw-text-sm', { hasText: 'Categories' })
  }

  async clickCatalog() {
    await this.catalog.click()
  }

  async clickProcesses() {
    await this.processes.click()
    await this.navImports.waitFor({ state: 'visible' })
  }

  async clickImports() {
    await this.navImports.click()
    await this.page.waitForSelector('text=Import Maintenance', { state: 'visible' })
  }

  async clickProducts() {
    await this.navProducts.click()
    await this.page.waitForSelector('[id="createEntityButton"]', { state: 'visible' })
  }

  async clickCategories() {
    await this.navCategories.click()
    await this.page.locator('button', { hasText: 'Add Category' }).waitFor({ state: 'visible' })
  }
}
