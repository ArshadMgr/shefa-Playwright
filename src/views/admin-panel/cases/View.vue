<template>
  <main class="edit-case d-flex flex-column align-items-start">
    <Button
      class="p-button p-button-rounded p-button-secondary align-self-end mb-4"
      @click.stop="goBack"
    >
      <i class="pi pi-times mx-1"></i>
      إغلاق الحالة
    </Button>

    <Card>
      <template #header>
        <div class="row">
          <div class="col-3">رقم الحالة</div>
          <div class="col-3">اسم المنشئ</div>
          <div class="col-3">تاريخ الانشاء</div>
          <div class="col-3">الحالة</div>
        </div>
      </template>
      <template #content>
        <div class="row">
          <strong class="col-3">{{ state.caseDetails.id }}</strong>
          <strong class="col-3">{{ state.caseDetails.charityName }}</strong>
          <strong class="col-3">{{ state.caseDetails.createdOn }}</strong>
          <div class="col-3">
            <Badge :severity="statusSeverity" :value="statusLabel"></Badge>
          </div>
        </div>
      </template>
    </Card>
    <Card>
      <template #header> البيانات الشخصية </template>
      <template #content>
        <div v-if="!state.personalLoaded"  class="text-center color-primary">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <StepPersonalInformation
          v-else
          edit-mode
          read-only
          :payload="state.stepPersonalInformation"
          :case-identity-information="state.stepIdentityInformation"
          :region-options="state.regionOptions"
        />
      </template>
    </Card>

    <Card :class="{'visually-hidden': !state.stepInsuranceInformation.insuranceCompany &&
           !state.stepInsuranceInformation.insuranceExpiry &&
           !state.stepInsuranceInformation.coverageMaximumAmount &&
           !state.stepInsuranceInformation.insuranceRejectedForm}">
      <template #header>بيانات التأمين</template>
      <template #content>
        <div v-if="!state.insuranceLoaded"  class="text-center color-primary">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <StepInsuranceInformation
          v-else
          edit-mode
          read-only
          :payload="state.stepInsuranceInformation"
        />
      </template>
    </Card>

    <Card>
      <template #header>بيانات الحالة الطبية والخطة العلاجية</template>
      <template #content>
        <div v-if="!state.medicalLoaded"  class="text-center color-primary">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <StepMedicalInformation
          v-else
          edit-mode
          read-only
          :payload="state.stepMedicalInformation"
        />
      </template>
    </Card>

    <Card>
      <template #header>بيانات المسح الاجتماعي</template>
      <template #content>
        <div v-if="!state.surveyLoaded"  class="text-center color-primary">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
        <StepSocialSurvey
          v-else
          edit-mode
          read-only
          :payload="state.stepSocialSurvey"
          :options="state.surveyOptions"
          :read-only-data="state.stepSocialSurveyReadOnlyData"
        />
      </template>
    </Card>

  </main>
