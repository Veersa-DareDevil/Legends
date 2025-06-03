import { test } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'
import { MobileNavigation } from '@src/pageObject/indianaUniversity/mobileUI/navigation'

test.describe('Mobile Navigation', () => {
  let commonFunction: CommonUtils
  let navigation: MobileNavigation

  test.beforeEach(async ({ page }) => {
    commonFunction = new CommonUtils(page)
    navigation = new MobileNavigation(page)
    await commonFunction.goToPortal('storefront')
  })

  test('488177 - Mobile Navigation', async ({}) => {
    await navigation.openMenu()
    await navigation.verifyAllNavOptions()
  })
})
