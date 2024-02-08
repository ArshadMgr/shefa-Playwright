<template>
  <section class="createAccount-area inner-page pb-5">
    <div class="container">
      <div class="createAccountform dir-rtl">
        <div class="form-cont">
          <div v-if="active_step <= 5">
            <Steps :model="items" />
          </div>

          <div
            class="form-container"
            :style="active_step <= 5 ? 'border-top: 1px solid #dadada' : ''"
          >
            <Step1
              :payload="payload"
              @close="close"
              @next="next"
              @openVerificationStep1="openVerificationStep1"
              v-if="active_step == 1 && !open_verification_step1"
            />
            <Step1Verification
              :payload="payload"
              @closeVerificationStep1="closeVerificationStep1"
              @next="next"
              @setPayload="setPayload"
              :verified_info="verified_info"
              v-else-if="active_step == 1 && open_verification_step1"
            />
            <Step2
              :payload="payload"
              :verified_info="verified_info"
              @close="close"
              @next="next"
              @fileChange="fileChange"
              @removeFile="removeFile"
              v-else-if="active_step == 2"
            />
            <Step3
              :payload="payload"
              @close="close"
              @next="next"
              @fileChange="fileChange"
              @removeFile="removeFile"
              @verifyIBAN="() => (this.payload.is_iban_verified = true)"
              v-else-if="active_step == 3"
            />
            <Step4
              :payload="payload"
              @close="close"
              @next="next"
              @openVerificationStep4="openVerificationStep4"
              @addServiceProvider="addServiceProvider"
              @removeServiceProvider="removeServiceProvider"
              v-else-if="active_step == 4 && !open_verification_step4"
            />
            <Step4Verification
              :payload="payload"
              @closeVerificationStep4="closeVerificationStep4"
              @next="next"
              @setPayload="setPayload"
              v-else-if="active_step == 4 && open_verification_step4"
            />
            <Step5
              :payload="payload"
              :verified_info="verified_info"
              @close="close"
              @next="next"
              v-else-if="active_step === 5"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Steps from "primevue/steps";
import Step1 from "./step1.vue";
import Step1Verification from "./step1_verification.vue";
import Step2 from "./step2.vue";
import Step3 from "./step3.vue";
import Step4 from "./step4.vue";
import Step4Verification from "./step4_verification.vue";
import Step5 from "./step5.vue";

import CharityRegisterService from "../../../services/charity-register.service";
import { toHijri } from "hijri-converter";

