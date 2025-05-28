import { Page, Locator } from 'playwright'

export class Payment {
  readonly page: Page
  readonly cardNumberInput: Locator
  readonly expiryDateInput: Locator
  readonly cvcInput: Locator
  readonly nameOnAccountInput: Locator
  readonly paymentButton: Locator

  constructor(page: Page) {
    this.page = page
    this.cardNumberInput = page
      .frameLocator('iframe[title="Secure card number input frame"]')
      .locator('input[name="cardnumber"]')

    this.expiryDateInput = page
      .frameLocator('iframe[title="Secure expiration date input frame"]')
      .locator('input[name="exp-date"]')

    this.cvcInput = page
      .frameLocator('iframe[title="Secure CVC input frame"]')
      .locator('input[name="cvc"]')
    this.nameOnAccountInput = page.locator('input[name="nameOnAccount"]')
    this.paymentButton = page.getByTestId('paybutton')
  }

  async fillPaymentDetails(nameOnAccount: string, cardNumber: string, expiry: string, cvc: string) {
    await this.nameOnAccountInput.fill(nameOnAccount)
    await this.cardNumberInput.fill(cardNumber)
    await this.expiryDateInput.fill(expiry)
    await this.cvcInput.fill(cvc)
  }

  async submitPayment() {
    await this.paymentButton.click()
    await this.page.waitForLoadState('domcontentloaded')
    await this.page.waitForTimeout(5000) // wait for 2 seconds to ensure the payment is processed
  }
}
