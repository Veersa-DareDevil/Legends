import { Page, Locator } from '@playwright/test';

export class Product {
  readonly page;
  readonly productCard: Locator;
  readonly navTaining:Locator
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
    this.phoneNumberInput = page.locator('[name="phoneNumber"]');
    this.warningMessage = page.getByText('Please only use Western characters.');
    this.shipAddress = page.getByText('Shipping Address');
  }

  async selectNavTraining(){
    await Promise.all([
      this.navTaining.click(),
      this.page.waitForSelector('#category-description', { state: 'visible' }),
    ]);
  }

  async selectProduct() {
    await this.productCard.first().hover();
    const productName = await this.productCardLink.
    await this.productCardLink.first().click();
    await this.page.waitForTimeout();
  }

    async addToCart() {
        await this.addToCartButton.click();
        await this.page.waitForTimeout(2000);
        await this.checkOutButton.click();
        await this.page.waitForTimeout(2000);
    }
}
