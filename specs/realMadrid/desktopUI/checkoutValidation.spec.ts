import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils.ts';
import { test } from '@playwright/test';
import { Product } from '@src/pageObject/realMadrid/desktopUI/product.ts';
import { CheckoutPage } from '@src/pageObject/realMadrid/desktopUI/checkout.ts';
import checkoutData from '../../../src/fixtures/realMadrid/checkoutValidation.json' with { type: "json" };

let login: CommonUtils;
let product: Product;
let checkout: CheckoutPage;

test.describe('56825-Checkout Validation', () => {
  test.beforeEach('should validate checkout process', async ({ page }) => {
    login = new CommonUtils(page);
    product = new Product(page);
    checkout = new CheckoutPage(page);
    await login.goToPortal('storefront');
    await login.loginToStorefront();
    await page.waitForTimeout(2000);
  });

  test('Should Validate Checkout Validations', async ({}) => {
    await product.selectNavTraining();
    const productName = await product.selectProduct();
    console.log('Product Name:', productName);
    await product.addToCart(productName as string);
    await checkout.fillYourDetails(
      checkoutData.nonWesternCharacters.userDetails.fullName,
      checkoutData.nonWesternCharacters.userDetails.email,
      checkoutData.nonWesternCharacters.userDetails.phone,
      checkoutData.nonWesternCharacters.userDetails.address1,
      checkoutData.nonWesternCharacters.userDetails.address2,
      checkoutData.nonWesternCharacters.userDetails.city,
      checkoutData.nonWesternCharacters.userDetails.postcode
    );
    // checkout.validateWarningMessage();
  });
});
