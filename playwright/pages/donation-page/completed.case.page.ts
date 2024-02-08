import {Locator, Page} from 'playwright';
import {AbstractCasePage} from "./abstract.case.page";
import {expect} from "@playwright/test";

export class CompletedCasesPage extends AbstractCasePage {
    private readonly caseImageSelector: string = ` .case-image-selector`;
    private readonly categorySelector: string = ` .category-selector`;
    private readonly charityImageSelector: string = ` .charity-image-selector`;
    private readonly progressBarSelector: string = ` .progress-bar-selector`;
    private readonly reportButtonSelector: string = ` .report-btn-selector`;
    private card?: Locator;

    constructor(page: Page, card?: Locator) {
        super(page, '[data-pc-name="card"]');
        if (card) {
            this.card = card;
        }
    }

    async getCaseImage(): Promise<string> {
        const context = this.card || this.page;
        const src = await context.locator(this.caseImageSelector).getAttribute('src');
        return src || '';
    }

    async getCategory(): Promise<string> {
        const context = this.card || this.page;
        const textContent = await context.locator(this.categorySelector).textContent();
        return textContent || '';
    }

    async getCharityImage(): Promise<string> {
        const context = this.card || this.page;
        const src = await context.locator(this.charityImageSelector).getAttribute('src');
        return src || '';
    }

    async getProgressBarValue(): Promise<string> {
        const context = this.card || this.page;
        const style = await context.locator(this.progressBarSelector).getAttribute('style');
        return style || '';
    }

    async clickReportButton(): Promise<void> {
        const context = this.card || this.page;
        await context.locator(this.reportButtonSelector).click();
    }

    async areAllFieldsVisible(): Promise<void> {
        const context = this.card || this.page;

        const caseImageLocator = context.locator(this.caseImageSelector);
        const categoryLocator = context.locator(this.categorySelector);
        const charityImageLocator = context.locator(this.charityImageSelector);
        const progressBarLocator = context.locator(this.progressBarSelector);
        const reportButtonLocator = context.locator(this.reportButtonSelector);

        await expect(caseImageLocator).toBeVisible();
        await expect(categoryLocator).toBeVisible();
        await expect(charityImageLocator).toBeVisible();
        await expect(progressBarLocator).toBeVisible();
        await expect(reportButtonLocator).toBeVisible();

        await super.areAllFieldsVisible(context);
    }
}
