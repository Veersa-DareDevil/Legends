import { expect, Locator, Page } from '@playwright/test'
import checkoutData from '@src/fixtures/realMadrid/checkoutValidation.json'

export class CheckoutPage {
  private page
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly phoneInput: Locator
  readonly address1Input: Locator
  readonly address2Input: Locator
  readonly cityInput: Locator
  readonly postalCodeInput: Locator
  readonly checkoutButton: Locator
  readonly warningMessage: Locator
  readonly countryDropdown: Locator
  readonly stateDropdown: Locator
  readonly continueShippingButton: Locator
  readonly addressConfirmButton: Locator
  readonly cartPanel: Locator
  readonly continueShoppingButton: Locator
  readonly shipmentLoader: Locator
  readonly continueToPaymentButton: Locator

  constructor(page: Page) {
    this.page = page
    this.nameInput = page.locator('input[name="fullName"]')
    this.emailInput = page.locator('input[name="email"]')
    this.phoneInput = page.locator('input[name="phoneNumber"]')
    this.address1Input = page.locator('input[name="addressLine1"]')
    this.address2Input = page.locator('input[name="addressLine2"]')
    this.cityInput = page.locator('input[name="city"]')
    this.postalCodeInput = page.locator('input[name="postalCode"]')
    this.checkoutButton = page.locator('[data-testid="checkoutbutton"]')
    this.countryDropdown = page.locator('[id="react-select-2-input"]')
    this.stateDropdown = this.page.locator('[id="react-select-3-input"]')
    this.warningMessage = page.getByText(checkoutData.nonWesternCharacters.warnMsg)
    this.continueShippingButton = page.getByRole('button', { name: 'Continue to shipping' })
    this.addressConfirmButton = page.getByRole('button', { name: 'Confirm' })
    this.cartPanel = page.locator('div.hidden.lg\\:block.col-span-4') //no unique locator need to chnage in future
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' })
    this.shipmentLoader = page.getByRole('img', { name: 'loading spinner' })
    this.continueToPaymentButton = page.getByRole('button', { name: 'Continue to payment' })
  }
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

  async validateWesternCharWarningMsg() {
    const warnMsg = await this.warningMessage.count()
    expect(warnMsg).toBe(7)
    for (let i = 0; i < warnMsg; i++) {
      expect(await this.warningMessage.nth(i).textContent()).toBe(
        checkoutData.nonWesternCharacters.warnMsg,
      )
    }
  }

  async selectCountry(country: string) {
    await this.countryDropdown.click()
    const option = this.page.getByRole('option', { name: country })
    await option.click()
  }

  async selectState(state: string) {
    await this.stateDropdown.click()
    const option = this.page.getByRole('option', { name: state })
    await option.click()
  }

  // to continue shooping after adding product to cart
  async continueShopping() {
    await this.checkoutButton.waitFor({ state: 'visible' })
    await this.continueShoppingButton.click()
  }

  // to go checkout page after adding product to cart
  async selectCheckout() {
    await this.checkoutButton.click()
    await this.page.waitForTimeout(2000)
  }

  // to wait for shipment loader to be visible and hidden
  async waitForShipmentLoader() {
    await this.shipmentLoader.waitFor({ state: 'visible' })
    await this.shipmentLoader.waitFor({ state: 'hidden' })
  }

  async continueToShipping() {
    await this.continueShippingButton.click()
    try {
      await this.page.waitForSelector('text=Confirm Your Address', {
        state: 'visible',
        timeout: 5000,
      })
      await this.page.waitForTimeout(2000)
      await this.addressConfirmButton.click()
    } catch (error) {
      console.log(error)
      // Address confirmation dialog not found, proceeding with flow
    }
    await this.page.waitForSelector('text=Confirm Your Address', { state: 'hidden' })
  }

  async verifyCurrency(currency: string) {
    // Find every visible price span with the currency symbol within the cart panel
    const priceSpans = this.cartPanel.locator(`span:has-text("${currency}")`)
    await this.page.waitForTimeout(3000)
    console.log(priceSpans)
    // 3) Assert we have exactly 6 of them
    await expect(priceSpans).toHaveCount(6)
    // 4) And each one starts with the symbol
    const count = await priceSpans.count()
    for (let i = 0; i < count; i++) {
      await expect(priceSpans.nth(i)).toHaveText(new RegExp(`\\${currency}\\d`)); // expecting the symbol to update dynamically as country changes
    }
  }

  async validateAndSelectShipments() {
    const optionLists = this.page.locator('ol.flex.flex-col.gap-4')
    await expect(optionLists).toHaveCount(2)

    for (let i = 0; i < 2; ++i) {
      const list = optionLists.nth(i)

      // Pick the label text we want
      const label = i === 0 ? 'Express' : 'Standard'

      // 1. Assert the button with that label exists
      const optionButton = list.getByRole('button', { name: new RegExp(`^${label}\\b`) })
      await expect(optionButton).toBeVisible()

      // 2. Click the button to select that shipping method
      await optionButton.click()

      // 3. Verify the radio inside is checked
      // const radio = optionButton.getByRole('radio')
      // await expect(radio).toBeChecked();
    }
  }

  // to click on continue to payment section
  async continueToPayment() {
    await this.continueToPaymentButton.waitFor({ state: 'visible' })
    await this.continueToPaymentButton.click()
  }
}
