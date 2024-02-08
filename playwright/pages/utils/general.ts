import { Page } from 'playwright';
import {expect} from "@playwright/test";
import * as fs from 'node:fs';

export class General {
    private readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    async verifyVisibilityAndTextContent(selector: string, textContent: string){
        await expect(this.page.locator(selector)).toBeVisible();
        await expect(this.page.locator(selector)).toHaveText(textContent);
    }
    async verifyVisibilityAndContainTextContent(selector: string, textContent: string){
        await expect(this.page.locator(selector)).toBeVisible();
        await expect(this.page.locator(selector)).toContainText(textContent);
    }
    async verifyVisibilityAndValue(selector: string, value: string){
        await expect(this.page.locator(selector)).toBeVisible();
        await expect(this.page.locator(selector)).toHaveValue(value);
    }
    async verifyVisibilityAndAttributeValue(selector: string, attribute: string, value: string){
        await expect(this.page.locator(selector)).toBeVisible();
        await expect(this.page.locator(selector)).toHaveAttribute(attribute, value);
    }
    async verifyVisibilityAndClass(selector: string, className: RegExp){
        await expect(this.page.locator(selector)).toBeVisible();
        await expect(this.page.locator(selector)).toHaveClass(className);
    }
    async verifyVisibilityAndNotHaveClass(selector: string, className: RegExp){
        await expect(this.page.locator(selector)).toBeVisible();
        await expect(this.page.locator(selector)).not.toHaveClass(className);
    }
    createFileStream(filePath: string){
        return fs.createReadStream(filePath);
    }
    async getAccessToken(){
        const contextCookies = await this.page.context().cookies();
        
        var accessTokenObj = contextCookies.find(obj => {
          return obj.name === "access_token"
        });
        
        var accessToken = accessTokenObj ? accessTokenObj["value"] : '';

        return accessToken;
    }
    async clickOnDropDown(dataCy: string){
        let dropDownSelector: string = `div[data-cy="${dataCy}"] span.p-inputtext`;
        await this.page.locator(dropDownSelector).click();
    }
    async chooseDropDownOptionHasText(optionText: string){
        let optionSelector: string = `ul li:has-text('${optionText}')`;
        await this.page.locator(optionSelector).click();
    }
    async verifyDropDownSelectedValue(dataCy: string, selectedValue: string){
        let dropDownSelector: string = `div[data-cy="${dataCy}"] span.p-inputtext`;
        await this.verifyVisibilityAndContainTextContent(dropDownSelector, selectedValue);
    }
    convertfileToBase64String(filePath:string, prefix:string){
        const base64File = fs.readFileSync(filePath, {encoding: 'base64'});
        return prefix + base64File;
    }
}
