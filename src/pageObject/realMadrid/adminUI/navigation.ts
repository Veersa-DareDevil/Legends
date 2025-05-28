import { Page, Locator } from "playwright/test"

export class Navigation {
  readonly page: Page
  readonly catalog: Locator
  readonly processes :Locator
  readonly navImports: Locator

  constructor(page: Page) {
    this.page = page
    this.catalog = page.getByText('Catalog', { exact: true })
    this.processes = page.getByText('Processes')
    this.navImports = page.getByRole('link', { name: 'Imports' })

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
}

