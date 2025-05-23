import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { test, expect } from '@playwright/test'
import { MobileNavigation } from '@src/pageObject/realMadrid/mobileUI/navigation'

test.describe('303887 & 745140 -Login to Storefront site of Real Madrid', () => {
  let commonFunction: CommonUtils
  let navigation: MobileNavigation

  test.beforeEach('Validate login process', async ({ page }) => {
    commonFunction = new CommonUtils(page)
    navigation = new MobileNavigation(page)
    await commonFunction.goToPortal('storefront')
  })

  test('Should Login to Storefront', async ({ page }) => {
    //switch to English before login
    await navigation.openMenu()
    await commonFunction.rejectAllCookies()
    await navigation.selectEnglishLanguage()
    await navigation.closeMenu()

    const homePageUrl = await page.url()
    await commonFunction.loginToStorefront()
    // switch to English after login
    await navigation.openMenu()
    await commonFunction.rejectAllCookies()
    await navigation.selectEnglishLanguage()
    await navigation.openMenu()

    const returnPageUrl = await page.url()
    expect(returnPageUrl).toBe(homePageUrl) // Validate that the page title is the same as the homepage title after login to check user is logged in and redirected to the homepage

    //Verify that you can login and the profile icon is replaced with a circle containing the user initials
    const getUsernameInitials = await commonFunction.profileIcon.textContent()
    await commonFunction.profileIcon.click()
    await page.waitForLoadState('load')
    const username = await navigation.getUsername.textContent()
    const usernameInitials = await commonFunction.getInitials(username ?? '')
    expect(usernameInitials).toBe(getUsernameInitials)
  })
})
