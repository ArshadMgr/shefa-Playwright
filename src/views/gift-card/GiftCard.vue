<template>
  <section class="container position-relative mb-5">
    <h1 class="h1">الإهداء</h1>
    <form class="w-100 mt-4" @submit.prevent="submit(!v$.$invalid)">
      <section>
        <h2>نوع الاهداء</h2>
        <div class="flex mt-5" dir="ltr">
          <Carousel
              container-class="gift-carousel"
              :value="giftCardsTypes"
              :numVisible="5"
              :numScroll="1"
              :show-indicators="false"
              :responsiveOptions="responsiveOptions"
          >
            <template #item="slotProps">
              <div>
                <input
                    type="radio"
                    class="hidden"
                    v-model="slotProps.data.type"
                    :value="slotProps.data.id"
                    :id="`gift-type-${slotProps.data.id}`"
                />
                <label
                    :for="`gift-type-${slotProps.data.id}`"
                    class="ml-2"
                    :class="{ 'gift-card--active': giftModel.type === slotProps.data.id }"
                    @click="setPreview(slotProps.data.gift_background, slotProps.data.id)"
                >
                  <img
                      class="gift-card__icon"
                      :src="slotProps.data.icon"
                      alt="gift card image"
                  />
                </label>
              </div>
            </template>
          </Carousel>
        </div>
      </section>
      <section class="sex">
        <h2>بطاقة الإهداء</h2>
        <div class="flex mt-5">
          <label for="male" class="mx-2">انثى</label>
          <RadioButton
              id="male"
              type="radio"
              v-model="giftModel.sex"
              :value="'F'"
          />
          <label for="female" class="mx-2">ذكر</label>
          <RadioButton
              id="female"
              type="radio"
              v-model="giftModel.sex"
              :value="'M'"
          />
        </div>
      </section>

      <div class="preview preview-mobile">
        <div class="preview__image-wrapper" :style="{'background': giftModel.color }">
          <img v-if="preview" :src="preview" alt="Preview of your current gift card" class="preview__image">
        </div>
      </div>

      <section class="flex mt-3">
        <div class="col-12 col-md-6">

          <h2 class="mt-5">لون الإهداء</h2>
          <div class="row mt-5">
            <div class="flex align-items-center">
              <div v-for="(cardColor, index) in giftCardsColors" :key="index">
                <input
                    type="radio"
                    class="hidden"
                    v-model="giftModel.color"
                    :value="cardColor"
                    :id="`gift-color-${index}`"
                    :class="{'p-invalid': v$.color.$invalid && validated}"
                />
                <label
                    :for="`gift-color-${index}`"
                    class="ml-5 gift-card__color"
                    :class="{ 'gift-card__color--active': giftModel.color === cardColor }"
                    :style="{ 'background': cardColor, 'border-color': cardColor }"
                >
                </label>
              </div>
            </div>
          </div>

          <h2 class="mt-5">تفاصيل الإهداء</h2>
          <Dropdown
              v-model="giftModel.speciality"
              class="w-100 mt-2"
              id="identityType"
              data-cy="identity-type-dropdown"
              optionLabel="name"
              optionValue="id"
              :options="specialities"
              :class="{'p-invalid': v$.speciality.$invalid && validated}"
              placeholder="التبرع للمرضى الأكثر حاجة"
              required
          />

          <InputText
              inputId="receiver-name"
              :min="0"
              id="receiver-name"
              placeholder="اسم المهدى له"
              v-model="giftModel.receiverName"
              class="w-100 mt-2"
              :class="{'p-invalid': v$.receiverName.$invalid && validated}"
              required
          />

          <InputText
              inputId="doner-mobile"
              :min="0"
              id="doner-mobile"
              maxLength="10"
              placeholder="الجوال"
              v-model="giftModel.receiverMobile"
              class="w-100 mt-2"
              :class="{'p-invalid': giftModel.receiverMobile && !isValidMobileNumber(giftModel.receiverMobile)}"
          /><!--        v-if="!$store.getters.isAuthenticated"-->

          <div class="tags">
            <div class="d-flex justify-content-evenly flex-column flex-lg-row">
              <div class="tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(10)">10 ر.س</div>
              <div class="tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(50)">50 ر.س</div>
              <div class="tag mb-3 mb-lg-0 fw-semibold" @click="setDonationAmount(100)">100 ر.س</div>
              <div class="tag mb-2 mb-lg-0 fw-semibold" @click="setDonationAmount(500)">500 ر.س</div>
            </div>
          </div>

          <InputNumber
              inputId="donation-amount"
              data-cy="donation-amount"
              :min="1"
              id="donation-amount"
              step="100"
              placeholder="أدخل مبلغ المتبرع"
              v-model="giftModel.amount"
              class="w-100 mt-2"
              :class="{'p-invalid': v$.amount.$invalid && validated}"
          />

          <InputText
              :min="0"
              maxLength="10"
              placeholder="اسم المُرسل"
              v-model="giftModel.senderName"
              class="w-100 mt-2"
              :class="{'p-invalid': v$.senderName.$invalid && validated}"
          />

          <div class="payment-methods d-flex align-items-center justify-content-center mb-3">
            <div class="item" @click="giftModel.paymentMethod = 'credit_card'"
                 :class="{'selected': giftModel.paymentMethod === 'credit_card'}">
              <img class="payment-radio__image payment-radio__image--visa" src="../../assets/images/card-pay-payment.png"
                   alt="">
            </div>
            <div v-if="browserEngine === 'safari'">
              <div
                  class="apple-pay item"
                  @click="applePayDonation"
                  :class="{
                      'p-disabled': disableSubmit
                    }"
              >
                <img src="../../assets/images/apple-pay-logo.png" alt="apple-pay">
              </div>
            </div>
          </div>

          <div class="d-flex align-items-center justify-content-center text-center">
            <Button
                :disabled="disableSubmit"
                type="submit"
                class="donate-button mt-3 p-button p-button-rounded p-button-primary px-5 justify-content-center"
                label="تبرع الآن"
            />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="preview">
            <div class="preview__image-wrapper" :style="{'background': giftModel.color }">
              <img v-if="preview" :src="preview" alt="Preview of your current gift card" class="preview__image">
            </div>
          </div>
        </div>
      </section>
    </form>
    <Dialog
        :visible="displayPaymentModal"
        :closable="false"
        :showHeader="true"
        :modal="true"
    >
      <form :action="redirectURI" class="paymentWidgets"
            :data-brands="dataBrands"></form>
    </Dialog>
  </section>
