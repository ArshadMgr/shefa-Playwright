<template>
  <section class="zakat-page d-flex align-items-center justify-content-center">
    <Card class="zakat-page__container">
      <template #header>
        <span class="zakat-page__header d-block text-center mt-4">
          <RouterLink to="/zakat/calculate" class="zakat-page__header-link d-block color-primary"><i class="pi pi-calculator"></i> حساب الزكاة</RouterLink>
          إخراج الزكاة</span>
      </template>
      <template #content>
        <div class="s_w_donation text-right width-450p pr-0 white pl-3 d-block">
          <div class="justify-content-center align-content-center">
            <div class="w-100 mb-2 mt-4">
              <span class="p-float-label">
                <InputNumber
                  inputId="donation-amount"
                  :min="1"
                  id="donation-amount"
                  :step="100"
                  :disabled="state.disablePaymentFields"
                  v-model="state.donationModel.donation_amount"
                  :max="1000000"
                  :class="['w-100',
                       { 'p-invalid': !state.donationModel.donation_amount && state.isSubmitted }]"
                />
                <label for="donation-amount">أدخل مبلغ الزكاة</label>
              </span>
            </div>
            <div class="w-100 mb-3 mt-5">
              <span class="p-float-label">
                <InputText
                  inputId="doner-mobile"
                  :min="0"
                  id="doner-mobile"
                  maxLength="10"
                  :disabled="state.disablePaymentFields"
                  v-model="state.donationModel.donor_mobile"
                  v-if="!$store.getters.isAuthenticated"
                  :class="['w-100',
                  { 'p-invalid': state.donationModel.donor_mobile && !isValidMobileNumber(state.donationModel.donor_mobile) }]"
                  v-focus
                />
                <label for="doner-mobile"
                      v-if="!$store.getters.isAuthenticated">ليصلك اثر تبرعك أدخل رقم جوالك</label>
              </span>
            </div>
            <div class="mb-2 color-secondary">وسيلة الدفع</div>
            <div class="payment-methods d-flex align-items-center justify-content-center mb-3">
              <div class="item" @click="state.cardType = 'credit_card'"
                   :class="{'selected': state.cardType === 'credit_card'}">
                <img class="payment-radio__image payment-radio__image--visa" src="../../assets/images/card-pay-payment.png"
                     alt="">
              </div>
              <div v-if="state.browserName === 'safari'">
                <div
                    class="apple-pay item"
                    @click="applePayDonation"
                    :class="{
                      'selected': state.cardType === 'applepay',
                      'p-disabled': disableSubmit
                    }"
                >
                  <img src="../../assets/images/apple-pay-logo.png" alt="apple-pay">
                </div>
              </div>
            </div>
            <div class="row mb-4 align-items-center flex-column">
              <div class="text-center mb-2">بإتمام التبرع أنت توافق على
                <span class="link"
                      @click="goToPrivacyPolicyPage">سياسات التبرع</span>
              </div>
              <BaseSpinner v-if="state.showApplepaySpinner"/>
              <Button class="p-button p-button-primary p-button-rounded mt-3 justify-content-center"
                      style="width: 185px; height: 50px"
                      v-if="state.cardType === 'credit_card'"
                      @click.stop="donate"
                      :disabled="disableSubmit"
              >
                <i v-if="state.loading" class="pi pi-spin pi-spinner"></i>
                <span v-else>إخراج الزكاة</span>
              </Button>
              <div :class="['form-cont', {'d-none': state.cardType !== 'applepay'}]"
                   v-if="state.donationModel.donation_amount && state.isHyperpayInjected">
                <form :action="state.redirectURI" class="paymentWidgets"
                      :data-brands="'APPLEPAY'"></form>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </section>
  <DonationSuccessDialog :showModal="state.showDonationSuccessModal"
                         :data="state.successDonationData"
                         :donationType="state.donationType"
                         v-if="state.showDonationSuccessModal"
                         @close="state.showDonationSuccessModal = false"></DonationSuccessDialog>

  <DonationFailureDialog :showModal="state.showDonationFailureModal"
                         :message="state.paymentFailureMessage"
                         v-if="state.showDonationFailureModal"
                         @close="state.showDonationFailureModal = false"></DonationFailureDialog>
