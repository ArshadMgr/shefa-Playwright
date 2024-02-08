<template>
  <ConfirmDialog appendTo="#app" :draggable="false"></ConfirmDialog>
  <div class="periodic-donation-page">
    <HeadingPanel title="التبرع الدوري" subtitle="ليكون عطاؤك مستمراً للمرضى الأشد حاجة، بادر بتفعيل خدمة التبرع الدوري , باستقطاع مبلغ بشكل دوري من حسابك" />
    <section v-if="state.authenticated" class="periodic-donation d-flex align-items-center justify-content-center mt-3 mt-md-5">
      <Card class="periodic-donation__container px-md-4">
        <template #header>
          <span class="periodic-donation__header d-block text-center mt-4 mt-md-5">تفاصيل التبرع الدوري</span>
        </template>
        <template v-if="!state.fetching" #content>
          <div class="d-flex gap-5 mt-4 position-relative">
            <div class="d-flex align-items-center gap-2">
              <RadioButton v-model="state.period" inputId="periodMonthly" name="monthly" value="monthly" />
              <label for="periodMonthly" class="ml-2 color-font-lighter">شهري</label>
            </div>
            <div class="d-flex align-items-center gap-2">
              <RadioButton v-model="state.period" inputId="periodDaily" name="daily" value="daily" />
              <label for="periodDaily" class="ml-2 color-font-lighter">يومي</label>
            </div>
          </div>
          <div class="tags d-flex justify-content-evenly mb-5 mt-4">
            <div class="tags__tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(state.period === 'monthly' ? 50 : 1)">
              {{ state.period === 'monthly' ? '50' : '1' }} ر.س</div>
            <div class="tags__tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(state.period === 'monthly' ? 100 : 5)">
              {{ state.period === 'monthly' ? '100' : '5' }} ر.س</div>
            <div class="tags__tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(state.period === 'monthly' ? 500 : 10)">
              {{ state.period === 'monthly' ? '500' : '10' }} ر.س</div>
          </div>
          <div class="s_w_donation text-right width-450p pr-0 white pl-3 d-block">
            <div class="justify-content-center align-content-center">
              <div class="w-100 mb-2 mt-4">
              <span class="p-float-label">
                <InputNumber
                    inputId="donation-amount"
                    :min="1"
                    :max="9999999"
                    locale="en"
                    id="donation-amount"
                    v-model="state.donationModel.donation_amount"
                    class="w-100"
                />
                <label for="donation-amount">أدخل مبلغ التبرع</label>
              </span>
              </div>
              <span class="position-relative">
                <label for="specialty" class="input-label">
                  نوع المرض
                </label>
                <Dropdown
                  inputId="specialty"
                  class="w-100 mt-4"
                  optionLabel="name"
                  optionValue="id"
                  :filter="true"
                  emptyFilterMessage="لا يوجد نتائج"
                  v-model="state.specialization"
                  :options="state.specializationOptions"
                  placeholder="الأشد حاجة"
                  emptyMessage="لا يوجد نتائج"
              />
              </span>

              <span class="d-flex w-100 justify-content-start pt-3 text-center payment-text">وسيلة الدفع</span>
              <div class="payment-methods d-flex align-items-center justify-content-center mb-3">
                <div class="item" @click="state.cardType = 'credit_card'"
                     :class="{'selected': state.cardType === 'credit_card'}">
                  <img class="payment-radio__image payment-radio__image--visa" src="../../assets/images/card-pay-payment.png"
                       alt="">
                </div>
              </div>

              <div class="row mt-5 mb-4 align-items-center flex-column">
                <span class="mb-2 color-primary--lighter">بإتمام التبرع أنت توافق على التالي:</span>
                <span class="mb-2 small">- سيتم خصم المبلغ تلقائيًا كل شهر ميلادي للإشتراك الشهري، وخصم المبلغ تلقائيًا كل يوم للإشتراك اليومي</span>
                <span class="mb-2 small">- يمكنك ايقاف الخدمة في اي وقت</span>
                <span class="mb-2 small">- حال الرغبة في تعديل آلية الاستقطاع , يستلزم إيقاف الخدمة و من ثم إعادة تفعيلها من جديد</span>
                <div class="text-center mb-3 mt-5">بإتمام التبرع أنت توافق على
                  <span class="color-primary text-decoration-underline pointer"
                        @click="goToPrivacyPolicyPage">سياسات التبرع</span>
                </div>
                <Button class="p-button p-button-primary p-button-rounded justify-content-center"
                        style="width: 185px; height: 50px"
                        @click.stop="donate"
                        :disabled="!state.canDonate || !state.donationModel.donation_amount || state.loading" >
                  <i v-if="state.loading" class="pi pi-spin pi-spinner"></i>
                  <span v-else>تفعيل الخدمة</span>
                </Button>
              </div>
            </div>
          </div>
        </template>
        <template v-else #content>
          <BaseSpinner class="mt-5" :size="4"/>
        </template>
      </Card>
    </section>
    <section v-else class="periodic-donation d-flex align-items-center justify-content-center mt-3 mt-md-5">
      <Card class="periodic-donation__container px-md-4">
        <template #content>
          <div class="d-flex flex-column align-items-center">
            <img src="@/assets/icons/calendar-and-time.png" alt="calendar" class="periodic-donation__calendar-img mt-5 mb-3 mb-xl-5"/>
            <img src="@/assets/icons/donation.png" alt="donation" class="periodic-donation__hand-img mb-4 mb-xl-5"/>
            <div class="periodic-donation__message mb-2 mb-xl-4 text-center">يرجى تسجيل الدخول لتتمكن من التبرع الدوري</div>
            <Divider class="periodic-donation__divider"/>
            <router-link :to="'/sign-in?tab=0'" class="mt-5">
              <Button class="p-button p-button-primary p-button-rounded justify-content-cente 4r" label="كن صديقًا لشفاء" style="width: 185px; height: 50px"/>
            </router-link>
          </div>
        </template>
      </Card>
    </section>
    <DonationFailureDialog :showModal="state.showDonationFailureModal"
                           :message="state.paymentFailureMessage"
                           v-if="state.showDonationFailureModal"
                           @close="state.showDonationFailureModal = false" />
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, onBeforeMount } from 'vue';
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

