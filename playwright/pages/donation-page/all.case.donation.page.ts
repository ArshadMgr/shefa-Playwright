import {Page} from 'playwright';
import {expect} from "@playwright/test";

export class AllCaseDonationPage {
    private readonly header: string = `span[data-cy="all-case-donation-header"]`;
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForPageLoad() {
        await expect(this.page.locator(this.header)).toBeVisible();
    }
}
