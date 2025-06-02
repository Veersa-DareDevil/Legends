import { Page, Locator, expect } from 'playwright/test'

export class PersonalizeProduct {
  readonly page: Page
  readonly selectPlayerOption: Locator
  readonly personalizeOption: Locator
  readonly swatches: Locator

  constructor(page: Page) {
    this.page = page
    this.swatches = page.getByRole('listbox').getByRole('button', { name: /Variant Swatch/ })
    this.selectPlayerOption = page.locator('button').filter({ hasText: 'Select Player ' })
    this.personalizeOption = page.locator('button').filter({ hasText: 'Personalize ' })
  }

  async verifyPersonalizeOptions() {
    await this.selectPlayerOption.waitFor({ state: 'visible' })
    await this.personalizeOption.waitFor({ state: 'visible' })
    expect(await this.selectPlayerOption.isVisible()).toBeTruthy()
    expect(await this.personalizeOption.isVisible()).toBeTruthy()
  }

  async verfyPersonalizeOptionPreviewPrice(locator: Locator, shouldHavePrice: boolean) {
    const priceRegex = /\$\d+(\.\d{1,2})?/
    const label = await locator.innerText()
    const hasPrice = priceRegex.test(label)
    console.log(label)

    if (shouldHavePrice) {
      expect(hasPrice).toBeTruthy()
    } else {
      expect(hasPrice).toBeFalsy()
    }
  }
}
