<template>
  <div>
    <div class="welcome-container row">
      <div class="col-12 title">التحقق من معلومات الجمعية</div>
      <div class="col-12 sub-title">
        يرجى إدخال رمز التحقق المرسل على كل من رقم الجوال والبريد الإلكتروني:
      </div>
    </div>

    <form class="form-step1 w-100">
      <div class="form-label-group mb-3" style="position: relative">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="chairman_mobile"
              type="number"
              v-model="payload.chairman_mobile"
              class="w-100"
              :readonly="true"
              style="padding-left: 40px"
              :disabled="true"
            />
            <label for="chairman_mobile"
              >التحقق من رقم جوال رئيس مجلس الإدارة
            </label>
          </span>
        </div>
        <div
          class="verified-icon"
          v-if="
            payload.is_chairman_mobile_verified ||
            (payload.the_charity_manager_is_the_chairman &&
              payload.chairman_mobile === payload.mobile_number)
          "
        >
          <img src="../../../assets/images/verified.png" alt="" />
        </div>
        <div class="verification" v-else>
          <button
            class="btn btn-lg btn-primary btn-block verify-btn"
            :disabled="loading"
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
              id="charity_email"
              type="email"
              v-model="payload.charity_email"
              class="w-100"
              :readonly="true"
              style="padding-left: 40px"
              :disabled="true"
            />
            <label for="charity_email">التحقق من بريد الجمعية الإلكرتوني</label>
          </span>
        </div>
        <div class="verified-icon" v-if="payload.is_charity_email_verified">
          <img src="../../../assets/images/verified.png" alt="" />
        </div>
        <div class="verification" v-else>
          <button
            class="btn btn-lg btn-primary btn-block verify-btn"
            :disabled="loading"
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
          :disabled="loading"
          @click.stop="$emit('closeVerificationStep4')"
        >
          إغلاق
        </button>
      </div>
      <div class="col-lg-6">
        <button
          id="tracking-btn"
          class="btn btn-lg btn-primary btn-block tracking-btn"
          type="button"
          :disabled="
            loading ||
            !(
              payload.is_chairman_mobile_verified ||
              (payload.the_charity_manager_is_the_chairman &&
                payload.chairman_mobile === payload.mobile_number)
            ) ||
            !payload.is_charity_email_verified
          "
          @click.stop="submit"
        >
          متابعة
        </button>
      </div>
    </div>

    <VerificationModal
      :display="isMobileOTPModalOpened"
      @onClose="onMobileModalClosed($event)"
      headerMessage="يرجى إدخال رمز التحقق المرسل على رقم الجوال"
      :requestType="otpType.CHAIRMAN_MOBILE"
      :mobileNumber="payload.chairman_mobile"
      :email="null"
      :model_id="payload.id"
    />

    <VerificationModal
      :display="isEmailOTPModalOpened"
      @onClose="onEmailModalClosed($event)"
      headerMessage="يرجى إدخال رمز التحقق المرسل على البريد الإلكتروني"
      :requestType="otpType.CHARITY_EMAIL"
      :mobileNumber="null"
      :email="payload.charity_email"
      :model_id="payload.id"
    />

    <VerifyInfoModal
      :display="open_verify_info_modal"
      :verified_info="verified_info"
    />
  </div>
</template>

<script>
import Checkbox from "primevue/checkbox";
import Calendar from "primevue/calendar";
import VerificationModal from "./verification-modal.vue";
import VerifyInfoModal from "./verify-info-modal.vue";

import { OTP_TYPE } from "@/services/otp.service";

export default {
  name: "create-account-step1-verification",
  props: ["payload", "verified_info", "setPayload", "next"],
  emits: ["closeVerificationStep4"],
  components: {
    Checkbox,
    Calendar,
    VerificationModal,
    VerifyInfoModal,
  },
  data() {
    return {
      otpType: OTP_TYPE,
      loading: false,
      error: null,
      submitted: false,
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
        this.$emit("setPayload", "is_chairman_mobile_verified", true);
      }
      this.toggleMobileVerificationModal();
    },
    toggleMobileVerificationModal() {
      this.isMobileOTPModalOpened = !this.isMobileOTPModalOpened;
    },
    onEmailModalClosed(data) {
      if (data.isOtpVerified) {
        this.$emit("setPayload", "is_charity_email_verified", true);
      }
      this.toggleEmailVerificationModal();
    },
    toggleEmailVerificationModal() {
      this.isEmailOTPModalOpened = !this.isEmailOTPModalOpened;
    },
    toggleVerifyInfoModal() {
      this.open_verify_info_modal = !this.open_verify_info_modal;
    },
    submit() {
      this.submitted = true;
      this.loading = true;
      this.error = null;
      this.$emit("next");
    },
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
