import {Locator, Page} from 'playwright';
import {expect} from "@playwright/test";

export abstract class AbstractCasePage {
    protected readonly page: Page;
    protected readonly baseSelector: string;
    protected readonly titleSelector: string;
    protected readonly descriptionSelector: string;
    protected readonly idSelector: string;
    protected readonly shareButtonSelector: string;
    protected readonly lastPageButtonSelector: string;

    constructor(page: Page, baseSelector: string) {
        this.page = page;
        this.baseSelector = baseSelector;
        this.titleSelector = ` div[data-cy="case-title"]`;
        this.descriptionSelector = ` div[data-cy="case-description"]`;
        this.idSelector = ` span[data-cy="case-id"]`;
        this.shareButtonSelector = `button[data-cy="share-button"]`;
        this.lastPageButtonSelector = 'button.p-paginator-last';
    }

    async isCardVisible(): Promise<boolean> {
        return await this.page.locator(this.baseSelector).isVisible();
    }

    async getTitle(): Promise<string> {
        const textContent = await this.page.locator(this.titleSelector).textContent();
        return textContent || '';
    }

    async getDescription(): Promise<string> {
        const textContent = await this.page.locator(this.descriptionSelector).textContent();
        return textContent || '';
    }

    async getId(): Promise<string> {
        const textContent = await this.page.locator(this.idSelector).textContent();
        return textContent || '';
    }

    async clickShareButton(): Promise<void> {
        await this.page.locator(this.shareButtonSelector).click();
    }

    async areAllFieldsVisible(card: Page | Locator): Promise<void> {
        const title = await card.locator(this.titleSelector);
        const description = await card.locator(this.descriptionSelector);
        const id = await card.locator(this.idSelector);
        const shareButton = await card.locator(this.shareButtonSelector);

        await expect(title).toBeVisible();
        await expect(description).toBeVisible();
        await expect(id).toBeVisible();
        await expect(shareButton).toBeVisible();
    }
    async verifyIfCaseFound(caseId: string, isFound: boolean) {
        
        const caseLocator: Locator = await this.page.locator(this.idSelector + `:has-text("${caseId}")`);

        if(isFound)
           await expect(caseLocator).toBeVisible();
        else
           await expect(caseLocator).not.toBeVisible();
    }
    async openLastPage(){
        await this.page.locator(this.lastPageButtonSelector).click();
    }
}
