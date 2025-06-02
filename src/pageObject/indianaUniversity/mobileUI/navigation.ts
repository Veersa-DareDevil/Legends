import { Page, Locator } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'

export class MobileNavigation {
  readonly page: Page
  readonly commonFunctions: CommonUtils
  readonly menuButton: Locator
  readonly getUsername: Locator
  readonly navTraining: Locator
  readonly navAddidas: Locator
  readonly navAthletics: Locator
  readonly navApparel: Locator
  readonly sale: Locator
  readonly submenuOption: Locator
  readonly loader: Locator

  constructor(page: Page) {
    this.page = page
    this.commonFunctions = new CommonUtils(page)
    this.menuButton = page.locator('[data-testid="navigation-bar"] button', {
      hasText: 'Open Menu',
    })
    this.getUsername = this.page.locator('div.bg-deep-purple-700 p:first-of-type')
    this.navAddidas = page.getByTestId('navigation-bar').getByRole('button', { name: 'Addidas' })
    this.navAthletics = page.getByTestId('navigation-bar').getByRole('button', { name: 'Atheletics' })
    this.navApparel = page.getByTestId('navigation-bar').getByRole('button', { name: 'Apparel' })
    this.sale = page.getByTestId('navigation-bar').getByRole('button', { name: 'Sale' })

    this.navTraining = page.getByTestId('navigation-bar').getByRole('button', { name: 'Training' })
    //this.navShopByPlayer = page
      .getByTestId('navigation-bar')
      .getByRole('button', { name: 'Shop By Player' })
    //this.navAccessories = page
      .getByTestId('navigation-bar')
      .getByRole('button', { name: 'Accessories' })
    this.submenuOption = this.page.getByRole('link', { name: /Mens|Fashion/i })
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
    //await this.commonFunctions.rejectAllCookies()
    // Array of navigation locators
    const navOptions = [
      this.navTraining,
      this.navAddidas,
      this.navAthletics,
      this.navApparel,
      this.sale
    ]
    // Check each nav option is visible and clickable
    for (const nav of navOptions) {
      await nav.waitFor({ state: 'visible' })
      await this.page.waitForTimeout(200) // Wait for any animations to complete
      await nav.click()
      // Wait for the submenu/dialog to appear and click on 'Mens' or 'Fashion'
      await this.submenuOption.first().waitFor({ state: 'visible' })
      await this.page.waitForTimeout(200) // Wait for any animations to complete
      await this.submenuOption.first().click()
      // Wait for the page to load and check for 404
      await this.page.waitForLoadState('networkidle')
      const isError = await this.page.locator('text=404').isVisible()
      if (isError) {
        throw new Error('404 page displayed after navigation')
      }
      // Reopen the menu for the next iteration
      await this.openMenu()
    }
  }


  async waitForLoaderToDisappear() {
    try {
      await this.loader.waitFor({ state: 'visible' })
    } catch (error) {
      console.log('Loader not visible, continuing...', error)
    }
    await this.loader.waitFor({ state: 'hidden' })
  }
}
