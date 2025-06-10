import { Page, Locator } from 'playwright'
import fs from 'fs'
import path from 'path'

export class AddCategory {
  readonly page: Page
  readonly addCategoryButton: Locator
  readonly selectCatelogDropdown: Locator
  readonly choseCatelogOption: Locator
  readonly addCategoryName: Locator
  readonly productMembershipType: Locator
  readonly choseProductMemberShipOption: Locator
  readonly submitAddCategoryButton: Locator
  readonly productTab: Locator // Product tab inside selected category
  readonly addProductButton: Locator // add product inside category
  readonly selectProductDropdown: Locator
  readonly submitSelectedProuctButton: Locator // submit selected product while adding product under category
  readonly filter: Locator // add filter on selected product
  readonly firstFilter: Locator
  readonly secondFilter: Locator
  readonly filterApplyButton: Locator // apply filter button on product under category
  readonly promoteButton: Locator
  readonly deployProductImmediately: Locator
  readonly promoteButtonHeader: Locator

  constructor(page: Page) {
    this.page = page
    this.addCategoryButton = page.locator('button', { hasText: 'Add Category' })
    this.selectCatelogDropdown = page
      .locator('div')
      .filter({ hasText: /^Select CatalogSelect\.\.\.$/ })
      .locator('svg')
    this.choseCatelogOption = page.locator('.Select__menu')
    this.addCategoryName = page.locator('input[name="name"]')
    this.productMembershipType = page.locator(
      '#productMembershipType > .Select__control > .Select__value-container > .Select__input-container',
    )
    this.choseProductMemberShipOption = page.getByText('Rule Based', { exact: true })
    this.submitAddCategoryButton = page.getByText('Submit')
    this.productTab = page.getByRole('button', { name: 'Products' })
    this.addProductButton = page.locator('.ModalFormAction >> button', { hasText: 'Add Product' })
    this.selectProductDropdown = page.locator('.Select__control', { hasText: 'Select a Product' })
    this.submitSelectedProuctButton = this.page.locator('button[type="submit"]', {
      hasText: 'Submit',
    })
    this.filter = page.getByRole('button', { name: 'Filters' })
    this.filterApplyButton = page.getByRole('button', { name: 'Apply' })
    this.firstFilter = page
      .locator('.Query', {
        hasText: 'Where',
      })
      .locator('.Select__control')
      .nth(0)
    this.secondFilter = page
      .locator('.Query', {
        hasText: 'Where',
      })
      .locator('.Select__control')
      .nth(1)
    //this.previewChangesButton = page.getByRole('button', { name: 'Preview Changes' }) can be used in future
    this.deployProductImmediately = page.locator(
      '[for="toggleSwitch-shouldDeployImmediately-true"]',
    )
    this.promoteButtonHeader = page.getByRole('button', { name: 'Promote' })
    this.promoteButton = page.getByLabel('Promote')
  }

  async createNewCategory() {
    // Click "Add Category" button
    await this.addCategoryButton.click()

    // Select catalog from dropdown
    await this.selectCatelogDropdown.click()
    await this.choseCatelogOption.waitFor({ state: 'visible' })
    await this.choseCatelogOption.getByText('ECOM Master').click()

    // Generate and fill category name
    const categoryName = this.generateCategoryName()
    await this.addCategoryName.fill(categoryName)

    // Store to JSON
    const filePath = path.resolve('src/fixtures/realMadrid/adminDetails.json')
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    jsonData.category = { categoryName }
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2))

    // Select product membership type
    await this.productMembershipType.waitFor({ state: 'visible' })
    await this.productMembershipType.click()
    await this.choseProductMemberShipOption.click()

    // Submit add Category
    await this.submitAddCategoryButton.waitFor({ state: 'visible' })
    await this.submitAddCategoryButton.click()

    // Validate and open newly created category
    const categoryLocator = this.page.getByTitle(categoryName)
    await categoryLocator.click()

    return categoryName
  }

  async addProductIntoCategory() {
    await this.productTab.waitFor({ state: 'visible' })
    await this.productTab.click()
    await this.addProductButton.click()
    await this.selectProductDropdown.waitFor({ state: 'visible' })
    await this.selectProductDropdown.click()
    await this.page.waitForTimeout(1000)
    const options = this.page.locator('.Select__menu .Select__option')
    await this.page.waitForTimeout(5000)
    const totalOptions = await options.count()

    if (totalOptions <= 5) {
      throw new Error(`Not enough options to skip the first 5. Found only ${totalOptions}`)
    }
    // Select a random option starting from index 5
    const randomIndex = Math.floor(Math.random() * (totalOptions - 5)) + 5
    await options.nth(randomIndex).click()
    await this.submitSelectedProuctButton.waitFor({ state: 'visible' })
    await this.submitSelectedProuctButton.click() // submit the selected product
  }

  async addFilterInCategoryForPruduct() {
    await this.filter.waitFor({ state: 'visible' })
    await this.filter.click()
    // apply filter options
    //first filter
    await this.firstFilter.click()
    await this.page.waitForTimeout(2000)
    await this.page.locator('.Select__menu .Select__option', { hasText: 'Name' }).click()

    //second filter
    await this.secondFilter.click()
    await this.page.waitForTimeout(2000)
    await this.page.getByText('is not empty').click()
    // click apply button
    await this.filterApplyButton.waitFor({ state: 'visible' })
    await this.filterApplyButton.click()
  }

  async promoteProductToSandbox() {
    await this.promoteButtonHeader.waitFor({ state: 'visible' })
    await this.promoteButtonHeader.click()
    await this.deployProductImmediately.click()
    await this.promoteButton.click()
  }

  generateCategoryName() {
    const timestamp = Math.floor(Date.now() / 1000) // seconds
    return `Test Category ${timestamp}`
  }
}
