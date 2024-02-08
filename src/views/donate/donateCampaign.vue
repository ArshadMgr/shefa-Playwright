<template>
  <div v-if="campaignDetails && !closedCampaignCondition" class="donate px-3 px-md-5 mb-5">
    <div class="donate__container">
      <DonateCardDetails :payload="campaignDetails" type="campaign"/>
      <div class="donate__card donate__form col-md-6 section">
        <div class="title fw-bold text-center mb-4 donate__heading">
          المبلغ المراد التبرع به
        </div>
        <div class="tags d-flex justify-content-evenly mb-5">
          <div class="tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(10)">10 ر.س</div>
          <div class="tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(50)">50 ر.س</div>
          <div class="tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(100)">100 ر.س</div>
          <div class="tag mb-3 mb-lg-0 fw-semibold" @click="donationModel.donation_amount = campaignDetails.target - campaignDetails.balance">التبرع بالمبلغ
            المتبقي
          </div>
        </div>
        <div class="w-100 mb-1">
          <InputNumber
              inputId="donation-amount"
              :min="1"
              id="donation-amount"
              step="100"
              locale="en"
              :disabled="disablePaymentFields"
              placeholder="أدخل مبلغ التبرع"
              v-model="donationModel.donation_amount"
              :max="campaignDetails.target - campaignDetails.balance"
              :class="['w-100',
                       { 'p-invalid': !donationModel.donation_amount && isSubmitted }]"
          />
        </div>
        <div class="mb-4 donation-disclaimer">
          أعلى قيمة يمكنك التبرع بها {{campaignDetails.target - campaignDetails.balance}} وأقل قيمة يمكنك التبرع بها 1.00
        </div>
        <div class="w-100 mb-4">
          <InputText
              inputId="doner-mobile"
              :min="0"
              id="doner-mobile"
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
              id="on_behalf_donation"
          />
          <label for="on_behalf_donation" class="mx-2">تبرع عن من تحب</label>
        </div>
        <div v-if="donationModel.on_behalf_donation">
          <div class="w-100 mb-4">
            <InputText
                inputId="doner-name"
                id="doner-name"
                placeholder="اسم المتبرع"
                v-model="donationModel.on_behalf_donor_name"
                class="w-100"
                :class="{'p-invalid': isSubmitted && donationModel.on_behalf_donation && !donationModel.on_behalf_donor_name}"
            />
          </div>
          <div class="w-100 mb-4">
            <InputText
                inputId="mobile-number"
                id="mobile-number"
                placeholder="جوال المهدى له"
                maxLength="10"
                v-model="donationModel.gifted_mobile_number"
                :class="['w-100',
                       { 'p-invalid': (isSubmitted && donationModel.on_behalf_donation && !donationModel.gifted_mobile_number) ||
                        donationModel.gifted_mobile_number && !isValidMobileNumber(donationModel.gifted_mobile_number) }]"
            />
          </div>
        </div>
        <div class="mb-2 color-secondary">وسيلة الدفع</div>
        <div class="payment-methods d-flex align-items-center justify-content-center mb-3">
          <div class="item" @click="cardType = 'credit_card'"
               :class="{'selected': cardType === 'credit_card'}">
            <img class="payment-radio__image payment-radio__image--visa" src="../../assets/images/card-pay-payment.png"
                 alt="">
          </div>
          <div v-if="browserName === 'safari'">
            <div class="apple-pay item" @click="applePayDonation"
                 :class="{
                  'selected': cardType === 'applepay',
                  'p-disabled': disableSubmit
                }">
              <img src="../../assets/images/apple-pay-logo.png" alt="apple-pay">
            </div>
          </div>
        </div>
        <div class="row my-5">
          <div class="text-center mb-2">بإتمام التبرع أنت موافق على
            <span class="color-primary text-decoration-underline pointer"
                  @click="goToPrivacyPolicyPage">سياسات التبرع</span>
          </div>
          <BaseSpinner v-if="showApplepaySpinner"/>
          <Button
              class="donate__button p-button-rounded p-button p-button-primary mt-2 mx-auto"
              label="تبرع الآن"
              v-if="cardType === 'credit_card'"
              @click.stop="donate"
              :disabled="disableSubmit"
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
  <CompletedDonation v-else-if="closedCampaignCondition"/>

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

import DonateCardDetails from "@/components/donate/DonateCardDetails"
import { ToastSeverity } from "primevue/api";
import ProgressBar from "primevue/progressbar";
import Dialog from "primevue/dialog";
import CompletedDonation from "@/components/donate/CompletedDonation";
import CampaignsService, { CAMPAIGN_TYPES } from "@/services/campaigns.service";
import DonationFailureDialog from "@/components/donate/DonationFailureDialog";
import DonationSuccessDialog from "@/components/donate/DonationSuccessDialog";
import BaseSpinner from "@/components/layout/BaseSpinner";
import { DONATION_TYPE } from "@/services/enum.service";

