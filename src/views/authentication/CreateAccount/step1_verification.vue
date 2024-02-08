<template>
  <div>
    <div class="welcome-container row">
      <div class="col-12 title">التحقق من هوية مدير الجمعية</div>
      <div class="col-12 sub-title">
        يرجى إدخال رمز التحقق المرسل على كل من رقم الجوال والبريد الإلكتروني:
      </div>
    </div>

    <form class="form-step1 w-100">
      <div class="form-label-group mb-3" style="position: relative">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="mobile_number"
              type="number"
              v-model="payload.mobile_number"
              class="w-100"
              :readonly="true"
              style="padding-left: 40px"
              :disabled="true"
            />
            <label for="mobile_number">رقم جوال مدير الجمعية</label>
          </span>
        </div>
        <div class="verified-icon" v-if="payload.is_mobile_verified">
          <img src="../../../assets/images/verified.png" alt="" />
        </div>
        <div class="verification" v-else>
          <button
            class="btn btn-lg btn-primary btn-block verify-btn"
            @click.stop="toggleMobileVerificationModal"
            type="button"
          >
            تحقق
          </button>
        </div>
      </div>

      <div class="form-label-group mb-3" style="position: relative">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="email"
              type="email"
              v-model="payload.email"
              class="w-100"
              :readonly="true"
              style="padding-left: 40px"
              :disabled="true"
            />
            <label for="email">بريد مدير الجمعية الإلكتروني</label>
          </span>
        </div>
        <div class="verified-icon" v-if="payload.is_email_verified">
          <img src="../../../assets/images/verified.png" alt="" />
        </div>
        <div class="verification" v-else>
          <button
            class="btn btn-lg btn-primary btn-block verify-btn"
            @click.stop="toggleEmailVerificationModal"
            type="button"
          >
            تحقق
          </button>
        </div>
      </div>
    </form>

    <div class="border-container"></div>

    <div class="row">
      <div class="col-lg-6">
        <button
          id="close-btn"
          class="btn btn-lg btn-secondary btn-block close-btn"
          type="button"
          @click.stop="$emit('closeVerificationStep1')"
        >
          إغلاق
        </button>
      </div>
      <div class="col-lg-6">
        <button
          id="tracking-btn"
          class="btn btn-lg btn-primary btn-block tracking-btn"
          type="button"
          :disabled="!payload.is_mobile_verified || !payload.is_email_verified"
          @click.stop="toggleVerifyInfoModal"
        >
          متابعة
        </button>
      </div>
    </div>

    <VerificationModal
      :display="isMobileOTPModalOpened"
      @onClose="onMobileModalClosed($event)"
      headerMessage="يرجى إدخال رمز التحقق المرسل على رقم الجوال"
      :requestType="otpType.VERIFY_MOBILE"
      :mobileNumber="payload.mobile_number"
      :email="null"
      :model_id="payload.id"
    />

    <VerificationModal
      :display="isEmailOTPModalOpened"
      @onClose="onEmailModalClosed($event)"
      headerMessage="يرجى إدخال رمز التحقق المرسل على البريد الإلكتروني"
      :requestType="otpType.VERIFY_EMAIL"
      :mobileNumber="null"
      :email="payload.email"
      :model_id="payload.id"
    />

    <VerifyInfoModal
      :display="open_verify_info_modal"
      :verified_info="verified_info"
      @submit="onVerificationSubmitted"
    />
  </div>
</template>

<script>
import Checkbox from "primevue/checkbox";
import Calendar from "primevue/calendar";
import VerificationModal from "./verification-modal.vue";
import VerifyInfoModal from "./verify-info-modal.vue";

import { OTP_TYPE } from "@/services/otp.service";
import CharityRegisterService from "@/services/charity-register.service";

export default {
  name: "create-account-step1-verification",
  props: ["payload", "verified_info", "next", "setPayload"],
  emits: ["closeVerificationStep1"],
  components: {
    Checkbox,
    Calendar,
    VerificationModal,
    VerifyInfoModal,
  },
  data() {
    return {
      otpType: OTP_TYPE,
      isMobileOTPModalOpened: false,
      isEmailOTPModalOpened: false,
      open_verify_info_modal: false,
      requestType: null,
      mobileNumber: null,
      email: null,
    };
  },
  methods: {
    onMobileModalClosed(data) {
      if (data.isOtpVerified) {
        this.$emit("setPayload", "is_mobile_verified", true);
      }
      this.toggleMobileVerificationModal();
    },
    toggleMobileVerificationModal() {
      this.isMobileOTPModalOpened = !this.isMobileOTPModalOpened;
    },
    onEmailModalClosed(data) {
      if (data.isOtpVerified) {
        this.$emit("setPayload", "is_email_verified", true);
      }
      this.toggleEmailVerificationModal();
    },
    toggleEmailVerificationModal() {
      this.isEmailOTPModalOpened = !this.isEmailOTPModalOpened;
    },
    setVerifiedInfo(
      first_name,
      last_name,
      father_name,
      gender,
      identity_card_expiry
    ) {
      this.$props.verified_info.first_name = first_name;
      this.$props.verified_info.last_name = last_name;
      this.$props.verified_info.father_name = father_name;
      this.$props.verified_info.gender = gender;
      this.$props.verified_info.identity_card_expiry = identity_card_expiry;
    },
    toggleVerifyInfoModal() {
      if (
        this.$props.payload.is_mobile_verified &&
        this.$props.payload.is_email_verified &&
        !this.verified_info.first_name
      ) {
        CharityRegisterService.step2(this.payload.id)
          .then(({ data }) => {
            const {
              first_name,
              last_name,
              father_name,
              gender,
              identity_card_expiry,
            } = data.result;
            this.setVerifiedInfo(
              first_name,
              last_name,
              father_name,
              gender,
              identity_card_expiry
            );
            this.open_verify_info_modal = !this.open_verify_info_modal;
          })
          .catch((error) => {
            this.error = error;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    onVerificationSubmitted() {
      this.open_verify_info_modal = !this.open_verify_info_modal;
    }
  },
};
</script>

<style lang="scss" scoped>
.welcome-container {
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  .sub-title {
    font-size: 18px;
  }
}
.accept-checkbox {
  label {
    font-size: 14px;
    color: #3f3f3f;
    margin-right: 5px;
  }
}
.border-container {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
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
</style>
