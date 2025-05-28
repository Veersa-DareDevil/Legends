import { test } from '@playwright/test'

import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { MobileNavigation } from '@src/pageObject/realMadrid/mobileUI/navigation'
import { Product } from '@src/pageObject/realMadrid/mobileUI/product'

test.describe('Madrista User - Mobile UI', () => {
  let commonFunction: CommonUtils
  let navBar: MobileNavigation
  let product: Product

  test.beforeEach(async ({ page }) => {
    commonFunction = new CommonUtils(page)
    navBar = new MobileNavigation(page)
    product = new Product(page)
    await commonFunction.goToPortal('storefront')
    await commonFunction.loginToStorefront() //login is required for madrista user
    await navBar.waitForLoaderToDisappear()
  })

  test('64550 & 568263- Madridista Pricing', async ({}) => {
    await navBar.openMenu()
    await product.selectNavTraining()
    await product.validateMadridistaDiscountedPrice()
  })
})
