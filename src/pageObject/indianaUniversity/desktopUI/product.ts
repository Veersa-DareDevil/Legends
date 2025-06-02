import { Page, Locator, expect } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'

export class Product {
  readonly page: Page
  private commonFunction: CommonUtils
  readonly productCard: Locator
  readonly cookieCloseBtn: Locator
  readonly productCardLink: Locator
  readonly addToCartButton: Locator
  readonly personalisedName: Locator
  readonly personalisedNumber: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunction = new CommonUtils(page)
    this.productCard = page.locator('[data-testid="productcard"]')
    this.productCardLink = page.locator('[data-testid="productcardlink"]')
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]')
    this.cookieCloseBtn = page.locator('[id="onetrust-close-btn-container"]')
    this.personalisedName = page.locator(
      'input[name="\\30 1J91Q84W4DH241G7BS50D0M32__addOn\\:01J91QR60F97E50TMSDYR51QYC__product\\:01J91QN00XMKFF03E81M7R04H5__productOption\\:name"]',
    )
    this.personalisedNumber = page.locator(
      'input[name="\\30 1J91Q84W4DH241G7BS50D0M32__addOn\\:01J91QR60F97E50TMSDYR51QYC__product\\:01J91QN00XMKFF03E81M7R04H5__productOption\\:number"]',
    )
  }

  async selectProduct() {
    await this.productCardLink.first().click()
  }

  async addToCart() {
    await this.addToCartButton.click()
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
