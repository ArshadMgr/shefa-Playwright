import {Page} from 'playwright';
import { constants } from '../../constants/case.auditors.text';
import {expect} from "@playwright/test";
import { CaseAuditor } from '../utils/enums';
import { General } from '../utils/general';

export class AdminProfileMenu {
    private readonly page: Page;
    private readonly general: General;

    private readonly activeRoleSelector: string = `div[data-cy="active-role"]`;
    private readonly changeUserRoleBtnSelector: string = 'div[data-cy="change-user-role-btn"]';
    private readonly changeUserRoleDropDownSelector: string = 'div[data-cy="change-user-role-drop-down"] span.p-inputtext';

    private readonly confirmBtnSelector: string = 'div[data-cy="confirm-btn"] button';

    constructor(page: Page) {
        this.page = page;
        this.general = new General(page);
    }
    async checkOrChangeUserRole(auditorText: string){
        const isActiveRoleEqualsRequiredAuditor = await this.isActiveRoleEqualsAuditor(auditorText);
        if(!isActiveRoleEqualsRequiredAuditor)
        {
            await this.changeUserRole(auditorText);
        }
    }
    async isActiveRoleEqualsAuditor(auditorText: string): Promise<boolean>{
        await expect(this.page.locator(this.activeRoleSelector)).toBeVisible();
        const activeRoleText = await this.page.locator(this.activeRoleSelector).textContent();
        return (activeRoleText === auditorText);
    }
    async changeUserRole(auditorText: string){
        await this.clickChangeUserRoleBtn();
        await this.clickChangeUserRoleDropDown();
        await this.clickAuditorOption(auditorText);
        await this.clickConfirmBtn();
    }
    async clickChangeUserRoleBtn(){
        await this.page.locator(this.changeUserRoleBtnSelector).click();
    }
    async clickChangeUserRoleDropDown(){
        await this.page.locator(this.changeUserRoleDropDownSelector).click();
    }
    async clickAuditorOption(auditorText: string){
        await this.general.chooseDropDownOptionHasText(auditorText);
    }
    async clickConfirmBtn(){
        await this.page.locator(this.confirmBtnSelector).click();
    }
}