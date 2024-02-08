<template>
  <section class="createAccount-area">
    <Card class="mx-auto">
      <template #content>
        <div class="createAccountform dir-rtl">
          <div class="form-cont">
            <Steps :model="state.steps" :readonly="true">
              <template #item="{ item }">
                <router-link :to="item.to" class="p-menuitem-link router-link-active router-link-active-exact"
                  role="presentation">
                  <span class="p-steps-number">{{ item.label }}</span></router-link>
              </template>
            </Steps>
            <StepIdentityInformation v-if="state.currentStep === 'stepIdentityInformation'"
              :payload="state.stepIdentityInformation" @submit="identityInformationSubmit" />
            <StepPersonalInformation v-if="state.currentStep === 'stepPersonalInformation'"
              :payload="state.stepPersonalInformation" :type-options="state.typeOptions"
              :region-options="state.regionOptions" @submit="stepSubmitted($event, 'stepPersonalInformation')"
              @previous="previous($event, 'stepPersonalInformation', 'stepIdentityInformation')" />
            <StepInsuranceInformation v-if="state.currentStep === 'stepInsuranceInformation'"
              :payload="state.stepInsuranceInformation" @submit="stepSubmitted($event, 'stepInsuranceInformation')"
              @previous="previous($event, 'stepInsuranceInformation', 'stepPersonalInformation')" />
            <StepMedicalInformation v-if="state.currentStep === 'stepMedicalInformation'"
              :payload="state.stepMedicalInformation" @submit="stepSubmitted($event, 'stepMedicalInformation')"
              @previous="previous($event, 'stepMedicalInformation', 'stepInsuranceInformation')" />
            <StepSocialSurvey v-if="state.currentStep === 'stepSocialSurvey' && state.surveyOptions"
              :options="state.surveyOptions" :payload="state.stepSocialSurvey" :type-options="state.typeOptions"
              :region-options="state.regionOptions" @submit="createCase"
              @previous="previous($event, 'stepSocialSurvey', 'stepMedicalInformation')"
              @submit-draft="createDraftCase" />
          </div>
        </div>
      </template>
    </Card>
    <OtherCasesExistModal :display="state.displayModal" :cases="state.otherExistingCases" :case-creation="true"
      @toggleModal="toggleModal" @submit="redirectToStep('stepIdentityInformation')" />
  </section>
  <Dialog :visible="state.showVisaExpirationModal" :closable="false" :showHeader="true" :modal="true"
    :header="'الإقامة / التأشيرة المستخدمة منتهية الصلاحية'">
    <div dir="rtl">
      <div class="title mb-2 pb-2">هل ترغب بالمتابعة ؟</div>
      <div class="d-flex justify-content-around align-items-center mt-4 w-75 m-auto">
        <button id="close-btn" class="btn btn-lg btn-secondary btn-block close-btn mx-4" type="button"
          @click.prevent="router.push('/admin-panel/auditors-list')">
          إغلاق
        </button>
        <button id="tracking-btn" class="btn btn-lg btn-primary btn-block tracking-btn mx-4" type="button"
          @click.prevent="validateUser(state.newIdentityInformation)">
          تأكيد
        </button>
      </div>
    </div>
  </Dialog>
