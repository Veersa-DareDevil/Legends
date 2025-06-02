import { Page, Locator, expect } from "playwright/test"
import productData from '@src/fixtures/realMadrid/personalizeProduct.json'
import { Product } from '@src/pageObject/realMadrid/desktopUI/product'
import { CheckoutPage } from '@src/pageObject/realMadrid/desktopUI/checkout'

export class PersonalizeProduct {
    readonly page: Page
    private product: Product
    private checkout: CheckoutPage
    readonly selectPlayerOption: Locator
    readonly personalizeOption: Locator
    readonly swatches: Locator
    readonly personalizeOptNameInput: Locator
    readonly personalizeOptNumberInput: Locator
    readonly selectPlayerDropdown: Locator
    readonly selectPlayerOptionInput: Locator
    readonly nameElement: Locator
    readonly numberElement: Locator


    constructor(page: Page) {
        this.page = page
        this.product = new Product(page)
        this.checkout = new CheckoutPage(page)
        this.swatches = page.getByRole('listbox').getByRole('button', { name: /Variant Swatch/ });
        this.selectPlayerOption = page.locator('button').filter({ hasText: 'Select Player ' })
        this.personalizeOption = page.locator('button').filter({ hasText: 'Personalize ' })
        this.personalizeOptNameInput = page.locator('input[name*="productOption:Name"]');
        this.personalizeOptNumberInput = page.locator('input[name*="productOption:Number"]');
        this.selectPlayerDropdown = page.locator('[id="react-select-2-input"]')
        this.selectPlayerOptionInput = page.locator('input[name*="productOption:Player Choice"]')
        this.nameElement = page.locator('div[style*="top: 21.66%"] p');
        this.numberElement = page.locator('div[style*="top: 38.83%"] img');
    }

    async verifyPersonalizationOptions() {
        await this.selectPlayerOption.waitFor({ state: 'visible' })
        await this.personalizeOption.waitFor({ state: 'visible' })
        expect(await this.selectPlayerOption.isVisible()).toBeTruthy()
        expect(await this.personalizeOption.isVisible()).toBeTruthy()
    }

    async verfyPersonalizationOptionPreviewPrice(locator: Locator, shouldHavePrice: boolean) {
        const priceRegex = /\$\d+(\.\d{1,2})?/
        const label = await locator.innerText();
        const hasPrice = priceRegex.test(label);

        if (shouldHavePrice) {
            expect(hasPrice).toBeTruthy()
        } else {
            expect(hasPrice).toBeFalsy()
        }

    }

    async verifyErrorMessage(option: 'Select Player' | 'Personalize') {
        let errorMessage: Locator;

        if (option === 'Select Player') {
            errorMessage = this.page.getByText(productData.errorMessage.selectPlayerOption)
        } else {
            errorMessage = this.page.getByText(productData.errorMessage.personalizeOption)
        }

        await errorMessage.waitFor({ state: 'visible' });
        expect(await errorMessage.isVisible()).toBeTruthy();
    }

    async fillPersonalizeOptionDetails(name: string, number: string) {
        await this.personalizeOptNameInput.fill(name)
        await this.personalizeOptNumberInput.fill(number)
    }

    async fillSelectPlayerOptionDetails(name: string) {
        await this.selectPlayerDropdown.click()
        await this.page.getByRole('option', { name: `${name}` }).click()
    }

    //verify select player Personalize option
    async verifySelectPlayerPersonalizeOption() {
        await this.selectPlayerOption.click()
        await this.product.addToCart()
        await this.verifyErrorMessage('Select Player')
        await this.fillSelectPlayerOptionDetails(productData.personalizeOptions.option2.playerName)
        await this.product.addToCart()
        await this.checkout.checkoutButton.waitFor({ state: 'visible' })
        expect(await this.checkout.checkoutButton.isVisible()).toBeTruthy()
    }

    async verifyPersonalizeOption() {
        await this.personalizeOption.click()
        await this.product.addToCart()
        await this.verifyErrorMessage('Personalize')
        await this.fillPersonalizeOptionDetails(productData.personalizeOptions.option1.name, productData.personalizeOptions.option1.number)
        await this.product.addToCart()
        await this.checkout.checkoutButton.waitFor({ state: 'visible' })
        expect(await this.checkout.checkoutButton.isVisible()).toBeTruthy()
    }

    // function to get rendered name text on the personalized product
    async getRenderedNameText() {
        return await this.nameElement.innerText();
    }

    // helper function to extract digit from alt text
    async extractDigitFromAltText(altText: string) {
        const parts = altText.split('-');
        return parts[parts.length - 1];
    }

    // function to get rendered number on the personalized product
    async getRenderedNumber() {
        const numberImgs = this.numberElement;
        const count = await numberImgs.count();
        let digits = '';

        for (let i = 0; i < count; i++) {
            const altText = await numberImgs.nth(i).getAttribute('alt');
            const digit = await this.extractDigitFromAltText(altText || '');
            digits += digit;
        }
        return digits;
    }
    // function to validate the rendered name and number on the personalized product
    async validatePersonalizePreviewMatchesInput(name: string, number: string) {
        const renderedName = (await this.getRenderedNameText()).trim();
        const renderedNumber = (await this.getRenderedNumber()).trim();

        expect(renderedName).toBe(name.toUpperCase());
        expect(renderedNumber).toBe(number);
    }

    // helper function to extract the player name and number from the select player option input
    async getSelectedPlayerNameAndNumber() {
        const playerText = await this.selectPlayerOptionInput.nth(1).inputValue();
        const playerTextParts = JSON.parse(playerText)
        return { name: playerTextParts.name, number: playerTextParts.number }
    }

    // function to validate the rendered name and number on the select player option
    async validateSelectPlayerPreviewMatchesInput() {
        const renderedName = (await this.getRenderedNameText()).trim();
        const renderedNumber = (await this.getRenderedNumber()).trim();
        const { name, number } = await this.getSelectedPlayerNameAndNumber()

        expect(renderedName).toBe(name.toUpperCase());
        expect(renderedNumber).toBe(number);
    }




}