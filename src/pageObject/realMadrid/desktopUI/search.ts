import { Page,Locator } from "playwright"
   

export class SearchPage {
    readonly page: Page
    readonly searchInput: Locator;

    constructor(page: Page) {
        this.page = page
        this.searchInput = page.locator('[data-testid="searchbar"]').first()
        
    }

    async searchProduct(query: string) {
        await this.searchInput.fill(query)
        await this.searchInput.click()
    }

}