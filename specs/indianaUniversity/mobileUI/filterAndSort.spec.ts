import { test } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/indianaUniversity/commonUtils'
import { ProductSearchPage } from '@src/pageObject/indianaUniversity/mobileUI/search'

test.describe('993760-Mobile Filter & Sort Tray UI', () => {
  let commonFunction: CommonUtils
  let productSearchPage: ProductSearchPage

  test.beforeEach(async ({ page }) => {
    commonFunction = new CommonUtils(page)
    await commonFunction.goToPortal('storefront')
    productSearchPage = new ProductSearchPage(page)
  })

  test('1. Open filter and sort tray', async () => {
    await productSearchPage.triggerBlankSearch()
    await productSearchPage.toggleFilterSection()
  })

  test('2. clicking any facet should automatically applies', async () => {
    await productSearchPage.triggerBlankSearch()
    await productSearchPage.addFilterFacetOnSize()
  })

  test('3. removing facet from selected filter', async () => {
    await productSearchPage.triggerBlankSearch()
    await productSearchPage.addFilterFacetOnSize()
    await productSearchPage.removeSizeFilter()
  })
})
