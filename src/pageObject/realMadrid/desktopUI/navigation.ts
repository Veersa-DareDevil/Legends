import { Locator, Page } from '@playwright/test'

export class DesktopNavigation {
  private page: Page
  readonly langButton: Locator
  readonly engLangOption: Locator
  readonly getUsername: Locator
  readonly navTraining: Locator
  readonly navKits: Locator
  readonly navShopByPlayer: Locator
  readonly navFashion: Locator
  readonly navAccessories: Locator
  readonly loader: Locator

  constructor(page: Page) {
    this.page = page
    this.langButton = this.page.getByText('EN | USD') //no unique locator
    this.engLangOption = this.page.getByRole('button', { name: 'UK Flag English' })
    this.getUsername = this.page.locator('div.bg-deep-purple-700 p:first-of-type')
    this.navFashion = page.getByTestId('navigation-bar').getByRole('link', { name: 'Fashion' })
    this.navKits = page.getByTestId('navigation-bar').getByRole('link', { name: 'Kits' })
    this.navTraining = page.getByTestId('navigation-bar').getByRole('link', { name: 'Training' })
    this.navShopByPlayer = page
      .getByTestId('navigation-bar')
      .getByRole('link', { name: 'Shop By Player' })
    this.navAccessories = page
      .getByTestId('navigation-bar')
      .getByRole('link', { name: 'Accessories' })
    this.loader = page.getByRole('img', { name: 'loading spinner' })
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

  async waitForLoaderToDisappear() {
    try {
      await this.loader.waitFor({ state: 'visible' })
    } catch (error) {
      console.log('Loader not visible, continuing...')
    }
    await this.loader.waitFor({ state: 'hidden' })
  }
}
