import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'
import { test } from '@playwright/test'

test.describe('303887 & 745140 -Login to Storefront site of IndianUniversity', () => {
  let commonFunction: CommonUtils

  test.beforeEach('Validate login process', async ({ page }) => {
    commonFunction = new CommonUtils(page)
    await commonFunction.goToPortal('storefront')
  })

  test('Should Login to Storefront', async ({}) => {
    await commonFunction.loginToStorefront()
  })
})
