import { test, expect, Page } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { MobileNavigation } from '@src/pageObject/realMadrid/mobileUI/navigation'

test.describe('488177 - Mobile Navigation', () => {
  let commonFunction: CommonUtils
  let navigation: MobileNavigation

  test.beforeEach(async ({ page }) => {
    commonFunction = new CommonUtils(page)
    navigation = new MobileNavigation(page)
    await commonFunction.goToPortal('storefront')
  })

  test('should valiadte all navigation options', async ({ page }) => {
    await navigation.openMenu()
    await navigation.verifyAllNavOptions()
  })
})