</template>

<script setup>
import { reactive, onMounted, onBeforeMount, onUnmounted, computed } from 'vue';
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";

import DonationService from "@/services/donation.service";
import JwtUtilService from "@/services/jwt.util.service";
import DonationFailureDialog from "@/components/donate/DonationFailureDialog";
import DonationSuccessDialog from "@/components/donate/DonationSuccessDialog";
import BaseSpinner from "@/components/layout/BaseSpinner";
import { DONATION_TYPE } from "@/services/enum.service";

const store = useStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const state = reactive({
  canDonate: JwtUtilService.getClientID()?.includes("doner") || !store.isAuthenticated,
  donationModel: {
    donation_amount: store.state.zakatCalculated,
  },
  browserName: '',
  cardType: "credit_card",
  checkoutId: "",
  loading: false,
  paymentFailureMessage: "",
  showDonationFailureModal: false,
  isHyperpayInjected: false,
  showApplepaySpinner: false,
  redirectURI: '',
  resourcePath: "",
  paymentTransactionId: 0,
  showDonationSuccessModal: false,
  successDonationData: {},
  donationType: DONATION_TYPE.CASE,
  isSubmitted: false,
  disablePaymentFields: false
});

const isValidMobileNumber = (mobileNumber) => {
  return /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(mobileNumber);
};

const checkBrowserEngine = () => {
  let userAgent = navigator.userAgent;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    state.browserName = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    state.browserName = "firefox";
  } else if (userAgent.match(/safari/i)) {
    state.browserName = "safari";
  } else if (userAgent.match(/opr\//i)) {
    state.browserName = "opera";
  } else if (userAgent.match(/edg/i)) {
    state.browserName = "edge";
  } else {
    state.browserName = "No browser detection";
  }
};

const donate = async () => {
  state.loading = true;
  const postBody = {
    card_type: state.cardType,
    amount: state.donationModel.donation_amount,
    target: state.donationModel.donation_amount,
  };
  await DonationService.getPaymentId(postBody)
    .then(({ data: { result: checkout_id } }) => {
      state.checkoutId = checkout_id?.checkout_id;
      localStorage.setItem("donationModel", JSON.stringify(state.donationModel));
      state.loading = false;
      injectCheckoutLibrary();
    })
    .catch(({ response: { data: { errors } } }) => {
      state.paymentFailureMessage = errors[0];
      state.showDonationFailureModal = true;
    });
};

const disableSubmit = computed(() => {
  return !!(!state.donationModel.donation_amount || state.donationModel.donor_mobile && !isValidMobileNumber(state.donationModel.donor_mobile))
});

const applePayDonation = () => {

  state.isSubmitted = true;
  state.disablePaymentFields = true;

  if(!state.donationModel.donation_amount) {
    return;
  }

  state.cardType = 'applepay';
  if (state.isHyperpayInjected) {
    return;
  }

  state.showApplepaySpinner = true;

  const postBody = {
    card_type: state.cardType,
    amount: state.donationModel.donation_amount
  };
  DonationService.getPaymentId(postBody)
    .then(({ data: { result: checkout_id } }) => {
      state.checkoutId = checkout_id?.checkout_id;
      localStorage.setItem("donationModel", JSON.stringify(state.donationModel));
      localStorage.setItem("wallet", JSON.stringify(state.walletId));
      injectCheckoutLibrary();
    })
    .catch(({ response: { data: { errors } } }) => {
      state.paymentFailureMessage = errors[0];
      state.showDonationFailureModal = true;
      state.showApplepaySpinner = false;
    });
};

const injectCheckoutLibrary = () => {
  let paymentLibraryScript = document.createElement("script");
  paymentLibraryScript.setAttribute("src", `${process.env.VUE_APP_HYPERPAY_URL}/v1/paymentWidgets.js?checkoutId=${state.checkoutId}`);
  document.head.appendChild(paymentLibraryScript);

  state.isHyperpayInjected = true;
  setTimeout(() => {
    state.showApplepaySpinner = false;
  }, 300)
  if (state.cardType === 'applepay') {
    return;
  }

  router.push(`/zakat-checkout?card_type=${state.cardType}`);
};

