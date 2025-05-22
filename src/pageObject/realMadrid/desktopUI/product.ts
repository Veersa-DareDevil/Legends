import { Page, Locator, expect } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'

export class Product {
  readonly page
  private commonFunction: CommonUtils
  readonly productCard: Locator
  readonly navTaining: Locator
  readonly rejectAllCookiesButton: Locator
  readonly productCardLink: Locator
  readonly addToCartButton: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunction = new CommonUtils(page)
    this.navTaining = page.getByTestId('navigation-bar').getByRole('link', { name: 'Training' })
    this.productCard = page.locator('[data-testid="productcard"]')
    this.productCardLink = page.locator('[data-testid="productcardlink"]')
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]')
    this.rejectAllCookiesButton = page.locator('#onetrust-reject-all-handler') //it is the unique locator
  }

  async selectNavTraining() {
    await Promise.all([
      this.navTaining.click(),
      this.page.waitForSelector('#category-description', { state: 'visible' }),
    ])
  }
  async selectProduct() {
    await this.productCard.first().hover()
    const productName = await this.productCard
      .first()
      .locator('[class="grid content-end"]')
      .textContent()
    console.log('Product Name:', productName)
    await this.productCardLink.first().click()
    await this.page.waitForTimeout(2000)
    return productName
  }

  async addToCart(productName: string) {
    await expect(this.page.getByText(productName)).toBeVisible() //validate the product name on product page
    await this.commonFunction.rejectAllCookies()
    await this.addToCartButton.click()
    await this.page.waitForTimeout(2000)
    await expect(this.page.getByText(productName)).toBeVisible() //validate the product name on cart page
  }
}
