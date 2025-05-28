import { test } from '@playwright/test'

import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { DesktopNavigation } from '@src/pageObject/realMadrid/desktopUI/navigation'
import { Product } from '@src/pageObject/realMadrid/desktopUI/product'

test.describe('Madridista User - Desktop UI', () => {
  let commonFunction: CommonUtils
  let navBar: DesktopNavigation
  let product: Product

  test.beforeEach(async ({ page }) => {
    commonFunction = new CommonUtils(page)
    navBar = new DesktopNavigation(page)
    product = new Product(page)
    await commonFunction.goToPortal('storefront')
    await commonFunction.loginToStorefront() //login is required for madrista user
    await navBar.waitForLoaderToDisappear()
  })

  test('64550 & 568263- Madridista Pricing', async ({}) => {
    await product.selectNavFashion()
    await product.validateMadridistaDiscountedPrice()
  })
})