</template>
<script setup>
import { reactive, onBeforeMount, watch, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router'
import Steps from "primevue/steps";
import StepIdentityInformation from "@/components/admin-panel/new-case/StepIdentityInformation";
import StepPersonalInformation from "@/components/admin-panel/new-case/StepPersonalInformation.vue";
import StepInsuranceInformation from "@/components/admin-panel/new-case/StepInsuranceInformation.vue";
import StepMedicalInformation from "@/components/admin-panel/new-case/StepMedicalInformation.vue";
import StepSocialSurvey from "@/components/admin-panel/new-case/StepSocialSurvey";
import OtherCasesExistModal from "@/components/admin-panel/auditor-case/OtherCasesExistModal";
import CaseService from "@/services/case-service";
import EnumService from "@/services/enum.service";
import { snakeToCamel } from "@/helpers/helpers";
import { convertToFormData } from "@/helpers/ConvertToFormData";
import { useToast } from "primevue/usetoast";
import YaqeenService from "@/services/yaqeen-service";
import dayjs from "dayjs";


const router = useRouter()
const route = useRoute()
const toast = useToast();

// TODO: write func parse state format in/out api payload
const state = reactive({
  currentStep: route.params.step || 'stepIdentityInformation',
  steps: [
    {
      label: '١',
      to: '/admin-panel/cases/create/stepIdentityInformation',
    },
    {
      label: '٢',
      to: '/admin-panel/cases/create/stepPersonalInformation',
    },
    {
      label: '٣',
      to: '/admin-panel/cases/create/stepInsuranceInformation',
    },
    {
      label: '٤',
      to: '/admin-panel/cases/create/stepMedicalInformation',
    },
    {
      label: '٥',
      to: '/admin-panel/cases/create/stepSocialSurvey',
    }
  ],
  stepIdentityInformation: {
    identityType: '',
    identityNumber: '',
    hijriBirthdate: "",
    gregorianBirthdate: ""
  },
  stepPersonalInformation: {
    firstName: "",
    fatherName: "",
    lastName: "",
    nationality: "",
    gender: "",
    idExpiration: "",
    age: null,
    area: '',
    city: '',
    address: '',
    mobileNumber: null,
    idPhoto: ''
  },
  stepInsuranceInformation: {
    insuranceCompany: '',
    insuranceExpiry: '',
    coverageMaximumAmount: '',
    insuranceRejectedForm: ''
  },
  stepMedicalInformation: {
    medicalReport: '',
    amount: '',
    amountAttachment: '',
    splitIntoPhases: false,
    phases: []
  },
  stepSocialSurvey: {
    maritalStatus: '',
    socialStatus: '',
    canServeHimself: '',
    job: '',
    jobless: '',
    accommodationType: '',
    accommodationOwnership: '',
    annualWage: '',
    numberOfFamilyMembers: '',
    patientIncome: '',
    familyIncome: '',
    worthyOfZakah: '',
    story: '',
    searchType: '',
    termsAndConditionsFlag: false,
    shefaaExclusiveFlag: false,
    publishOnCharityPage: false
  },
  regionOptions: {},
  typeOptions: {},
  surveyOptions: {},
  displayModal: false,
  OtherExistingCases: [],
  showVisaExpirationModal: false,
  newIdentityInformation: {}
})

const previous = (data, stepLabel, previousStepLabel) => {
  state[stepLabel] = data;
  const _previousStepLabel = state.steps.findIndex(e => e.to.includes(previousStepLabel))
  setStep(state.steps[_previousStepLabel].to)
}

const setStep = (stepLabel) => {
  router.push(stepLabel)
  scrollToTop();
};

const preValidateCase = async (stepLabel) => {
  const formData = convertToFormData({
    ...state.stepIdentityInformation,
  });
  formData.delete('mobile_number');
  const response = await CaseService.preValidateCase(formData);
  if (response.status === 200) {
    const { data } = response;
    if (!data.result.length) {
      redirectToStep(stepLabel)
      scrollToTop()
    } else {
      state.otherExistingCases = data.result;
      toggleModal('open');
    }
  }
}
const toggleModal = (value) => {
  state.displayModal = !state.displayModal;
  if (value === "close") {
    goBack();
  }
};
const goBack = () => {
  router.push("/admin-panel/auditors-list");
};

const stepSubmitted = (data, stepLabel, redirect = true) => {
  state[stepLabel] = data;
  if (stepLabel === 'stepIdentityInformation') {
    preValidateCase(stepLabel)
  } else {
    if (redirect) {
      redirectToStep(stepLabel)
      scrollToTop()
    }
  }
};

const redirectToStep = (stepLabel) => {
  const nextStepLabel = state.steps.findIndex(e => e.to.includes(stepLabel))
  setStep(state.steps[nextStepLabel + 1].to)
}

const setDefaultStep = () => {
  if (!route.params.step) {
    router.push('create/stepIdentityInformation')
  }
}

const sendCase = (isDraft = true) => {

  state.stepPersonalInformation.gender = state.stepPersonalInformation.gender === 'أنثى' ? 'F' : 'M';
  state.stepPersonalInformation.age = state.stepPersonalInformation.age.toString();

  if (state.stepMedicalInformation.amountAttachment === null) {
    delete state.stepMedicalInformation.amountAttachment
  }

  const formData = convertToFormData({
    ...state.stepIdentityInformation,
    ...state.stepPersonalInformation,
    ...state.stepInsuranceInformation,
    ...state.stepMedicalInformation,
    ...state.stepSocialSurvey,
  });

  if (!isDraft) {
    formData.append('status', 'Technical_Audit')
  }

  for (let i = 0; i < state.stepMedicalInformation.phases.length; i++) {
    if (state.stepMedicalInformation.phases[i].attachment === null) {
      delete state.stepMedicalInformation.phases[i].attachment
    }
  }

  CaseService.createCase(formData, state.stepMedicalInformation.phases)
    .then(() => {
      toast.add({
        severity: "success",
        detail: "تم إنشاء الحالة بنجاح",
        life: 3000
      });
      router.push("/admin-panel/auditors-list");
    });

}

const identityInformationSubmit = async (newIdentityInformation, newNumber) => {
  state.newIdentityInformation = newIdentityInformation;
  try {
    const { data: response } = await YaqeenService.getUserProfile({
      identity_type: newIdentityInformation.identityType,
      identifier: newIdentityInformation.identityNumber,
      date_of_birth: dayjs(newIdentityInformation.gregorianBirthdate).format('DD-MM-YYYY'),
    })

    state.stepPersonalInformation.firstName = response.result.first_name
    state.stepPersonalInformation.fatherName = response.result.father_name
    state.stepPersonalInformation.lastName = response.result.last_name
    state.stepPersonalInformation.nationality = response.result.nationality
    state.stepPersonalInformation.gender = response.result.gender
    state.stepPersonalInformation.idExpiration = response.result.identity_expiry_date
    state.stepPersonalInformation.age = response.result.age

    if (response.result?.is_identity_expired) {
      state.showVisaExpirationModal = true;
    }
    else {
      validateUser(newIdentityInformation)
    }
  } catch (error) {
    toast.add({
      severity: "error",
      detail: "حدث خطأ من مزود الخدمة. الرجاء المحاولة لاحقاً",
      life: 3000
    });
  }
}

const validateUser = (newIdentityInformation) => {
  state.showVisaExpirationModal = false;
  YaqeenService.validateUser(
    {
      identity_type: newIdentityInformation.identityType,
      identifier: newIdentityInformation.identityNumber,
    }
  ).then(async () => {
    await getInsuranceData(newIdentityInformation);
    stepSubmitted(newIdentityInformation, 'stepIdentityInformation')
  })
}

const getInsuranceData = async (newIdentityInformation) => {
  const { data } = await CaseService.getInsuranceData(newIdentityInformation.identityNumber)
  state.stepInsuranceInformation.insuranceCompany = data[0].InsuranceCompanyName
  state.stepInsuranceInformation.insuranceExpiry = data[0].ExpiryDate
  state.stepInsuranceInformation.coverageMaximumAmount = data[0].MaxLimit
}
const createDraftCase = ($event) => {
  stepSubmitted($event, 'stepSocialSurvey', false)
  sendCase()
}

const createCase = ($event) => {
  stepSubmitted($event, 'stepSocialSurvey', false)
  sendCase(false)
}

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
  } catch (error) {
    state.error = error;
  } finally {
    state.loading = false;
  }
};

