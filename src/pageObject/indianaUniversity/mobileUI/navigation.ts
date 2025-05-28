import { Page, Locator } from '@playwright/test'

export class MobileNavigation {
  readonly page: Page
  readonly menuButton: Locator
  readonly getUsername: Locator

  constructor(page: Page) {
    this.page = page
    this.menuButton = page.locator('[data-testid="navigation-bar"] button', {
      hasText: 'Open Menu',
    })
    this.getUsername = this.page.locator('div.bg-deep-purple-700 p:first-of-type')
  }

  async selectMenu() {
    await this.page.waitForTimeout(2000)
    await this.menuButton.click()
  }
  async closeMenu() {
    await this.page.waitForTimeout(2000)
    await this.menuButton.click()
  }

  // future use
  // async selectEnglishLanguage() {
  //   const languageButton = await this.page
  //     .locator('[data-testid="navigation-bar"]')
  //     .getByRole('button', { name: 'EN | USD' })
  //   await languageButton.click()
  //   await this.page.waitForLoadState('networkidle')
  //   await this.page.waitForTimeout(2000)
  //   const englishLanguageOption = this.page.getByRole('button', { name: 'UK Flag English' })
  //   await englishLanguageOption.click()
  // }
}
