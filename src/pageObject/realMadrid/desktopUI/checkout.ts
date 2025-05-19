import { Locator } from "@playwright/test";

export class CheckoutPage {
    // Example selectors
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly address1Input: Locator;
    readonly address2Input: Locator;
    readonly cityInput: Locator;
    readonly postalCodeInput: Locator;

    constructor(private page: any) {
        this.nameInput = page.locator('input[name="fullName"]')
        this.emailInput = page.locator('input[name="email"]')
        this.phoneInput = page.locator('input[name="phoneNumber"]')
        this.address1Input = page.locator('input[name="addressLine1"]')
        this.address2Input = page.locator('input[name="addressLine2"]')
        this.cityInput = page.locator('input[name="city"]')
        this.postalCodeInput = page.locator('input[name="postalCode"]')
    }
    async fillYourDetails(name: string, email: string, phone: string, address1: string, address2: string, city: string, postalCode: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.phoneInput.fill(phone);
        await this.address1Input.fill(address1);
        await this.address2Input.fill(address2);
        await this.cityInput.fill(city);
        await this.postalCodeInput.fill(postalCode);
    }

}
