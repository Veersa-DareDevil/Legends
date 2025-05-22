import { Page, Locator } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'

export class Product {
  readonly page
  private commonFunction: CommonUtils
  readonly productCard: Locator
  //readonly navTaining: Locator   //enable when website is completed
  readonly optionMensTraining: Locator
  private cookieCloseBtn: Locator
  readonly productCardLink: Locator
  readonly addToCartButton: Locator
  readonly phoneNumberInput: Locator
  readonly warningMessage: Locator
  readonly shipAddress: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunction = new CommonUtils(page)
    //this.navTaining = page.getByTestId('navigation-bar').getByRole('button', { name: 'Training' })
    this.optionMensTraining = page.getByRole('link', { name: 'Mens', exact: true })
    this.productCard = page.locator('[data-testid="productcard"]')
    this.productCardLink = page.locator('[data-testid="productcardlink"]')
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]')
    this.cookieCloseBtn = page.getByRole('button', { name: 'Close' })
    this.phoneNumberInput = page.locator('[name="phoneNumber"]')
    this.warningMessage = page.getByText('Please only use Western characters.')
    this.shipAddress = page.getByText('Shipping Address')
  }
  //navigation should be enabled when website is completed
  // async selectNavTraining() {
  //   await this.navTaining.click()
  //   //await this.commonFunction.rejectAllCookies()
  //   await this.optionMensTraining.click({ force: true })
  //   await this.page.waitForSelector('#category-description', { state: 'visible' })
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

  // async addToCart(productName: string) {
  //   await expect(this.page.getByText(productName)).toBeVisible() //validate the product name on product page
  //   await this.addToCartButton.click()
  //   await this.page.waitForTimeout(2000)
  //   await expect(this.page.getByText(productName)).toBeVisible() //validate the product name on cart page
  // }

  async addToCart() {
    await this.page.getByRole('button', { name: 'Add to Cart' }).click()
  }
}
