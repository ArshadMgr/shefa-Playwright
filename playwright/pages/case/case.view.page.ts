import {Page} from 'playwright';
import {constants} from '../../constants/case.text';
import { General } from '../utils/general';
import {constants as auditorConstants} from '../../constants/case.auditors.text';

export class CaseViewPage {
    private readonly general: General;
    
    private readonly identityTypeViewSelector: string = 'span[data-cy="identity-type"] input';
    private readonly identityNumberViewSelector: string = 'span[data-cy="identity-number"] input';
    private readonly gregorianBirthdateViewSelector: string = 'span[data-cy="gregorian-birthdate"] input';
    private readonly hijriBirthdateViewSelector: string = 'span[data-cy="hijri-birthdate"] input';
    private readonly idExpirationViewSelector: string = 'span[data-cy="id-expiration"] input';
    private readonly regionViewSelector: string = 'span[data-cy="region"] input';
    private readonly cityViewSelector: string = 'span[data-cy="city"] input';
    private readonly addressViewSelector: string = 'span[data-cy="address"] input';
    private readonly phoneNumberViewSelector: string = 'span[data-cy="phone-number"] input';
    private readonly photoNameViewSelector: string = 'span[data-cy="photo-name"]';
    
    private readonly medicalReportFileNameViewSelector: string = 'span[data-cy="medical-report-file-name"]';
    private readonly financialCostViewSelector: string = 'span[data-cy="financial-cost"] input';
    private readonly financialCostFileNameViewSelector: string = 'span[data-cy="financial-cost-file-name"]';
    private readonly falseDivideMedicationViewSelector: string = 'div[data-cy="divide-false"] .p-radiobutton-box';
    private readonly trueDivideMedicationViewSelector: string = 'div[data-cy="divide-true"] .p-radiobutton-box';

    private readonly maritalStatusViewSelector: string = 'span[data-cy="marital-status-value"] input';
    private readonly socialStatusViewSelector: string = 'span[data-cy="social-status-value"] input';
    private readonly canServeHimselfViewSelector: string = 'span[data-cy="can-serve-himself-value"] input';
    private readonly jobViewSelector: string = 'input[data-cy="job-value"]';
    private readonly joblessViewSelector: string = 'span[data-cy="jobless-value"] input';
    private readonly accommodationTypeViewSelector: string = 'span[data-cy="accommodation-type-value"] input';
    private readonly accommodationOwnershipViewSelector: string = 'span[data-cy="accommodation-ownership-value"] input';
    private readonly annualWageViewSelector: string = 'span[data-cy="annual-wage-value"] input';
    private readonly numberOfFamilyMembersViewSelector: string = 'span[data-cy="number-of-family-members-value"] input';
    private readonly patientIncomeViewSelector: string = 'span[data-cy="patient-income-value"] input';
    private readonly familyIncomeViewSelector: string = 'span[data-cy="family-income-value"] input';
    private readonly isMemberOfZakahViewSelector: string = 'span[data-cy="is-member-of-zakah-value"] input';
    private readonly caseStoryViewSelector: string = 'div[data-cy="case-story-value"] textarea';
    private readonly searchTypeViewSelector: string = 'span[data-cy="search-type-value"] input';

    private readonly specialtyDataCy: string = 'specialty';
    private readonly actionTypeDataCy: string = 'action-type';
    private readonly actionDescriptionDataCy: string = 'action-description';
    private readonly caseEvaluationDataCy: string = 'case-evaluation';

    private readonly storyTitleSelector = 'span[data-cy="story-title"] input';
    private readonly shownStorySelector = 'div[data-cy="shown-story"] textarea';
    private readonly storyPhotoSelector = 'span[data-cy="story-photo"]';

    private readonly caseStatusSelector = 'span[data-cy="case-status"]';

    private readonly highlightClass: RegExp = new RegExp(/p-highlight/);

    private readonly notesCellSelector: string = `div[data-cy="actions-table"] tr td >> nth=4`;

    constructor(page: Page) {
        this.general = new General(page);
    }
    
