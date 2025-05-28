import { expect, Locator, Page } from '@playwright/test'
import checkoutData from '@src/fixtures/indianaUniversity/checkoutValidation.json'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'

export class CheckoutPage {
  private page
  private commonFunctions: CommonUtils
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
    this.stateDropdown = this.page.getByText('State/Province/Region', { exact: true })
    this.postalCodeInput = page.locator('input[name="postalCode"]')
    this.checkOutButton = page.locator('[data-testid="checkoutbutton"]')
    this.warningMessage = page.getByText(checkoutData.nonWesternCharacters.warnMsg)
    this.cookieCloseBtn = page.locator('[id="onetrust-close-btn-container"]')
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

  async validateWesternCharWarningMsg() {
    const warnMsg = await this.warningMessage.count()
    expect(warnMsg).toBe(7)
    for (let i = 0; i < warnMsg; i++) {
      expect(await this.warningMessage.nth(i).textContent()).toBe(
        checkoutData.nonWesternCharacters.warnMsg,
      )
    }
  }
  // to continue shooping after adding product to cart
  async continueShopping() {
    await this.checkOutButton.waitFor({ state: 'visible' })
    await this.continueShoppingButton.click()
  }

  async selectCheckout() {
    await this.commonFunctions.handleCookieBanner()
    await this.checkOutButton.click()
    await this.page.waitForTimeout(2000)
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
      // Address confirmation dialog not found, proceeding with flow
      console.log(error)
    }
    await this.page.waitForSelector('text=Confirm Your Address', { state: 'hidden' })
  }
  // async validateAndSelectShipments() {
  //   const optionLists = this.page.locator('ol.flex.flex-col.gap-4')
  //   await expect(optionLists).toHaveCount(2)

  //   for (let i = 0; i < 2; ++i) {
  //     const list = optionLists.nth(i)

  //     // Pick the label text we want
  //     const label = i === 0 ? 'Express' : 'Standard'

  //     // 1. Assert the button with that label exists
  //     const optionButton = list.getByRole('button', { name: new RegExp(`^${label}\\b`) })
  //     await expect(optionButton).toBeVisible()

  //     // 2. Click the button to select that shipping method
  //     await optionButton.click()

  //     // 3. Verify the radio inside is checked
  //     const radio = optionButton.getByRole('radio')
  //     // await expect(radio).toBeChecked();
  //   }
  // }

  async continueToPayment() {
    await this.continueToPaymentButton.click()
  }
}
