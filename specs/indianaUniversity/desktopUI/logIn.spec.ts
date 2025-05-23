import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'
//import { DesktopNavigation } from '@src/pageObject/indianaUniversity/desktopUI/navigation' //future use
import { test, expect } from '@playwright/test'

test.describe('303887 & 745140 -Login to Storefront site of IndianaUniversity', () => {
  let commonFunction: CommonUtils
  // let navigation: DesktopNavigation //future use

  test.beforeEach('Validate login process', async ({ page }) => {
    commonFunction = new CommonUtils(page)
    // navigation = new DesktopNavigation(page) //future use
    await commonFunction.goToPortal('storefront')
  })

  test.skip('Should Login to Storefront', async ({ page }) => {
    //await navigation.selectEnglishLanguage() // future use
    const homePageUrl = page.url()

    await commonFunction.loginToStorefront()
    //await navigation.selectEnglishLanguage() // future use

    const returnPageUrl = page.url() //validation will fail,
    expect(returnPageUrl).toBe(homePageUrl) // Validate that the page URL is the same as the homepage title after login to check user is logged in and redirected to the homepage
  })
})
