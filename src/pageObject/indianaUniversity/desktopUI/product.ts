import { Page, Locator } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'

export class Product {
  readonly page
  private commonFunction: CommonUtils
  readonly productCard: Locator
  //readonly navTraining: Locator
  readonly rejectAllCookiesButton: Locator
  readonly productCardLink: Locator
  readonly addToCartButton: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunction = new CommonUtils(page)
    //this.navTraining = page.getByTestId('navigation-bar').getByRole('link', { name: 'Training' })
    this.productCard = page.locator('[data-testid="productcard"]')
    this.productCardLink = page.locator('[data-testid="productcardlink"]')
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]')
    this.rejectAllCookiesButton = page.locator('#onetrust-reject-all-handler') //it is the unique locator
  }
  // future use
  // async selectNavTraining() {
  //   await Promise.all([
  //     this.navTraining.click(),
  //     this.page.waitForSelector('#category-description', { state: 'visible' }),
  //   ])
  // }
  async selectProduct() {
    await this.page.getByTestId('productcardlink').first().click()
  }

  async addToCart() {
    await this.page.getByRole('button', { name: 'Add to Cart' }).click()
  }
}
