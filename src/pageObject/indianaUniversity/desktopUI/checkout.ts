import { expect, Locator, Page } from '@playwright/test'
import checkoutData from '@src/fixtures/indianaUniversity/checkoutValidation.json'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'

export class CheckoutPage {
  private page: Page
  private commonFunctions: CommonUtils

  // Locators
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly phoneInput: Locator
  readonly address1Input: Locator
  readonly address2Input: Locator
  readonly cityInput: Locator
  readonly countryDropdown: Locator
  readonly stateDropdown: Locator
  readonly postalCodeInput: Locator
  readonly checkOutButton: Locator
  readonly warningMessage: Locator
  readonly cookieCloseBtn: Locator
  readonly continueShippingButton: Locator
  readonly addressConfirmButton: Locator
  readonly cartPanel: Locator
  readonly continueShoppingButton: Locator
  readonly shipmentLoader: Locator
  readonly continueToPaymentButton: Locator
  readonly outOfStockButtonSmall: Locator
  readonly cartButton: Locator
  readonly noOfCartItem: Locator
  readonly miniCart: Locator
  readonly miniCartItems: Locator

  // Cart Summary Locators
  readonly summaryContainer: Locator
  readonly subtotalRow: Locator
  readonly discountRow: Locator
  readonly taxesRow: Locator
  readonly shippingRow: Locator
  readonly totalLabel: Locator
  readonly totalValue: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunctions = new CommonUtils(page)

    this.nameInput = page.locator('input[name="fullName"]')
    this.emailInput = page.locator('input[name="email"]')
    this.phoneInput = page.locator('input[name="phoneNumber"]')
    this.address1Input = page.locator('input[name="addressLine1"]')
    this.address2Input = page.locator('input[name="addressLine2"]')
    this.cityInput = page.locator('input[name="city"]')
    this.countryDropdown = page.locator('[id="react-select-2-input"]')
    this.stateDropdown = page.getByText('State/Province/Region', { exact: true })
    this.postalCodeInput = page.locator('input[name="postalCode"]')
    this.checkOutButton = page.locator('[data-testid="checkoutbutton"]')
    this.warningMessage = page.getByText(checkoutData.nonWesternCharacters.warnMsg)
    this.cookieCloseBtn = page.locator('[id="onetrust-close-btn-container"]')
    this.continueShippingButton = page.getByRole('button', { name: 'Continue to shipping' })
    this.addressConfirmButton = page.getByRole('button', { name: 'Confirm' })
    this.cartPanel = page.locator('div.hidden.lg\\:block.col-span-4')
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' })
    this.shipmentLoader = page.getByRole('img', { name: 'loading spinner' })
    this.continueToPaymentButton = page.getByRole('button', { name: 'Continue to payment' })
    this.outOfStockButtonSmall = page.locator('button').filter({ hasText: 'Small' })
    this.cartButton = page.locator('[data-testid="cartbutton"]')
    this.noOfCartItem = page.locator('header span:has-text("My Cart")')
    this.miniCart = page.locator('[data-testid="minicart"]')
    this.miniCartItems = this.miniCart.locator('div.pt-3.space-y-8.px-8 > div')

