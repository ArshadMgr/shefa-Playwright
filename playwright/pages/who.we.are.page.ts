import {Page} from 'playwright';
import {expect} from "@playwright/test";
import { constants } from '../constants/who.we.are.text';

export class WhoWeArePage {
    private readonly page: Page;

    private readonly mainHeader: string = `h4[data-cy="main-header"]`;

    private readonly aboutShefaHeader: string = `div[data-cy="about-shefa-header"]`;
    private readonly aboutShefaaParFirst: string = `div[data-cy="about-shefa-first"]`;
    private readonly aboutShefaaParSecond: string = `div[data-cy="about-shefa-second"]`;
    private readonly aboutShefaaParThird: string = `span[data-cy="about-shefa-third"]`;

    private readonly aboutusImg: string = `img[data-cy="aboutus-img"]`;

    private readonly objectivesHeader: string = `div[data-cy="objectves-header"]`;
    private readonly objectivePointFirst: string = `div[data-cy="first-objective"]`;
    private readonly objectivePointSecond: string = `div[data-cy="second-objective"]`;
    private readonly objectivePointThird: string = `div[data-cy="third-objective"]`;

    private readonly prosHeader: string = `div[data-cy="shefa-pros-header"]`;
    private readonly prosPointFirst: string = `div[data-cy="first-pros"]`;
    private readonly prosPointSecond: string = `div[data-cy="second-pros"]`;
    private readonly prosPointThird: string = `div[data-cy="third-pros"]`;
    private readonly prosPointFourth: string = `div[data-cy="fourth-pros"]`;
    
    constructor(page: Page) {
        this.page = page;
    }

    async verifyMainHeader() {
        await expect(this.page.locator(this.mainHeader)).toHaveText(constants.mainHeaderText);
    }
    async verifyAboutShefa() {
        await expect(this.page.locator(this.aboutShefaHeader)).toBeVisible();
        await expect(this.page.locator(this.aboutShefaaParFirst)).toHaveText(constants.aboutShefaaParFirstText);
        await expect(this.page.locator(this.aboutShefaaParSecond)).toHaveText(constants.aboutShefaaParSecondText);
        await expect(this.page.locator(this.aboutShefaaParThird)).toHaveText(constants.aboutShefaaParThirdText);
    }
    async verifyAboutusImg(){
        await expect(this.page.locator(this.aboutusImg)).toBeVisible();
    }
    async verifyShefaObjectives() {
        await expect(this.page.locator(this.objectivesHeader)).toBeVisible();
        await expect(this.page.locator(this.objectivePointFirst)).toHaveText(constants.objectivePointFirstText);
        await expect(this.page.locator(this.objectivePointSecond)).toHaveText(constants.objectivePointSecondText);
        await expect(this.page.locator(this.objectivePointThird)).toHaveText(constants.objectivePointThirdText);
    }
    async verifyShefaPros() {
        await expect(this.page.locator(this.prosHeader)).toBeVisible();
        await expect(this.page.locator(this.prosPointFirst)).toHaveText(constants.prosPointFirstText);
        await expect(this.page.locator(this.prosPointSecond)).toHaveText(constants.prosPointSecondText);
        await expect(this.page.locator(this.prosPointThird)).toHaveText(constants.prosPointThirdText);
        await expect(this.page.locator(this.prosPointFourth)).toHaveText(constants.prosPointFourthText);
    }
}