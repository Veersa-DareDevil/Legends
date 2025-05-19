import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils';
import { test } from '@playwright/test';
import { Product } from '@src/pageObject/realMadrid/desktopUI/product';

let login: CommonUtils;
let product: Product;

test.describe('56825-Checkout Validation', () => {
  test.beforeEach('should validate checkout process', async ({ page }) => {
    login = new CommonUtils(page);
    await login.goToPortal('storefront');
    await login.loginToStorefront();
    await page.waitForTimeout(2000);
  });

  test('Should Validate Checkout Validations', async ({ page }) => {
    product = new Product(page);
    await product.selectNavTraining();
    await product.selectProduct();
  });
});
