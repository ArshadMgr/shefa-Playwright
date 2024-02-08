import {Page} from 'playwright';
import {expect} from "@playwright/test";
import {constants} from '../../constants/case.text';
import { General } from '../utils/general';


export class CaseCreatePage {
    private readonly page: Page;
    private readonly general: General;

    private readonly addNewCaseButtonSelector: string = `button span[data-cy="add-new-case"]`
    
    private readonly identityTypeDropDownSelector: string = `span[data-cy="identity-type"] span.p-inputtext`;
    private readonly visaSelector: string = `#identityType_list li:has-text('${constants.visa}')`;
    private readonly identityNumberSelector: string = `span[data-cy="identity-number-input"] input`;
    private readonly gregorianBirthdateSelector: string = `span[data-cy="gregorian-birthdate-calendar"] input`;
    private readonly highlightedCalendarDaySelector: string = `.p-datepicker-calendar span.p-highlight`;
    private readonly hijriBirthdateSelector: string = `span[data-cy="hijri-birthdate-calendar"] input`;
    private readonly gregorianVisaExpirationSelector: string = `span[data-cy="gregorian-visa-expiration-calendar"] input`;
    private readonly hijriVisaExpirationSelector: string = `span[data-cy="hijri-visa_expiration_date-calendar"] input`;
    private readonly trackingButtonCaseInfoSelector: string = `button[data-cy="tracking-button"]`;
    
    private readonly trackingButtonPrevRequestsOnIdentitySelector: string = `button[data-cy="tracking-btn"]`;
    
    private readonly areaDropDownSelector: string = `div[data-cy="state-from-area"] span.p-inputtext`;
    private readonly riyadSelector: string = `#regionList_list li:has-text('${constants.riyad}')`;
    private readonly cityDropDownSelector: string = `div[data-cy="state-from-city"] span.p-inputtext`;
    private readonly shaqraDropDownSelector: string = `#cityList_list li:has-text('${constants.shaqra}')`;
    private readonly addressSelector: string = `div[data-cy="address"] input`;
    private readonly mobileSelector: string = `div[data-cy="mobile"] input`;
    private readonly idPhotoUploadSelector: string = `div[data-cy="id-photo-upload"] span.p-fileupload-choose`;
    private readonly idPhotoInputSelector: string = `div[data-cy="id-photo-upload"] input`;
    private readonly trackingButtonPersonalInfoSelector: string = `div[data-cy="tracking-btn"] button`;
    
    private readonly trackingButtonInsuranceInfoSelector: string = `div[data-cy="tracking-button"] button`;
    
    private readonly medicalReportSelector: string = `div[data-cy="medical-report-upload"] input`;
    private readonly financialCostSelector: string = `div[data-cy="financial-cost-input"] input`;
    private readonly financialCostAttachmentSelector: string = `div[data-cy="financial-cost-attachment"] input`;
    private readonly falseDivideMedicationSelector: string = `div[data-cy="divide-false"] div.p-radiobutton-box`;
    private readonly trackingButtonMedicalInfoSelector: string = `div[data-cy="tracking-button"] button`;
    
    private readonly maritalStatusSelector: string = `div[data-cy="marital-status"] span.p-inputtext`;
    private readonly marriedSelector: string = `.p-dropdown-items li:has-text('${constants.married}')`;
    private readonly socialStatusSelector: string = `div[data-cy="social-status"] span.p-inputtext`;
    private readonly widowerSelector: string = `.p-dropdown-items li:has-text('${constants.widower}')`;
    private readonly canServeHimselfSelector: string = `div[data-cy="can-serve-himself"] span.p-inputtext`;
    private readonly needHelpSelector: string = `.p-dropdown-items li:has-text('${constants.needHelp}')`;
    private readonly jobSelector: string = `span[data-cy="job-input"] input`;
    private readonly joblessSelector: string = `div[data-cy="jobless-input"] span.p-inputtext`;
    private readonly noJoblessSelector: string = `.p-dropdown-items li:has-text('${constants.No}')`;
    private readonly accommodationTypeSelector: string = `div[data-cy="accommodation-type"] span.p-inputtext`;
    private readonly roomSelector: string = `.p-dropdown-items li:has-text('${constants.room}')`;
    private readonly accommodationOwnershipSelector: string = `div[data-cy="accommodation-ownership"] span.p-inputtext`;
    private readonly rentSelector: string = `.p-dropdown-items li:has-text('${constants.rent}')`;
    private readonly annualWageSelector: string = `div[data-cy="annual-wage"] span.p-inputtext`;
    private readonly lessThan5000AnnualWageSelector: string = `.p-dropdown-items li:has-text('${constants.lessThan5000}')`;
    private readonly numberOfFamilyMembersSelector: string = `div[data-cy="number-of-family-members"] span.p-inputtext`;
    private readonly fiveFamilyMembersSelector: string = `.p-dropdown-items li:has-text('${constants.five}')`;
    private readonly patientIncomeSelector: string = `div[data-cy="patient-income"] span.p-inputtext`;
    private readonly lessThan1500PatientIncomeSelector: string = `.p-dropdown-items li:has-text('${constants.lessThan1500}')`;
    private readonly familyIncomeSelector: string = `div[data-cy="family-income"] span.p-inputtext`;
    private readonly lessThan2500FamilyIncomeSelector: string = `.p-dropdown-items li:has-text('${constants.lessThan2500}')`;
    private readonly isMemberOfZakahSelector: string = `div[data-cy="is-member-of-zakah"] span.p-inputtext`;
    private readonly noNeedForZakahSelector: string = `.p-dropdown-items li:has-text('${constants.No}')`;
    private readonly caseStorySelector: string = `div[data-cy="case-story"] textarea`;
    private readonly searchTypeSelector: string = `div[data-cy="search-type"] span.p-inputtext`;
    private readonly callSelector: string = `.p-dropdown-items li:has-text('${constants.call}')`;
    
