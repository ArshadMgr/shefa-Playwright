import {Page} from 'playwright';

export class DonorProfileMenu {
    private readonly page: Page;

    private readonly myAccount: string = '.item span:has-text("حسابي")';

    constructor(page: Page) {
        this.page = page;
    }

    async clickMyAccount(){
        await this.page.locator(this.myAccount).click();
    }
}