</template>
<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import GiftCards from "@/services/gift-cards";
import CaseService from "@/services/case-service";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import DonationService from "@/services/donation.service";
import {useRoute, useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";

const giftCardsColors = ['#00B5AB', '#89D9D5', '#5581C4', '#AA0000', '#FFD8FC']
const route = useRoute()
const router = useRouter()
const toast = useToast()
const preview = ref('')
const checkoutId = ref('')
const giftCardsTypes = ref([])
const browserEngine = ref('')

const responsiveOptions = ref([
  {
    breakpoint: '1200px',
    numVisible: 4,
    numScroll: 1
  },
  {
    breakpoint: '600px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '480px',
    numVisible: 2,
    numScroll: 1
  }
]);

const specialities = ref([])
const validated = ref(false)
const displayPaymentModal = ref(false)
const redirectURI = ref(process.env.VUE_APP_FE_URL + `/gift-card`)

const isValidMobileNumber = (mobileNumber) => {
  return /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(mobileNumber);
};

const checkBrowserEngine = () => {
  let userAgent = navigator.userAgent;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserEngine.value = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserEngine.value = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browserEngine.value = "safari";
  } else if (userAgent.match(/opr\//i)) {
    browserEngine.value = "opera";
  } else if (userAgent.match(/edg/i)) {
    browserEngine.value = "edge";
  } else {
    browserEngine.value = "No browser detection";
  }
};

const giftModel =
    reactive(JSON.parse(localStorage.getItem('giftModel'))) ||
    reactive({
          type: '',
          format: '',
          color: '#00B5AB',
          speciality: '',
          receiverName: '',
          receiverMobile: '',
          amount: null,
          senderName: '',
          paymentMethod: ''
        }
    )

const rules = {
  color: { required },
  speciality: { required },
  receiverName: { required },
  receiverMobile: { required },
  amount: { required },
  senderName: { required },
  paymentMethod: { required },
};

const v$ = useVuelidate(rules, giftModel, { $autoDirty: false });

const disableSubmit = computed(() => {
  return !!(v$.$invalid || !isValidMobileNumber(giftModel.receiverMobile))
})
const dataBrands = computed(() => {
  return {
    "visa": "VISA",
    "mastercard": "MASTER",
    "mada": "MADA",
    "applepay": "APPLEPAY"
  }[giftModel.paymentMethod]
})

const setDonationAmount = (amount) => {
  giftModel.amount = amount
}
const injectCheckoutLibrary = () => {
  const paymentLibraryScript = document.createElement("script");
  paymentLibraryScript.setAttribute(
      "src",
      `${process.env.VUE_APP_HYPERPAY_URL}/v1/paymentWidgets.js?checkoutId=${checkoutId.value}`
  );
  document.body.appendChild(paymentLibraryScript);
  router.push(`/checkout?card_type=${giftModel.paymentMethod}&payment_type=gift_card`);
}

const getCheckoutId = async () => {
  const postBody = {
    card_type: giftModel.paymentMethod,
    amount: giftModel.amount,
    target: 0
  };

  const { data } = await DonationService.getPaymentId(postBody)
  checkoutId.value = data.result.checkout_id
  injectCheckoutLibrary()
}

const submit = async () => {
  validated.value = true
  if (v$.value.$invalid) {
    return
  }
  localStorage.setItem('giftModel', JSON.stringify(giftModel))
  await getCheckoutId()
  displayPaymentModal.value = true
}

const applePayDonation = () => {
  giftModel.paymentMethod = 'applepay'

  submit()
};

const setPreview = (example, id) => {
  giftModel.type = id
  preview.value = example
}


onMounted( async() => {
  checkBrowserEngine()
  const { data: giftCardsData } = await GiftCards.getTypes()
  giftCardsTypes.value = giftCardsData.result
  preview.value = giftCardsData.result[0]?.example
  const { data: specialitiesData } = await CaseService.getMedicalDataDropdown()
  specialities.value = specialitiesData.result?.case_specialty
})

</script>
<style scoped lang="scss">
@import "@/styles/variables";

.selected {
  padding: 0.3rem;
  border: 1px solid $color-primary !important;
  border-radius: 8px;
}

h1 {
  display: block;
  width: 100%;
  height: 64px;
  color: white;
  padding: 0 20px;
  background: transparent linear-gradient(270deg, #12B2AA 0%, #5581C4 100%) 0% 0% no-repeat padding-box;
  box-shadow: -10px 10px 20px #21395D24;
  opacity: 1;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 1.5rem;
  border-radius: 8px;
}

h2 {
  color: #12B2AA;
  background-color: #E7F7F7;
  padding-bottom: 10px;
  max-width: 260px;
  min-width: 210px;
  border-radius: 20px 0px 0px 20px;
  transform: translateX(20px);
  padding-right: 20px;
}

.border-active {
  border-color: #12B2AA;
}

form {
  border-radius: 8px;
  box-shadow: 0 3px 6px #0000003E;
  background: white;
  padding: 20px;
}

.hidden {
  display: none;
}


.gift-card--active {
  border: 2px solid $color-primary;
  border-radius: 5px;
}

.gift-card__icon {
  width: 126px;
  height: 136px;
  cursor: pointer;
  margin: auto;
  padding: 5px;
}

.gift-card__color {
  cursor: pointer;
  display: block;
  margin-left: 16px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  padding: 5px;
  position: relative;

  &--active::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    border-color: inherit;
    border-width: 2px;
    border-style: solid;
  }
}

.tags {
  margin-top: 7px;

  .tag {
    margin: 0 0.5rem;
    padding: 5px 0;
    text-align: center;
    color: $color-primary;
    border: 1px solid $color-primary;
    border-radius: 8px;
    cursor: pointer;
    height: 40px;
    flex: 1;

    &:first-of-type {
      margin-right: 0;
    }

    &:last-of-type {
      margin-left: 0;
    }

    &:hover {
      opacity: 0.7;
    }
  }
}

.flex {
  display: flex;
}

.applepay {
  height: 75px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  color: white;
  border-radius: 8px;
  cursor: pointer;

  img {
    width: 70px;
    height: 35px;
    margin: 0 1rem;
  }
}


.applepay {
  &.selected {
    padding: 0.3rem;
    border: 1px solid #181818;
    border-radius: 8px;
  }
}

.tags-pay.tag {
  border: lightgray;
  margin-left: 5px;
  margin-right: 5px;
  height: 60px;
}


.applepay {
  height: 75px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  color: white;
  border-radius: 8px;
  cursor: pointer;

  img {
    width: 70px;
    height: 35px;
    margin: 0 1rem;
  }
}


.payment-methods {
  margin-top: 15px;
  justify-content: center;
  align-items: center;

  .item {
    height: 74px;
    min-width: 120px;
    padding: 0 .5rem;
    margin: 0 5px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid #ced4da;

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

  /* Small Devices, Tablets */
  .mada {
    cursor: pointer;
    img {
      width: 50px;
      height: 50px;
    }
  }

  .mastercard {
    cursor: pointer;
    img {
      width: 70px;
      height: 50px;
    }
  }

  .visa {
    cursor: pointer;
    img {
      width: 66px;
      height: 50px;
    }
  }
}

.preview {
  margin: 50px;
  height: 920px;
  &__image-wrapper {
    background-color: $color-primary;
    border-radius: 20px;
    overflow: hidden;
  }
  &__image {
    width: 100%;
  }
}

.-ml-3 {
  z-index: 11;
  transform: translateX(-40px);
}

.sex {
  margin-top: 200px;
}

.preview-mobile {
  display: none;
  margin: 25px 10px;
}


.payment-methods .payment-method {
  border: 1px solid #CED4DA;
  border-radius: 8px;
  padding: 0 1rem;
  height: 55px;
  margin: 1rem 5px;
}

.no-border {
  border: none !important;
}

@media screen and (max-width: 768px) {
  .preview {
    display: none;
    height: unset;
  }
  .preview-mobile {
    display: block;
  }
}
@media screen and (max-width: 992px) {
  .tags {
    .tag {
      margin-left: 0;
      margin-right: 0;
      &:first-of-type {
        margin-top: 0.5rem;
      }
    }
  }
}
</style>
<style>
.gift-carousel {
  position: absolute;
  width: 1200px;
  right: 60px;
  z-index: 4;
}

.p-items-hidden .p-carousel-item {
  visibility: visible;
}

.p-carousel-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 1200px) {
  .gift-carousel {
    width: 800px;
  }
}

@media screen and (max-width: 992px) {
  .gift-carousel {
    width: 600px;
  }
}

@media screen and (max-width: 768px) {
  .gift-carousel {
    width: 500px;
    right: 30px;
  }
}

@media screen and (max-width: 576px) {
  .gift-carousel {
    width: 95%;
    right: 10px;
  }
}
</style>
