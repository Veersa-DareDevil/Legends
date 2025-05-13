import { CommonUtils } from "@src/utils/loginUtils/realMadrid/commonUtils";
import { test} from "@playwright/test";

let login: CommonUtils;
test.describe("56825-Checkout Validation", () => {
  test.beforeEach("should validate checkout process", async ({ page }) => {
    login = new CommonUtils(page);
    await login.goToPortal("storefront");
    // Perform checkout validation steps
  });

  test("Should Validate Checkout Validations", async ({ page }) => {
    await login.loginToStorefront();
    await page.waitForTimeout(2000);
    // Perform checkout validation steps
  });

});