import {Page} from 'playwright';
import {expect} from "@playwright/test";

export class ZakatOptionsPage {
    private headerSelector: string = `span[data-cy="zakat-options-header"]`;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForPageLoad() {
        await expect(this.page.locator(this.headerSelector)).toBeVisible();
    }
}
