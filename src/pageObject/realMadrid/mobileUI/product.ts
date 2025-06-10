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
  readonly miniCartProductPrice: (priceSymbol: string) => Locator

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
    this.miniCartProductPrice = (priceSymbol: string) => page.getByTestId('minicart').getByText(priceSymbol).first()
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

  async addToCart(productName?: string) {
    if (productName) {
      await expect(this.page.getByText(productName)).toBeVisible() //validate the product name on product page
    }
    await this.commonFunction.rejectAllCookies()
    await this.addToCartButton.click()
    await this.page.waitForTimeout(2000)
    if (productName) {
      await expect(this.page.getByText(productName)).toBeVisible() //validate the product name on cart page
    }
  }

  async getProductCardContent() {
    await this.productCard.first().hover()
    const productName = await this.productCard
      .first()
      .locator('[class="grid content-end"]')
      .textContent()
    console.log('Product Name:', productName)
    return productName as string
  }

  async validateMadridistaDiscountedPrice() {
    const porductCount = await this.productCard.count()

    // 1. to validate the product card content and the discounted price
    for (let i = 0; i < porductCount; i++) {
      const productPrice = await this.getProductCardContent()
      const prices = productPrice.match(/\$(\d+\.\d+)/g)
      if (prices && prices.length >= 2) {
        console.log('Prices:', prices)
        const discountedPrice = parseFloat(prices[0].substring(1))
        const originalPrice = parseFloat(prices[1].substring(1))
        expect(discountedPrice).toBeLessThan(originalPrice) // expect discounted price to be less than original price
      }

      // 2. to validate the product card background color to be purple
      const productElement = this.productCard.nth(i).locator('[class="grid content-end"]')
      const discountPriceElement = productElement.locator('.bg-deep-purple-300')
      const computedStyle = await discountPriceElement.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor
      })
      expect(computedStyle).toBe('rgb(222, 229, 253)') // expect purple color
    }
  }

  async miniCartProductRemove(productName: string) {
    await this.page.locator(`//button[@aria-label="Remove ${productName}"]`).click()
  }
}
