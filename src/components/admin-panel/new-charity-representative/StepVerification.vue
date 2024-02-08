<template>
  <section>
    <VerificationModal
        :display="state.isMobileOTPModalOpened"
        @onClose="onMobileModalClosed($event)"
        headerMessage="يرجى إدخال رمز التحقق المرسل على رقم الجوال"
        :requestType="OTP_TYPE.TYPE_REPRESENTATIVE_VERIFY_MOBILE"
        :mobileNumber="payload.mobileNumber?.replace('-', '')"
        :email="null"
        :model_id="payload.id"
    />

    <VerificationModal
        :display="state.isEmailOTPModalOpened"
        @onClose="onEmailModalClosed($event)"
        headerMessage="يرجى إدخال رمز التحقق المرسل على البريد الإلكتروني"
        :requestType="OTP_TYPE.TYPE_REPRESENTATIVE_VERIFY_EMAIL"
        :mobileNumber="null"
        :email="payload.email"
        :model_id="payload.id"
    />

    <div class="welcome-container row">
      <div class="col-12 title">التحقق من هوية ممثل الجمعية</div>
      <span class="col-12 subtitle"
        >يرجى إدخال رمز التحقق المرسل على كل من رقم الجوال والبريد
        الإلكتروني:</span
      >
    </div>

    <form
      class="form-personal-information w-100 mt-4"
      @submit.prevent="submit()"
    >
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4 position-relative">
            <span class="p-float-label">
              <InputText
                id="mobile"
                type="text"
                disabled
                v-model="payload.mobileNumber"
                class="w-100"
                maxlength="100"
              />
              <label for="mobile">رقم جوال ممثل الجمعية</label>
            </span>
            <span>هذا الحقل لا يمكن تحريره</span>
            <i
              v-if="state.mobileVerified"
              class="pi pi-check-circle icon-primary icon-primary--float"
            ></i>
            <Button
              v-else
              @click="verifyMobile"
              class="
                p-button p-button-rounded p-button-primary
                button-primary--float
              "
              label="تحقق"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4 position-relative">
            <span class="p-float-label">
              <InputText
                id="email"
                type="text"
                disabled
                v-model="payload.email"
                class="w-100"
                maxlength="100"
              />
              <label for="email">بريد ممثل الجمعية الإلكتروني</label>
            </span>
            <span>هذا الحقل لا يمكن تحريره</span>
            <i
              v-if="state.emailVerified"
              class="pi pi-check-circle icon-primary icon-primary--float"
            ></i>
            <Button
              v-else
              @click="verifyEmail"
              class="
                p-button p-button-rounded p-button-primary
                button-primary--float
              "
              label="تحقق"
            />
          </div>
        </div>
      </div>

      <div class="row border-top-spacer">
        <div class="col-lg-6">
          <Button
            id="close-btn"
            label="إغلاق"
            class="p-button p-button-rounded p-button-secondary px-5 mx-2 w-100"
            type="button"
            @click.stop="goBack"
          />
        </div>
        <div class="col-lg-6">
          <Button
            id="tracking-btn"
            label="متابعة"
            class="p-button p-button-rounded p-button-primary px-5 mx-2 w-100"
            type="submit"
            :disabled="!state.mobileVerified || !state.emailVerified"
          />
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import {defineProps, onMounted, reactive, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import otpService, { OTP_TYPE } from "@/services/otp.service";
import VerificationModal from "@/views/authentication/CreateAccount/verification-modal.vue";
const router = useRouter();
const route = useRoute();
const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
  payload: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["submit", "previous", "resend", "setPayload"]);

const otpArray = ref([])
const showResend = ref(false)
const state = reactive({
  isMobileOTPModalOpened: false,
  isEmailOTPModalOpened: false,
  value: null,
  form: Object.assign({}, props.payload),
  loading: false,
  error: "",
  submitted: false,
  mobileVerified: false,
  emailVerified: false,
  otpString: ""
});

onMounted(() => {
  setTimeout(() => {
    showResend.value = true
  }, 5 * 1000)
})

const resend = () => {
  setTimeout(() => {
    showResend.value = true
  }, 5 * 1000)
  showResend.value = false
  emit('resend')
}

const onMobileModalClosed = (data) => {
  if (data.isOtpVerified) {
    state.mobileVerified = true
    emit("setPayload", "is_mobile_verified", true);
  }
  state.isMobileOTPModalOpened = false
}

const onEmailModalClosed = (data) => {
  if (data.isOtpVerified) {
    state.emailVerified = true
    emit("setPayload", "is_email_verified", true);
  }
  state.isEmailOTPModalOpened = false
}

const verifyMobile = () => {
  state.isMobileOTPModalOpened = true
};

const verifyEmail = () => {
  state.isEmailOTPModalOpened = true
};

const inputsMobile = ref([])
const inputsEmail = ref([])
const focusNext = (num, group) => {
  let inputsArray = [];
  if(group === 'email') {
    inputsArray = Array.from(inputsEmail.value);
  } else if(group === 'mobile') {
    inputsArray = Array.from(inputsMobile.value);
  }
  inputsArray.splice(0, 1)
  if(num < 6 && inputsArray[num - 1].value !== '') {
    inputsArray[num].focus()
  }
}
const resetInputs = () => {
  state.otpArray = [];
  state.otpArray = [];
}

const goBack = () => {
  emit("previous");
};

const submit = () => {
  state.submitted = true;
  emit("submit", state.form);
};

defineExpose({ state })
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
.welcome-container {
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  .subtitle {
    font-size: 18px;
  }
}
.p-float-label label {
  right: 0.75rem;
}

.field * {
  display: block;
}

.top-label {
  margin-right: 0.75rem;
  font-size: 12px;
  color: #6c757d;
}

.tracking-btn {
  display: block;
  margin: 0 auto;
  width: 80%;
  border-radius: 25px;
  padding: 10px;
  background: #12b2aa;
  color: #ffffff;
  border: none;
  font-size: 18px;
}

.icon-primary {
  font-size: 18px;
  color: $color-primary;
  &--float {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(20px, -118%);
  }
}
.button-primary {
  font-size: 18px;
  &--float {
    position: absolute;
    top: 64%;
    left: 0;
    transform: translate(20px, -118%);
    padding: 0.3rem 1rem;
    font-size: 14px;
  }
}

.tracking-btn:hover {
  background-color: #0e8e88 !important;
  border: none;
}

.close-btn {
  display: block;
  margin: 0 auto;
  width: 80%;
  border-radius: 25px;
  padding: 10px;
  background: #d9d9d9;
  color: #3f3f3f;
  border: none;
  font-size: 18px;
}

input[disabled] {
  background: #ececec;
  border: 1px solid #ececec;
}
.file-input-invalid {
  border: 1px solid #e24c4c;
  border-radius: 5px;
}
.border-top-spacer {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
}
input.digit {
  width: 3rem;
  height: 3rem;
  margin: 0 1rem;
  border: 1px solid $color-secondary;
  border-radius: $border-radius-small;
  text-align: center;
  &:focus,
  &:focus-visible {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 8px rgba($color: $color-primary, $alpha: 0.5);
  }
}

.send-again {
  display: flex;
  justify-content: center;
  color: $color-primary;
  text-decoration: underline;
  cursor: pointer;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
