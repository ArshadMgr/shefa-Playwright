import {Page} from 'playwright';
import {expect} from '@playwright/test';

export class TopAmbassadorsPage {
    private readonly ambassadorsTable: string = `div[data-cy="top-ambassadors-table"]`;
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForPageLoad() {
        await expect(this.page.locator(this.ambassadorsTable)).toBeVisible();
    }

}