    async verifyCaseFields(){
        await this.verifyPersonalInfo();
        await this.verifyMedicalInfo();
        await this.verifySocialInfo();
    }
    async verifyPersonalInfo(){
        await this.general.verifyVisibilityAndValue(this.identityTypeViewSelector, constants.visa);
        await this.general.verifyVisibilityAndValue(this.identityNumberViewSelector, constants.visaNumber);
        await this.general.verifyVisibilityAndValue(this.gregorianBirthdateViewSelector, constants.gregorianBirthdateView);
        await this.general.verifyVisibilityAndValue(this.hijriBirthdateViewSelector, constants.hijriBirthdateView);
        await this.general.verifyVisibilityAndValue(this.idExpirationViewSelector, constants.gregorianVisaExpirationDateView);
        await this.general.verifyVisibilityAndValue(this.regionViewSelector, constants.riyad);
        await this.general.verifyVisibilityAndValue(this.cityViewSelector, constants.shaqra);
        await this.general.verifyVisibilityAndValue(this.addressViewSelector, constants.address);
        await this.general.verifyVisibilityAndValue(this.phoneNumberViewSelector, constants.phoneView);
        await this.general.verifyVisibilityAndContainTextContent(this.photoNameViewSelector, constants.idPhotoFileName);
    }
    async verifyMedicalInfo(){
        await this.general.verifyVisibilityAndContainTextContent(this.medicalReportFileNameViewSelector, constants.medicalReportFileName);
        await this.general.verifyVisibilityAndAttributeValue(this.financialCostViewSelector, 'aria-valuenow', constants.financialCost);
        await this.general.verifyVisibilityAndContainTextContent(this.financialCostFileNameViewSelector, constants.financialCostFileName);

        await this.general.verifyVisibilityAndClass(this.falseDivideMedicationViewSelector, this.highlightClass);
        await this.general.verifyVisibilityAndNotHaveClass(this.trueDivideMedicationViewSelector, this.highlightClass);
    }
    async verifySocialInfo(){
        await this.general.verifyVisibilityAndValue(this.maritalStatusViewSelector, constants.married);
        await this.general.verifyVisibilityAndValue(this.socialStatusViewSelector, constants.widower);
        await this.general.verifyVisibilityAndValue(this.canServeHimselfViewSelector, constants.needHelp);
        await this.general.verifyVisibilityAndValue(this.jobViewSelector, constants.job);
        await this.general.verifyVisibilityAndValue(this.joblessViewSelector, constants.No);
        await this.general.verifyVisibilityAndValue(this.accommodationTypeViewSelector, constants.room);
        await this.general.verifyVisibilityAndValue(this.accommodationOwnershipViewSelector, constants.rent);
        await this.general.verifyVisibilityAndValue(this.annualWageViewSelector, constants.lessThan5000);
        await this.general.verifyVisibilityAndValue(this.numberOfFamilyMembersViewSelector, constants.five);
        await this.general.verifyVisibilityAndValue(this.patientIncomeViewSelector, constants.lessThan1500);
        await this.general.verifyVisibilityAndValue(this.familyIncomeViewSelector, constants.lessThan2500);
        await this.general.verifyVisibilityAndValue(this.isMemberOfZakahViewSelector, constants.No);
        await this.general.verifyVisibilityAndValue(this.caseStoryViewSelector, constants.caseStory);
        await this.general.verifyVisibilityAndValue(this.searchTypeViewSelector, constants.call);
    }
    async verifyInfoEnteredByMedicalAuditor(){
        await this.general.verifyDropDownSelectedValue(this.specialtyDataCy, auditorConstants.specialtyText);
        await this.general.verifyDropDownSelectedValue(this.actionTypeDataCy, auditorConstants.actionTypeText);
        await this.general.verifyDropDownSelectedValue(this.actionDescriptionDataCy, auditorConstants.actionDescriptionText);
        await this.general.verifyDropDownSelectedValue(this.caseEvaluationDataCy, auditorConstants.caseEvaluationText);
    }
    async verifyCaseStatus(caseStatus: string){
        await this.general.verifyVisibilityAndTextContent(this.caseStatusSelector, caseStatus);
    }
    async verifyStoryInfo(){
        await this.general.verifyVisibilityAndValue(this.storyTitleSelector, auditorConstants.storyTitleText);
        await this.general.verifyVisibilityAndValue(this.shownStorySelector, auditorConstants.shownStoryText);
        await this.general.verifyVisibilityAndContainTextContent(this.storyPhotoSelector, auditorConstants.storyPhotoFileName);
    }
    async verifyAuditorNotes(notes: string){
        await this.general.verifyVisibilityAndTextContent(this.notesCellSelector, notes);
    }
}
