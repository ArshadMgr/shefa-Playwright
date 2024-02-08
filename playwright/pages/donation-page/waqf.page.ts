import {Locator, Page} from 'playwright';
import {AbstractCasePage} from "./abstract.case.page";
import {expect} from "@playwright/test";

export class WaqfListCasePage extends AbstractCasePage {
    private readonly remainingAmountSelector: string = ` div[data-cy="remaining-amount"]`;
    private readonly donateNowButtonSelector: string = ` button[data-cy="donate-now"]`;
    private readonly waqfCardSelector: string = 'div[data-cy="waqf-card"]';
    private headerSelector: string = `div[data-cy="waqf-header"]`;
    private card?: Locator;

    constructor(page: Page, card?: Locator) {
        super(page, 'div[data-cy="waqf-card"]');
        if (card) {
            this.card = card;
        }
    }

    async getRemainingAmount(): Promise<string> {
        const context = this.card || this.page;
        const textContent = await context.locator(this.remainingAmountSelector).textContent();
        return textContent || '';
    }

    async clickDonateNow(): Promise<void> {
        const context = this.card || this.page;
        await context.locator(this.donateNowButtonSelector).click();
    }

    async verifyAllCardsAreVisible(): Promise<void> {
        const cards = await this.page.locator(this.baseSelector).all();

        expect(cards.length > 0)

        for (const card of cards) {
            const cardInstance = new WaqfListCasePage(this.page, card);
            await cardInstance.areAllFieldsVisible();

        }
    }

    async areAllFieldsVisible(): Promise<void> {
        const context = this.card || this.page;

        const remainingAmountLocator = await context.locator(this.remainingAmountSelector);
        const donateNowButtonLocator = await context.locator(this.donateNowButtonSelector);

        await expect(remainingAmountLocator).toBeVisible();
        await expect(donateNowButtonLocator).toBeVisible();

        await super.areAllFieldsVisible(context);
    }

    async waitForPageLoad() {
        await expect(this.page.locator(this.headerSelector)).toBeVisible();
        await expect(this.page.locator(this.waqfCardSelector).first()).toBeVisible();
    }
}
