import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { DesktopNavigation } from '@src/pageObject/realMadrid/desktopUI/navigation'
import { test, expect } from '@playwright/test'

test.describe('303887 & 745140 -Login to Storefront site of Real Madrid', () => {
  let commonFunction: CommonUtils
  let navigation: DesktopNavigation

  test.beforeEach('Validate login process', async ({ page }) => {
    commonFunction = new CommonUtils(page)
    navigation = new DesktopNavigation(page)
    await commonFunction.goToPortal('storefront')
  })

  test('Should Login to Storefront', async ({ page }) => {
    await navigation.selectEnglishLanguage()
    const homePageTitle = await page.title()

    await commonFunction.loginToStorefront()
    await navigation.selectEnglishLanguage()

    const returnPageTitle = await page.title()
    expect(returnPageTitle).toBe(homePageTitle) // Validate that the page title is the same as the homepage title after login to check user is logged in and redirected to the homepage

    //Verify that you can login and the profile icon is replaced with a circle containing the user initials
    const getUsernameInitials = await commonFunction.profileIcon.textContent()
    await commonFunction.profileIcon.click()
    await page.waitForLoadState('load')
    const username = await navigation.getUsername.textContent()
    const usernameInitials = await commonFunction.getInitials(username ?? '')
    expect(usernameInitials).toBe(getUsernameInitials)
  })
})
