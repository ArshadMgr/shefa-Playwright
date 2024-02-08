<template>
  <main class="edit-case d-flex flex-column align-items-start">
    <div class="d-flex justify-content-end w-100">
      <Button v-if="state.otherCasesExist"
        class="p-button p-button-rounded p-button-primary p-button-outlined align-self-end mb-4 mx-2"
        @click.stop="toggleModal"
        label="الطلبات الأخرى"
      />
      <Button
        class="p-button p-button-rounded p-button-secondary align-self-end mb-4"
        @click.stop="goBack"
      >
        <i class="pi pi-times mx-1"></i>
        إغلاق الحالة
      </Button>
    </div>

    <Card>
      <template #header>
        <div class="row">
          <div class="col-2">رقم الحالة</div>
          <div class="col-3">اسم المنشئ</div>
          <div class="col-2">تاريخ الانشاء</div>
          <div class="col-3">المبلغ المطلوب/الذي تم جمعه</div>
          <div class="col-2">الحالة</div>
        </div>
      </template>
      <template #content>
        <div v-if="!state.personalLoaded" class="text-center color-primary">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <div v-else class="row">
          <strong v-if="route.query.obj_type === 'phase'" class="col-2">
            {{ state.caseDetails.id }}-{{ state.caseData.phases[0].index }}
          </strong>
          <strong v-else class="col-2">{{ state.caseDetails.id }}</strong>
          <strong class="col-3">{{ state.caseDetails.charityName }}</strong>
          <strong class="col-2">{{ state.caseDetails.createdOn }}</strong>
          <strong class="col-3">{{ state.caseDetails.collectedRequiredAmounts }}</strong>
          <div
              class="col-2"
              :style="{
              color:
                state.caseDetails &&
                state.caseDetails.color &&
                state.caseDetails.color.code
                  ? state.caseDetails.color.code
                  : 'grey',
            }"
          >
            <span v-if="route.query.obj_type === 'phase'">
              {{ state.caseData.phases[0].status }}
            </span>
            <span v-else data-cy="case-status">
              {{ state.caseDetails.status }}
            </span>
          </div>
        </div>
      </template>
    </Card>
    <Card>
      <template #header><strong> البيانات الشخصية </strong></template>
      <template #content>
        <div v-if="!state.personalLoaded" class="text-center color-primary">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <StepPersonalInformation
            v-else
            edit-mode
            read-only
            :payload="state.caseData"
            :type-options="state.typeOptions"
            :region-options="state.regionOptions"
            :city-options="state.citiesOptions"
            :case-identity-information="state.caseData"
            v-if="state.citiesOptions?.length"
        />
      </template>
    </Card>

    <Card v-if="state.caseData.insuranceCompany ||
           state.caseData.insuranceExpiry ||
           state.caseData.coverageMaximumAmount ||
           state.caseData.insuranceRejectedForm">
      <template #header><strong> بيانات التأمين </strong></template>
      <template #content>
        <div v-if="!state.insuranceLoaded" class="text-center color-primary">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <StepInsuranceInformation
            v-else
            edit-mode
            read-only
            :payload="state.caseData"
        />
      </template>
    </Card>

    <Card>
      <template #header>
        <strong> بيانات الحالة الطبية والخطة العلاجية </strong>
      </template>
      <template #content>
        <div v-if="!state.medicalLoaded" class="text-center color-primary">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <StepMedicalInformation
            v-else
            edit-mode
            read-only
            :payload="state.caseData"
            :caseData="state.caseData"
            :caseDetails="state.caseDetails"
            :medicalOptions="state.medicalOptions"
        />
      </template>
    </Card>

    <Card>
      <template #header><strong> بيانات المسح الاجتماعي </strong></template>
      <template #content>
        <div v-if="!state.surveyLoaded" class="text-center color-primary">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <StepSocialSurvey
            v-else
            edit-mode
            read-only
            :payload="state.caseData"
            :options="state.surveyOptions"
            :read-only-data="state.caseData"
        />
      </template>
    </Card>

    <Card
        v-if="
        state.caseData &&
        state.caseData.phases &&
        state.caseData.phases.length &&
        state.caseData.phases.find(
          (each) =>
            each.story_title ||
            each.story_content ||
            (each.story_photo && each.story_photo !== '-')
        )
      "
    >
      <template #header>
        <strong> بيانات العرض </strong>
      </template>
      <template #content>
        <StepStoryDisplay
            :payload="state.caseData"
            :status="state.caseDetails.status"
        />
      </template>
    </Card>

    <Card
        v-if="
        state.caseData.caseLogEnable && state.caseLogs && state.caseLogs.length
      "
    >
      <template #header><strong>اجراءات الطلب</strong></template>
      <template #content>
        <StepSocietyNotes :payload="state.caseLogs"/>
      </template>
    </Card>

    <Card
        v-if="
        state.caseData.feedbackCharityLog &&
        state.auditorsLogs &&
        state.auditorsLogs.length
      "
    >
      <template #header><strong>ملاحظات خاصة بالجمعية</strong></template>
      <template #content>
        <StepOrderProcedures :payload="state.auditorsLogs"/>
      </template>
    </Card>
  </main>
  <OtherCasesExistModal
      :display="state.displayModal"
      :cases="state.caseList"
      @toggleModal="toggleModal"
  />
