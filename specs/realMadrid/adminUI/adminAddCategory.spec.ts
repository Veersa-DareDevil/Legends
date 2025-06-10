import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { Navigation } from '@src/pageObject/realMadrid/adminUI/navigation'
import { AddCategory } from '@src/pageObject/realMadrid/adminUI/addCategory'

test.describe.serial('Catalog Management', () => {
  let commonFunction: CommonUtils
  let navigation: Navigation
  let category: AddCategory
  const filePath = path.resolve('src/fixtures/realMadrid/adminDetails.json')

  test.beforeEach('Visiting', async ({ page }, testInfo) => {
    // Check flag set in test
    if (testInfo.annotations.some((a) => a.type === 'skipSetup')) {
      console.log('⏭️ Skipping admin login/setup for this test')
      return
    }

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

    await category.createNewCategory()
    await category.addProductIntoCategory()
    await category.addFilterInCategoryForPruduct()
    await category.promoteProductToSandbox()
    await page.waitForTimeout(30000)
  })

  // ⏭️ Skip admin login setup for this test
  test('671873 - Verifying it in Storefront', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'skipSetup', description: 'Skip admin setup' })
    console.log('📍 Storefront test started')

    try {
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      const categoryName = jsonData.category?.categoryName
      console.log('✅ Read categoryName:', categoryName)

      if (!categoryName) {
        throw new Error('No categoryName found in adminDetails.json')
      }

      const endpoint = categoryName.trim().toLowerCase().split(' ').join('-')
      const URL = `${process.env.RM_STOREFRONT_URL}/${endpoint}`

      await page.goto(URL)
      await page.waitForLoadState('load')

      const errorMessage = page.getByText(/404|page not found/i)
      await expect(errorMessage).not.toBeVisible()

      const productNameStoreFront = page.getByRole('heading', { name: categoryName })
      await expect(productNameStoreFront).toBeVisible()
    } catch (error) {
      console.error('🚨 Storefront test error:', error)
      throw error
    }
  })
})
