import { Locator, Page } from '@playwright/test'

export class DesktopNavigation {
  private page: Page
  readonly langButton: Locator
  readonly engLangOption: Locator
  readonly getUsername: Locator

  constructor(page: Page) {
    this.page = page
    this.langButton = this.page.getByText('EN | USD') //no unique locator
    this.engLangOption = this.page.getByRole('button', { name: 'UK Flag English' })
    this.getUsername = this.page.locator('div.bg-deep-purple-700 p:first-of-type')
  }

  // Add more common utility functions.
  async selectEnglishLanguage() {
    await this.page.waitForTimeout(2000)
    await this.langButton.click()
    await this.page.waitForLoadState('load')
    await this.engLangOption.click()
    await this.langButton.click()
    await this.page.waitForTimeout(2000)
  }
}
