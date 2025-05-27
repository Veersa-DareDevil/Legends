import { Page, Locator } from 'playwright'

export class SearchPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly searchButton: Locator
  readonly searchResults: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="searchbar"]').first()
    this.searchButton = page.locator('button[aria-label="Search button"]').first()
    this.searchResults = page.getByRole('heading', { name: 'Search Results' })
  }

  async searchProduct(query: string) {
    await this.searchInput.fill(query)
    await this.searchInput.press('Enter')
    await this.searchResults.waitFor({ state: 'visible' })
  }
}
