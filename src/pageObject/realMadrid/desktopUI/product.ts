import { Page, Locator } from '@playwright/test';

export class Product {
  readonly page;
  readonly productCard: Locator;
  readonly productCardLink: Locator;
  readonly addToCartButton: Locator;
  readonly checkOutButton: Locator;
  readonly phoneNumberInput: Locator;
  readonly warningMessage: Locator;
  readonly shipAddress: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCard = page.locator('[data-testid="productcard"]');
    this.productCardLink = page.locator('[data-testid="productcardlink"]');
    this.addToCartButton = page.locator('[data-testid="addtocartbutton"]');
    this.checkOutButton = page.locator('[data-testid="checkoutbutton"]');
    this.phoneNumberInput = page.locator('[name="phoneNumber"]');
    this.warningMessage = page.getByText('Please only use Western characters.');
    this.shipAddress = page.getByText('Shipping Address');
  }

  async selectProduct() {
    await this.productCard.hover();
    await this.productCardLink.click();
    await this.page.waitForTimeout(2000);
  }
}
