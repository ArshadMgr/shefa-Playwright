<template>
  <div class="profile">
    <div class="form-container">
      <form class="profile-form" @submit.prevent="submit" v-if="pageModel">
        <div class="container">
          <div class="row mt-4">
            <div class="col-lg-12">
              <div class="form-label-group">
                <span class="p-float-label" data-cy="first-name">
                  <InputText
                    id="first_name"
                    type="text"
                    v-model="pageModel.first_name"
                    maxlength="100"
                    class="w-100"/>
                  <label for="first_name">الاسم الأول</label>
                </span>
              </div>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-lg-12">
              <div class="form-label-group">
                <span class="p-float-label" data-cy="last-name">
                  <InputText type="text" name="last_name" maxlength="100"
                             id="last_name" v-model="pageModel.last_name"
                             class="w-100"/>
                  <label for="last_name">الاسم الأخير</label>
                </span>
              </div>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-lg-12">
              <div class="form-label-group">
                <span class="p-float-label" data-cy="email">
                  <InputText type="email" name="email" maxlength="100"
                             id="email" v-model="pageModel.email"
                             @blur="checkEmailValidity"
                             :class="[
                               'w-100',
                               { 'p-invalid': pageModel.email && isValidEmail === false }]"/>
                  <label for="email">البريد الإلكتروني</label>
                </span>
              </div>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-lg-12">
              <div class="form-label-group position-relative">
                <div>
                  <span class="p-float-label">
                    <div class="d-flex align-items-center" data-cy="phone">
                      <InputText required
                                 name="mobile" id="mobile"
                                 v-model="pageModel.mobile_number"
                                 @change="onMobileNumberChange"
                                 maxLength="10"
                                 :class="[
                                   'w-100',
                                   { 'p-invalid': pageModel.mobile_number && isValidMobileNumber === false }]"/>
                      <label for="mobile">الجوال</label>
                    </div>
                  </span>
                </div>
                <div class="verification" v-if="!isOtpVerified && isValidMobileNumber">
                  <button
                    class="btn btn-lg btn-primary btn-block verify-btn"
                    @click.prevent="toggleVerificationModal">
                    تحقق
                  </button>
                </div>
                <div class="verified-icon" v-if="isOtpVerified">
                  <img src="../../../assets/images/verified.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-lg-6 mb-3 mb-lg-0">
              <div class="form-label-group">
                <div class="mb-1">
                  <label data-cy="date-of-birth-gregorian-label">تاريخ الميلاد (ميلادي)</label>
                </div>
                <div class="text-end" data-cy="date-of-birth-gregorian">
                  <Calendar v-model="dateGregorian" :showIcon="true" inputId="icon"
                            name="dateGregorian" @date-select="onDateChange(true)"
                            :maxDate="maxDate"
                            class="w-100"></Calendar>
                </div>
              </div>
            </div>
            <div class="col-lg-6 mb-3 mb-lg-0">
              <div class="form-label-group">
                <div class="mb-1">
                  <label data-cy="date-of-birth-hijri-label">تاريخ الميلاد (هجري)</label>
                </div>
                <div class="text-end" data-cy="date-of-birth-hijri">
                  <HijriCalendar v-model="dateHijri" :showIcon="true" inputId="icon"
                            name="dateHijri" @date-select="onDateChange(false)"
                            :maxDate="hijriMaxDate" class="w-100"
                            :monthNames="$store.state.hijriMonthNames"
                            :monthNamesShort="$store.state.hijriMonthNamesShort"></HijriCalendar>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4 mb-4">
            <div class="col-lg-6">
              <div class="form-label-group">
                <div class="mb-3">
                  <label data-cy="gender">الجنس</label>
                </div>
                <div class="row mb-2">
                  <div class="col-3 d-flex mb-3 mb-lg-0"  data-cy="male-radio-btn">
                    <RadioButton inputId="1" name="gender" id="male" value="1" v-model="pageModel.gender"/>
                    <label for="male" class="me-3" data-cy="male-label">ذكر</label>
                  </div>
                  <div class="col-3 d-flex mb-3 mb-lg-0"  data-cy="female-radio-btn">
                    <RadioButton inputId="2" name="gender" id="female" value="2" v-model="pageModel.gender"/>
                    <label for="female" class="me-3" data-cy="female-label">أنثى</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="form-label-group text-end mb-1">
                <label for="region" data-cy="region-label">المنطقة</label>
                <div data-cy="region">
                  <Dropdown v-model="pageModel.region" :options="regions" optionLabel="name" optionValue="id"
                            placeholder="اختر المنطقة" :filter="true"
                            name="region" id="region" class="w-100" />
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 mb-4">
            <div class="row mb-4">
              <span data-cy="account-settings">إعدادات الحساب:</span>
            </div>
            <div class="row mb-3">
              <div class="form-label-group">
                <span class="p-float-label" data-cy="your-name-in-list">
                  <InputText
                    id="ambassador_name"
                    type="text"
                    v-model="pageModel.ambassador_name"
                    class="w-100"
                  />
                  <label for="first_name">اسمك في القائمة</label>
                </span>
              </div>
            </div>
            <div class="d-flex" data-cy="hide-ambassador-name-checkbox">
              <Checkbox
                v-model="pageModel.hide_ambassador_name"
                :binary="true"
                inputId="hide_ambassador_name"
                id="hide_ambassador_name"/>
              <label for="hide_ambassador_name" class="mx-2" data-cy="hide-ambassador-name">
                إخفاء اسمي من قائمة سفراء شفاء
              </label>
            </div>
            <div class="d-flex mt-3" data-cy="hide-donor-name-checkbox">
              <Checkbox
                  v-model="pageModel.hide_donor_name"
                  :binary="true"
                  inputId="hide_donor_name"
                  id="hide_donor_name"/>
              <label for="hide_donor_name" class="mx-2" data-cy="hide-donor-name">
                إخفاء اسمي من قائمة كبار المتبرعين
              </label>
            </div>
          </div>
          <div class="row">
            <div class="col-12 text-center">
              <button class="btn btn-lg btn-primary btn-block login-btn float-lg-start" type="submit"
                      :disabled="!(isOtpVerified && isSaveButtonEnabled && isValidEmail && isValidMobileNumber)" data-cy="save">
                <i class="lni-enter"></i>
                حفظ
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <VerificationModal
    :display="isOTPModalOpened"
    @onClose="onModalClosed($event)"
    headerMessage="يرجى إدخال رمز التحقق المرسل على رقم الجوال"
    :requestType="otpType.CHANGE_MOBILE"
    :mobileNumber="pageModel?.mobile_number?.split('-').join('')" />
