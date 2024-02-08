import {Frame, FrameLocator, Page} from 'playwright';


export enum UserTab {
    Donor = 0, Charity = 1
}

export default class LoginPage {
    private readonly page: Page;

    private readonly phoneNumber = '#phoneNumber';
    private readonly password = '#password';
    private readonly username = '#username';
    private readonly otpCode = '#code';
    private readonly submitButton = '#kc-login';
    private readonly sendOtpButton = 'input.pf-c-button';

    private readonly donorIframeSelector: string = `iframe[src*="keycloak.shefa.live/realms/shefa-doner"]`
    private readonly charityIframeSelector: string = `iframe[src*="keycloak.shefa.live/realms/shefa-charity"]`
    private readonly adminIframeSelector: string = `iframe[src*="keycloak.shefa.live/realms/shefa-admin"]`

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(tab: UserTab) {
        await this.page.goto(`/sign-in?tab=${tab}`);
    }

    async navigateAdmin() {
        await this.page.goto(`./login/admin`);
    }

    async loginAsDonor(phoneNumber: string, otpCode: string) {
        await this.navigate(UserTab.Donor);

        const frameLocator = await this.page.frameLocator(this.donorIframeSelector);

        await this.loginWithOtp(frameLocator, phoneNumber, otpCode);
    }

    async loginAsCharity(phoneNumber: string, password: string) {
        await this.navigate(UserTab.Charity);

        const frameLocator = await this.page.frameLocator(this.charityIframeSelector);

        await this.loginWithCredentials(frameLocator, phoneNumber, password);
    }

    async loginAsAdmin(phoneNumber: string, password: string) {
        await this.navigateAdmin();

        const frameLocator = await this.page.frameLocator(this.adminIframeSelector);

        await this.loginWithCredentials(frameLocator, phoneNumber, password);
    }

    private async loginWithOtp(frame: FrameLocator, phoneNumber: string, otpCode: string) {
        await frame.locator(this.phoneNumber).fill(phoneNumber);
        await frame.locator(this.sendOtpButton).click();
        await frame.locator(this.otpCode).fill(otpCode);
        await frame.locator(this.submitButton).click();
    }

    private async loginWithCredentials(frame: FrameLocator, username: string, password: string) {
        await frame.locator(this.username).fill(username);
        await frame.locator(this.password).fill(password);
        await frame.locator(this.submitButton).click();
    }

    private async getLoginFrame(): Promise<Frame> {
        const frameHandle = await this.page.waitForSelector('iframe[src*="keycloak.shefa.live"]');
        const frame = await frameHandle.contentFrame();
        if (frame === null) {
            throw new Error('Login frame not found');
        }
        return frame;
    }
}
