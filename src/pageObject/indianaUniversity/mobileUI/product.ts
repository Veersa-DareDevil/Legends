import { Page, Locator, expect } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'
import checkoutData from '@src/fixtures/indianaUniversity/checkoutValidation.json'

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
  readonly personalisedName: Locator
  readonly personalisedNumber: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunction = new CommonUtils(page)
    this.optionMensTraining = page.getByRole('link', { name: 'Mens', exact: true })
    this.productCard = page.locator('[data-testid="productcard"]')
    this.productCardLink = page.locator('[data-testid="productcardlink"]')
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]')
    this.cookieCloseBtn = page.getByRole('button', { name: 'Close' })
    this.phoneNumberInput = page.locator('[name="phoneNumber"]')
    this.warningMessage = page.getByText(checkoutData.nonWesternCharacters.warnMsg)
    this.shipAddress = page.getByText('Shipping Address') //
    this.personalisedName = page.locator(
      'input[name="\\30 1J91Q84W4DH241G7BS50D0M32__addOn\\:01J91QR60F97E50TMSDYR51QYC__product\\:01J91QN00XMKFF03E81M7R04H5__productOption\\:name"]',
    ) //no unique locator
    this.personalisedNumber = page.locator(
      'input[name="\\30 1J91Q84W4DH241G7BS50D0M32__addOn\\:01J91QR60F97E50TMSDYR51QYC__product\\:01J91QN00XMKFF03E81M7R04H5__productOption\\:number"]',
    ) // no unique locator
  }

  async selectProduct() {
    await this.page.getByTestId('productcardlink').first().click()
  }
  async addToCart() {
    await this.page.getByRole('button', { name: 'Add to Cart' }).click()
  }

  async personalisedProduct(name: string, number: string) {
    await this.commonFunction.handleCookieBanner()
    await this.personalisedName.fill(name)
    await this.personalisedNumber.fill(number)
    const namePreview = this.page.locator('svg textPath').filter({
      hasText: name.toUpperCase(),
    })
    await expect(namePreview.first()).toHaveText(name.toUpperCase(), { timeout: 10000 })
    const numberPreview = this.page.locator('svg textPath').filter({
      hasText: number,
    })
    await expect(numberPreview.first()).toHaveText(number, { timeout: 10000 })
  }
}