import DonationService from "@/services/donation.service";
import JwtUtilService from "@/services/jwt.util.service";
import CaseService from "@/services/case-service";
import DonationFailureDialog from "@/components/donate/DonationFailureDialog";
import HeadingPanel from "@/components/layout/HeadingPanel";
import BaseSpinner from "@/components/layout/BaseSpinner";
import Divider from "@/components/layout/Divider.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const state = reactive({
  period: "monthly",
  specialization: null,
  specializationOptions: null,
  canDonate: JwtUtilService.getClientID()?.includes("doner") || !store.isAuthenticated,
  isAdmin: JwtUtilService.getClientID()?.includes("admin"),
  authenticated: store.getters.isAuthenticated,
  walletId: '',
  donationModel: {
    donation_amount: null,
  },
  browserName: '',
  cardType: "credit_card",
  checkoutId: "",
  types: [],
  selectedType: {},
  loading: false,
  fetching: false,
  paymentFailureMessage: "",
  showDonationFailureModal: false,
});

const setDonationAmount = (amount) => {
  state.donationModel.donation_amount = amount;
};

const donate = async () => {
  confirm.require({
    header: 'هل انت متأكد من حفظ التغييرات؟',
    acceptLabel: 'تفعيل الخدمة',
    rejectLabel: 'إغلاق',
    acceptClass: 'p-button-rounded p-button-primary px-5 mx-2',
    rejectClass: 'p-button-rounded p-button-secondary px-5 mx-2',
    accept: async () => {
      state.loading = true;
      const postBody = {
        payment: {
          card_type: state.cardType,
          amount: state.donationModel.donation_amount,
        },
        subscription: {
          donation_period: state.period,
          specialty: state.specialization
        }
      };
      await DonationService.getSubscriptionPaymentId(postBody)
          .then(({ data: { result } }) => {
            state.checkoutId = result.checkout_id;
            state.walletId = result.target_wallet;
            localStorage.setItem("donationModel", JSON.stringify(state.donationModel));
            localStorage.setItem("wallet", JSON.stringify(state.walletId));
            state.loading = false;
            injectCheckoutLibrary();
          })
          .catch(({ response }) => {
            state.loading = false;
            state.paymentFailureMessage = response?.data?.non_field_errors[0];
            state.showDonationFailureModal = true;
            toast.add({
              severity: "error",
              summary: "خطأ",
              detail: response?.data?.non_field_errors[0],
              life: 3000,
            })
          });
    },
  });
};

