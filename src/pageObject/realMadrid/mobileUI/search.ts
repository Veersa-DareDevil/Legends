import { Page, Locator } from 'playwright'

export class SearchPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly searchButton: Locator
  readonly searchResults: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="searchbar"]')
    this.searchButton = page.locator('button[aria-label="Search button"]')
    this.searchResults = page.getByRole('heading', { name: 'Search Results' })
  }

  async searchProduct(query: string) {
    const searchBox = this.searchInput.nth(1)
    await searchBox.fill(query)
    await searchBox.press('Enter')
    await this.searchResults.waitFor({ state: 'visible' })
  }
}
