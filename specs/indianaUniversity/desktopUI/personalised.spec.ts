import { test } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'
import { Product } from '@src/pageObject/indianaUniversity/desktopUI/product'
import productData from '@src/fixtures/indianaUniversity/product.json'

let login: CommonUtils
let product: Product

test.describe('Personalised Product Scenario', () => {
  test.beforeEach(async ({ page }) => {
    login = new CommonUtils(page)
    product = new Product(page)
    await login.goToPortal('storefront')
    await page.waitForTimeout(2000)
  })

  test('518685 - Personalizing a Basketball Jersey', async ({ page }) => {
    const { personaliseProduct, Name, Number } = productData.personalisedProduct
    const homePageUrl = await page.url()
    const fullUrl=`${homePageUrl}${personaliseProduct}`
    await page.goto(fullUrl)
    await product.personalisedProduct(Name, Number)
  })
})
