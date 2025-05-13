import { Locator, Page } from '@playwright/test';

export class CommonUtils {
  private page: Page;
  private adminUrl: string;
  private storefrontUrl: string;
  readonly adminUsername: Locator;
  readonly adminPassword: Locator;
  readonly adminSignIn: Locator;
  readonly storefrontLoginIcon: Locator;
  readonly storefrontUsername: Locator
  readonly storefrontLoginContinueButton: Locator
  readonly storefrontPassword: Locator
  readonly storefrontLoginButton: Locator
  readonly loader: Locator
  readonly profileIcon: Locator

  constructor(page: Page) {
    this.page = page;
    this.adminUrl = process.env.RM_ADMIN_URL!;
    this.storefrontUrl = process.env.RM_STOREFRONT_URL!;
    this.adminUsername = page.getByRole('textbox', { name: 'Username' });
    this.adminPassword = page.getByRole('textbox', { name: 'Password' });
    this.adminSignIn = page.getByRole('button', { name: 'Sign In' });
    this.storefrontLoginIcon = page.getByTestId('loginbutton');
    this.storefrontUsername = page.getByRole('textbox', { name: 'Email' });
    this.storefrontPassword = page.locator('[id="rm-password-register"]');
    this.storefrontLoginContinueButton = page.locator('[id="rm-register-email-btn"]');
    this.storefrontLoginButton = page.locator('[id="rm-password-register-btn"]');
    this.loader = page.locator('app-loader path');
    this.profileIcon = page.locator('[id=":r2:"]');
  }

  /**
   * Navigates to the specified portal URL.
   * @param portalType - 'admin' or 'storefront'
   */
  async goToPortal(portalType: 'admin' | 'storefront'): Promise<void> {
    let urlToNavigate: string;
    if (portalType === 'admin') {
      urlToNavigate = this.adminUrl;
    } else if (portalType === 'storefront') {
      urlToNavigate = this.storefrontUrl;
    } else {
      throw new Error(`Invalid portal type: ${portalType}`);
    }

    console.log(`Navigating to ${urlToNavigate}`);
    await this.page.goto(urlToNavigate);
    await this.page.waitForLoadState('load');
    await this.page.waitForSelector('text=Loading', { state: 'hidden' });

  }
  /**
   * Performs login based on the portal type.
   * @param portalType - 'admin' or 'storefront'
   * @param username - The username for login
   * @param password - The password for login
   */
  async loginToAdmin() {
    const username = process.env.RM_ADMIN_USERNAME;
    const password = process.env.RM_ADMIN_PASSWORD;
    if (!username || !password) {
      throw new Error('Username and password must be provided for admin login.');
    }

    await this.adminUsername.fill(username);
    await this.adminPassword.fill(password);
    await this.adminSignIn.click();
    await this.page.waitForLoadState('load');
    await this.page.waitForSelector('text=Loading', { state: 'hidden' });
    console.log('Successfully logged in to admin portal.');
  }

  /**
   * Performs login to the storefront portal.
   */
  async loginToStorefront(): Promise<void> {
    const username = process.env.RM_STOREFRONT_USERNAME
    const password = process.env.RM_STOREFRONT_PASSWORD
    if (!username || !password) {
      throw new Error('Username and password must be provided for storefront login.')
    }
    await this.storefrontLoginIcon.click()
    await this.page.waitForLoadState('load')
    await this.page.getByRole('button', { name: 'EN', exact: true }).click()
    await this.page.waitForLoadState('load')
    await this.storefrontUsername.fill(username)
    //reject all cookies
    const cookieBanner = this.page.locator('role=region[name="Cookie banner"]')
    await cookieBanner.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { })
    if (await cookieBanner.isVisible()) {
      const rejectAllButton = this.page.locator('[id="onetrust-reject-all-handler"]')
      await rejectAllButton.click();
    }

    await this.storefrontLoginContinueButton.click()
    await this.page.waitForLoadState('load')
    await this.waitForLoaderToDisappear()
    //fill password
    await this.storefrontPassword.fill(password);
    await this.storefrontLoginButton.click()
    await this.page.waitForLoadState('load')
    await this.waitForLoaderToDisappear()
  }

  async waitForLoaderToDisappear() {
    await this.loader.waitFor({ state: 'visible' })
    await this.loader.waitFor({ state: 'hidden' })
  }

  // Add more common utility functions.
  async selectEnglishLanguage() {
    const languageButton = this.page.locator('[id=":R1hil26H2:"]')
    await languageButton.click()
    await this.page.waitForLoadState('load')
    const englishLanguageOption = this.page.getByRole('button', { name: 'UK Flag English' })
    await englishLanguageOption.click()
    await languageButton.click()
  }
}
