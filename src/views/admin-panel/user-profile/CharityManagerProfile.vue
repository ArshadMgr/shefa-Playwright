<template>
  <div class="profile">
    <div class="form-container">
      <form class="profile-form" @submit.prevent="submit">
        <div class="container" v-if="pageModel">
          <div class="row mt-4">
            <div class="col-lg-12">
              <div class="form-label-group">
                <span class="p-float-label">
                  <InputText
                    id="name"
                    type="text"
                    v-model="pageModel.full_name"
                    class="w-100"
                    maxlength="100"
                    :disabled="true"
                  />
                  <label for="name">اسم مدير الجمعية</label>
                </span>
                <label class="not-edited-label">هذا الحقل لا يمكن تحريره.</label>
              </div>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-lg-12">
              <div class="form-label-group">
                <span class="p-float-label">
                  <InputText type="text" name="last_name" maxlength="100" class="w-100"
                             id="id_num" v-model="pageModel.national_id"
                             :disabled="true" />
                  <label for="id_num">رقم الهوية</label>
                </span>
                <label class="not-edited-label">هذا الحقل لا يمكن تحريره.</label>
              </div>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-lg-12">
              <div class="form-label-group position-relative">
                <div>
              <span class="p-float-label">
                  <InputText type="email" name="email" placeholder="example@domain.com" maxlength="100"
                             id="email" v-model="pageModel.email"
                             @blur="checkEmailValidity"
                             :class="[
                               'w-100',
                               { 'p-invalid': pageModel.email && isValidEmail === false }]" />
                  <label for="email">البريد الإلكتروني</label>
                </span>
                </div>
                <div class="verification" v-if="!isEmailOtpVerified && isValidEmail">
                  <button
                    class="btn btn-lg btn-primary btn-block verify-btn"
                    @click.prevent="toggleEmailVerificationModal">
                    تحقق
                  </button>
                </div>
                <div class="verified-icon" v-if="isEmailOtpVerified">
                  <img src="../../../assets/images/verified.png" alt="" />
                </div>

              </div>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-lg-12">
              <div class="form-label-group position-relative">
                <div>
                  <span class="p-float-label">
                    <div class="d-flex align-items-center">
                      <InputText required
                                 name="mobile" id="mobile"
                                 v-model="pageModel.mobile_number"
                                 @change="onMobileNumberChange"
                                 maxLength="10"
                                 :class="[
                                   'w-100',
                                   { 'p-invalid': pageModel.mobile_number && isValidMobileNumber === false }]" />
                      <label for="mobile">رقم الجوال</label>
                    </div>
                  </span>
                </div>
                <div class="verification" v-if="!isMobileOtpVerified && isValidMobileNumber">
                  <button
                    class="btn btn-lg btn-primary btn-block verify-btn"
                    @click.prevent="toggleMobileVerificationModal">
                    تحقق
                  </button>
                </div>
                <div class="verified-icon" v-if="isMobileOtpVerified">
                  <img src="../../../assets/images/verified.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4 mb-4">
            <div class="col-lg-6">
              <div class="form-label-group">
                <div class="mb-1">
                  <label class="float-label">تاريخ الميلاد (ميلادي)</label>
                </div>
                <div class="text-end">
                  <Calendar v-model="pageModel.gregorian_birthdate" :showIcon="true" inputId="icon"
                            name="dateGregorian" :disabled="true" class="w-100"></Calendar>
                </div>
                <label class="not-edited-label">هذا الحقل لا يمكن تحريره.</label>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="form-label-group">
                <div class="mb-1">
                  <label class="float-label">تاريخ الميلاد (هجري)</label>
                </div>
                <div class="text-end">
                  <Calendar v-model="pageModel.hijri_birthdate" :showIcon="true" inputId="icon"
                            name="dateHijri" class="w-100" :disabled="true"></Calendar>
                </div>
                <label class="not-edited-label">هذا الحقل لا يمكن تحريره.</label>
              </div>
            </div>
          </div>
          <div class="row text-start">
            <div class="col-12">
              <button class="btn btn-lg btn-primary btn-block login-btn" type="submit"
                      :disabled="!(isMobileOtpVerified && isEmailOtpVerified && isSaveButtonEnabled && isValidEmail && isValidMobileNumber)">
                <i class="lni-enter"></i>
                حفظ
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <VerificationModal :display="isMobileOTPModalOpened" @onClose="onMobileModalClosed($event)"
                     headerMessage="يرجى إدخال رمز التحقق المرسل على رقم الجوال"
                     :requestType="otpType.UPDATE_CHARITY_MANAGER_VERIFY_MOBILE"
                     :mobileNumber="pageModel?.mobile_number" />
  <VerificationModal :display="isEmailOTPModalOpened" @onClose="onEmailModalClosed($event)"
                     headerMessage="يرجى إدخال رمز التحقق المرسل على البريد الإلكتروني"
                     :requestType="otpType.UPDATE_CHARITY_MANAGER_VERIFY_EMAIL"
                     :email="pageModel?.email" />
