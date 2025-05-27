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
  readonly checkOutButton: Locator
  readonly countryDropdown: Locator
  readonly stateDropdown: Locator
  readonly continueShippingButton: Locator
  readonly addressConfirmButton: Locator
  readonly warningMessage: Locator
  readonly cartPanel: Locator
  readonly expandBag: Locator
  readonly closeTaxMsg: Locator

  constructor(page: Page) {
    this.page = page
    this.nameInput = page.locator('input[name="fullName"]')
    this.emailInput = page.locator('input[name="email"]')
    this.phoneInput = page.locator('input[name="phoneNumber"]')
    this.address1Input = page.locator('input[name="addressLine1"]')
    this.address2Input = page.locator('input[name="addressLine2"]')
    this.cityInput = page.locator('input[name="city"]')
    this.postalCodeInput = page.locator('input[name="postalCode"]')
    this.checkOutButton = page.locator('[data-testid="checkoutbutton"]')
    this.warningMessage = page.getByText(checkoutData.nonWesternCharacters.warnMsg)
    this.countryDropdown = page.locator('[id="react-select-2-input"]')
    this.stateDropdown = this.page.locator('[id="react-select-3-input"]')
    this.warningMessage = page.getByText(checkoutData.nonWesternCharacters.warnMsg)
    this.continueShippingButton = page.getByRole('button', { name: 'Continue to shipping' })
    this.addressConfirmButton = page.getByRole('button', { name: 'Confirm' })
    this.cartPanel = page.locator('div.sticky.top-0.z-50.lg\\:hidden') //no unique locator need to chnage in future
    this.expandBag = page.getByRole('paragraph').filter({ hasText: 'Your bag' })
    this.closeTaxMsg = page.getByRole('button', { name: 'close' })
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

  async selectCheckout() {
    await this.checkOutButton.click()
    await this.page.waitForTimeout(2000)
  }

  async selectCountry(country: string) {
    await this.countryDropdown.click()
    const option = this.page.getByRole('option', { name: country })
    await option.click()
  }

  async selectState(state: string) {
    await this.stateDropdown.click({ force: true })
    const option = this.page.getByRole('option', { name: state })
    await option.click()
  }

  async continueToShipping() {
    await this.continueShippingButton.click()
    await this.page.waitForSelector('text=Confirm Your Address', { state: 'visible' })
    await this.page.waitForTimeout(2000)
    await this.addressConfirmButton.click()
    await this.page.waitForSelector('text=Confirm Your Address', { state: 'hidden' })
  }

  async verifyCurrency(currency: string) {
    await this.expandBag.click({ force: true }) // open the bag to see the prices
    await this.closeTaxMsg.click({ timeout: 6000 }).catch(() => {
      // Silently continue if close button is not found
    })
    await this.cartPanel.waitFor({ state: 'visible' })
    await this.page.waitForTimeout(2000) // wait for prices to load dynamically
    const priceSpans = this.cartPanel.locator(`span:has-text("${currency}")`)
    // Assert we have exactly 6 of them
    await expect(priceSpans).toHaveCount(6)
    // And each one starts with the symbol
    const count = await priceSpans.count()
    for (let i = 0; i < count; i++) {
      await expect(priceSpans.nth(i)).toHaveText(new RegExp(`^\\${currency}\\d`)) // expecting the symbol to update dynamically as country changes
    }
    await this.expandBag.click({ force: true }) // close the bag after verification
  }
}
