import { expect, Locator, Page } from '@playwright/test'
import checkoutData from '@src/fixtures/indianaUniversity/checkoutValidation.json'

export class CheckoutPage {
  private page
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly phoneInput: Locator
  readonly address1Input: Locator
  readonly address2Input: Locator
  readonly cityInput: Locator
  readonly postalCodeInput: Locator
  //readonly checkOutButton: Locator

  readonly warningMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.nameInput = page.locator('input[name="fullName"]')
    this.emailInput = page.locator('input[name="email"]')
    this.phoneInput = page.locator('input[name="phoneNumber"]')
    this.address1Input = page.locator('input[name="addressLine1"]')
    this.address2Input = page.locator('input[name="addressLine2"]')
    this.cityInput = page.locator('input[name="city"]')
    this.postalCodeInput = page.locator('input[name="postalCode"]')
    //this.checkOutButton = page.locator('[data-testid="checkoutbutton"]')
    this.warningMessage = page.getByText(checkoutData.nonWesternCharacters.warnMsg)
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
  async handleCookieBanner() {
    const cookieCloseBtn = this.page.locator('.onetrust-close-btn-handler.banner-close-button')
    if (await cookieCloseBtn.isVisible()) {
      await cookieCloseBtn.click()
    }
  }

  async selectCheckout() {
    //await this.checkOutButton.click()
    await this.handleCookieBanner()
    await this.page.getByTestId('checkoutbutton').click()
    await this.page.waitForTimeout(2000)
  }
}