const goToPrivacyPolicyPage = () => {
  window.open(process.env.VUE_APP_FE_URL + "/privacy-policy", "_blank");
};

const checkPaymentStatus = () => {
  DonationService.getPaymentStatus(state.paymentTransactionId, state.resourcePath)
    .then(({ data: { response } }) => {

      const donationModel = JSON.parse(localStorage.getItem("donationModel"));
      const postBody = {
        donor_mobile_number: donationModel.donor_mobile,
        checkout_id: state.paymentTransactionId
      };

      DonationService.payZakat(postBody)
        .then(({ data: { result: { donation_success_data } } }) => {
          state.successDonationData = donation_success_data;
          state.donationType = state.successDonationData.type;
          state.showDonationSuccessModal = true;
        })
        .finally(() => {
          localStorage.removeItem("donationModel");
          localStorage.removeItem("wallet");
        });
    })
    .catch(({ response: { data: { errors } } }) => {
      state.paymentFailureMessage = errors[0];
      state.showDonationFailureModal = true;
    });
};

const vFocus = {
  mounted: (el) => {
    if(state.donationModel.donation_amount > 0) {
      el.focus()
    }
  }
}

onBeforeMount(() => {
  if(!state.canDonate) {
    router.push('/home');
  }
})

onMounted(() => {
  state.redirectURI = `${process.env.VUE_APP_FE_URL}/zakat/donate`;
  checkBrowserEngine();

  if (route.query.id && route.query.resourcePath) {
    state.resourcePath = route.query.resourcePath;
    state.paymentTransactionId = route.query.id;

    checkPaymentStatus();
  }
});

onUnmounted(() => {
  store.state.zakatCalculated = null
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/helpers";
@import "@/styles/components/card";
@import "@/styles/components/input";
.zakat-page {
  font-size: 20px;
  margin-bottom: 100px;
  &__container {
    width: 100%;
    max-width: 612px;
  }
  &__header {
    position: relative;
    font-size: 24px;
    font-weight: bold;
    color: $color-font-black;
  }
  &__header-link {
    position: absolute;
    top: 50%;
    left: 1.25rem;
    transform: translate(0, -50%);
    font-size: 14px;
    text-decoration: none;
    transition: $transition-basic;
    &:hover {
      color: $color-primary-hover;
    }
  }
}

.apple-pay-container {

  .apple-pay {
    height: 60px;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    background-color: #181818;

    img {
      width: 70px;
      height: 35px;
      margin: 0 1rem;
    }
  }

  &.selected {
    padding: 0.3rem;
    border: 1px solid;
    border-radius: 8px;
  }
}

.payment-methods {
  height: 60px;
  padding: 0 2rem;
  border-radius: 8px;

  .mada {
    img {
      width: 50px;
      height: 50px;
    }
  }

  .mastercard {
    img {
      width: 70px;
      height: 50px;
    }
  }

  .visa {
    img {
      width: 66px;
      height: 50px;
    }
  }
}

.payment-radio {
  width: 80px;
  height: 42px;
  margin: 0 7px;
  border: 1px solid $color-secondary;
  border-radius: $border-radius-default;
  cursor: pointer;
  overflow: hidden;

  ::v-deep(.p-radiobutton) {
    opacity: 0;
    position: absolute;
  }

  &__image {
    height: 42px !important;
    object-fit: cover;
    object-position: center;
    padding: 0 0.5rem;
    margin: 0 5px;
    border: 1px solid #ced4da;
    border-radius: 8px;

    &--apple {
      height: 30px;
    }
  }

  &--checked {
    border-color: $color-primary;
  }
}

.payment-methods {

  .item {
    height: 42px;
    min-width: 120px;
    padding: 0 .5rem;
    margin: 0 5px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.selected img {
      border-color: $color-primary-border;
    }
  }

  .apple-pay {

    border: 1px solid #ced4da;

    &.selected {
      border-color: $color-primary-border;
    }
    img {
      width: 42px;
      height: 22px;
    }
  }
}

.link {
  text-decoration: underline;
  color: $color-primary;
  cursor: pointer;
  transition: $transition-basic;
  &:hover {
    color: $color-primary-hover;
  }
}
::v-deep(.p-float-label label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 14px !important;
}
</style>
