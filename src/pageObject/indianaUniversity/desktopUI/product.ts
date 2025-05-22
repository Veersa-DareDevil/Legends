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

  // async selectNavTraining() {
  //   await Promise.all([
  //     this.navTraining.click(),
  //     this.page.waitForSelector('#category-description', { state: 'visible' }),
  //   ])
  // }
  async selectProduct() {
    await this.page.getByTestId('productcardlink').first().click()
    // const productName = await this.productCard
    //   .first()
    //   .locator('[class="grid content-end"]')
    //   .textContent()
    // console.log('Product Name:', productName)
    // await this.productCardLink.first().click()
    // await this.page.waitForTimeout(4000)
    // return productName
  }

  async addToCart() {
    await this.page.getByRole('button', { name: 'Add to Cart' }).click()
  }
  // async addToCart(productName: string) {
  //   await expect(this.page.getByText(productName)).toBeVisible() //validate the product name on product page
  //   //await this.commonFunction.rejectAllCookies()
  //   await this.page.getByRole('button', { name: 'Add to Cart' }).click();
  //   await this.page.waitForTimeout(2000)
  //   await expect(this.page.getByText(productName)).toBeVisible() //validate the product name on cart page
  // }
}
