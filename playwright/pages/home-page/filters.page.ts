import {Page} from "playwright";
import {expect} from "@playwright/test";

export enum Gender {
    Man = 'man', Woman = 'woman', Child = 'child'
}

export default class Filters {
    private page: Page;
    private readonly searchInput = 'span[data-cy="filters-form-search-input"] input';
    private readonly submitButton = 'button[data-cy="submit-btn"]';
    private readonly regionDropdown = 'div[data-cy="region-dropdown"]';
    private readonly specializationDropdown = 'div[data-cy="specialization-dropdown"]';
    private readonly isManButton = 'div[data-cy="filter-radio-man"]';
    private readonly isWomanButton = 'div[data-cy="filter-radio-woman"]';
    private readonly isChildButton = 'div[data-cy="filter-radio-child"]';


    constructor(page: Page) {
        this.page = page;
    }

    async selectDropdownOption(dropdownSelector: string, option: string) {
        await this.page.click(dropdownSelector);
        await this.page.click(`text=${option}`);
    }

    async searchCase(caseId: string) {
        await this.page.locator(this.searchInput).fill(caseId.toString());
        await this.page.click(this.submitButton);
    }

    async selectRadioButton(option: Gender) {
        switch (option) {
            case Gender.Man:
                await this.page.click(this.isManButton);
                break;
            case Gender.Woman:
                await this.page.click(this.isWomanButton);
                break;
            case Gender.Child:
                await this.page.click(this.isChildButton);
                break;
            default:
                throw new Error(`Invalid radio button option: ${option}`);
        }
    }

    async verifyAllFiltersAreVisible(): Promise<void> {
        await expect(this.page.locator(this.searchInput)).toBeVisible();
        await expect(this.page.locator(this.submitButton)).toBeVisible();
        await expect(this.page.locator(this.regionDropdown)).toBeVisible();
        await expect(this.page.locator(this.specializationDropdown)).toBeVisible();
        await expect(this.page.locator(this.isManButton)).toBeVisible();
        await expect(this.page.locator(this.isWomanButton)).toBeVisible();
        await expect(this.page.locator(this.isChildButton)).toBeVisible();
    }

}