import { Locator, Page } from '@playwright/test';

export class CommonUtils {
  private page: Page;
  private adminUrl: string;
  private storefrontUrl: string;
  readonly adminUsername: Locator;
  readonly adminPassword: Locator;
  readonly adminSignIn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminUrl = process.env.IU_ADMIN_URL!;
    this.storefrontUrl = process.env.IU_STOREFRONT_URL!;
    this.adminUsername = page.getByRole('textbox', { name: 'Username' });
    this.adminPassword = page.getByRole('textbox', { name: 'Password' });
    this.adminSignIn = page.getByRole('button', { name: 'Sign In' });
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
    const username = process.env.IU_ADMIN_USERNAME;
    const password = process.env.IU_ADMIN_PASSWORD;
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

  // Add more common utility functions.
}
