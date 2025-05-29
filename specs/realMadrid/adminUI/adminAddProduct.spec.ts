import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { Navigation } from '@src/pageObject/realMadrid/adminUI/navigation'
import { AddProduct } from '@src/pageObject/realMadrid/adminUI/addProduct'
import { test, expect } from '@playwright/test'

test.describe('Admin portal', () => {
  let commonFunction: CommonUtils
  let navigation: Navigation
  let product: AddProduct

  test.beforeEach('Visiting', async ({ page }) => {
    commonFunction = new CommonUtils(page)
    navigation = new Navigation(page)
    product = new AddProduct(page)
    await commonFunction.goToPortal('admin')
    await commonFunction.loginToAdmin()
    await page.waitForTimeout(2000)
  })

  test('Creating Product in Admin', async ({ page }) => {
    await navigation.clickCatalog()
    await navigation.clickProducts()
    const productName = await product.generateProductName()
    await product.addProductButton.click()
    await product.addProductType('Standard')
    await product.fillProductDetails(productName, productName, '120')
    await product.promoteProductToSandbox()
    await page.waitForTimeout(5000)
    const endpoint = productName.trim().toLowerCase().split(' ').join('-')
    const URL = `${process.env.RM_STOREFRONT_URL}product/${endpoint}`
    await page.goto(URL)
    await page.waitForLoadState('load')
    // Verify that 404 or error page is not visible
    const errorMessage = page.getByText(/404|page not found/i)
    await expect(errorMessage).not.toBeVisible()
    // Verify product details are visible
    const productNameStoreFront = page.getByRole('heading', { name: `${productName}` })
    await expect(productNameStoreFront).toBeVisible() // Verify product is visible on storefront
  })
})
