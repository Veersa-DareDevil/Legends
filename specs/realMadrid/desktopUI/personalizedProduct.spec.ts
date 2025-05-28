import { test } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'

test.describe('640373 - Personalization Pricing', () => {
  let commonFunction: CommonUtils

  test.beforeEach(async ({ page }) => {
    commonFunction = new CommonUtils(page)
    await commonFunction.goToPortal('storefront')
  })

  test.skip('should display correct personalization price', async ({}) => {
    // Issue with the site
  })
})
