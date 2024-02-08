import { Page } from 'playwright';

export class Navbar {
    private readonly page: Page;
    private readonly isMobile?: boolean;

    private readonly logoSelector = '.navbar-brand img';
    private readonly homeLinkSelector = '.nav-item a[href="/home"]';
    private readonly casesLinkSelector = '.nav-item a[href="/cases-list"]';
    private readonly donationOptionsSelector = 'a[data-cy="donation-options"]';
    private readonly whoWeAreLinkSelector = '.collapse:visible .nav-item a[href="/about-us"]';
    private readonly navbarToggleBtnSelector = '.navbar-toggler';
    private readonly navbarToggleUserDropDownSelector = 'div:visible[data-cy="user-info"]';
    private readonly myAccountSelector = '#overlay_menu_0 span:has-text("حسابي")';
    private readonly controlPanelSelector = '#overlay_menu_0 span:has-text("لوحة التحكم")';
    private readonly logoutSelector = 'span.p-menuitem-text:has-text("تسجيل الخروج")';
    private readonly navCampaignTabSelector = "div[data-cy='campaigns-tab']";



    constructor(page: Page, isMobile?: boolean) {
        this.page = page;
        this.isMobile = isMobile;
    }

    async clickHomeLink(): Promise<void> {
        await this.page.click(this.homeLinkSelector);
    }

    async clickTopAmbassadorsLink(): Promise<void> {
        await this.page.click(this.donationOptionsSelector);
        await this.page.locator('span:has-text("سفير شفاء")').click();
    }
    async clickCasesLink(): Promise<void> {
        await this.page.click(this.casesLinkSelector);
    }

    async isLogoVisible(): Promise<boolean> {
        return await this.page.isVisible(this.logoSelector);
    }

    async clickCampaignsLink() {
        await this.page.click(this.donationOptionsSelector);
        await this.page.locator('span:has-text("الحملات")').click();
    }

    async clickWaqfLink() {
        await this.page.click(this.donationOptionsSelector);
        await this.page.locator('span:has-text("الأوقاف")').click();
    }

    async clickZakatLink() {
        await this.page.click(this.donationOptionsSelector);
        await this.page.locator('span:has-text("الزكاة")').click();
    }

    async clickAllCasesDonationLink() {
        await this.page.click(this.donationOptionsSelector);
        await this.page.locator('span:has-text("التبرع الشامل")').click();
    }
    async clickWhoWeAreLink(): Promise<void> {
        await this.page.click(this.whoWeAreLinkSelector);
    }
    async openMobileNavbar(){
        if(this.isMobile)
           await this.page.click(this.navbarToggleBtnSelector);
    }
    async clickUserToggleLink(): Promise<void> {
        await this.page.click(this.navbarToggleUserDropDownSelector);
    }
    async clickMyAccountBtn(){
        await this.page.click(this.myAccountSelector);
    }
    async clickControlPanelBtn(){
        await this.page.click(this.controlPanelSelector);
    }
    async logout(){
        await this.page.click(this.logoutSelector);
    }

    async navCampaignTab(){

        await this.page.click(this.navCampaignTabSelector);

    }




}
