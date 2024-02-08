// HomePage.ts
import {Page} from 'playwright';
import Filters from "./filters.page";
import {expect} from "@playwright/test";

export default class HomePage {
    public readonly showMoreCasesButton = 'div[data-cy="show-more-cases-btn"]';
    public readonly numberOfCompletedCases = 'span[data-cy="number-of-completed-cases"]';
    public readonly donationsAmount = 'span[data-cy="amount-of-donations"]';
    public readonly topAmbassadors = 'a[data-cy="top-ambassador-link"]';
    public readonly majorDonors = 'a[data-cy="major-donors-link"]';
    public readonly healthInitiatives = 'a[data-cy="health-initiatives-link"]';
    public readonly partnershipRequest = 'a[href="/partnership-request"]';
    public readonly privacyPolicy = 'a[href="/privacy-policy"]';
    public readonly faq = 'a[href="/faq"]';
    private readonly page: Page;
    private readonly caseFilters: Filters;
    private readonly carousel = '.p-carousel-content';
    private readonly filters = 'div[data-cy="case-filters"]';
    private readonly casesTab = 'div[data-cy="cases-tab"]';
    private readonly campaignsTab = 'div[data-cy="campaigns-tab"]';
    private readonly markItCloseTab = 'div[data-cy="markItClose-tab"]';
    private readonly endowmentsTab = 'div[data-cy="endowments-tab"]';
    private readonly partnerLogo = 'div[data-cy="our-partners-logo"]  img';

    constructor(page: Page) {
        this.page = page;
        this.caseFilters = new Filters(page);
    }

    async open() {
        await this.page.goto("/");
    }

    async waitForPageLoad() {
        await this.page.waitForSelector(this.carousel);
    }

    async verifyCarouselVisible() {
        await expect(this.page.locator(this.carousel)).toBeVisible();
    }

    async areFiltersVisible() {
        const filtersElement = this.page.locator(this.filters);
        return filtersElement.isVisible();
    }

    async verifyPartnersLogosVisible() {
        const partnerLogos = await this.page.locator(this.partnerLogo).all();
        await partnerLogos[0].scrollIntoViewIfNeeded();

        await expect(partnerLogos.length).toBe(2);

        for (const logo of partnerLogos) {
            await expect(logo).toBeVisible();
        }
    }

    async verifyFooterLinks() {
        await expect(this.page.locator(this.partnershipRequest)).toBeVisible();
        await expect(this.page.locator(this.privacyPolicy)).toBeVisible();
        await expect(this.page.locator(this.faq)).toBeVisible();
    }

    async clickCasesTab() {
        const casesTabElement = this.page.locator(this.casesTab);
        await casesTabElement.click();
    }

    async clickCampaignsTab() {
        const campaignsTabElement = this.page.locator(this.campaignsTab);
        await campaignsTabElement.click();
    }

    async clickMarkItCloseTab() {
        const markItCloseTabElement = this.page.locator(this.markItCloseTab);
        await markItCloseTabElement.click();
    }

    async clickEndowmentsTab() {
        const endowmentsTabElement = this.page.locator(this.endowmentsTab);
        await endowmentsTabElement.click();
    }

    async openFilters(): Promise<void> {
        const filtersElement = await this.page.locator(this.filters);
        await filtersElement.click();
    }


    async closeFilters(): Promise<void> {
        await expect(this.page.locator(this.filters)).toBeVisible();
        await this.page.locator(this.filters).click();
    }
}
