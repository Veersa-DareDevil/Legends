import { Page, Locator, expect } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import checkoutData from '@src/fixtures/indianaUniversity/checkoutValidation.json'
import { MobileNavigation } from './navigation'

export class Product {

  readonly page
  private commonFunction: CommonUtils
  private navbar: MobileNavigation
  readonly productCard: Locator
  readonly optionMensTraining: Locator
  readonly rejectAllCookiesButton: Locator
  readonly productCardLink: Locator
  readonly addToCartButton: Locator
  readonly phoneNumberInput: Locator
  readonly warningMessage: Locator
  readonly shipAddress: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunction = new CommonUtils(page)
    this.navbar = new MobileNavigation(page)
    this.optionMensTraining = page.getByRole('link', { name: 'Mens', exact: true })
    this.productCard = page.locator('[data-testid="productcard"]')
    this.productCardLink = page.locator('[data-testid="productcardlink"]')
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]')
    this.rejectAllCookiesButton = page.locator('#onetrust-reject-all-handler') //it is the unique locator
    this.phoneNumberInput = page.locator('[name="phoneNumber"]')
    this.warningMessage = page.getByText(checkoutData.nonWesternCharacters.warnMsg)
    this.shipAddress = page.getByText('Shipping Address')
  }

  async selectNavTraining() {
    await this.navbar.navTraining.click()
    await this.commonFunction.rejectAllCookies()
    await this.optionMensTraining.click({ force: true })
    await this.page.waitForSelector('#category-description', { state: 'visible' })
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
    await this.addToCartButton.click()
    await this.page.waitForTimeout(2000)
    await expect(this.page.getByText(productName)).toBeVisible() //validate the product name on cart page
  }
}
