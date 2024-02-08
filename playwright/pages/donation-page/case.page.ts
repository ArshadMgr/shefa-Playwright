import {Locator, Page} from 'playwright';
import {AbstractCasePage} from "./abstract.case.page";
import {expect} from "@playwright/test";

export class CasePage extends AbstractCasePage {
    private readonly headerSelector: string = `div[data-cy="cases-list-header"]`;
    private readonly caseImageSelector: string = ` img[data-cy="case-image"]`;
    private readonly charityLogoSelector: string = ` img[data-cy="charity-logo"]`;
    private readonly remainingAmountSelector: string = ` div[data-cy="remaining-amount-value"]`;
    private readonly progressBarSelector: string = ` div[data-cy="remaining-amount-progress-bar"]`;
    private readonly locationSelector: string = ` span[data-cy="area-name"]`;
    private readonly donateButtonSelector: string = ` button[data-cy="donate-now-button"]`;
    private specialitySelector: string = ` span[data-cy="speciality-name"]`;
    private card?: Locator;


    constructor(page: Page, card?: Locator) {
        super(page, 'div[data-cy="case-card"]');
        if (card) {
            this.card = card;
        }
    }

    async getCaseImage(): Promise<string> {
        const context = this.card || this.page;
        const src = await context.locator(this.caseImageSelector).getAttribute('src');
        return src || '';
    }

    async getRemainingPeriod(): Promise<string> {
        const context = this.card || this.page;
        const textContent = await context.locator(this.remainingAmountSelector).textContent();
        return textContent || '';
    }

    async getProgressBarValue(): Promise<string> {
        const context = this.card || this.page;
        const style = await context.locator(this.progressBarSelector).getAttribute('style');
        return style || '';
    }

    async getLocationValue(): Promise<string> {
        const context = this.card || this.page;
        const textContent = await context.locator(this.locationSelector).textContent();
        return textContent || '';
    }

    async getSpecialityValue(): Promise<string> {
        const context = this.card || this.page;
        const textContent = await context.locator(this.specialitySelector).textContent();
        return textContent || '';
    }

    async clickDonateButton(): Promise<void> {
        const context = this.card || this.page;
        await context.locator(this.donateButtonSelector).first().click();
    }


    async verifyAllCardsAreVisible(): Promise<void> {
        const cards = await this.page.locator(this.baseSelector).all();

        expect(cards.length > 0)

        for (const card of cards) {
            const cardInstance = new CasePage(this.page, card);
            await cardInstance.areAllFieldsVisible();
        }
    }

    async areAllFieldsVisible(): Promise<void> {
        const context = this.card || this.page;

        const caseImage = await context.locator(this.caseImageSelector);
        const charityLogo = await context.locator(this.charityLogoSelector);
        const remainingAmount = await context.locator(this.remainingAmountSelector);
        const progressBar = await context.locator(this.progressBarSelector);
        const location = await context.locator(this.locationSelector);
        const donateButton = await context.locator(this.donateButtonSelector);
        const speciality = await context.locator(this.specialitySelector);

        await expect(caseImage).toBeVisible();
        await expect(charityLogo).toBeVisible();
        await expect(remainingAmount).toBeVisible();
        await expect(progressBar).toBeVisible();
        await expect(location).toBeVisible();
        await expect(speciality).toBeVisible();
        await expect(donateButton).toBeVisible();

        await super.areAllFieldsVisible(context);
    }

    async waitForPageLoad() {
        await expect(this.page.locator(this.headerSelector)).toBeVisible();
    }
    async clickDonateCaseButton(caseId: string){
        const caseCardLocator = await this.getCaseCardLocator(caseId);
        await caseCardLocator.locator(this.donateButtonSelector).click();
    }
    async getCaseCardLocator(caseId: string){
        const caseIdSelector = await this.getCaseIdLocator(caseId);
        const caseCardLocator = await this.page.locator(this.baseSelector, { has: this.page.locator(caseIdSelector) });
        return caseCardLocator;
    }
    async getCaseIdLocator(caseId: string){
        let caseIdSelector: string = `${this.idSelector}:has-text("${caseId}")`;
        return caseIdSelector;
    }
}