</template>

<script>
import UserProfileService from "@/services/user-profile.service";
import { ToastSeverity } from "primevue/api";
import VerificationModal from "@/views/authentication/CreateAccount/verification-modal";
import { OTP_TYPE } from "@/services/otp.service";

export default {
  name: "CharityManagerProfile",
  components: { VerificationModal },
  data() {
    return {
      pageModel: {
        full_name: "",
        national_id: "",
        email: "",
        mobile_number: null,
        gregorian_birthdate: "",
        hijri_birthdate: "",
        isValidNationalID: false,
        isValidMobileNumber: false,
        isValidEmail: false
      },
      isValidOTP: true,
      isMobileOtpVerified: true,
      isEmailOtpVerified: true,
      isMobileOTPModalOpened: false,
      isEmailOTPModalOpened: false,
      originalModel: null,
      isValidMobileNumber: true,
      isValidEmail: true,
      isSaveButtonEnabled: false,
      firstLoad: true,
      verifiedMobileNumber: 0,
      verifiedEmail: "",
      otpType: OTP_TYPE
    };
  },
  created() {
    this.getProfileInfo();
  },
  methods: {
    submit() {

      UserProfileService.updateCharityManagerInfo(this.pageModel)
        .then(({ data: { result } }) => {
          this.isSaveButtonEnabled = false;
          this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم تعديل المعلومات بنجاح", life: 3000 });
        });
    },
    getProfileInfo() {
      UserProfileService.getCharityManagerInfo()
        .then(({ data }) => {
          this.pageModel = data;
          this.originalModel = { ...data };

          this.verifiedMobileNumber = this.pageModel.mobile_number;
          this.verifiedEmail = this.pageModel.email;

          this.pageModel.gregorian_birthdate = new Date(this.pageModel.gregorian_birthdate);
          this.pageModel.hijri_birthdate = new Date(this.pageModel.hijri_birthdate);
        });
    },
    onMobileNumberChange() {
      this.isMobileOtpVerified = this.pageModel.mobile_number === this.verifiedMobileNumber;
      this.isValidMobileNumber = /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(this.pageModel.mobile_number);
      if (JSON.stringify(this.pageModel) === JSON.stringify(this.originalModel)) {
        this.isSaveButtonEnabled = false;
      }
    },
    checkEmailValidity() {
      if (!this.pageModel.email) {
        this.isValidEmail = true;
        return;
      }
      this.isEmailOtpVerified = this.pageModel.email === this.verifiedEmail;
      this.isValidEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.pageModel.email);
    },
    toggleEmailVerificationModal() {
      this.isEmailOTPModalOpened = !this.isEmailOTPModalOpened;
    },
    toggleMobileVerificationModal() {
      this.isMobileOTPModalOpened = !this.isMobileOTPModalOpened;
    },
    onMobileModalClosed(data) {
      if (data.isOtpVerified) {
        this.isMobileOtpVerified = true;
        this.verifiedMobileNumber = this.pageModel.mobile_number;
      }
      this.isMobileOTPModalOpened = false;
    },
    onEmailModalClosed(data) {
      if (data.isOtpVerified) {
        this.isEmailOtpVerified = true;
        this.verifiedEmail = this.pageModel.email;
      }
      this.isEmailOTPModalOpened = false;
    }
  },
  watch: {
    "pageModel": {
      handler(val) {
        if (val) {
          if (!this.firstLoad) {
            this.isSaveButtonEnabled = true;
          }
          this.firstLoad = false;
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>

.profile {

  .form-container {

    direction: rtl;

    .profile-form {
      padding: 20px;
      margin: auto;
      background-color: white;
      border-radius: 10px;
      box-shadow: 1px 1px 14px #0000001a;
    }
  }

  .login-btn {
    border-radius: 57px;
    padding: 0.7rem 4rem;
    width: auto;
    background: #38c5be;
    border: none;
    font-size: 23px;
    float: left;

    &:hover {
      background: #36aba8;
    }
  }

  .btn:not(:disabled):not(.disabled) {
    cursor: pointer;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
  }

  .dir-rtl {
    direction: rtl;
  }
}

.not-edited-label {
  font-size: 14px;
  color: #3f3f3f;
  margin-top: 5px;
}

.p-float-label label,
.float-label {
  left: 0;
  right: 0.75rem;
  font-size: 12px;
  color: #8c8c8c;
}

:deep(.p-component:disabled) {
  background: #ECECEC;
}

:deep(.p-calendar-disabled) {
  button {
    display: none;
  }
}
</style>