</template>
<script setup>
import {FilterMatchMode} from "primevue/api";
import OtherCasesExistModal from "@/components/admin-panel/auditor-case/OtherCasesExistModal";
import {reactive, onMounted, onUpdated} from "vue";
import {useRoute, useRouter} from "vue-router";
import {snakeToCamel, formatCreationDate} from "@/helpers/helpers";
import StepPersonalInformation from "@/components/admin-panel/auditor-case/StepPersonalInformation";
import StepInsuranceInformation from "@/components/admin-panel/auditor-case/StepInsuranceInformation";
import StepMedicalInformation from "@/components/admin-panel/auditor-case/StepMedicalInformation";
import StepSocialSurvey from "@/components/admin-panel/auditor-case/StepSocialSurvey";
import StepStoryDisplay from "@/components/admin-panel/auditor-case/StepStoryDisplay";
import StepOrderProcedures from "@/components/admin-panel/auditor-case/StepOrderProcedures";
import StepSocietyNotes from "@/components/admin-panel/auditor-case/StepSocietyNotes";
import CaseService from "@/services/case-service";
import EnumService, {CASE_STATUS, PAYMENT_REQUEST_ENUM} from "@/services/enum.service";
import JwtUtilService from "@/services/jwt.util.service";
import {ARABIC_CASES_STATUS} from "@/services/enum.service";

const route = useRoute();
const router = useRouter();

const state = reactive({
  currentUserRole: '',
  displayModal: false,
  caseData: {},
  caseDetails: {
    id: "",
    charityName: "",
    createdOn: "",
    status: "",
    color: null,
    collectedRequiredAmounts: ""
  },
  regionOptions: {},
  typeOptions: {},
  citiesOptions: [],
  surveyOptions: {},
  medicalOptions: {},
  loading: false,
  error: "",
  personalLoaded: false,
  insuranceLoaded: false,
  medicalLoaded: false,
  surveyLoaded: false,
  auditorsLogs: [],
  caseLogs: [],
  caseList: [],
  filters: {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  },
  isCharityManager: JwtUtilService.getClientID()?.includes("charity"),
  personelDataOptions: [
    {
      label: "البيانات الشخصية",
      value: "personal_information",
      items: [
        {label: "المنطقة", value: "area"},
        {label: "المدينة", value: "city"},
        {label: "الحي", value: "address"},
        {label: "رقم الجوال", value: "mobile_number"},
        {label: "صورة الهوية", value: "id_photo"},
      ],
    },
    {
      label: "بيانات التأمين",
      value: "insurance_information",
      items: [{label: "خطاب رفض التأمين", value: "insurance_rejected_form"}],
    },
    {
      label: "بيانات الحالة الطبية والخطة العلاجية",
      value: "medical_information",
      items: [
        {label: "التقرير الطبي", value: "medical_report"},
        {label: "التكلفة المالية", value: "amount"},
        {label: "مرفق التكلفة المالية", value: "amount_attachment"},
      ],
    },
    {
      label: "بيانات المسح الاجتماعي",
      value: "social_survey_details",
      items: [
        {label: "الحالة الاجتماعية", value: "marital_status"},
        {label: "الوضع الاجتماعي", value: "social_status"},
        {label: "خدمة المريض لنفسه", value: "can_serve_himself"},
        {label: "المهنة", value: "job"},
        {label: "الانقطاع عن العمل والمهام اليومية", value: "jobless"},
        {label: "نوع السكن", value: "accommodation_type"},
        {label: "ملكية السكن", value: "accommodation_ownership"},
        {label: "الإيجار السنوي", value: "annual_wage"},
        {label: "عدد أفراد الأسرة", value: "number_of_family_members"},
        {label: "دخل المريض", value: "patient_income"},
        {label: "دخل الأسرة", value: "family_income"},
        {label: "هل المريض مستحق للزكاة", value: "worthy_of_zakah"},
        {label: 'قصة الحالة "رأي الباحث الاجتماعي"', value: "story"},
        {label: "نوع البحث", value: "search_type"},
      ],
    },
  ],
  userRole: null,
  otherCasesExist: false,
});

