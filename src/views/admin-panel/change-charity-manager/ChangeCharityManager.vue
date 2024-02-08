<template>
  <div class="new-charity-manager">
    <div class="form-container">
      <Step1 v-if="step === 1"
             :page-model="pageModel"
             @next="next"></Step1>
      <Step2 v-if="step === 2"
             :page-model="pageModel"
             @next="next"></Step2>
      <Step3 v-if="step === 3"
             :page-model="pageModel"
             @next="next"></Step3>
    </div>
  </div>
</template>

<script>
import Step1 from "@/components/change-charity-manager/Step1";
import Step2 from "@/components/change-charity-manager/Step2";
import Step3 from "@/components/change-charity-manager/Step3";

export default {
  name: "ChangeCharityManager",
  components: { Step1, Step2, Step3 },
  data() {
    return {
      step: 1,
      pageModel: {
        national_id: "",
        email: "",
        mobile_number: null,
        gregorian_birthdate: "",
        hijri_birthdate: "",
        dateGregorian: null,
        dateHijri: null,
        dateGregorianObj: {},
        dateHijriObj: { hy: 0, hm: 0, hd: 0 },
        maxDate: null,
        hijriMaxDate: Date,
        is_submit: false,
        isMobileOtpVerified: false,
        isEmailOtpVerified: false,
        isMobileOTPModalOpened: false,
        isEmailOTPModalOpened: false,
      }
    };
  },
  methods: {
    next() {
      this.step++;
    },
    prev() {
      this.step--;
    },
    submit() {

    }
  }
};
</script>

<style lang="scss">
.new-charity-manager {

  .form-container {

    direction: rtl;

    .form {
      max-width: 50%;
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
</style>
