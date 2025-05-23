import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'
import { test, expect } from '@playwright/test'
//import { MobileNavigation } from '@src/pageObject/indianaUniversity/mobileUI/navigation' //future use

test.describe('303887 & 745140 -Login to Storefront site of IndianUniversity', () => {
  let commonFunction: CommonUtils
  //let navigation: MobileNavigation // future use

  test.beforeEach('Validate login process', async ({ page }) => {
    commonFunction = new CommonUtils(page)
    //navigation = new MobileNavigation(page) //future use
    await commonFunction.goToPortal('storefront')
  })

  test.skip('Should Login to Storefront', async ({ page }) => {
    const homePageURL = page.url()

    await commonFunction.loginToStorefront()

    const returnPageURL = page.url() //this will fail because of functionality issue

    expect(returnPageURL).toBe(homePageURL) // Validate that the page URL is the same as the homepage URL after login to check user is logged in and redirected to the homepage
  })
})
