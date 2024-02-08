<template>
  <div v-if="caseDetails && !closedCasesCondition" class="donate px-3 px-md-5 mb-5" >
    <div class="donate__container">
      <DonateCardDetails :payload="caseDetails" type="case" />
      <div class="donate__card donate__form col-md-6 section">
        <h2 class="title fw-bold text-center donate__heading" data-cy="donate-case-card-header">
          المبلغ المراد التبرع به
        </h2>
        <div class="tags d-flex justify-content-evenly mb-5">
          <div class="tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(10)" data-cy="donate-10-sar">10 ر.س</div>
          <div class="tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(50)" data-cy="donate-50-sar">50 ر.س</div>
          <div class="tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(100)" data-cy="donate-100-sar">100 ر.س</div>
          <div class="tag mb-3 mb-lg-0 fw-semibold" data-cy="donate-remaining-amount"
               @click="donationModel.donation_amount = caseDetails.required_amount - caseDetails.collected_amount">
            التبرع بالمبلغ
            المتبقي
          </div>
        </div>
        <div class="w-100 mb-1">
          <InputNumber
            inputId="donation-amount"
            data-cy="donation-amount"
            :min="1"
            id="donation-amount"
            step="100"
            locale="en"
            :disabled="disablePaymentFields"
            placeholder="أدخل مبلغ التبرع"
            v-model="donationModel.donation_amount"
            :max="caseDetails.required_amount - caseDetails.collected_amount"
            :class="['w-100',
                       { 'p-invalid': !donationModel.donation_amount && isSubmitted }]"
          />
        </div>
        <div class="mb-4 donation-disclaimer">
          أعلى قيمة يمكنك التبرع بها {{ maximumDonationAmount }} وأقل قيمة يمكنك
          التبرع بها 1.00
        </div>
        <div class="w-100 mb-4">
          <InputText
            inputId="doner-mobile"
            :min="0"
            id="doner-mobile"
            data-cy="donor-mobile"
            maxLength="10"
            :disabled="disablePaymentFields"
            placeholder="ليصلك اثر تبرعك أدخل رقم جوالك"
            v-model="donationModel.doner_mobile"
            v-if="!$store.getters.isAuthenticated"
            class="w-100"
            :class="{'p-invalid': donationModel.doner_mobile && !isValidMobileNumber(donationModel.doner_mobile)}"
          />
        </div>
        <div class="mb-4">
          <Checkbox
            v-model="donationModel.on_behalf_donation"
            :binary="true"
            inputId="on_behalf_donation"
            data-cy="on-behalf-donation-checkbox"
            id="on_behalf_donation"
          />
          <label for="on_behalf_donation" class="mx-2">تبرع عن من تحب</label>
        </div>
        <div v-if="donationModel.on_behalf_donation">
          <div class="w-100 mb-4">
            <InputText
              inputId="doner-name"
              data-cy="donor-name"
              id="doner-name"
              placeholder="اسم المتبرع"
              v-model="donationModel.on_behalf_donor_name"
              class="w-100"
              :class="{'p-invalid': isSubmitted && donationModel.on_behalf_donation && !donationModel.on_behalf_donor_name}"
            />
          </div>
          <div class="w-100 mb-4" v-if="donationModel.gifted_to === 'أخرى'">
            <InputText
              inputId="giftedToText"
              id="giftedToText"
              data-cy="gifted-to-text"
              placeholder="إهداء إلى"
              v-model="donationModel.gifted_to_text"
              class="w-100"
              :class="{'p-invalid': isSubmitted && donationModel.gifted_to === 'أخرى' && !donationModel.gifted_to_text}"
            />
          </div>
          <div class="w-100 mb-4">
            <InputText
              inputId="mobile-number"
              id="mobile-number"
              data-cy="gifted-mobile-number"
              maxLength="10"
              placeholder="جوال المهدى له"
              v-model="donationModel.gifted_mobile_number"
              :class="['w-100',
                       { 'p-invalid': (isSubmitted && donationModel.on_behalf_donation && !donationModel.gifted_mobile_number) ||
                        donationModel.gifted_mobile_number && !isValidMobileNumber(donationModel.gifted_mobile_number) }]"
            />
          </div>
          <div class="w-100 mb-4" v-if="donationModel.donor_relation === 'أخرى'">
            <InputText
              inputId="donor_relation_Text"
              id="donor_relation_Text"
              data-cy="donor-relation-text"
              placeholder="توقيع المٌهدي"
              v-model="donationModel.donor_relation_text"
              class="w-100"
              :class="{'p-invalid': isSubmitted && donationModel.donor_relation === 'أخرى' && !donationModel.donor_relation_text}"
            />
          </div>
        </div>
        <div class="mb-2 color-secondary">وسيلة الدفع</div>
        <div class="payment-methods d-flex align-items-center justify-content-center mb-3">
          <div class="item" @click="cardType = 'credit_card'"
               :class="{'selected': cardType === 'credit_card'}">
            <img class="payment-radio__image payment-radio__image--visa" src="../../assets/images/card-pay-payment.png"
                 alt="" data-cy="pay-by-credit-card">
          </div>
          <div v-if="browserName === 'safari'">
            <div
                class="apple-pay item"
                @click="applePayDonation"
               :class="{
                  'selected': cardType === 'applepay',
                  'p-disabled': disableSubmit
                }"
            >
              <img data-cy="pay-by-apple-pay" src="../../assets/images/apple-pay-logo.png" alt="apple-pay">
            </div>
          </div>
        </div>
        <div class="row my-5">
          <div class="text-center mb-2">بإتمام التبرع أنت موافق على
            <span class="color-primary text-decoration-underline pointer" data-cy="privacy-policy-link"
                  @click="goToPrivacyPolicyPage">سياسات التبرع</span>
          </div>
          <BaseSpinner v-if="showApplepaySpinner"/>
          <Button
            class="donate__button p-button-rounded p-button p-button-primary mt-2 mx-auto"
            @click.stop="donate"
            data-cy="donate-button"
            :disabled="disableSubmit"
            v-if="cardType === 'credit_card'"
            label="تبرع الآن"
          />
          <div :class="['form-cont', {'d-none': cardType !== 'applepay'}]"
               v-if="donationModel.donation_amount && isHyperpayInjected">
            <form :action="redirectURI" class="paymentWidgets"
                  :data-brands="'APPLEPAY'"></form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CompletedDonation v-else-if="closedCasesCondition"/>

  <DonationSuccessDialog :showModal="showDonationSuccessModal"
                         :data="successDonationData"
                         :donationType="donationType"
                         v-if="showDonationSuccessModal"
                         @close="showDonationSuccessModal = false"></DonationSuccessDialog>

  <DonationFailureDialog :showModal="showDonationFailureModal"
                         :message="paymentFailureMessage"
                         v-if="showDonationFailureModal"
                         @close="showDonationFailureModal = false"></DonationFailureDialog>
