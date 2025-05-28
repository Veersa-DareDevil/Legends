import { Page, Locator, expect } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { DesktopNavigation } from './navigation'
import productData from '@src/fixtures/realMadrid/product.json'

export class Product {
  readonly page
  private navBar: DesktopNavigation
  private commonFunction: CommonUtils
  readonly productCard: Locator
  readonly rejectAllCookiesButton: Locator
  readonly productCardLink: Locator
  readonly addToCartButton: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunction = new CommonUtils(page)
    this.navBar = new DesktopNavigation(page)
    this.productCard = page.locator('[data-testid="productcard"]')
    this.productCardLink = page.locator('[data-testid="productcardlink"]')
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]')
    this.rejectAllCookiesButton = page.locator('#onetrust-reject-all-handler') //it is the unique locator
  }

  async selectNavTraining() {
    await Promise.all([
      this.navBar.navTraining.click(),
      this.page.waitForSelector('#category-description', { state: 'visible' }),
    ])
  }
  async selectNavFashion() {
    await Promise.all([
      this.navBar.navFashion.click(),
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
    return productName as string
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

  async validateMadridistaDiscountedPrice() {
    const porductCount = await this.productCard.count()

    for (let i = 0; i < porductCount; i++) {

      // 1. to validate the product card content and the discounted price 
      const productPrice = await this.getProductCardContent()
      const prices = productPrice.match(/\$(\d+\.\d+)/g);
      if (prices && prices.length >= 2) {
        console.log('Prices:', prices)
        const discountedPrice = parseFloat(prices[0].substring(1));
        const originalPrice = parseFloat(prices[1].substring(1));
        expect(discountedPrice).toBeLessThan(originalPrice);                 // expect discounted price to be less than original price
      }
      // 2. to vaildate the background color of the discount price tag
      const productElement = this.productCard.nth(i).locator('[class="grid content-end"]');
      const discountPriceElement = productElement.locator('.bg-deep-purple-300');
      const computedStyle = await discountPriceElement.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      expect(computedStyle).toBe(productData.madristaUser.newPriceTagColor); // Deep purple color
      
    }

  }
}