    private readonly termsAndConditionsCheckboxSelector: string = `div[data-cy="terms-and-conditions"] div.p-checkbox-box`;
    private readonly sendRequestButtonSelector: string = `div[data-cy="send-request"] button`;

    constructor(page: Page) {
        this.page = page;
        this.general = new General(page);
    }

    async addNewCase(){
        await this.page.locator(this.addNewCaseButtonSelector).click();

        await this.fillCaseInfo();

        await this.page.locator(this.trackingButtonPrevRequestsOnIdentitySelector).click();
        
        await this.fillPersonalInfo();
        await this.fillInsuranceInfo();
        await this.fillMedicalInfo();
        await this.fillSocialInfo();

        await this.page.locator(this.termsAndConditionsCheckboxSelector).click();
        await this.page.locator(this.sendRequestButtonSelector).click();
    }
    
    
    async fillCaseInfo(){
        await this.page.locator(this.identityTypeDropDownSelector).click();
        await this.page.locator(this.visaSelector).click();

        await this.page.locator(this.identityNumberSelector).fill(constants.visaNumber);

        await this.page.locator(this.gregorianBirthdateSelector).fill(constants.gregorianBirthdate);
        await this.page.locator(this.highlightedCalendarDaySelector).click();
        await expect(this.page.locator(this.hijriBirthdateSelector)).toHaveValue(constants.hijriBirthdate);

        await this.page.locator(this.trackingButtonCaseInfoSelector).click();
    }
    async fillPersonalInfo(){
        await this.page.locator(this.areaDropDownSelector).click();
        await this.page.locator(this.riyadSelector).click();

        await this.page.locator(this.cityDropDownSelector).click();
        await this.page.locator(this.shaqraDropDownSelector).click();

        await this.page.locator(this.addressSelector).fill(constants.address);
        await this.page.locator(this.mobileSelector).fill(constants.phone);
        await this.page.setInputFiles(this.idPhotoInputSelector, constants.idPhotoFilePath);
        await this.page.locator(this.trackingButtonPersonalInfoSelector).click();
    }
    async fillInsuranceInfo(){
        await this.page.locator(this.trackingButtonInsuranceInfoSelector).click();
    }
    async fillMedicalInfo(){
        await this.page.setInputFiles(this.medicalReportSelector, constants.medicalReportFilePath);
        await this.page.locator(this.financialCostSelector).fill(constants.financialCost);
        await this.page.setInputFiles(this.financialCostAttachmentSelector, constants.financialCostFilePath);
        await this.page.locator(this.falseDivideMedicationSelector).click();
        await this.page.locator(this.trackingButtonMedicalInfoSelector).click();
    }
    async fillSocialInfo(){
        await this.page.locator(this.maritalStatusSelector).click();
        await this.page.locator(this.marriedSelector).click();

        await this.page.locator(this.socialStatusSelector).click();
        await this.page.locator(this.widowerSelector).click();

        await this.page.locator(this.canServeHimselfSelector).click();
        await this.page.locator(this.needHelpSelector).click();

        await this.page.locator(this.jobSelector).fill(constants.job);

        await this.page.locator(this.joblessSelector).click();
        await this.page.locator(this.noJoblessSelector).click();

        await this.page.locator(this.accommodationTypeSelector).click();
        await this.page.locator(this.roomSelector).click();

        await this.page.locator(this.accommodationOwnershipSelector).click();
        await this.page.locator(this.rentSelector).click();

        await this.page.locator(this.annualWageSelector).click();
        await this.page.locator(this.lessThan5000AnnualWageSelector).click();

        await this.page.locator(this.numberOfFamilyMembersSelector).click();
        await this.page.locator(this.fiveFamilyMembersSelector).click();

        await this.page.locator(this.patientIncomeSelector).click();
        await this.page.locator(this.lessThan1500PatientIncomeSelector).click();

        await this.page.locator(this.familyIncomeSelector).click();
        await this.page.locator(this.lessThan2500FamilyIncomeSelector).click();

        await this.page.locator(this.isMemberOfZakahSelector).click();
        await this.page.locator(this.noNeedForZakahSelector).click();

        await this.page.locator(this.caseStorySelector).fill(constants.caseStory);

        await this.page.locator(this.searchTypeSelector).click();
        await this.page.locator(this.callSelector).click();
    }
}