    // Cart Summary Locators
    this.summaryContainer = page.locator('div.px-6.sticky.bottom-0.bg-white')
    this.subtotalRow = this.summaryContainer.locator('li:has-text("Subtotal")')
    this.discountRow = this.summaryContainer.locator('span:has-text("Discount code applied")')
    this.taxesRow = this.summaryContainer.locator('li:has-text("Taxes")')
    this.shippingRow = this.summaryContainer.locator('li:has-text("Shipping")')
    // Total row parent div (has both label and value spans)
    const totalRow = this.summaryContainer.locator('div.border-t').filter({ hasText: 'Total' })
    this.totalLabel = totalRow.locator('span').first()
    this.totalValue = totalRow.locator('span').nth(1)
  }

  // Dynamic Locators
  getQuantityInput = (productIndex: number): Locator =>
    this.miniCartItems.nth(productIndex).locator('input[name*="quantity"]')

  getProductDeleteBtn = (productIndex: number): Locator =>
    this.miniCartItems.nth(productIndex).locator('button[aria-label*="Remove"]')

  getIncrementBtn = (productIndex: number): Locator =>
    this.miniCartItems.nth(productIndex).locator('button').nth(1)

  getDecrementBtn = (productIndex: number): Locator =>
    this.miniCartItems.nth(productIndex).locator('button').nth(0)

  async fillYourDetails(
    name: string,
    email: string,
    phone: string,
    address1: string,
    address2: string,
    city: string,
    postalCode: string,
  ) {
    await this.nameInput.fill(name)
    await this.emailInput.fill(email)
    await this.phoneInput.fill(phone)
    await this.address1Input.fill(address1)
    await this.address2Input.fill(address2)
    await this.cityInput.fill(city)
    await this.postalCodeInput.fill(postalCode)
    await this.postalCodeInput.press('Enter')
  }

  async selectCountry(country: string) {
    await this.countryDropdown.click()
    await this.page.getByRole('option', { name: country }).click()
  }

  async selectState(state: string) {
    await this.stateDropdown.click()
    await this.page.getByRole('option', { name: state }).click()
  }

  async validateWesternCharWarningMsg() {
    const count = await this.warningMessage.count()
    expect(count).toBe(7)
    for (let i = 0; i < count; i++) {
      expect(await this.warningMessage.nth(i).textContent()).toBe(
        checkoutData.nonWesternCharacters.warnMsg,
      )
    }
  }

  async continueShopping() {
    await this.checkOutButton.waitFor({ state: 'visible' })
    await this.continueShoppingButton.click()
  }

  async selectCheckout() {
    await this.checkOutButton.waitFor({ state: 'visible' })
    await this.checkOutButton.click()
    await this.page.waitForTimeout(2000)
  }

  async handleCookieBanner() {
    try {
      await this.cookieCloseBtn.waitFor({ state: 'visible', timeout: 5000 })
      await this.cookieCloseBtn.click()
    } catch {
      console.log('Cookie banner not found')
    }
  }

  async continueToShipping() {
    await this.continueShippingButton.click()
    try {
      await this.page.waitForSelector('text=Confirm Your Address', { timeout: 5000 })
      await this.page.waitForTimeout(2000)
      await this.addressConfirmButton.click()
    } catch (error) {
      console.log('No address confirmation needed')
    }
    await this.page.waitForSelector('text=Confirm Your Address', { state: 'hidden' })
  }

  async continueToPayment() {
    await this.continueToPaymentButton.click()
  }

  async getOutOfStockProduct() {
    await this.outOfStockButtonSmall.click()
  }

  async getEmailNotification(email: string) {
    const emailInput = this.page.getByRole('textbox', { name: 'Email' })
    await expect(emailInput).toBeVisible({ timeout: 5000 })
    await emailInput.fill(email)
    await this.page.getByRole('button', { name: 'Submit' }).click()
  }

  // 1. Validate multiple products in the mini cart
  async cartValidation() {
    await this.cartButton.waitFor({ state: 'visible' })
    await this.cartButton.click()

    const miniCart = this.page.locator('[data-testid="minicart"]')
    await expect(miniCart).toBeVisible()

    const productContainers = miniCart.locator('div.pt-3.space-y-8.px-8 > div')
    const count = await productContainers.count()

    console.log(`Total products in cart: ${count}`)

    for (let i = 0; i < count; i++) {
      const product = productContainers.nth(i)

      const name = await product.locator('a span.text-base.font-bold').textContent()
      const price = await product.locator('span.font-bold.text-black').textContent()

      // Safe check for size field
      let sizeText = 'Not specified'
      const sizeLocator = product.locator('p:has(label:text("Size:"))')
      const hasSize = await sizeLocator.isVisible().catch(() => false)
      if (hasSize) {
        const sizeRaw = await sizeLocator.textContent()
        sizeText = sizeRaw?.replace('Size:', '').trim() || 'Not specified'
      }

      const quantity = await product.locator('input[name*="quantity"]').inputValue()

      console.log(`\nProduct #${i + 1}`)
      console.log(`Name: ${name?.trim()}`)
      console.log(`Price: ${price?.trim()}`)
      console.log(`Size: ${sizeText}`)
      console.log(`Quantity: ${quantity}`)
    }
  }

  async adjustQuantity(productIndex: number, targetQuantity: number) {
    const input = this.getQuantityInput(productIndex)
    const currentQuantity = parseInt(await input.inputValue())
    const diff = targetQuantity - currentQuantity
    const button =
      diff > 0 ? this.getIncrementBtn(productIndex) : this.getDecrementBtn(productIndex)

    for (let i = 0; i < Math.abs(diff); i++) {
      await button.click()
      await this.page.waitForTimeout(300)
    }
  }

  async deleteProduct(productIndex: number) {
    await this.getProductDeleteBtn(productIndex).click()
    await this.page.waitForTimeout(500)
  }

  // verify cart summary details is visible
  async verifyCartSummaryDetails() {
    await expect(this.summaryContainer).toBeVisible()

    // Subtotal
    await expect(this.subtotalRow).toContainText('Subtotal')
    const subtotalValue = await this.subtotalRow.locator('span >> nth=1').textContent()
    console.log(`Subtotal: ${subtotalValue?.trim()}`)

    // Optional: Discount
    if (await this.discountRow.isVisible()) {
      const discountCode = await this.discountRow.locator('span.font-bold').textContent()
      const discountAmount = await this.discountRow.locator('span.whitespace-nowrap').textContent()
      console.log(`Discount Code: ${discountCode?.trim()} | Amount: ${discountAmount?.trim()}`)
    } else {
      console.log('Discount not applied')
    }

    // Taxes
    await expect(this.taxesRow).toBeVisible()
    const taxesText = await this.taxesRow.locator('span >> nth=1').textContent()
    console.log(`Taxes: ${taxesText?.trim()}`)

    // Shipping
    await expect(this.shippingRow).toBeVisible()
    const shippingText = await this.shippingRow.locator('span >> nth=1').textContent()
    console.log(`Shipping: ${shippingText?.trim()}`)

    // Total
    await expect(this.totalLabel).toBeVisible()
    await expect(this.totalValue).toBeVisible()
    const totalAmount = await this.totalValue.textContent()
    console.log(`Total: ${totalAmount?.trim()}`)
    console.log('Cart summary validated including optional discount')
  }
}
