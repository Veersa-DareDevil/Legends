import { Page, Locator } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'

export class MobileNavigation {
  readonly page: Page
  readonly commonFunctions: CommonUtils
  readonly menuButton: Locator
  readonly getUsername: Locator
  readonly navTraining: Locator
  readonly navKits: Locator
  readonly navShopByPlayer: Locator
  readonly navFashion: Locator
  readonly navAccessories: Locator
  readonly submenuOption: Locator
  readonly langButton: Locator
  readonly langEnglishOption: Locator
  readonly loader: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunctions = new CommonUtils(page)
    this.menuButton = page.locator('[data-testid="navigation-bar"] button', {
      hasText: 'Open Menu',
    })
    this.getUsername = this.page.locator('div.bg-deep-purple-700 p:first-of-type')
    this.navFashion = page.getByTestId('navigation-bar').getByRole('button', { name: 'Fashion' })
    this.navKits = page.getByTestId('navigation-bar').getByRole('button', { name: 'Kits' })
    this.navTraining = page.getByTestId('navigation-bar').getByRole('button', { name: 'Training' })
    this.navShopByPlayer = page
      .getByTestId('navigation-bar')
      .getByRole('button', { name: 'Shop By Player' })
    this.navAccessories = page
      .getByTestId('navigation-bar')
      .getByRole('button', { name: 'Accessories' })
    this.submenuOption = this.page.getByRole('link', { name: /Mens|Fashion/i })
    this.langButton = this.page
      .locator('[data-testid="navigation-bar"]')
      .getByRole('button', { name: 'EN | USD' })
    this.langEnglishOption = this.page.getByRole('button', { name: 'UK Flag English' })
    this.loader = page.getByRole('img', { name: 'loading spinner' })
  }

  async openMenu() {
    await this.page.waitForTimeout(200)
    await this.menuButton.click()
  }
  async closeMenu() {
    await this.page.waitForTimeout(200)
    await this.menuButton.click()
  }

  async verifyAllNavOptions() {
    // Ensure the navigation menu is visible
    await this.page.waitForSelector('[data-testid="navigation-bar"]', { state: 'visible' })
    await this.commonFunctions.rejectAllCookies()
    // Array of navigation locators
    const navOptions = [
      this.navTraining,
      this.navKits,
      this.navShopByPlayer,
      this.navFashion,
      this.navAccessories,
    ]
    // Check each nav option is visible and clickable
    for (const nav of navOptions) {
      await nav.waitFor({ state: 'visible' })
      await nav.click()
      // Wait for the submenu/dialog to appear and click on 'Mens' or 'Fashion'
      await this.submenuOption.first().waitFor({ state: 'visible' })
      await this.submenuOption.first().click()
      // Wait for the page to load and check for 404
      await this.page.waitForLoadState('networkidle')
      const isError = await this.page.locator('text=404').isVisible()
      if (isError) {
        throw new Error('404 page displayed after navigation')
      }
      // Reopen the menu for the next iteration
      await this.closeMenu()
      await this.openMenu()
    }
  }

  async selectEnglishLanguage() {
    await this.langButton.click()
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForTimeout(1000)
    await this.langEnglishOption.click()
  }

  async waitForLoaderToDisappear() {
    try {
      await this.loader.waitFor({ state: 'visible' })
    } catch (error) {
      console.log('Loader not visible, continuing...',error)
    }
    await this.loader.waitFor({ state: 'hidden' })
  }
}
