import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { Navigation } from '@src/pageObject/realMadrid/adminUI/navigation'
import { AddCategory } from '@src/pageObject/realMadrid/adminUI/addCategory'
import { test, expect } from '@playwright/test'

test.describe('Catalog Management', () => {
  let commonFunction: CommonUtils
  let navigation: Navigation
  let category: AddCategory

  test.beforeEach('Visiting', async ({ page }) => {
    commonFunction = new CommonUtils(page)
    navigation = new Navigation(page)
    category = new AddCategory(page)
    await commonFunction.goToPortal('admin')
    await commonFunction.loginToAdmin()
    await page.waitForTimeout(2000)
  })

  test('671873 - Creating Category in Admin', async ({ page }) => {
    await navigation.clickCatalog()
    await navigation.clickCategories()

    // ✅ Capture the categoryName returned
    const categoryName = await category.createNewCategory()

    await category.addProductIntoCategory()
    await category.addFilterInCategoryForPruduct()

    //can be used in future
    //await category.previewCategoryOnStoreFront()
    
    await category.promoteProductToSandbox()
    await page.waitForTimeout(30000)

    // Use categoryName to create endpoint
    const endpoint = categoryName.trim().toLowerCase().split(' ').join('-')
    const URL = `${process.env.RM_STOREFRONT_URL}/${endpoint}`

    await page.goto(URL)
    await page.waitForLoadState('load')

    // Verify 404 or error page is not visible
    const errorMessage = page.getByText(/404|page not found/i)
    await expect(errorMessage).not.toBeVisible()

    // Verify product details are visible
    const productNameStoreFront = page.getByRole('heading', { name: categoryName })
    await expect(productNameStoreFront).toBeVisible()
  })
})