const injectCheckoutLibrary = () => {
  console.log('state.checkoutId', state.checkoutId);
  let paymentLibraryScript = document.createElement("script");
  paymentLibraryScript.setAttribute("src", `${process.env.VUE_APP_HYPERPAY_URL}/v1/paymentWidgets.js?checkoutId=${state.checkoutId}`);
  document.head.appendChild(paymentLibraryScript);

  router.push(`/periodic-donation-checkout?card_type=${state.cardType}`);
};

const checkForSubscription = async () => {
  state.fetching = true;
  const { data } = await DonationService.getSubscriptions();
  if(data.result.length) {
    await router.push('/admin-panel/periodic-donation');
  }
  state.fetching = false;
};

const goToPrivacyPolicyPage = () => {
  window.open(process.env.VUE_APP_FE_URL + "/privacy-policy", "_blank");
};


onMounted(() => {
  if(state.isAdmin) {
    router.push('/admin-panel/auditors-list?case_status=Admin_All');
    return;
  }
  if(state.authenticated) {
    checkForSubscription();
    CaseService.getMedicalDataDropdown().then(({ data }) => {
      if (data.result.case_specialty.length) {
        state.specializationOptions = data.result.case_specialty;
      }
    });
  }
});
</script>

<style lang="scss" scoped>

</style>
<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";
@import "@/styles/helpers";
@import "@/styles/components/card";
@import "@/styles/components/input";
.periodic-donation-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 80px 135px;
}
.periodic-donation {
  font-size: 20px;
  margin-bottom: 100px;
  &__container {
    position: relative;
    width: 100%;
    max-width: 612px;
  }
  &__header {
    position: relative;
    padding: 0 1.25rem;
    font-size: 24px;
    font-weight: bold;
    color: $color-font-black;
  }
  &__calendar-img {
    max-width: 250px;
  }
  &__hand-img {
    max-width: 300px;
    margin-left: 150px;
  }
  &__message {
    font-size: 24px;
  }
  &__divider {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 110px;
  }
}
.tags {
  &__tag {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.5rem;
    padding: 5px 0;
    text-align: center;
    color: $color-primary;
    border: 1px solid $color-complementary;
    border-radius: 8px;
    cursor: pointer;
    flex: 1;

    &:nth-of-type(1) {
      margin-right: 0;
    }

    &:hover {
      opacity: 0.7;
    }
  }
}

.error-message {
  position: absolute;
  bottom: -23px;
  right: .75rem;
  font-size: 14px;
  color: #e24c4c;
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
.payment-text {
  font-size: 14px;
  color: $color-font-lighter;
}
.link {
  text-decoration: underline;
  color: $color-primary-lighter;
  cursor: pointer;
  transition: $transition-basic;
  &:hover {
    color: $color-primary-hover;
  }
}
.input-label {
  position: absolute;
  top: -41px;
  right: 0.75rem;
  font-size: 14px;
  color: $color-font-lighter;
}
::v-deep(.p-float-label label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 14px !important;
  color: $color-font-lighter !important;
}
::v-deep(.p-card-content) {
  padding-top: 0;
}
::v-deep(.p-card-body) {
  padding-top: 0;
}
@include respond(xl) {
  .periodic-donation-page {
    padding: 0 30px 100px;
  }
  .periodic-donation {
    &__calendar-img {
      max-width: 200px;
    }
    &__hand-img {
      max-width: 250px;
      margin-left: 100px;
    }
    &__message {
      font-size: 24px;
    }
  }
}
@include respond(md) {
  .periodic-donation-page {
    padding: 0 15px 50px;
  }
  .periodic-donation {
    &__calendar-img {
      max-width: 100px;
    }
    &__hand-img {
      max-width: 150px;
      margin-left: 0;
    }
    &__message {
      font-size: 18px;
    }
  }
}
</style>