import isValidMobileNumberMixin from "@/mixins/isValidMobileNumberMixin";
import validateOnBehalfDonationMixin from "@/mixins/validateOnBehalfDonationMixin";
import {useHead} from "@vueuse/head";

export default {
  name: "donate-campaign",
  mixins: [isValidMobileNumberMixin, validateOnBehalfDonationMixin],
  components: { DonationFailureDialog, DonationSuccessDialog, BaseSpinner, CompletedDonation, ProgressBar, Dialog, DonateCardDetails },
  data() {
    return {
      campaignId: this.$route.params.campaign_id,
      campaignDetails: null,
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
      campaignTypes: CAMPAIGN_TYPES,
      isSubmitted: false,
      paymentFailureMessage: "",
      showDonationFailureModal: false,
      isHyperpayInjected: false,
      showApplepaySpinner: false,
      resourcePath: "",
      paymentTransactionId: 0,
      showDonationSuccessModal: false,
      successDonationData: {},
      donationType: DONATION_TYPE.CASE,
      disablePaymentFields: false
    };
  },
  mounted() {
    this.getCampaignInfo();
    this.checkBrowserEngine();
    this.redirectURI = process.env.VUE_APP_FE_URL + `/donate-campaign/${this.campaignId}`;

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
    getCampaignInfo() {
      CampaignsService.getCampaignDetails(this.campaignId)
        .then(({ data: { result } }) => {
          this.campaignDetails = result;
          useHead({
            meta: [
              {
                name: "og:description",
                content: this.campaignDetails.full_title
              },
              {
                name: "og:image",
                content: this.campaignDetails.image
              },
              {
                name: 'twitter:image',
                content: this.campaignDetails.image
              },
              {
                name: 'twitter:description',
                content: this.campaignDetails.full_title
              }
            ]
          })
          this.campaignDetails.amountPercentage = Math.floor((this.campaignDetails.balance / this.campaignDetails.target) * 100);

          if (this.$route.query.close === 'true') {
            this.donationModel.donation_amount = this.campaignDetails.target - this.campaignDetails.balance
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
        is_waqf_sehi: this.campaignDetails.typ === 'Waqf_sehi',
        object_type: "campaign",
        object_id: this.campaignDetails.id
      };
      DonationService.getPaymentId(postBody)
        .then(({ data: { result: checkout_id } }) => {
          this.checkoutId = checkout_id?.checkout_id;
          localStorage.setItem("donationModel", JSON.stringify(this.donationModel));
          localStorage.setItem("wallet", JSON.stringify(this.campaignDetails.wallet?.id));
          this.injectCheckoutLibrary();
        })
        .catch(({ response: { data: { errors } } }) => {
          this.paymentFailureMessage = errors[0];
          this.showDonationFailureModal = true;
        });
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
        is_waqf_sehi: this.campaignDetails.typ === 'Waqf_sehi',
        object_type: "campaign",
        object_id: this.campaignDetails.id
      };
      DonationService.getPaymentId(postBody)
        .then(({ data: { result: checkout_id } }) => {
          this.checkoutId = checkout_id?.checkout_id;
          localStorage.setItem("donationModel", JSON.stringify(this.donationModel));
          localStorage.setItem("wallet", JSON.stringify(this.campaignDetails.wallet?.id));
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
      document.head.appendChild(paymentLibraryScript);

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
      if (amount > this.campaignDetails.required_amount - this.campaignDetails.collected_amount) {
        this.donationModel.donation_amount = this.campaignDetails.required_amount - this.campaignDetails.collected_amount;
      }
      else {
        this.donationModel.donation_amount = amount;
      }
    },
    onShareClicked(platform) {
      const FEURL = process.env.VUE_APP_FE_URL;
      let facebookShareURL = 'https://www.facebook.com/sharer.php?u=' + FEURL + '/donate-campaign/' + this.campaignDetails?.id;
      let whatsappShareURL = 'https://wa.me/?text=' + FEURL + '/donate-campaign/' + this.campaignDetails?.id;
      let twitterShareURL = 'https://twitter.com/share?url=' + FEURL + '/donate-campaign/' + this.campaignDetails?.id;

      switch (platform) {
        case "facebook": {
          window.open(facebookShareURL, "_blank")
          break;
        }
        case "whatsapp": {
          window.open(whatsappShareURL, "_blank")
          break;
        }
        case "twitter": {
          window.open(twitterShareURL, "_blank")
          break;
        }
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
    closedCampaignCondition() {
      return this.campaignDetails?.is_completed || this.campaignDetails?.is_cancelled;
    },
    disableSubmit() {
      return !!(!this.donationModel.donation_amount || this.donationModel.doner_mobile && !this.isValidMobileNumber(this.donationModel.doner_mobile)) //@TODO: disable for on behalf donation
    },
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/components/donate";
</style>