</template>

<script>
import DonationService from "@/services/donation.service";
import JwtUtilService from "@/services/jwt.util.service";
import { ToastSeverity } from "primevue/api";

import DonateCardDetails from "@/components/donate/DonateCardDetails";
import ProgressBar from "primevue/progressbar";
import Dialog from "primevue/dialog";
import BaseSpinner from "@/components/layout/BaseSpinner";
import CompletedDonation from "@/components/donate/CompletedDonation";

import DonationFailureDialog from "@/components/donate/DonationFailureDialog";
import DonationSuccessDialog from "@/components/donate/DonationSuccessDialog";
import { DONATION_TYPE, CASE_STATUS } from "@/services/enum.service";

import isValidMobileNumberMixin from "@/mixins/isValidMobileNumberMixin";
import validateOnBehalfDonationMixin from "@/mixins/validateOnBehalfDonationMixin";
import {useHead} from "@vueuse/head";

export default {
  name: "donate-case",
  mixins: [isValidMobileNumberMixin, validateOnBehalfDonationMixin],
  components: { DonationFailureDialog, DonationSuccessDialog, BaseSpinner, CompletedDonation, ProgressBar, Dialog, DonateCardDetails },
  data() {
    return {
      caseId: this.$route.params.case_id,
      caseDetails: null,
      donationModel: {},
      donateToList: [
        {
          label: "أمي",
          value: 1
        },
        {
          label: "والدي",
          value: 2
        },
        {
          label: "أختي",
          value: 3
        },
        {
          label: "زوجتي",
          value: 4
        },
        {
          label: "زوجي",
          value: 5
        },
        {
          label: "صديقتي",
          value: 6
        },
        {
          label: "صديقي",
          value: 7
        },
        {
          label: "أخرى",
          value: 8
        }
      ],
      signatureList: [
        {
          label: "أمك",
          value: 1
        },
        {
          label: "والدك",
          value: 2
        },
        {
          label: "أختك",
          value: 3
        },
        {
          label: "زوجتك",
          value: 4
        },
        {
          label: "زوجك",
          value: 5
        },
        {
          label: "صديقتك",
          value: 6
        },
        {
          label: "صديقك",
          value: 7
        },
        {
          label: "أخرى",
          value: 8
        }
      ],
      checkoutId: "",
      browserName: "",
      cardType: "credit_card",
      redirectURI: "",
      isAmbassador: false,
      referenceId: null,
      FEURL: process.env.VUE_APP_FE_URL,
      canShareTrackableLink: JwtUtilService.getClientID()?.includes("doner") && this.$store.getters.isAuthenticated,
      sharableLink: `${process.env.VUE_APP_FE_URL}/donate-case/${this.$route.params.case_id}`,
      isSubmitted: false,
      paymentFailureMessage: "",
      showDonationFailureModal: false,
      isHyperpayInjected: false,
      showApplepaySpinner: false,
      showDonationSuccessModal: false,
      successDonationData: {},
      donationType: DONATION_TYPE.CASE,
      resourcePath: "",
      paymentTransactionId: 0,
      disablePaymentFields: false
    };
  },
  mounted() {
    this.getCaseInfo();
    this.checkBrowserEngine();

    this.redirectURI = process.env.VUE_APP_FE_URL + `/donate-case/${this.$route.params.case_id}`;
    if (this.$route.query.reference_id) {
      this.isAmbassador = true;
      this.referenceId = this.$route.query.reference_id;
    }

    if (this.$route.query.id && this.$route.query.resourcePath) {
      this.resourcePath = this.$route.query.resourcePath;
      this.paymentTransactionId = this.$route.query.id;

      this.checkPaymentStatus();
    }
  },
  methods: {
    getCaseInfo() {
      DonationService.getCaseDetails(this.caseId)
        .then(({ data: { result } }) => {
          this.caseDetails = result;
          console.log('this.caseDetails.urls',this.caseDetails.urls)
          useHead({
            meta: [
              {
                name: "og:description",
                content: this.caseDetails.story
              },
              {
                name: "og:image",
                content: this.caseDetails.urls.case_image[0] || this.caseDetails.urls.charity_image
              },
              {
                name: 'twitter:image',
                content: this.caseDetails.urls.case_image[0]
              },
              {
                name: 'twitter:description',
                content: this.caseDetails.story
              }
            ]
          })
          this.caseDetails.remainingAmount = this.caseDetails.required_amount - this.caseDetails.collected_amount;
          this.caseDetails.amountPercentage = Math.floor((this.caseDetails.collected_amount / this.caseDetails.required_amount) * 100);
          if (this.$route.query.close === "true") {
            this.donationModel.donation_amount = this.caseDetails.required_amount - this.caseDetails.collected_amount;
          }
        });
    },
    donate() {

      this.isSubmitted = true;
      if(this.donationModel.on_behalf_donation && !this.validateOnBehalfDonation(this.donationModel)) {
        return;
      }

      const postBody = {
        card_type: this.cardType,
        amount: this.donationModel.donation_amount,
        target: this.caseDetails.required_amount,
        object_type: "case",
        object_id: this.caseDetails.id
      };
      if (!this.isAmbassador) {
        DonationService.getPaymentId(postBody)
            .then(({data: {result: checkout_id}}) => {
              this.checkoutId = checkout_id?.checkout_id;
              localStorage.setItem("donationModel", JSON.stringify(this.donationModel));
              localStorage.setItem("wallet", JSON.stringify(this.caseDetails.wallet));
              this.injectCheckoutLibrary();
            })
            .catch(({ response: { data: { errors } } }) => {
              this.paymentFailureMessage = errors[0];
              this.showDonationFailureModal = true;
            });
      } else {
        DonationService.getAmbassadorPaymentId(postBody, this.referenceId)
            .then(({data: {result: checkout_id}}) => {
              this.checkoutId = checkout_id?.checkout_id;
              localStorage.setItem("donationModel", JSON.stringify(this.donationModel));
              localStorage.setItem("wallet", JSON.stringify(this.caseDetails.wallet));
              this.injectCheckoutLibrary();
            });
      }
    },
    applePayDonation() {

      this.isSubmitted = true;
      this.disablePaymentFields = true;

      if(!this.donationModel.donation_amount) {
        return;
      }

      this.cardType = 'applepay';
      if (this.isHyperpayInjected) {
        return;
      }

      this.showApplepaySpinner = true;

      const postBody = {
        card_type: this.cardType,
        amount: this.donationModel.donation_amount,
        object_type: "case",
        object_id: this.caseDetails.id
      };
      DonationService.getPaymentId(postBody, this.referenceId)
        .then(({ data: { result: checkout_id } }) => {
          this.checkoutId = checkout_id?.checkout_id;
          localStorage.setItem("donationModel", JSON.stringify(this.donationModel));
          localStorage.setItem("wallet", JSON.stringify(this.caseDetails.wallet));
          this.injectCheckoutLibrary();
        })
        .catch(({ response: { data: { errors } } }) => {
          this.paymentFailureMessage = errors[0];
          this.showDonationFailureModal = true;
          this.showApplepaySpinner = false;
        });
    },
    injectCheckoutLibrary() {
      let paymentLibraryScript = document.createElement("script");
      paymentLibraryScript.setAttribute("src", `${process.env.VUE_APP_HYPERPAY_URL}/v1/paymentWidgets.js?checkoutId=${this.checkoutId}`);
      document.body.appendChild(paymentLibraryScript);

      this.isHyperpayInjected = true;
      setTimeout(() => {
        this.showApplepaySpinner = false;
      }, 300)
      if (this.cardType === 'applepay') {
        return;
      }

      this.$router.push(`/checkout?card_type=${this.cardType}`);
    },
    setDonationAmount(amount) {
      if (amount > this.caseDetails.required_amount - this.caseDetails.collected_amount) {
        this.donationModel.donation_amount = this.caseDetails.required_amount - this.caseDetails.collected_amount;
      } else {
        this.donationModel.donation_amount = amount;
      }
    },
    checkBrowserEngine() {
      let userAgent = navigator.userAgent;

      if (userAgent.match(/chrome|chromium|crios/i)) {
        this.browserName = "chrome";
      } else if (userAgent.match(/firefox|fxios/i)) {
        this.browserName = "firefox";
      } else if (userAgent.match(/safari/i)) {
        this.browserName = "safari";
      } else if (userAgent.match(/opr\//i)) {
        this.browserName = "opera";
      } else if (userAgent.match(/edg/i)) {
        this.browserName = "edge";
      } else {
        this.browserName = "No browser detection";
      }
    },
    goToPrivacyPolicyPage() {
      window.open(process.env.VUE_APP_FE_URL + "/privacy-policy", "_blank");
    },
    checkPaymentStatus() {
      DonationService.getPaymentStatus(this.paymentTransactionId, this.resourcePath)
        .then(({ data: { response } }) => {

          const donationModel = JSON.parse(localStorage.getItem("donationModel"));
          const postBody = {
            to_wallet: JSON.parse(localStorage.getItem("wallet")),
            amount: donationModel.donation_amount,
            donor_mobile_number: donationModel.doner_mobile,
            checkout_id: this.paymentTransactionId,
            on_behalf_donor_name: donationModel.on_behalf_donor_name,
            gifted_to: donationModel.gifted_to === "أخرى" ? donationModel.gifted_to_text : donationModel.gifted_to,
            donor_relation: donationModel.donor_relation === "أخرى" ? donationModel.donor_relation_text : donationModel.donor_relation,
            gifted_mobile_number: donationModel.gifted_mobile_number,
            on_behalf_donation: donationModel.on_behalf_donation,
            link_of_the_donated_on_object: this.redirectURI
          };

          DonationService.donate(postBody)
            .then(({ data: { result: { donation_success_data } } }) => {
              this.successDonationData = donation_success_data;
              this.donationType = this.successDonationData.type;
              this.showDonationSuccessModal = true;
            })
            .finally(() => {
              localStorage.removeItem("donationModel");
              localStorage.removeItem("wallet");
            });
        })
        .catch(({ response: { data: { errors } } }) => {
          this.paymentFailureMessage = errors[0];
          this.showDonationFailureModal = true;
        });
    },
  },
  computed: {
    closedCasesCondition() {
      return this.caseDetails?.is_completed || this.caseDetails?.is_cancelled;
    },
    disableSubmit() {
      return !!(!this.donationModel.donation_amount || this.donationModel.doner_mobile && !this.isValidMobileNumber(this.donationModel.doner_mobile))
    },
    //@TODO: for future reference: check if browser is mobile (this.isBrowserMobile()) and open in app if true
    facebookLink() {
      return `https://www.facebook.com/sharer.php?u=${this.sharableLink}`;
    },
    twitterLink() {
      return `https://twitter.com/share?url=${this.sharableLink}`;
    },
    whatsappLink() {
      return `https://wa.me/?text=${this.sharableLink}`;
    },
    maximumDonationAmount() {
      return Math.ceil(this.caseDetails.required_amount - this.caseDetails.collected_amount).toLocaleString("en-US");
    },
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/components/donate";
</style>
