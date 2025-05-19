import { Page, Locator } from '@playwright/test';

export class Navigation {
  readonly page: Page;
  //correct locators
  readonly menuButton: Locator;

  //need to update the locators
  readonly fashionIcon: Locator;
  readonly getTrackSuitLink: Locator;
  readonly selectProduct: Locator;
  readonly addToCartButton: Locator;
  readonly checkOutButton: Locator;
  readonly phoneNumberInput: Locator;
  readonly rejectAllCookiesButton: Locator;
  readonly warningMessage: Locator;
  readonly shipAddress: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('[data-testid="navigation-bar"] button', { hasText: 'Open Menu' });

    //ned to update the locators
    this.fashionIcon = page.locator('[data-testid="category"] button a').getByText('Fashion');
    this.getTrackSuitLink = page
      .locator('[data-testid="subcategory"]')
      .getByRole('button', { name: 'Tracksuits' })
      .first();
    this.selectProduct = page.locator('[data-testid="productcardlink"]').first();
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]');
    this.checkOutButton = page.locator('[data-testid="checkoutbutton"]');
    this.phoneNumberInput = page.locator('[name="phoneNumber"]');
    this.rejectAllCookiesButton = page.getByRole('button', { name: 'Rechazarlas todas' });
    this.warningMessage = page.getByText('Please only use Western characters.');
    this.shipAddress = page.getByText('Shipping Address');
  }

  async openMenu() {
    await this.menuButton.click();
    await this.page.waitForTimeout(2000);
  }

  async handleCookiePopUp() {
    await this.rejectAllCookiesButton.click();
  }

  async selectAnyProduct() {
    await this.fashionIcon.hover();
    await this.getTrackSuitLink.click();
    await this.page.waitForTimeout(2000);
    await this.selectProduct.click();
    await this.page.waitForTimeout(2000);
  }
  async addToCart() {
    await this.addToCartButton.click();
    await this.page.waitForTimeout(2000);
    await this.checkOutButton.click();
    await this.page.waitForTimeout(2000);
  }
}
