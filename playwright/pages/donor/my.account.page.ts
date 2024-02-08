import {Page} from 'playwright';
import {expect} from "@playwright/test";
import { constants } from '../../constants/my.account.text';

export class MyAccountPage {
    private readonly page: Page;

    private readonly firstName: string = `span[data-cy="first-name"] input`;
    private readonly lastName: string = `span[data-cy="last-name"] input`;
    private readonly email: string = `span[data-cy="email"] input`;
    private readonly phone: string = `div[data-cy="phone"] input`;
    private readonly dateOfBirthGregorianLabel: string = `label[data-cy="date-of-birth-gregorian-label"]`;
    private readonly dateOfBirthGregorian: string = `div[data-cy="date-of-birth-gregorian"] input`;
    private readonly dateOfBirthHijriLabel: string = `label[data-cy="date-of-birth-hijri-label"]`;
    private readonly dateOfBirthHijri: string = `div[data-cy="date-of-birth-hijri"] input`;
    private readonly gender: string = `label[data-cy="gender"]`;
    private readonly maleRadioBtn: string = `div[data-cy="male-radio-btn"] .p-radiobutton-box`;
    private readonly maleLabel: string = `label[data-cy="male-label"]`;
    private readonly femaleRadioBtn: string = `div[data-cy="female-radio-btn"] .p-radiobutton-box`;
    private readonly femaleLabel: string = `label[data-cy="female-label"]`;
    private readonly regionLabel: string = `label[data-cy="region-label"]`;
    private readonly region: string = `div[data-cy="region"] .p-dropdown-label`;
    private readonly accountSettings: string = `span[data-cy="account-settings"]`;
    private readonly yourNameInList: string = `span[data-cy="your-name-in-list"] input`;
    private readonly hideAmbassadorNameCheckbox: string = `div[data-cy="hide-ambassador-name-checkbox"] .p-checkbox-box`;
    private readonly hideAmbassadorNameLabel: string = `label[data-cy="hide-ambassador-name"]`;
    private readonly hideDonorNameCheckbox: string = `div[data-cy="hide-donor-name-checkbox"] .p-checkbox-box`;
    private readonly hideDonorNameLabel: string = `label[data-cy="hide-donor-name"]`;
    private readonly save: string = `button[data-cy="save"]`;
    private readonly highlightClass: RegExp = new RegExp(/p-highlight/);

    constructor(page: Page) {
        this.page = page;
    }

    async verifyAllFields(){
        await expect(this.page.locator(this.firstName)).toBeVisible();
        await expect(this.page.locator(this.firstName)).toHaveValue(constants.firstName);

        await expect(this.page.locator(this.lastName)).toBeVisible();
        await expect(this.page.locator(this.lastName)).toHaveValue(constants.lastName);

        await expect(this.page.locator(this.email)).toBeVisible();
        await expect(this.page.locator(this.email)).toHaveValue(constants.email);


        await expect(this.page.locator(this.phone)).toBeVisible();
        await expect(this.page.locator(this.phone)).toHaveValue(constants.phone);


        await expect(this.page.locator(this.dateOfBirthGregorianLabel)).toBeVisible();

        await expect(this.page.locator(this.dateOfBirthGregorian)).toBeVisible();
        await expect(this.page.locator(this.dateOfBirthGregorian)).toHaveValue(constants.dateOfBirthMiladi);

        await expect(this.page.locator(this.dateOfBirthHijriLabel)).toBeVisible();

        await expect(this.page.locator(this.dateOfBirthHijri)).toBeVisible();
        await expect(this.page.locator(this.dateOfBirthHijri)).toHaveValue(constants.dateOfBirthHijri);

        await expect(this.page.locator(this.gender)).toBeVisible();

        await expect(this.page.locator(this.maleRadioBtn)).toBeVisible();
        await expect(this.page.locator(this.maleRadioBtn)).toHaveClass(this.highlightClass);

        await expect(this.page.locator(this.maleLabel)).toBeVisible();

        await expect(this.page.locator(this.femaleRadioBtn)).toBeVisible();
        await expect(this.page.locator(this.femaleRadioBtn)).not.toHaveClass(this.highlightClass);

        await expect(this.page.locator(this.femaleLabel)).toBeVisible();

        await expect(this.page.locator(this.regionLabel)).toBeVisible();

        await expect(this.page.locator(this.region)).toBeVisible();
        await expect(this.page.locator(this.region)).toHaveText(constants.region);

        await expect(this.page.locator(this.accountSettings)).toBeVisible();

        await expect(this.page.locator(this.yourNameInList)).toBeVisible();
        await expect(this.page.locator(this.yourNameInList)).toHaveValue(constants.yourNameInList);

        await expect(this.page.locator(this.hideAmbassadorNameCheckbox)).toBeVisible();
        await expect(this.page.locator(this.hideAmbassadorNameCheckbox)).toHaveClass(this.highlightClass);

        await expect(this.page.locator(this.hideAmbassadorNameLabel)).toBeVisible();

        await expect(this.page.locator(this.hideDonorNameCheckbox)).toBeVisible();
        await expect(this.page.locator(this.hideDonorNameCheckbox)).toHaveClass(this.highlightClass);

        await expect(this.page.locator(this.hideDonorNameLabel)).toBeVisible();

        await expect(this.page.locator(this.save)).toBeVisible();
        await expect(this.page.locator(this.save)).toHaveText(constants.save);
    }
}