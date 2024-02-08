<template>
  <form class="form">
    <div class="title fw-bold">
      <span>بيانات مدير الجمعية الجديد</span>
    </div>
    <div class="container">
      <div class="row mt-5">
        <div class="col-lg-12">
          <div class="form-label-group">
                <span class="p-float-label">
                  <InputText type="text"
                             name="last_name"
                             maxlength="10"
                             id="id_num" v-model="pageModel.national_id"
                             class="w-100"
                             @blur="onNationalIDChange"
                             :class="[
                               'w-100',
                               { 'p-invalid': pageModel.national_id && pageModel.isValidNationalID === false }]"/>
                  <label for="id_num">رقم الهوية</label>
                </span>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-lg-12">
          <div class="form-label-group position-relative">
            <div>
              <span class="p-float-label">
                  <InputText type="email"
                             name="email"
                             id="email"
                             v-model="pageModel.email"
                             @blur="checkEmailValidity"
                             :disabled="pageModel.isEmailOtpVerified"
                             :class="[
                               'w-100',
                               { 'p-invalid': pageModel.email && pageModel.isValidEmail === false }]" />
                  <label for="email">البريد الإلكتروني</label>
                </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-lg-12">
          <div class="form-label-group position-relative">
            <div>
              <span class="p-float-label">
                  <InputText name="mobile"
                             type="text"
                             id="mobile"
                             maxLength="10"
                             v-model="pageModel.mobile_number"
                             :disabled="pageModel.isMobileOtpVerified"
                             @change="onMobileNumberChange"
                             :class="[
                               'w-100',
                               { 'p-invalid': pageModel.mobile_number && pageModel.isValidMobileNumber === false }]" />
                  <label for="mobile">رقم الجوال</label>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-lg-6">
          <div class="form-label-group">
            <div class="mb-1">
              <label class="float-label">تاريخ الميلاد (ميلادي)</label>
            </div>
            <div class="text-end">
              <Calendar v-model="pageModel.dateGregorian" :showIcon="true" inputId="icon"
                        name="dateGregorian" @date-select="onDateChange(true)"
                        :maxDate="pageModel.maxDate" class="w-100"
                        dateFormat="yy-mm-dd"></Calendar>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-label-group">
            <div class="mb-1">
              <label class="float-label">تاريخ الميلاد (هجري)</label>
            </div>
            <div class="text-end">
              <HijriCalendar v-model="pageModel.dateHijri" :showIcon="true" inputId="icon"
                        name="dateHijri" @date-select="onDateChange(false)"
                        :maxDate="pageModel.hijriMaxDate" class="w-100"
                        :monthNames="$store.state.hijriMonthNames"
                        :monthNamesShort="$store.state.hijriMonthNamesShort"
                        dateFormat="yy-mm-dd"></HijriCalendar>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="row text-start">
          <div class="col-12">
            <Button label="متابعة" class="p-button-rounded px-5" @click="submit"
                    :disabled="!(pageModel.isValidEmail && pageModel.isValidMobileNumber && pageModel.isValidNationalID)" />
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { toGregorian, toHijri } from "hijri-converter";
import ChangeCharityManagerService from "@/services/change-charity-manager.service";
import VerificationModal from "@/views/authentication/CreateAccount/verification-modal";

export default {
  name: "Step1",
  props: ["pageModel"],
  emits: ["next"],
  components: { VerificationModal },
  data() {
    return {
      submitted: false,
    };
  },
  created() {
    this.pageModel.dateGregorian = new Date();
    this.pageModel.dateHijri = new Date();
    this.pageModel.maxDate = new Date();
    this.pageModel.hijriMaxDate = new Date();
    this.setInitialDateValues();
  },
  methods: {
    onDateChange(isGregorian) {
      if (isGregorian) {
        this.pageModel.dateHijriObj = toHijri(this.pageModel.dateGregorian.getFullYear(), this.pageModel.dateGregorian.getMonth() + 1, this.pageModel.dateGregorian.getDate());
        this.pageModel.dateHijri = new Date(this.pageModel.dateHijriObj.hy, this.pageModel.dateHijriObj.hm - 1, this.pageModel.dateHijriObj.hd);
      } else {
        this.pageModel.dateGregorianObj = toGregorian(this.pageModel.dateHijri.getFullYear(), this.pageModel.dateHijri.getMonth() + 1, this.pageModel.dateHijri.getDate());
        this.pageModel.dateGregorian = new Date(this.pageModel.dateGregorianObj.gy, this.pageModel.dateGregorianObj.gm - 1, this.pageModel.dateGregorianObj.gd);
      }
    },
    setInitialDateValues() {
      this.pageModel.dateHijriObj = toHijri(this.pageModel.dateGregorian.getFullYear(), this.pageModel.dateGregorian.getMonth() + 1, this.pageModel.dateGregorian.getDate());
      this.pageModel.dateHijri = new Date(this.pageModel.dateHijriObj.hy, this.pageModel.dateHijriObj.hm - 1, this.pageModel.dateHijriObj.hd);

      const hijriMaxDateObj = toHijri(this.pageModel.maxDate.getFullYear(), this.pageModel.maxDate.getMonth() + 1, this.pageModel.maxDate.getDate());
      this.pageModel.hijriMaxDate = new Date(hijriMaxDateObj.hy, hijriMaxDateObj.hm - 1, hijriMaxDateObj.hd);
    },
    submit() {
      this.submitted = true;

      const hijriMonth = this.pageModel.dateHijri.getMonth() + 1;
      const gregorianMonth = this.pageModel.dateGregorian.getMonth() + 1;
      this.pageModel.hijri_birthdate = this.pageModel.dateHijri.getFullYear() + "-" + hijriMonth + "-" + this.pageModel.dateHijri.getDate();
      this.pageModel.gregorian_birthdate = this.pageModel.dateGregorian.getFullYear() + "-" + gregorianMonth + "-" + this.pageModel.dateGregorian.getDate();

      this.pageModel.is_submit = false;

      ChangeCharityManagerService.assignCharityManager(this.pageModel)
        .then(({ data: { result } }) => {
          this.$emit("next");
        });
    },
    onMobileNumberChange() {
      this.pageModel.isValidMobileNumber = /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(this.pageModel.mobile_number);
    },
    onNationalIDChange() {
      this.pageModel.isValidNationalID = this.pageModel.national_id?.length === 10;
    },
    checkEmailValidity() {
      if (!this.pageModel.email) {
        this.pageModel.isValidEmail = false;
        return;
      }
      this.pageModel.isValidEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.pageModel.email);
    }
  }
};
</script>

<style lang="scss" scoped>

.title {
  font-size: 24px;
}

.p-float-label label,
.float-label {
  left: 0;
  right: 0.75rem;
  font-size: 12px;
  color: #8c8c8c;
}
</style>
