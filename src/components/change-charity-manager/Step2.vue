<template>
  <form class="form">
    <div class="title fw-bold mb-2">
      <span>بيانات مدير الجمعية الجديد</span>
    </div>
    <div class="sub-title">
      <span>يرجى إدخال رمز التحقق المرسل على كل من رقم الجوال والبريد الإلكتروني:</span>
    </div>
    <div class="container">
      <div class="row mt-5">
        <div class="col-lg-12">
          <div class="form-label-group position-relative">
            <div>
              <span class="p-float-label">
                <div class="d-flex align-items-center">
                  <InputText name="mobile"
                             type="text"
                             id="mobile"
                             v-model="pageModel.mobile_number"
                             :disabled="true"
                             maxLength="10"
                             class="w-100" />
                  <label for="mobile">رقم الجوال</label>
                </div>
              </span>
            </div>
            <div class="verification" v-if="!pageModel.isMobileOtpVerified">
              <button
                class="btn btn-lg btn-primary btn-block verify-btn"
                @click.prevent="toggleMobileVerificationModal">
                تحقق
              </button>
            </div>
            <div class="verified-icon" v-if="pageModel.isMobileOtpVerified">
              <img src="../../assets/images/verified.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-5 mb-5">
        <div class="col-lg-12">
          <div class="form-label-group position-relative">
            <div>
              <span class="p-float-label">
                  <InputText type="email"
                             name="email"
                             id="email"
                             v-model="pageModel.email"
                             :disabled="true"
                             class="w-100" />
                  <label for="email">البريد الإلكتروني</label>
                </span>
            </div>
            <div class="verification" v-if="!pageModel.isEmailOtpVerified">
              <button
                class="btn btn-lg btn-primary btn-block verify-btn"
                @click.prevent="toggleEmailVerificationModal">
                تحقق
              </button>
            </div>
            <div class="verified-icon" v-if="pageModel.isEmailOtpVerified">
              <img src="../../assets/images/verified.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="row text-start">
        <div class="col-12 d-flex justify-content-around">
          <Button label="السابق" class="p-button-rounded p-button-secondary prev-btn mx-3 flex-grow-1"
                  @click="this.$parent.prev" />
          <Button label="متابعة" class="p-button-rounded mx-3 flex-grow-1" @click="submit"
                  :disabled="!(pageModel.isMobileOtpVerified && pageModel.isEmailOtpVerified)" />
        </div>
      </div>
    </div>
  </form>
  <VerificationModal :display="pageModel.isMobileOTPModalOpened" @onClose="onMobileModalClosed($event)"
                     headerMessage="يرجى إدخال رمز التحقق المرسل على رقم الجوال"
                     :requestType="otpType.REASSIGN_CHARITY_MANAGER_VERIFY_MOBILE"
                     :mobileNumber="pageModel?.mobile_number" />
  <VerificationModal :display="pageModel.isEmailOTPModalOpened" @onClose="onEmailModalClosed($event)"
                     headerMessage="يرجى إدخال رمز التحقق المرسل على البريد الإلكتروني"
                     :requestType="otpType.REASSIGN_CHARITY_MANAGER_VERIFY_EMAIL"
                     :email="pageModel?.email" />
</template>

<script>
import VerificationModal from "@/views/authentication/CreateAccount/verification-modal";
import { OTP_TYPE } from "@/services/otp.service";

export default {
  name: "Step2",
  components: { VerificationModal },
  props: ["pageModel"],
  emits: ["next"],
  data() {
    return {
      otpType: OTP_TYPE
    };
  },
  methods: {
    submit() {
      if (this.pageModel.isMobileOtpVerified && this.pageModel.isEmailOtpVerified)
        this.$emit("next");
    },
    toggleEmailVerificationModal() {
      this.pageModel.isEmailOTPModalOpened = !this.pageModel.isEmailOTPModalOpened;
    },
    toggleMobileVerificationModal() {
      this.pageModel.isMobileOTPModalOpened = !this.pageModel.isMobileOTPModalOpened;
    },
    onMobileModalClosed(data) {
      if (data.isOtpVerified) {
        this.pageModel.isMobileOtpVerified = true;
      }
      this.pageModel.isMobileOTPModalOpened = false;
    },
    onEmailModalClosed(data) {
      if (data.isOtpVerified) {
        this.pageModel.isEmailOtpVerified = true;
      }
      this.pageModel.isEmailOTPModalOpened = false;
    }
  }
};
</script>

<style lang="scss" scoped>

.title {
  font-size: 24px;
}

.sub-title {
  font-size: 18px;
}

:deep(.p-float-label label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 14px !important;
}

:deep(.prev-btn) {
  background: #D9D9D9;
  border-color: #D9D9D9;
  color: black;

  &:hover {
    background: #A9A9A9 !important;
    color: black !important;
    border-color: #D9D9D9 !important;
  }
}
</style>