const goBack = () => {
  if (route.query?.returnUrl) {
    router.push("/admin-panel/payment-request");
  } else if (state.userRole === 'Financial Reviewer') {
    router.push("/admin-panel/payment-request");
  } else {
    router.back();
  }
};

const getMedicalDropdowns = async () => {
  const {data} = await CaseService.getMedicalDataDropdown();
  const resultEntries = Object.entries(data.result);
  const results = {};
  for (let entry of resultEntries) {
    results[snakeToCamel(entry[0])] = entry[1];
  }
  state.medicalOptions = results;
};

const getTypesOptions = async () => {
  try {
    state.loading = true;
    const {data} = await EnumService.types();
    state.typeOptions = data.result;
  } catch (error) {
    state.error = error;
  } finally {
    state.loading = false;
  }
};
const getRegionsOptions = async () => {
  try {
    state.loading = true;
    const {data} = await EnumService.regions();
    state.regionOptions = data.result;
    // state.stepPersonalInformation.area =
    //   state.regionOptions[state.stepPersonalInformation.area - 1].name;
  } catch (error) {
    state.error = error;
  } finally {
    state.loading = false;
  }
};
const getCitiesOptions = async () => {
  try {
    state.loading = true;
    const {data} = await EnumService.cities(state.caseData.area);
    // const resultEntries = Object.entries(data.result);
    // const results = {};
    // for (let entry of resultEntries) {
    //   results[snakeToCamel(entry[0])] = entry[1];
    // }
    state.citiesOptions = data.result;
    // const asArray = Object.entries(results);
    // let findCity = asArray.filter((entry) => {
    //   return entry[1].id === state.stepPersonalInformation.city;
    // });
    // state.stepPersonalInformation.city = findCity[0][1].name;
  } catch (error) {
    state.error = error;
  } finally {
    state.loading = false;
  }
};
const getSurveyOptions = async () => {
  const {data} = await CaseService.getSurveyDropdown();
  const resultEntries = Object.entries(data.result);
  const results = {};
  for (let entry of resultEntries) {
    results[snakeToCamel(entry[0])] = entry[1];
  }
  state.surveyOptions = results;
  state.surveyLoaded = true;
};
const getCase = async () => {
  const {data} = await CaseService.getCaseDetail(
      route.params.id,
      route.query.obj_type
  );
  state.currentUserRole = data.result.user_role;
  const auditorsLogsResult = await CaseService.getAuditorsLogs(
      `${route.params.id}`
  );
  const caseLogsResult = await CaseService.getCaseLogs(
          `${route.params.id}`,
          `${route.query.obj_type}`
      );
  state.userRole = data.result.user_role;
  const auditorsListResult = await CaseService.getAuditorsList({
    search_id: data.result.identity_information.identity_number,
    page: 1,
    page_size: 15,
  });

  if (
      auditorsLogsResult &&
      auditorsLogsResult.data &&
      auditorsLogsResult.data.result &&
      auditorsLogsResult.data.result.length
  ) {
    const dataToBeModifiedObj = [];
    state.personelDataOptions.forEach((option) => {
      if (option.items?.length > 1) {
        option.items.forEach((item) => {
          dataToBeModifiedObj.push(item);
        });
      } else {
        dataToBeModifiedObj.push(option.items[0]);
      }
    });
    let auditorsLogs = [];
    for (let i = 0; i < auditorsLogsResult.data.result.length; i++) {
      const element = auditorsLogsResult.data.result[i];
      const dataToBeModifiedInArabic = [];
      element?.data_to_be_modified?.fields?.forEach((field) => {
        let item = dataToBeModifiedObj?.find((item) => item.value === field);
        dataToBeModifiedInArabic.push(item?.label);
      });
      auditorsLogs.push({
        id: element.id,
        user: element.user,
        validity: element.user_type,
        action: dataToBeModifiedInArabic?.join(", "),
        comment: element.comment || "-",
        date: formatCreationDate(element.created_on),
      });
    }
    state.auditorsLogs = auditorsLogs;
  }

  if (
      caseLogsResult &&
      caseLogsResult.data &&
      caseLogsResult.data.result &&
      caseLogsResult.data.result.length
  ) {
    let caseLogs = [];
    for (let i = 0; i < caseLogsResult.data.result.length; i++) {
      const element = caseLogsResult.data.result[i];
      caseLogs.push({
        id: element.id,
        user: element.user,
        validity: element.user_type,
        action: element.procedure_action,
        comment: element.comment || "-",
        date: formatCreationDate(element.created_on),
      });
    }
    state.caseLogs = caseLogs;
  }

  if (
      auditorsListResult &&
      auditorsListResult.data &&
      auditorsListResult.data.results &&
      auditorsListResult.data.results.cases &&
      (auditorsListResult.data.results.cases.length > 1 ||
          (auditorsListResult.data.results.cases.length === 1 &&
              auditorsListResult.data.results.cases[0].phases?.length))
  ) {
    let caseList = [];
    for (let i = 0; i < auditorsListResult.data.results.cases.length; i++) {
      const element = auditorsListResult.data.results.cases[i];
      caseList.push({
        id: element.id,
        createdOn: element.created_on,
        specialty: element.specialty || "-",
        status: element.status || "-",
        medicalReport: element.medical_report,
        phases: element.phases,
        charityName: element.charity_name,
      });
    }
    state.caseList = caseList;
    if (state.currentUserRole === 'Technical_Audit' || state.currentUserRole === 'Medical_Audit') {
      state.otherCasesExist = true;
      toggleModal();
    }
  }

  const resultEntries = Object.entries({
    id: data.result.case_details.id,
    required_amount: null,
    charity_name: data.result.case_details.charity_name,
    created_on: data.result.case_details.created_on,
    collected_required_amounts: data.result.case_details.collected_required_amounts,
    updated_on: null,
    status: data.result.case_details.status,
    color: data.result.color,
    identity_type: data.result.identity_information.identity_type,
    identity_number: data.result.identity_information.identity_number,
    hijri_birthdate: data.result.identity_information.hijri_birthdate,
    gregorian_birthdate: data.result.identity_information.gregorian_birthdate,
    first_name: data.result.identity_information.first_name,
    father_name: data.result.identity_information.father_name,
    last_name: data.result.identity_information.last_name,
    nationality: data.result.identity_information.nationality,
    gender: data.result.identity_information.gender,
    id_expiration: data.result.identity_information.id_expiration,
    age: data.result.identity_information.age,
    address: data.result.identity_information.address,
    mobile_number: data.result.identity_information.mobile_number,
    id_photo: data.result.identity_information.id_photo,
    insurance_company: data.result.insurance_information.insurance_company,
    insurance_expiry: data.result.insurance_information.insurance_expiry,
    coverage_maximum_amount:
    data.result.insurance_information.coverage_maximum_amount,
    insurance_rejected_form:
    data.result.insurance_information.insurance_rejected_form,
    medical_report: data.result.medical_information.medical_report,
    amount: data.result.medical_information.amount,
    amount_attachment: data.result.medical_information.amount_attachment,
    phases:
        Array.isArray(data.result.medical_information.phases) &&
        data.result.medical_information.phases.length
            ? data.result.medical_information.phases
            : typeof data.result.medical_information.phases === "object" &&
            route.query.obj_type === "phase"
                ? [data.result.medical_information.phases]
                : [
                  {
                    story_title: null,
                    story_photo: null,
                    story_content: null,
                  },
                ],
    split_into_phases:
        (Array.isArray(data.result.medical_information.phases) &&
            data.result.medical_information.phases.length > 1) ||
        (typeof data.result.medical_information.phases === "object" &&
            route.query.obj_type === "phase"),
    job: data.result.social_survey_details.job,
    story: data.result.social_survey_details.story,
    terms_and_conditions_flag:
    data.result.social_survey_details.terms_and_conditions_flag,
    shefaa_exclusive_flag:
    data.result.social_survey_details.shefaa_exclusive_flag,
    status_updated_on: null,
    created_by: null,
    updated_by: null,
    charity: null,
    area: data.result.identity_information.area,
    city: data.result.identity_information.city,
    marital_status: data.result.social_survey_details.marital_status,
    social_status: data.result.social_survey_details.social_status,
    can_serve_himself: data.result.social_survey_details.can_serve_himself,
    jobless: data.result.social_survey_details.jobless,
    accommodation_type: data.result.social_survey_details.accommodation_type,
    accommodation_ownership:
    data.result.social_survey_details.accommodation_ownership,
    annual_wage: data.result.social_survey_details.annual_wage,
    number_of_family_members:
    data.result.social_survey_details.number_of_family_members,
    patient_income: data.result.social_survey_details.patient_income,
    family_income: data.result.social_survey_details.family_income,
    worthy_of_zakah: data.result.social_survey_details.worthy_of_zakah,
    search_type: data.result.social_survey_details.search_type,
    publish_on_charity_page:
    data.result.social_survey_details.publish_on_charity_page,
    action_description: data.result.medical_information.action_description,
    action_type: data.result.medical_information.action_type,
    evaluation: data.result.medical_information.evaluation,
    specialty: data.result.medical_information.specialty,
    case_log_enable: data.result.case_log_enable,
    feedback_charity_log: data.result.feedback_charity_log,
    procedures: data.result.procedures,
  });

  const results = {};

  for (let entry of resultEntries) {
    results[snakeToCamel(entry[0])] = entry[1];
  }
  state.caseData = results;

  state.caseDetails.id = results.id;
  if (state.caseData?.status === PAYMENT_REQUEST_ENUM.Payment_Request_Manager_Cancellation) {
    state.caseData.status = PAYMENT_REQUEST_ENUM.Manager_Cancellation
  }

  for (let phase of state.caseData.phases) {
    phase.status = ARABIC_CASES_STATUS[phase.status?.toUpperCase()]
    if (phase.status === CASE_STATUS.Manager_Cancellation) {
      phase.status = PAYMENT_REQUEST_ENUM.Manager_Cancellation
    }
  }

  state.caseDetails.charityName = results.charityName;
  state.caseDetails.createdOn = results.createdOn;
  state.caseDetails.status = results.status;
  state.caseDetails.color = results.color;
  state.caseDetails.collectedRequiredAmounts = results.collectedRequiredAmounts;

  state.personalLoaded = true;
  state.insuranceLoaded = true;
  state.medicalLoaded = true;
  state.surveyLoaded = true;

  getRegionsOptions();
  getCitiesOptions();
  getSurveyOptions();
  getMedicalDropdowns();
};
const toggleModal = (value) => {
  state.displayModal = !state.displayModal;
  if (value === "close") {
    goBack();
  }
};
onMounted(() => {
  Promise.all([getTypesOptions(), getCase()]);
});
onUpdated(() => {
  if (
      (route.query.obj_type === "phase" &&
          state?.caseData?.phases &&
          state.caseData.phases[0].id !== parseInt(route?.params?.id, 10)) ||
      ((!route.query.obj_type || route.query.obj_type === "case") &&
          state?.caseDetails?.id !== parseInt(route?.params?.id, 10))
  ) {
    Promise.all([getTypesOptions(), getCase()]);
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/helpers";

::v-deep(.p-datatable) {
  .p-datatable-header {
    background: white;
    border-top: none;
    padding: 0 0 1rem 0;
  }

  .p-datatable-thead > tr:nth-child(1) > th {
    border-bottom: none;
  }

  .p-datatable-thead > tr > th {
    text-align: right;
  }

  .p-datatable-thead > tr > th.column__amount-requested {
    padding-left: 0;
  }

  .p-datatable-thead > tr > th.column__amount-collected {
    padding-right: 0;
  }

  .p-datatable-tbody > tr > td {
    text-align: right;

    a {
      display: block;
      color: black;
      text-decoration: none;
    }
  }

  .color-primary {
    color: $color-primary;
  }

  .p-dropdown-label:not(.p-placeholder) {
    text-transform: uppercase;
  }

  .p-paginator {
    position: absolute;
    bottom: -10rem;
    left: 0;
    background-color: transparent;
    border-bottom: none;
    padding-left: 0;

    .p-paginator-icon {
      transform: rotate(180deg);
    }

    .p-paginator-next,
    .p-paginator-prev {
      padding-right: 5px;
      padding-left: 5px;
      border-radius: $border-radius-small;
      color: $color-primary;
    }

    .p-paginator-next {
      &::before {
        content: "الصفحة التالية";
      }
    }

    .p-paginator-prev {
      &::after {
        content: "الصفحة السابقة";
      }
    }

    .p-disabled {
      display: none;
    }

    .p-paginator-page {
      min-width: 1.7rem;
      height: 1.7rem;
      border-radius: $border-radius-small;
    }

    .p-paginator-page.p-highlight {
      background-color: $color-primary;
      color: white;
    }
  }
}

::v-deep(.form-personal-information) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 3rem;
}

::v-deep(.form-insurance-information) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 3rem;
}

::v-deep(.form-medical-information__first-group) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 3rem;
}