const getSurveyDropdowns = async () => {
  const { data } = await CaseService.getSurveyDropdown()
  const resultEntries = Object.entries(data.result)
  const results = {}
  for (let entry of resultEntries) {
    results[snakeToCamel(entry[0])] = entry[1]
  }
  state.surveyOptions = results
}

const scrollToTop = () => {
  window.scrollTo(0, 130)
}

watch(() => route.params.step, (newStep) => {
  if (newStep) {
    state.currentStep = newStep
  }
})

onBeforeMount(() => setDefaultStep())
onMounted(() => {
  Promise.all([getTypesOptions(), getRegionsOptions(), getSurveyDropdowns()]);
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/components/fileupload";

::v-deep(.p-steps) {
  border-bottom: 1px solid $color-secondary;
  padding-bottom: 2rem;
  margin-bottom: 1rem;

  ul[role=tablist] {
    width: 80%;
    margin: auto;

    li {
      &::before {
        top: 100%;
      }
    }

    li:nth-child(1) {
      &::before {
        width: 50%;
      }
    }

    li:last-child {
      &::before {
        width: 50%;
        right: 0;
      }
    }
  }

  .p-steps-list {
    width: 80%;
    margin: auto;

    .p-steps-item {
      &::before {
        top: 100%;
      }
    }

    .p-steps-item:nth-child(1) {
      &::before {
        width: 50%;
      }
    }

    .p-steps-item:last-child {
      &::before {
        width: 50%;
        right: 0;
      }
    }
  }

  .p-steps-item.p-highlight .p-steps-number {
    background-color: $color-primary;
    color: white;
  }
}

::v-deep(.p-card) {
  max-width: 610px;
  box-shadow: $box-shadow-card;
  border-radius: $border-radius-default;
  margin-bottom: 8rem;

  .p-card-body {
    box-shadow: none;
  }
}

::v-deep(.p-inputtext) {
  &::placeholder {
    opacity: 1;
  }

  &:disabled {
    background-color: #ececec;
  }
}

::v-deep(.p-float-label .p-placeholder) {
  opacity: 1;
}

.tracking-btn {
  display: block;
  margin: 0 auto;
  width: 100%;
  border-radius: 25px;
  padding: 10px;
  background: #12b2aa;
  color: #ffffff;
  border: none;
  font-size: 18px;
}

.tracking-btn:hover {
  background-color: #0e8e88 !important;
  border: none;
}

.close-btn {
  display: block;
  margin: 0 auto;
  width: 100%;
  border-radius: 25px;
  padding: 10px;
  background: #d9d9d9;
  color: #3f3f3f;
  border: none;
  font-size: 18px;
}
</style>
