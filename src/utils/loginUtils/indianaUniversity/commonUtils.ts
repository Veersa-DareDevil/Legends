import { Locator, Page, expect } from '@playwright/test'

export class CommonUtils {
  private page: Page
  private adminUrl: string
  private storefrontUrl: string
  readonly adminUsername: Locator
  readonly adminPassword: Locator
  readonly adminSignIn: Locator
  readonly storefrontLoginIcon: Locator
  readonly storefrontUsername: Locator
  readonly storefrontLoginButton: Locator
  readonly storefrontPassword: Locator
  readonly cookieCloseBtn: Locator
  readonly loader: Locator

  constructor(page: Page) {
    this.page = page
    this.adminUrl = process.env.IU_ADMIN_URL!
    this.storefrontUrl = process.env.IU_STOREFRONT_URL!
    this.adminUsername = page.getByRole('textbox', { name: 'Username' })
    this.adminPassword = page.getByRole('textbox', { name: 'Password' })
    this.adminSignIn = page.getByRole('button', { name: 'Sign In' })
    this.storefrontLoginIcon = page.getByTestId('loginbutton')
    this.storefrontUsername = page.getByRole('textbox', { name: 'Email' })
    this.storefrontPassword = page.getByRole('textbox', { name: 'Password' })
    this.storefrontLoginButton = page.getByRole('button', { name: 'Sign in' })
    this.cookieCloseBtn = page.locator('[id="onetrust-close-btn-container"]') //it is the unique locator
    this.loader = page.locator('app-loader path')
  }

  /**
   * Navigates to the specified portal URL.
   * @param portalType - 'admin' or 'storefront'
   */
  async goToPortal(portalType: 'admin' | 'storefront'): Promise<void> {
    let urlToNavigate: string
    if (portalType === 'admin') {
      urlToNavigate = this.adminUrl
    } else if (portalType === 'storefront') {
      urlToNavigate = this.storefrontUrl
    } else {
      throw new Error(`Invalid portal type: ${portalType}`)
    }

    console.log(`Navigating to ${urlToNavigate}`)
    await this.page.goto(urlToNavigate)
    await this.page.waitForLoadState('load')
    await this.page.waitForSelector('text=Loading', { state: 'hidden' })
  }

  /**
   * Performs login based on the portal type.
   * @param portalType - 'admin' or 'storefront'
   * @param username - The username for login
   * @param password - The password for login
   */
  async loginToAdmin() {
    const username = process.env.IU_ADMIN_USERNAME
    const password = process.env.IU_ADMIN_PASSWORD
    if (!username || !password) {
      throw new Error('Username and password must be provided for admin login.')
    }

    await this.adminUsername.fill(username)
    await this.adminPassword.fill(password)
    await this.adminSignIn.click()
    await this.page.waitForLoadState('load')
    await this.page.waitForSelector('text=Loading', { state: 'hidden' })
    console.log('Successfully logged in to admin portal.')
  }

  /**
   * Performs login to the storefront portal.
   */
  async loginToStorefront(): Promise<void> {
    const username = process.env.IU_STOREFRONT_USERNAME
    const password = process.env.IU_STOREFRONT_PASSWORD
    if (!username || !password) {
      throw new Error('Username and password must be provided for storefront login.')
    }
    await this.storefrontLoginIcon.click()
    await this.page.waitForLoadState('load')
    await this.handleCookieBanner()
    await this.page.waitForLoadState('load')
    // fill username
    await this.storefrontUsername.fill(username)
    //fill password
    await this.storefrontPassword.fill(password)
    await this.storefrontLoginButton.waitFor({ state: 'visible' })
    await expect(this.storefrontLoginButton).toBeEnabled()

    await this.storefrontLoginButton.click()
    await this.page.waitForLoadState('load')
    //await this.waitForLoaderToDisappear() // future use when re-directing to homePage
  }

  async handleCookieBanner() {
    if (await this.cookieCloseBtn.isVisible()) {
      await this.cookieCloseBtn.click()
    }
  }
}
