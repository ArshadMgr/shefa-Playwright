<template>
  <section class="create-charity-representative">
    <Card class="mx-auto">
      <template #content>
        <div class="createAccountform">
          <keep-alive>
            <StepIdentityInformation
              v-if="state.currentStep === 'stepIdentityInformation'"
              :payload="state.stepIdentityInformation"
              @submit="stepIdentitySubmitted"
            />
          </keep-alive>
          <StepVerification
            ref="stepVerification"
            v-show="state.currentStep === 'StepVerification'"
            :payload="state.stepIdentityInformation"
            @resend="resendOtp"
            @submit="stepSubmitted($event, 'StepVerification')"
            @previous="setStep('stepIdentityInformation')"
          />
          <StepSummary
            v-if="state.currentStep === 'stepSummary'"
            :payload="state.yaqeenInfo"
            @submit="createRepresentative"
            @previous="setStep('StepVerification')"
          />
        </div>
      </template>
    </Card>
  </section>
</template>
<script setup>
import StepIdentityInformation from "@/components/admin-panel/new-charity-representative/StepIdentityInformation";
import StepVerification from "@/components/admin-panel/new-charity-representative/StepVerification.vue";
import StepSummary from "@/components/admin-panel/new-charity-representative/StepSummary.vue";

import { ref } from 'vue'

const stepVerification = ref()
import { reactive, onBeforeMount, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {useToast} from "primevue/usetoast";
import {ToastSeverity} from "primevue/api";
import { formatMobile, formatDate } from "@/helpers/helpers";
import CharityRepresentativeService from "@/services/charity-representative-service";
import OTPService, {OTP_TYPE} from "@/services/otp.service";
import YaqeenService from "@/services/yaqeen-service";
import dayjs from "dayjs";

const router = useRouter();
const route = useRoute();
const toast = useToast();

// TODO: write func parse state format in/out api payload
const state = reactive({
  currentStep: route.params.step || "stepIdentityInformation",
  steps: [
    {
      label: "١",
      to: "/admin-panel/charity-representative/create/stepIdentityInformation",
    },
    {
      label: "٢",
      to: "/admin-panel/charity-representative/create/StepVerification",
    },
    {
      label: "٣",
      to: "/admin-panel/charity-representative/create/stepSummary",
    },
  ],
  stepIdentityInformation: {
    identityNumber: "",
    email: "",
    mobileNumber: null,
    hijriBirthdate: "",
    gregorianBirthdate: "",
  },
  yaqeenInfo: {},
  unauthorized: true,
});


const setStep = (stepLabel) => {
  router.push(stepLabel);
};

const sendOtp = async (type) => {
  await OTPService.resendOTP({
    mobile_number: type === 'mobile'
        ? state.stepIdentityInformation.mobileNumber.replace('-', '')
        : null,
    email: type === 'email' ? state.stepIdentityInformation.email : null,
    request_type: type === 'email'
        ? OTP_TYPE.TYPE_REPRESENTATIVE_VERIFY_EMAIL
        : OTP_TYPE.TYPE_REPRESENTATIVE_VERIFY_MOBILE
  });
};

const resendOtp = () => {
  sendOtp('email')
  sendOtp('mobile')
  toast.add({
    severity: ToastSeverity.SUCCESS,
    detail: 'OTPs sent',
    life: 3000,
  });
}

const stepIdentitySubmitted = (event) => {
  stepSubmitted(event, 'stepIdentityInformation', true)
  stepVerification.value.state.mobileVerified = false
  stepVerification.value.state.emailVerified = false
}

const getUserProfile = async () => {
  await YaqeenService.getUserProfile({
    identity_type: "national_id",
    identifier: state.stepIdentityInformation.identityNumber,
    date_of_birth: dayjs(state.stepIdentityInformation.gregorianBirthdate).format('DD-MM-YYYY'),
  })
      .then((response) => {
        response.status_code === 400 ? state.unauthorized = true : state.unauthorized = false;
        state.yaqeenInfo = response.data.result;
      })
      .catch(error => {
        state.unauthorized = true;
        toast.add({
          severity: ToastSeverity.ERROR,
          detail: 'لا يمكن إضافة الممثل، بيانات الهوية غير صالحة',
          life: 3000,
        });
      });
}
const preValidate = async () => {
  const payload = {
    mobile_number: state.stepIdentityInformation.mobileNumber,
    email: state.stepIdentityInformation.email,
    national_id: state.stepIdentityInformation.identityNumber,
  }
  await CharityRepresentativeService.preValidateUser(payload)
      .then((response) => {
        response.status === 400 ? state.unauthorized = true : state.unauthorized = false;
      })
      .catch(() => {
        state.unauthorized = true;
      });
};
const stepSubmitted = async (data, stepLabel, preValidation = false) => {
  state[stepLabel] = data;
  if(preValidation) {
    state.unauthorized = true;
    await preValidate();
    if(!state.unauthorized) {
      await getUserProfile();
    }
    if(!state.unauthorized) {
      const nextStepLabel = state.steps.findIndex((e) => e.to.includes(stepLabel));
      setStep(state.steps[nextStepLabel + 1].to);
    }
  } else {
    state.unauthorized = true;
    await getUserProfile();
    if(!state.unauthorized) {
      const nextStepLabel = state.steps.findIndex((e) => e.to.includes(stepLabel));
      setStep(state.steps[nextStepLabel + 1].to);
    }
  }
};

const createRepresentative = async () => {
  const data = {
    mobile_number: formatMobile(state.stepIdentityInformation.mobileNumber),
    hijri_birthdate: formatDate(state.stepIdentityInformation.hijriBirthdate),
    gregorian_birthdate: formatDate(
      state.stepIdentityInformation.gregorianBirthdate
    ),
    national_id: state.stepIdentityInformation.identityNumber,
    email: state.stepIdentityInformation.email,
    represented_charity: localStorage.getItem('user_charity_id') || 1,
    first_name: state.yaqeenInfo.first_name,
    father_name: state.yaqeenInfo.father_name,
    last_name: state.yaqeenInfo.last_name
  };

  await CharityRepresentativeService.sendRepresentative(data);

  router.push('/admin-panel/charity-representative')

  toast.add({
    severity: ToastSeverity.SUCCESS,
    detail: 'تم إضافة ممثل الجمعية بنجاح',
    life: 3000,
  });
};

watch(
  () => route.params.step,
  (newStep) => {
    if (newStep) {
      state.currentStep = newStep;
    }
  }
);
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
::v-deep(.p-card) {
  max-width: 500px;
  box-shadow: $box-shadow-card;
  border-radius: $border-radius-default;
  margin-bottom: 8rem;
  .p-card-body {
    box-shadow: none;
  }
}
::v-deep(.p-inputtext) {
  &:disabled {
    background-color: #ececec;
  }
}
</style>
