import { Page, Locator } from 'playwright'

export class AddProduct {
  readonly page: Page
  readonly addProductButton: Locator
  readonly selectEntityDropdown: Locator
  readonly createBtn: Locator
  readonly addProductPageHeading: Locator
  readonly productNameInput: Locator
  readonly skuInput: Locator
  readonly priceInput: Locator
  readonly createProductButton: Locator
  readonly saveButton: Locator
  readonly promoteButton: Locator
  readonly deployProductImmediately: Locator
  readonly promoteButtonHeader: Locator

  constructor(page: Page) {
    this.page = page
    this.addProductButton = page.locator('#createEntityButton')
    this.selectEntityDropdown = page.locator('.Select__placeholder', { hasText: 'Select...' })
    this.createBtn = page.locator('#createChoiceButton')
    this.addProductPageHeading = page.getByRole('heading', { name: 'Product Information' })
    this.productNameInput = page.locator('[name="name"]')
    this.skuInput = page.locator('[name="sku"]')
    this.priceInput = page.locator('#defaultPrice')
    this.createProductButton = page.getByRole('button', { name: 'Create Product' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.deployProductImmediately = page.locator(
      '[for="toggleSwitch-shouldDeployImmediately-true"]',
    )
    this.promoteButtonHeader = page.getByRole('button', { name: 'Promote' })
    this.promoteButton = page.getByLabel('Promote')
  }

  async addProductType(type: string) {
    await this.selectEntityDropdown.click({ force: true })
    await this.page.waitForSelector(`text=${type}`, { state: 'visible' })
    await this.selectOption(type)
    await this.createBtn.click()
    await this.addProductPageHeading.waitFor({ state: 'visible' })
  }

  async selectOption(option: string) {
    await this.page
      .locator('.Select__option')
      .filter({ hasText: `${option}` })
      .click()
  }

  async fillProductDetails(name: string, sku: string, price: string) {
    await this.productNameInput.fill(name)
    await this.skuInput.fill(sku)
    await this.priceInput.fill(price)
    await this.createProductButton.click()
    await this.saveButton.waitFor({ state: 'visible' })
  }

  async selectExistingProduct(name: string) {
    const productNameTable = this.page.locator('.LinkColumn', { hasText: `${name}` })
    await productNameTable.click()
  }

  async promoteProductToSandbox() {
    await this.promoteButtonHeader.waitFor({ state: 'visible' })
    await this.promoteButtonHeader.click()
    await this.deployProductImmediately.click()
    await this.promoteButton.click()
  }

  async generateProductName() {
    const randomNumber = Math.floor(Math.random() * 10000)
    const productName = `Test Product ${randomNumber}`
    return productName
  }
}
