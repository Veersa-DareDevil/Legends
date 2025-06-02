import { Page, Locator } from 'playwright/test'
import importData from '@src/fixtures/realMadrid/importProduct.json'

export class ImportProduct {
  readonly page: Page
  readonly importButton: Locator
  readonly importTypeDropdown: Locator
  readonly importTypeoption: Locator
  readonly importFileName: Locator
  readonly fileInput: Locator
  readonly importFormSubmit: Locator
  readonly importSendBoxdrpdown: Locator
  readonly getOption:Locator

  constructor(page: Page) {
    this.page = page
    this.importButton = page.getByRole('button', { name: 'Import', exact: true })
    this.importTypeDropdown = page.locator('#specification svg')
    this.importFileName = page.locator('input[name="name"]')
    this.fileInput = page.locator('input[type="file"][name="file"]')
    this.importTypeoption = page.locator('#react-select-3-option-0')
    this.importFormSubmit = page.getByRole('button', { name: 'Button' })
    this.importSendBoxdrpdown = page.locator('.Select__input-container')
    this.getOption = page.locator('.Select__option')
  }

  async importProduct(fileName?: string) {
    await this.importButton.click()
    await this.page.waitForTimeout(1000)
    await this.importTypeDropdown.click()
    await this.importTypeoption.click()
    await this.importSendBoxdrpdown.nth(3).click()
    await this.getOption.first().click()  // need to update
    await this.importSendBoxdrpdown.nth(5).click()
    await this.selectOption(importData.importSandboxOption)
    await this.importFileName.fill(fileName as string)
    await this.fileInput.setInputFiles(importData.importFilePath)
    await this.page.waitForTimeout(2000)
    await this.importFormSubmit.click()
    await this.page.waitForSelector(`text=${fileName}`, { state: 'visible' }) // for assertion
  }

  async selectOption(option: string) {
    await this.page
      .locator('.Select__option')
      .filter({ hasText: `${option}` })
      .click()
  }
}
