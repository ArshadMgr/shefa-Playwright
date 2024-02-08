import {Locator, Page} from 'playwright';
import {AbstractCasePage} from "./abstract.case.page";
import {expect} from "@playwright/test";

export class CampaignPage extends AbstractCasePage {
    private readonly remainingPeriodSelector: string = `div[data-cy="remaining-period"]`;
    private readonly progressBarSelector: string = `div[data-cy="progress-bar"]`;
    private readonly donateButtonSelector: string = ` button[data-cy="donate-campaign"]`;
    private readonly reportButtonSelector: string = ` button[data-cy="report-campaign"]`;
    private readonly headerSelector: string = `div[data-cy="campaign-header"]`;
    private readonly campaignCardSelector: string = `div[data-cy="campaign-card"]`;
    private card?: Locator;


    constructor(page: Page, card?: Locator) {
        super(page, 'div[data-cy="campaign-card"]');
        if (card) {
            this.card = card;
        }
    }

    async getRemainingPeriod(): Promise<string> {
        const context = this.card || this.page;
        const textContent = await context.locator(this.remainingPeriodSelector).textContent();
        return textContent || '';
    }

    async getProgressBarValue(): Promise<string> {
        const context = this.card || this.page;
        const style = await context.locator(this.progressBarSelector).getAttribute('style');
        return style || '';
    }

  async clickDonateButton(): Promise<void> {
        const context = this.card || this.page;
        await context.locator(this.donateButtonSelector).click();
    }

    async clickReportButton(): Promise<void> {
        const context = this.card || this.page;
        await context.locator(this.reportButtonSelector).click();
    }

    async waitForPageLoad() {
        await expect(this.page.locator(this.headerSelector)).toBeVisible();
    }

    async verifyAllCardsAreVisible(): Promise<void> {
        const cards = await this.page.locator(this.baseSelector).all();
        expect(cards.length > 0)

        for (const card of cards) {
            const cardInstance = new CampaignPage(this.page, card);
            await cardInstance.areAllFieldsVisible();
        }
    }

    async areAllFieldsVisible(): Promise<void> {
        const context = this.card || this.page;

        const remainingPeriodLocator = await context.locator(this.remainingPeriodSelector);
        const progressBarLocator = await context.locator(this.progressBarSelector);
        const donateButtonLocator = await context.locator(this.donateButtonSelector);
        const reportButtonLocator = await context.locator(this.reportButtonSelector);

        await expect(remainingPeriodLocator).toBeVisible();
        await expect(progressBarLocator).toBeVisible();
        await expect(donateButtonLocator).toBeVisible();
        await expect(reportButtonLocator).toBeVisible();


        await super.areAllFieldsVisible(context);
    }
}
