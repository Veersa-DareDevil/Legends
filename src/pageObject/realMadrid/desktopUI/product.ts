import { Page, Locator, expect } from '@playwright/test';

export class Product {
  readonly page;
  readonly productCard: Locator;
  readonly navTaining: Locator
  readonly rejectAllCookiesButton: Locator;
  readonly productCardLink: Locator;
  readonly addToCartButton: Locator;
  readonly checkOutButton: Locator;
  readonly phoneNumberInput: Locator;
  readonly warningMessage: Locator;
  readonly shipAddress: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navTaining = page.getByTestId('navigation-bar').getByRole('link', { name: 'Training' })
    this.productCard = page.locator('[data-testid="productcard"]');
    this.productCardLink = page.locator('[data-testid="productcardlink"]');
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]');
    this.checkOutButton = page.locator('[data-testid="checkoutbutton"]');
    this.rejectAllCookiesButton = page.locator('#onetrust-reject-all-handler')   //it is the unique locator
    this.phoneNumberInput = page.locator('[name="phoneNumber"]');
    this.warningMessage = page.getByText('Please only use Western characters.');
    this.shipAddress = page.getByText('Shipping Address');
  }

  async selectNavTraining() {
    await Promise.all([
      this.navTaining.click(),
      this.page.waitForSelector('#category-description', { state: 'visible' }),
    ]);
  }
  async selectProduct() {
    await this.productCard.first().hover();
    const productName = await this.productCard.first().locator('[class="grid content-end"]').textContent();
    console.log('Product Name:', productName);
    await this.productCardLink.first().click();
    await this.page.waitForTimeout(4000);
    return productName;
  }

  async addToCart(productName: string) {
    await expect(this.page.getByText(productName)).toBeVisible(); //validate the product name on product page
    await this.page.waitForSelector('#onetrust-reject-all-handler', { state: 'visible' });
    await this.rejectAllCookiesButton.click();
    await this.addToCartButton.click();
    await this.page.waitForTimeout(2000);
    await expect(this.page.getByText(productName)).toBeVisible(); //validate the product name on cart page
    await this.checkOutButton.click();
    await this.page.waitForTimeout(2000);
  }
}
