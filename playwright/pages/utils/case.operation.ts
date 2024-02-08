import { Page } from "playwright/test";
import { General } from "./general";
import {constants} from '../../constants/case.text';
import {constants as apiConstants} from '../../constants/case.api.text';
import {constants as generalConstants} from '../../constants/general.text';


export class CaseOperation{

    private readonly page: Page;
    private readonly general: General;

    private static caseId: string;

    public static get CaseId() :string {
        return this.caseId;
    }

    constructor(page: Page) {
        this.page = page;
        this.general = new General(page);
    }

    async addNewCaseByAPIs(){
        const photoFileStream = this.general.createFileStream(constants.idPhotoFilePath);
        const amountFileStream = this.general.createFileStream(constants.financialCostFilePath);
        const medicalReportFileStream = this.general.createFileStream(constants.medicalReportFilePath);
  
        const accessToken = await this.general.getAccessToken();
  
        const response = await this.page.request.post(`${process.env.VUE_APP_API_URL}${apiConstants.createCaseUrl}`, {
          headers: {
            Accept: "*/*",
              ContentType: "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
            multipart: {
              accommodation_ownership:apiConstants.accommodationOwnership,
              accommodation_type:apiConstants.accommodationType,
              address:constants.address,
              age:apiConstants.age,
              amount: constants.financialCost,
              amount_attachment:amountFileStream,
              annual_wage:apiConstants.annualWage,
              area:apiConstants.area,
              can_serve_himself:apiConstants.canServeHimself,
              city:apiConstants.city,
              family_income:apiConstants.familyIncome,
              father_name:apiConstants.fatherName,
              first_name:apiConstants.firstName,
              gender:apiConstants.gender,
              gregorian_birthdate:constants.gregorianBirthdate,
              gregorian_visa_expiration_date:apiConstants.gregorianVisaExpirationDate,
              hijri_birthdate: constants.hijriBirthdate,
              hijri_visa_expiration_date:apiConstants.hijriVisaExpirationDate,
              id_expiration:constants.gregorianVisaExpirationDate,
              id_photo:photoFileStream,
              identity_number: constants.visaNumber,
              identity_type: apiConstants.identityType,
              job: constants.job,
              jobless: apiConstants.jobless,
              last_name: apiConstants.lastName,
              marital_status: apiConstants.maritalStatus,
              medical_report:medicalReportFileStream,
              mobile_number: constants.phone,
              nationality: apiConstants.nationality,
              number_of_family_members: apiConstants.numberOfFamilyMembers,
              patient_income: apiConstants.patientIncome,
              phases: apiConstants.phases,
              publish_on_charity_page: apiConstants.publishOnCharityPage,
              search_type: apiConstants.searchType,
              shefaa_exclusive_flag: apiConstants.shefaaExclusiveFlag,
              social_status:apiConstants.socialStatus,
              split_into_phases: apiConstants.splitIntoPhases,
              status: apiConstants.waitingTechnicalAuditorApprovalStatus,
              story: constants.caseStory,
              terms_and_conditions_flag: apiConstants.termsAndConditionsFlag,
              worthy_of_zakah: apiConstants.worthyOfZakah
          }
        });
        
        const responseJson  = await response.json();
        CaseOperation.caseId = responseJson.result.id;
    }
    async getCaseDetailsByAPIs(){
        
      const accessToken = await this.general.getAccessToken();

      const response = await this.page.request.get(`${process.env.VUE_APP_API_URL}${apiConstants.caseDetailsUrl}${CaseOperation.caseId}?${apiConstants.caseObjType}`, {
          headers: {
            Accept: "*/*",
              ContentType: "application/json",
              Authorization: `Bearer ${accessToken}`,
            }
        });

      const responseJson  = await response.json();
      return responseJson.result;
    }
    async doActionByAuditorByAPIs(caseObj: any, caseStatus: string, caseComment: string, phases: any[], specialty?: string, actionType?: string, actionDescription?: string, evaluation?: string){

        const accessToken = await this.general.getAccessToken();

        const response = await this.page.request.put(`${process.env.VUE_APP_API_URL}${apiConstants.caseDetailsUrl}${CaseOperation.caseId}?${apiConstants.caseObjType}`, {
            headers: {
              Accept: "*/*",
                ContentType: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                case_log_comment: caseComment,
                charity_feedback_log_comment: null,
                publish_duration: apiConstants.publishDuration,
                data_to_be_modified: {
                    fields: null
                },
                case: {
                    charity_name: caseObj.case_details.charity_name,
                    created_on: caseObj.case_details.created_on,
                    status: caseStatus,
                    identity_type: caseObj.identity_information.identity_type,
                    identity_number: caseObj.identity_information.identity_number,
                    gregorian_birthdate: caseObj.identity_information.gregorian_birthdate,
                    hijri_birthdate: caseObj.identity_information.hijri_birthdate,
                    first_name: caseObj.identity_information.first_name,
                    father_name: caseObj.identity_information.father_name,
                    last_name: caseObj.identity_information.last_name,
                    nationality: caseObj.identity_information.nationality,
                    gender: caseObj.identity_information.gender,
                    id_expiration: caseObj.identity_information.id_expiration,
                    age: caseObj.identity_information.age,
                    area: caseObj.identity_information.area,
                    city: caseObj.identity_information.city,
                    address: caseObj.identity_information.address,
                    mobile_number: caseObj.identity_information.mobile_number,
                    id_photo: caseObj.identity_information.id_photo,
                    insurance_company: caseObj.insurance_information.insurance_company,
                    insurance_expiry: caseObj.insurance_information.insurance_expiry,
                    coverage_maximum_amount: caseObj.insurance_information.coverage_maximum_amount,
                    insurance_rejected_form: caseObj.insurance_information.insurance_rejected_form,
                    medical_report: caseObj.medical_information.medical_report,
                    amount: constants.financialCost,
                    amount_attachment: caseObj.medical_information.amount_attachment,
                    phases: phases,
                    specialty: specialty ?? caseObj.medical_information.specialty,
                    action_type: actionType ?? caseObj.medical_information.action_type,
                    action_description: actionDescription ?? caseObj.medical_information.action_description,
                    evaluation: evaluation ?? caseObj.medical_information.evaluation,
                    marital_status: caseObj.social_survey_details.marital_status,
                    social_status: caseObj.social_survey_details.social_status,
                    can_serve_himself: caseObj.social_survey_details.can_serve_himself,
                    job: caseObj.social_survey_details.job,
                    jobless: caseObj.social_survey_details.jobless,
                    accommodation_type: caseObj.social_survey_details.accommodation_type,
                    accommodation_ownership: caseObj.social_survey_details.accommodation_ownership,
                    annual_wage: caseObj.social_survey_details.annual_wage,
                    number_of_family_members: caseObj.social_survey_details.number_of_family_members,
                    patient_income: caseObj.social_survey_details.patient_income,
                    family_income: caseObj.social_survey_details.family_income,
                    worthy_of_zakah: caseObj.social_survey_details.worthy_of_zakah,
                    story: caseObj.social_survey_details.story,
                    search_type: caseObj.social_survey_details.search_type,
                    publish_on_charity_page: caseObj.social_survey_details.publish_on_charity_page,
                    terms_and_conditions_flag: caseObj.social_survey_details.terms_and_conditions_flag,
                    shefaa_exclusive_flag: caseObj.social_survey_details.shefaa_exclusive_flag
                }
            }            
          });

        const responseJson  = await response.json();
    }
    async addCaseInvoiceByAPIs(){
        
      const accessToken = await this.general.getAccessToken();

      const invoice = this.general.convertfileToBase64String(constants.invoiceFilePath, generalConstants.pngImgbase64Text);

      const response = await this.page.request.post(`${process.env.VUE_APP_API_URL}${apiConstants.invoicingUrl}${apiConstants.paymentRequestUrl}`, {
          headers: {
            Accept: "*/*",
              ContentType: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            data: {
              amount: constants.financialCost,
              attachment: invoice,
              charity_case: CaseOperation.caseId,
              description: constants.invoiceNotes,
              hospital: apiConstants.hospital,
              invoice_number: constants.invoiceNumber,
              phase:null
            }
      });
    }
}