</template>
<script setup>
import { reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { snakeToCamel, formatCreationDate, checkIfExist, displayGender } from '@/helpers/helpers'
import StepPersonalInformation from "@/components/admin-panel/new-case/StepPersonalInformation";
import StepInsuranceInformation from "@/components/admin-panel/new-case/StepInsuranceInformation";
import StepMedicalInformation from "@/components/admin-panel/new-case/StepMedicalInformation";
import StepSocialSurvey from "@/components/admin-panel/new-case/StepSocialSurvey";
import CaseService from "@/services/case-service";
import EnumService from "@/services/enum.service";

const route = useRoute();
const router = useRouter();

const state = reactive({
  caseData: {},
  caseDetails: {
    id: "",
    charityName: "",
    createdOn: "",
    status: "",
  },
  stepIdentityInformation: {
    identityType: "",
    identityNumber: "",
    gregorianBirthdate: "",
    hijriBirthdate: "",
  },
  stepPersonalInformation: {
    firstName: "",
    fatherName: "",
    lastName: "",
    nationality: "",
    gender: "",
    idExpiration: "",
    age: "",
    area: null,
    city: "",
    cityOptions: "",
    address: "",
    mobileNumber: "",
    idPhoto: "",
  },
  stepInsuranceInformation: {
    insuranceCompany: "",
    insuranceExpiry: "",
    coverageMaximumAmount: "",
    insuranceRejectedForm: "",
  },
  stepMedicalInformation: {
    medicalReport: "",
    amount: "",
    amountAttachment: "",
    splitIntoPhases: "",
    phases: [],
  },
  stepSocialSurvey: {
    maritalStatus: "",
    socialStatus: "",
    canServeHimself: "",
    job: "",
    jobless: "",
    accommodationType: "",
    accommodationOwnership: "",
    annualWage: "",
    numberOfFamilyMembers: "",
    patientIncome: "",
    familyIncome: "",
    worthyOfZakah: "",
    story: "",
    searchType: "",
    termsAndConditionsFlag: false,
    shefaaExclusiveFlag: false,
    publishOnCharityPage: false
  },
  regionOptions: {},
  typeOptions: {},
  citiesOptions: {},
  surveyOptions: {},
  loading: false,
  error: '',
  personalLoaded: false,
  insuranceLoaded: false,
  medicalLoaded: false,
  surveyLoaded: false,
});

const goBack = () => {
  if (route.query?.returnUrl) {
    router.push("/admin-panel/payment-request");
  }
  else {
    router.push("/admin-panel/auditors-list");
  }
};

const statusSeverity = computed(() => {
  if (state.caseDetails.status.toLowerCase() === "draft") {
    return "info";
  } else if (state.caseDetails.status.toLowerCase() === "accepted") {
    return "success";
  } else if (state.caseDetails.status.toLowerCase() === "rejected") {
    return "danger";
  }
});
const statusLabel = computed(() => {
  if (state.caseDetails.status.toLowerCase() === "draft") {
    return "مسودة";
  } else if (state.caseDetails.status.toLowerCase() === "accepted") {
    return "وافقت";
  } else if (state.caseDetails.status.toLowerCase() === "rejected") {
    return "مرفوض";
  }
});
const getTypesOptions = async () => {
  try {
    state.loading = true;
    const { data } = await EnumService.types();
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
    const { data } = await EnumService.regions();
    state.regionOptions = data.result;
    state.stepPersonalInformation.area = state.regionOptions[state.stepPersonalInformation.area - 1].name
  } catch (error) {
    state.error = error;
  } finally {
    state.loading = false;
  }
};
const getCitiesOptions = async () => {
  try {
    state.loading = true;
    const { data } = await EnumService.cities(state.stepPersonalInformation.area);
    const resultEntries = Object.entries(data.result)
    const results = {}
    for (let entry of resultEntries) {
      results[snakeToCamel(entry[0])] = entry[1]
    }
    state.citiesOptions = results;
    const asArray = Object.entries(results);
    let findCity = asArray.filter((entry) => {
      return entry[1].id === state.stepPersonalInformation.city;
    })
    state.stepPersonalInformation.city = findCity[0][1].name
  } catch (error) {
    state.error = error;
  } finally {
    state.loading = false;
  }
};
const getSurveyOptions = async () => {
  const { data } = await CaseService.getSurveyDropdown()
  const resultEntries = Object.entries(data.result)
  const results = {}
  for (let entry of resultEntries) {
    results[snakeToCamel(entry[0])] = entry[1]
  }
  state.surveyOptions = results
  state.surveyLoaded = true;
}

const getStepData = (arrFromResults, arrFromStep) => {
  let results = []
  for(let el of arrFromStep) {
    const found = arrFromResults.find(([key]) => key === el[0])
    found ? results.push(found) : false
  }
  return Object.fromEntries(results);
}

const getCase = async () => {
  const { data } = await CaseService.getCase(`${route.params.id}`);

  const resultEntries = Object.entries(data.result)
  const results = {}
  for (let entry of resultEntries) {
    results[snakeToCamel(entry[0])] = entry[1]
  }
  const arrFromResults = Object.entries(results)

  state.caseDetails = getStepData(arrFromResults, Object.entries(state.caseDetails))
  state.stepIdentityInformation = getStepData(arrFromResults, Object.entries(state.stepIdentityInformation))
  state.stepPersonalInformation = getStepData(arrFromResults, Object.entries(state.stepPersonalInformation))
  state.stepInsuranceInformation = getStepData(arrFromResults, Object.entries(state.stepInsuranceInformation))
  state.stepMedicalInformation = getStepData(arrFromResults, Object.entries(state.stepMedicalInformation))
  state.stepSocialSurvey = getStepData(arrFromResults, Object.entries(state.stepSocialSurvey))

  state.caseDetails.createdOn = formatCreationDate(state.caseDetails.createdOn)
  state.stepPersonalInformation.gender = displayGender(state.stepPersonalInformation.gender)
  state.stepPersonalInformation.idPhoto = {objectURL: results.urls.id_photo}

  await getCitiesOptions(state.stepPersonalInformation.area)

  const dataPhases = await CaseService.getPhases()
  const filterPhases =  dataPhases.data.result.filter(phase => phase.case === data.result.id);
  state.stepMedicalInformation.phases = filterPhases;

  state.personalLoaded = true;
  state.insuranceLoaded = true;
  state.medicalLoaded = true;
  state.surveyLoaded = true;

  getRegionsOptions();
  getSurveyOptions();
}

onMounted(() => {
  Promise.all([getTypesOptions(), getCase()]);
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/helpers";
@import "@/styles/components/fileupload";

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
