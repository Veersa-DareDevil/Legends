import { Page, Locator } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'

export class MobileNavigation {
  readonly page: Page
  readonly commonFunctions: CommonUtils
  readonly menuButton: Locator
  readonly navAdidas: Locator
  readonly navAthletics: Locator
  readonly navApparel: Locator
  readonly navSale: Locator
  //readonly submenuOption: Locator // future use
  readonly loader: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunctions = new CommonUtils(page)
    this.menuButton = page.locator('[data-testid="navigation-bar"] button', {
      hasText: 'Open Menu',
    })
    this.navAdidas = page.getByRole('button', { name: 'Adidas' })
    this.navApparel = page.getByRole('button', { name: 'Apparel' })
    this.navAthletics = page.getByRole('button', { name: 'Athletics' })
    this.navSale = page.getByRole('button', { name: 'Sale' })
    //this.submenuOption = this.page.getByRole('link', { name: /Mens|Fashion/i }) // future use
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
    await this.commonFunctions.handleCookieBanner()
    // Array of navigation locators
    const navOptions = [this.navAdidas, this.navAthletics, this.navApparel, this.navSale]
    // Check each nav option is visible and clickable
    for (const nav of navOptions) {
      await nav.waitFor({ state: 'visible' })
      await this.page.waitForTimeout(200) // Wait for any animations to complete
      await nav.click()
      // Reopen the menu for the next iteration
      await this.openMenu()
    }
  }
}