::v-deep(.form-medical-information__phases) {
  .stage {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 3rem;
    align-items: end;
  }

  .stage__input {
    display: flex;
    flex-direction: column;
  }

  .stage__file {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
}

::v-deep(.phases-divider) {
  position: relative;
  width: 100%;
  height: 0;
  border-top: 1px solid #d9d9d9;

  .phases-divider__heading {
    position: absolute;
    right: 2rem;
    top: -0.7rem;
    padding: 0 0.7rem;
    background-color: white;
  }
}

::v-deep(.form-social-survey) {
  .form-social-survey__select-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 3rem;
  }
}

::v-deep(.p-card) {
  width: 100%;
  margin-bottom: 2rem;
  box-shadow: $box-shadow-card;
  border-radius: $border-radius-default;
  overflow: hidden;

  .p-card-header {
    padding: 1rem 1.2rem;
    background-color: #d4d4d4;
  }

  .p-card-body {
    padding-top: 0;
    padding-bottom: 0;
    box-shadow: none;
  }
}

::v-deep(.p-button-secondary) {
  font-size: 14px;
  background-color: $color-secondary;
  border-color: $color-secondary;
  color: $color-font-dark;

  .pi {
    font-size: 14px;
  }

  &:hover {
    background-color: $color-secondary-hover;
    border-color: $color-secondary-hover;
  }
}
::v-deep(.p-button-outlined) {
  font-size: 14px;
}