export default {
  name: "SignIn",
  components: {
    Steps,
    Step1,
    Step1Verification,
    Step2,
    Step3,
    Step4,
    Step4Verification,
    Step5,
  },
  data() {
    return {
      active_step: null,
      items: [
        {
          label: "1",
          to: `/create-account/1?open_verification=${false}`,
        },
        {
          label: "2",
          to: "/create-account/2",
        },
        {
          label: "3",
          to: "/create-account/3",
        },
        {
          label: "4",
          to: "/create-account/4",
        },
        {
          label: "5",
          to: "/create-account/5",
        },
      ],
      loading: false,
      error: null,
      open_verification_step1: false,
      open_verification_step4: false,
      payload: {
        id: 0,
        national_id: null,
        hijri_birthdate: null,
        gregorian_birthdate: null,
        mobile_number: null,
        email: null,
        the_charity_manager_is_the_chairman: false,

        is_mobile_verified: false,
        is_email_verified: false,

        is_chairman_mobile_verified: false,
        is_charity_email_verified: false,

        iban: null,
        is_iban_verified: false,
        number_of_retry: 0,

        charity_license_number: null,
        license_expiry_hijri_date: null,
        license_expiry_gregorian_date: null,
        license_attachment: null,

        bank_name: null,
        bank_account_attachment: null,

        region: null,
        city: null,
        charity_type: null,
        charity_logo: null,
        charity_name: null,
        charity_specialization: null,
        charity_phone: null,
        charity_email: null,
        charity_website: null,
        charity_location: null,
        chairman_name: null,
        chairman_mobile: null,

        number_of_service_provider_agreements: null,
        service_provider: null,

        association_director_name: null,
        is_accepted_terms: false,

        flag: null,
      },
      verified_info: {
        first_name: null,
        last_name: null,
        father_name: null,
        gender: null,
        identity_card_expiry: null,
      },
      gregorian_max_date: null,
      hijri_max_date: null,
    };
  },
  methods: {
    createAccount() {},
    setStep() {
      this.active_step = parseInt(this.$route.params.step, 10);

      if (this.active_step === 2) this.closeVerificationStep1();
      if (this.active_step === 5) this.closeVerificationStep4();

      if (this.active_step && !this.payload.id)
        this.$router.push(`/create-account/1?open_verification=false`);
    },
    close() {
      if (this.active_step > 1)
        this.$router.push(`/create-account/${this.active_step - 1}`);
      else this.$router.push("/sign-in?tab=1");
    },
    next() {
      if (this.active_step < 5)
        this.$router.push(`/create-account/${this.active_step + 1}`);
      else this.$router.push("/sign-in?tab=1");
    },
    openVerificationStep1(id) {
      this.payload.id = id;
      this.open_verification_step1 = true;
      this.$router.push(`/create-account/1?open_verification=${true}`);
    },
    closeVerificationStep1() {
      this.open_verification_step1 = false;
    },
    openVerificationStep4() {
      this.open_verification_step4 = true;
      this.$router.push(`/create-account/4?open_verification=${true}`);
    },
    closeVerificationStep4() {
      this.open_verification_step4 = false;
    },
    addServiceProvider() {
      this.payload.service_provider.push({ hospital_id: null, discount: null });
    },
    removeServiceProvider(index) {
      this.payload.service_provider.splice(index, 1);
    },
    fileChange(event, key) {
      if (
        event &&
        event.target &&
        event.target.files &&
        event.target.files.length
      ) {
        this.payload[key] = event.target.files[0];
      }
    },
    removeFile(key) {
      this.payload[key] = null;
    },
    setPayload(key, val) {
      this.payload[key] = val;
    },
  },
  watch: {
    $route() {
      this.setStep();
    },
    active_step(val) {
      if (
        val == 2 &&
        this.payload.the_charity_manager_is_the_chairman &&
        this.payload.chairman_mobile != this.payload.mobile_number
      ) {
        this.payload.chairman_mobile = this.payload.mobile_number;
      }
    }
  },
  mounted() {
    this.setStep();
  },
  created() {
    this.gregorian_max_date = new Date();
    const dateHijriObj = toHijri(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    );
    this.hijri_max_date = new Date(
      dateHijriObj.hy,
      dateHijriObj.hm - 1,
      dateHijriObj.hd
    );
    this.payload.gregorian_birthdate = this.gregorian_max_date;
    this.payload.hijri_birthdate = this.hijri_max_date;
    this.payload.license_expiry_gregorian_date = this.gregorian_max_date;
    this.payload.license_expiry_hijri_date = this.hijri_max_date;
  },
};
</script>

<style lang="scss" scoped>
.createAccount-area {
  .container {
    padding: 0 0 45px 0;
  }

  .form-container {
    padding-top: 1rem;
  }

  .form-cont {
    padding: 2rem;
  }

  .logo {
    width: 30px;
    margin-left: 10px;
  }

  .createAccountform {
    background-color: #ffffff;
    border-radius: 10px;
    width: 40%;
    display: block;
    margin: 5px auto;
    direction: rtl;
    text-align: right;
    font-weight: lighter;
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

  :deep(.p-tabview .p-tabview-nav li) {
    width: 50% !important;
  }

  :deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link) {
    display: block;
    text-align: center;
  }

  :deep(.p-tabview
      .p-tabview-nav
      li
      .p-tabview-nav-link:not(.p-disabled):focus) {
    box-shadow: none;
  }

  :deep(.p-float-label > label) {
    left: 0 !important;
    right: 0.75rem;
  }
}
</style>

<style lang="scss">
.p-steps-title {
  color: transparent !important;
}

.p-steps .p-steps-item.p-highlight .p-steps-number {
  background: #12b2aa !important;
  color: #ffffff !important;
}

.p-steps .p-steps-item:before,
.p-steps .p-steps-item .p-menuitem-link .p-steps-number {
  border-color: #b2b2b2 !important;
}

.p-steps .p-steps-item:first-child:before {
  left: 0;
  width: 50%;
}

.p-steps .p-steps-item:last-child:before {
  left: 50%;
  width: 50%;
}
</style>
