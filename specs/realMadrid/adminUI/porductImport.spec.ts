import { test } from '@playwright/test'
import { CommonUtils } from '@src/utils/loginUtils/realMadrid/commonUtils'
import { Navigation } from '@src/pageObject/realMadrid/adminUI/navigation'
import { ImportProduct } from '@src/pageObject/realMadrid/adminUI/importProduct'

let login: CommonUtils
let navigation: Navigation
let productImport: ImportProduct 

test.describe('Product Import', () => {
   test.beforeEach("should import",async ({ page }) => {
      login = new CommonUtils(page)
      navigation = new Navigation(page)
      productImport = new ImportProduct(page)
      await login.goToPortal('admin')
      await login.loginToAdmin()
      await page.waitForTimeout(2000)
   })

   test('should do something', async ({page}) => {
      await navigation.clickProcesses()
      await navigation.clickImports()
      const randomNumber = Math.floor(Math.random() * 900) + 100
      await productImport.importProduct(`Test Product-${randomNumber}`)
   })
})