::v-deep(.p-disabled) {
  background-color: #ececec;
  border-color: #d9d9d9;
}

::v-deep(.p-inputtext:disabled) {
  border-color: #d9d9d9;
}

::v-deep(.p-inputtextarea:disabled) {
  background-color: #ececec;
  border-color: #d9d9d9;
}

::v-deep(.p-fileupload) {
  border: 1px dashed #ced4da;
  border-radius: 6px;

  .p-fileupload-buttonbar {
    border: none;
    background-color: transparent;
  }

  .p-button,
  .p-button-icon-only {
    background-color: #d9d9d9;
    border-color: #d9d9d9;
    color: #3f3f3f;
    transition: 0.1s;
    border-radius: 25px;

    &:hover,
    &:active,
    &:focus {
      background-color: #565e64;
      border-color: #565e64;
      color: #fff;
      box-shadow: none;

      .p-focus {
        box-shadow: none;
      }
    }
  }

  .p-progressbar {
    display: none;
  }

  .p-fileupload-content {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    border: none;
    padding: 0;

    .p-fileupload-file {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-top: 1px solid $color-secondary;

      &__image {
        display: block;
        width: 40px;
        height: 40px;
      }

      &__file-name {
        font-size: 14px;
        color: $color-font-lighter;
      }

      .p-fileupload-file-actions {
        margin: 0;
      }

      .p-button {
        min-width: 48px;
      }
    }
  }

  .p-fileupload-file {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    border: none;

    .p-badge {
      display: none;
    }
  }

  .p-fileupload-row,
  .p-fileupload-file {
    font-size: 14px;
    color: #8c8c8c;
  }

  input[accept=".pdf"] ~ .p-fileupload-content img {
    display: none;
  }
}

::v-deep(.p-inputtext) {
  &:disabled {
    background-color: #ececec;
  }
}

::v-deep(.p-badge) {
  border-radius: 0;
}

::v-deep(.p-badge.p-badge-info) {
  background-color: $color-background-info;
  color: $color-font-info;
}

::v-deep(.p-badge.p-badge-success) {
  background-color: $color-background-success;
  color: $color-font-success;
}

::v-deep(.p-badge.p-badge-danger) {
  background-color: $color-background-danger;
  color: $color-font-danger;
}

a {
  text-decoration: none;
}
</style>
