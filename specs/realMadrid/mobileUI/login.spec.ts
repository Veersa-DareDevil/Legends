import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils';
import { test, expect } from '@playwright/test';
import { Navigation } from '@src/pageObject/realMadrid/mobileUI/navigation';

test.describe('303887 & 745140 -Login to Storefront site of Real Madrid', () => {
  let login: CommonUtils;
  let navigation: Navigation;

  test.beforeEach('Validate login process', async ({ page }) => {
    login = new CommonUtils(page);
    await login.goToPortal('storefront');
  });

  test('Should Login to Storefront', async ({ page }) => {
    navigation = new Navigation(page);
    await navigation.openMenu();

    await login.selectEnglishLanguage();
    await page.waitForTimeout(2000);
    const homePageTitle = await page.title();
    await login.loginToStorefront();

    await page.waitForTimeout(2000);
    await login.selectEnglishLanguage();
    await page.waitForTimeout(2000);

    const returnPageTitle = await page.title();
    expect(returnPageTitle).toBe(homePageTitle); // Validate that the page title is the same as the homepage title after login to check user is logged in and redirected to the homepage

    //Verify that you can login and the profile icon is replaced with a circle containing the user initials
    await login.profileIcon.click();
    await page.waitForLoadState('load');
    const username = await page.locator('div.bg-deep-purple-700 p:first-of-type').textContent();

    // Split into words using space as delimiter
    const words = (username ?? '').split(' ');

    // Take the first letter of the first two word-groups
    const usernameInitials = words
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
    console.log(usernameInitials); // Output: "KL"
    expect(usernameInitials).toBe(await login.profileIcon.textContent());
  });
});