</template>

<script>
import UserProfileService from "@/services/user-profile.service";
import EnumService from "@/services/enum.service";
import { ToastSeverity } from "primevue/api";
import { toGregorian, toHijri } from "hijri-converter";
import VerificationModal from "@/views/authentication/CreateAccount/verification-modal";
import InputMask from "primevue/inputmask";
import { OTP_TYPE } from "@/services/otp.service";
import { STORE_ENUM } from "@/store/store.enums";
import dayjs from "dayjs";

export default {
  name: "DonorProfile",
  components: { VerificationModal, InputMask },
  data() {
    return {
      pageModel: null,
      dateGregorian: null,
      dateHijri: null,
      regions: [],
      selectedRegion: {},
      dateGregorianObj: {},
      dateHijriObj: { hy: 0, hm: 0, hd: 0 },
      maxDate: null,
      hijriMaxDate: Date,
      isOtpVerified: true,
      isOTPModalOpened: false,
      isSubmitted: false,
      isValidEmail: true,
      isValidMobileNumber: true,
      otpType: OTP_TYPE,
      isSaveButtonEnabled: false,
      firstLoad: true,
      verifiedMobileNumber: 0,
      originalModel: null
    };
  },
  created() {
    this.getRegions();
    this.setInitialDateValues();
  },
  methods: {
    submit() {
      if (this.dateGregorian && this.dateHijri) {
        this.pageModel.hijri_birthdate = dayjs(this.dateHijri).format("YYYY-MM-DD");
        this.pageModel.gregorian_birthdate = dayjs(this.dateGregorian).format("YYYY-MM-DD");
      }
      this.pageModel.mobile_number = this.pageModel.mobile_number.split("-").join("");

      this.isSubmitted = true;
      this.pageModel.gender ??= undefined;

      UserProfileService.updateProfileInfo(this.pageModel)
        .then(({ data: { result } }) => {
          this.isSaveButtonEnabled = false;
          if (this.pageModel.mobile_number !== this.originalModel.mobile_number) {
            this.logout();
          }
          localStorage.setItem("username", this.pageModel.first_name ? this.pageModel.first_name : this.pageModel.mobile_number);
          this.$router.go();
          this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: result, life: 3000 });
        });
    },
    onDateChange(isGregorian) {
      if (isGregorian) {
        this.dateHijriObj = toHijri(this.dateGregorian.getFullYear(), this.dateGregorian.getMonth() + 1, this.dateGregorian.getDate());
        this.dateHijri = new Date(this.dateHijriObj.hy, this.dateHijriObj.hm - 1, this.dateHijriObj.hd);
      } else {
        this.dateGregorianObj = toGregorian(this.dateHijri.getFullYear(), this.dateHijri.getMonth() + 1, this.dateHijri.getDate());
        this.dateGregorian = new Date(this.dateGregorianObj.gy, this.dateGregorianObj.gm - 1, this.dateGregorianObj.gd);
      }
      this.isSaveButtonEnabled = true;
    },
    getRegions() {
      EnumService.regions()
        .then(({ data: { result } }) => {
          this.regions = result;

          this.getProfileInfo();
        });
    },
    getProfileInfo() {
      UserProfileService.getProfileInfo()
        .then(({ data: { result } }) => {
          this.pageModel = result;
          this.originalModel = { ...result };
          this.verifiedMobileNumber = this.pageModel.mobile_number;

          this.selectedRegion = this.regions.find(region => region.id === Number(this.pageModel.region));

          this.dateGregorian = this.pageModel.gregorian_birthdate ?
            new Date(this.pageModel.gregorian_birthdate) : null;
          this.dateHijri = this.pageModel.hijri_birthdate ?
            new Date(this.pageModel.hijri_birthdate) : null;
        });
    },
    setInitialDateValues() {
      this.maxDate = new Date();
      const hijriMaxDateObj = toHijri(this.maxDate.getFullYear(), this.maxDate.getMonth() + 1, this.maxDate.getDate());
      this.hijriMaxDate = new Date(hijriMaxDateObj.hy, hijriMaxDateObj.hm - 1, hijriMaxDateObj.hd);
    },
    toggleVerificationModal() {
      if (!this.pageModel?.mobile_number) return;
      this.isOTPModalOpened = !this.isOTPModalOpened;
    },
    onModalClosed(data) {
      if (data.isOtpVerified) {
        this.isOtpVerified = true;
        this.verifiedMobileNumber = this.pageModel.mobile_number;
      }
      this.isOTPModalOpened = false;
    },
    checkEmailValidity() {
      if (!this.pageModel.email) {
        this.isValidEmail = true;
        return;
      }
      this.isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.pageModel.email);
    },
    onMobileNumberChange() {
      this.isOtpVerified = this.pageModel.mobile_number === this.verifiedMobileNumber;
      this.isValidMobileNumber = /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(this.pageModel.mobile_number);
      if (JSON.stringify(this.pageModel) === JSON.stringify(this.originalModel)) {
        this.isSaveButtonEnabled = false;
      }
    },
    logout() {
      this.$store
        .dispatch(STORE_ENUM.SIGN_OUT)
        .then(() => {
          this.$router.push("/sign-in");
        })
        .catch(() => {
          this.$toast.add({ severity: ToastSeverity.ERROR, detail: "حدث خطأ في النظام", life: 3000 });
        });
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

:deep(.p-float-label label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 14px !important;
}
</style>
