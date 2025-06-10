import { Page, Locator } from 'playwright/test'

export class Navigation {
  readonly page: Page
  readonly catalog: Locator
  readonly pricing: Locator
  readonly processes: Locator
  readonly navImports: Locator
  readonly navProducts: Locator
  readonly navCategories: Locator
  readonly navOffers: Locator

  constructor(page: Page) {
    this.page = page
    this.catalog = page.getByText('Catalog', { exact: true })
    this.pricing = page.getByText('Pricing', { exact: true })
    this.processes = page.getByText('Processes')
    this.navImports = page.getByRole('link', { name: 'Imports' })
    this.navProducts = page.locator('.tw-text-sm', { hasText: 'Products' })
    this.navCategories = page.locator('.tw-text-sm', { hasText: 'Categories' })
    this.navOffers = page.locator('.tw-text-sm', { hasText: 'Offers' })
  }

  async clickCatalog() {
    await this.catalog.click()
  }

  async clickPricing() {
    await this.pricing.click()
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

  async clickOffers() {
    await this.navOffers.click()
    await this.page.getByRole('button', { name: 'Add Offer' }).waitFor({ state: 'visible' })
  }
}
