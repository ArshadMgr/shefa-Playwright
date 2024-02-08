<template>
  <div class="home-page" v-if="pageModel">
    <div class="header-area">

      <div class="slider-area" data-cy="slider">
        <div class="bd-example">
          <div class="carousel slide" data-ride="carousel">
            <div class="carousel-inner" ref="slider">
              <div class="image-slider" v-if="imageSlides?.length">
                <Carousel :value="imageSlides" :numVisible="1" :numScroll="1"
                          :circular="true" class="custom-carousel"
                          :autoplayInterval="setInterval"
                          :showNavigators="false">
                  <template #item="slotProps">
                    <div class="d-flex position-relative slide-item justify-content-center justify-content-sm-end align-items-center pe-0 pe-sm-5 pt-5 pt-sm-0"
                         :style="{'background': 'url(' + slotProps.data?.image + ')'}">
                      <div class="summary d-flex flex-column align-items-center align-items-sm-end mt-sm-0 mb-xl-5 pb-xl-5">
                        <div class="summary__text text-white mb-sm-3 fs-1">{{ slotProps.data?.name }}</div>
                        <a :href="slotProps.data?.url_link">
                          <Button class="p-button-primary w-200 fw-light" label="تبرع الآن" />
                        </a>
                      </div>
                    </div>
                  </template>
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>

    <section class="section-cases-navigation position-relative">
      <CasesNavigation @item-clicked="getConditionalCases" @toggle-filters="toggleFilters" :navigation-items="this.casesNavigationItems" :filters-opened="this.filtersOpened"/>
      <FilterCasesForm v-if="this.filtersOpened" :specialization-options="this.specializationOptions" :region-options="this.regionOptions" @submit="filterCases" />
    </section>
    <div class="cases-area">
        <div class="cases-area-all" :class="{'cases-area-all--additional-section': this.selectedCondition === 'campaigns'}">
          <BaseSpinner v-if="this.loading" :size="4" data-aos="zoom-in" data-aos-duration="100"/>
          <CardBoard v-else-if="this.selectedCondition && !this.loading"
                     :type="this.selectedCondition"
                     :items="this.selectedItems"
                     :show-more-items="this.showMoreItems"
                     @reportCampaign="reportCampaign"
                     :link-button="displayShowMoreButton"
                     :items-filtered="casesFiltered"
                     @fetch-more-items="fetchMoreItems"
                     :total-items-count="this.totalItemsCount"
          />
          <CardBoard v-else-if="!this.selectedCondition && !this.loading"
                     :items="this.filteredCases"
                     @reportCampaign="reportCampaign"
                     :link-button="displayShowMoreButton"
                     :items-filtered="casesFiltered"
                     @fetch-more-items="fetchMoreItems"
                     :total-items-count="this.totalItemsCount"
          />
        </div>
      </div>

    <section class="bg-white">
        <div class="container cases-section-width tile-grid">
          <mostafeed-section v-if="pageModel" :data="pageModel" class="tile-top" data-aos="fade-up" data-aos-delay="200"></mostafeed-section>
          <router-link to="/ambassador/top" class="tile tile--wide tile--hover tile-left d-flex" data-aos="fade-up" data-cy="top-ambassador-link">
            <img v-if="images.shefaaAmbassador" class="tile__picture" :src="images.shefaaAmbassador" alt="Health initiatives">
            <img v-else class="tile__picture" src="../../assets/images/ambassadors.png" alt="Health initiatives">
            <span class="tile__text fw-bolder">سفراء شفاء</span>
            <div class="tile__cover"></div>
          </router-link>
          <router-link to="/major-donors" class="tile tile--wide tile--hover tile tile-right d-flex" data-aos="fade-up" data-cy="major-donors-link">
            <img v-if="images.majorDonors" class="tile__picture" :src="images.majorDonors" alt="Health initiatives">
            <img v-else class="tile__picture" src="../../assets/images/major-donors.png" alt="Health initiatives">
            <span class="tile__text fw-bolder">كبار المانحين</span>
            <div class="tile__cover"></div>
          </router-link>
          <router-link to="/health-initiatives" class="tile tile--wide tile--hover tile tile-bottom d-flex" data-aos="fade-up" data-cy="health-initiatives-link">
            <img v-if="images.healthInitiatives" class="tile__picture" :src="images.healthInitiatives" alt="Health initiatives">
            <img v-else class="tile__picture" src="../../assets/images/health-initiatives.png" alt="Health initiatives">
            <span class="tile__text fw-bolder">مبادرات القطاع الصحي</span>
            <div class="tile__cover"></div>
          </router-link>
        </div>
      </section>
    </div>
  </div>

  <div class="row" v-if="canDonate">
    <div @click.stop="onQuickDonationClicked"
         :class="['s_w_donation_header_btn btn', { 'only-icon': isScrolledDown, 'expanded': isQuickDonationOpened }]">
      <div class="donation-wrapper text-right text-white d-flex justify-content-between align-items-center">
        <span class="d-block donate-text w-100 py-2 text-center">تبرع سريع</span>
        <i class="pi pi-plus-circle mx-2 py-2 fs-4"></i>
      </div>
    </div>

    <div :class="['s_w_donation text-right width-450p pr-0 white pl-3',
                  isQuickDonationOpened ? 'd-block' : 'd-none']">
      <div class="w-100 mb-2">
        <div class="case-container d-flex">
          <div class="case text-center" v-for="(type, index) in types" :key="index"
               :class="{ 'selected': type.id === donationModel.selected_type }"
               @click.stop="donationModel.selected_type = type.id; selectedType = type">
            {{ type?.name }}
          </div>
        </div>
        <div class="text-black text-center my-2">{{selectedType?.description}}</div>
      </div>
      <div class="justify-content-center align-content-center">
        <div class="tags mt-1 mb-4">
          <div class="d-flex justify-content-evenly">
            <div class="tag" @click="donationModel.donation_amount = 10">10 ر.س</div>
            <div class="tag" @click="donationModel.donation_amount = 50">50 ر.س</div>
            <div class="tag" @click="donationModel.donation_amount = 100">100 ر.س</div>
          </div>
        </div>
        <div class="mb-4 mx-2">
            <span class="p-float-label">
              <InputNumber
                inputId="donation-amount"
                :min="1"
                id="donation-amount"
                :step="100"
                locale="en"
                :disabled="disableFields"
                v-model="donationModel.donation_amount"
                :class="['w-100', {'p-invalid': allCasesDonationCondition || !donationModel.donation_amount && isSubmitted}]"
                :max="1000000"
              />
              <label for="donation-amount">أدخل مبلغ التبرع</label>
              <span v-if="allCasesDonationCondition" class="error-message">
                <span>الحد الادنى للمبلغ الذي يمكن التبرع به هو </span>
                <span>{{ selectedType?.minimum_amount }}</span></span>
            </span>
        </div>
        <div class="mb-1 mx-2" v-if="!$store.getters.isAuthenticated">
            <span class="p-float-label">
              <InputText
                inputId="doner-mobile"
                :min="0"
                :disabled="disableFields"
                id="doner-mobile"
                maxLength="10"
                v-model="donationModel.doner_mobile"
                :class="['w-100', {'p-invalid': donationModel.doner_mobile && !isValidMobileNumber(donationModel.doner_mobile)}]"
              />
              <label for="doner-mobile">رقم الجوال لتصلك رسالة التبرع</label>
            </span>
        </div>
        <div class="mb-2 color-secondary">وسيلة الدفع</div>
        <div class="payment-methods d-flex align-items-center justify-content-center mb-3">
          <div class="item" @click="cardType = 'credit_card'"
               :class="{'selected': cardType === 'credit_card'}">
            <img class="payment-radio__image payment-radio__image--visa" src="../../assets/images/card-pay-payment.png"
                 alt="">
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
              <img src="../../assets/images/apple-pay-logo.png" alt="apple-pay">
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="text-center mb-2">بإتمام التبرع أنت توافق على
            <span class="color-primary text-decoration-underline pointer"
                  @click="goToPrivacyPolicyPage">سياسات التبرع</span>
          </div>
          <BaseSpinner v-if="showApplepaySpinner"/>
          <Button class="p-button p-button-rounded p-button-primary w-50 m-auto d-flex justify-content-center"
                  v-if="cardType === 'credit_card'"
                  @click.stop="donate"
                  :disabled="disableSubmit">
            <span class="text-center">تبرع الآن</span>
          </Button>
          <div :class="['form-cont', {'d-none': cardType !== 'applepay'}]"
               v-if="donationModel.donation_amount && isHyperpayInjected">
            <form :action="redirectURI" class="paymentWidgets"
                  :data-brands="'APPLEPAY'"></form>
          </div>
        </div>
      </div>
    </div>
  </div>
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
import {defineComponent} from "vue";

import MostafeedSection from "@/components/home/mostafeed.vue";
import CaseCard from "@/components/home/case-card.vue";
import {ToastSeverity} from "primevue/api";
import Dialog from "primevue/dialog";
import WaqfCard from "@/components/home/waqf-card";
import CampaignCard from "@/components/home/campaign-card";
import CasesNavigation from "@/components/home/CasesNavigation";
import CardBoard from "@/components/home/CardBoard";
import BaseSpinner from "@/components/layout/BaseSpinner";
import FilterCasesForm from "@/components/home/FilterCasesForm";

import HomePageService from "@/services/home-page.service";
import DonationService from "@/services/donation.service";
import JwtUtilService from "@/services/jwt.util.service";
import WalletService from "@/services/wallet.service";
import CasesService from "@/services/case-service";
import EnumService, { DONATION_TYPE } from "@/services/enum.service";
import CampaignsService from "@/services/campaigns.service";
import DonationFailureDialog from "@/components/donate/DonationFailureDialog";
import DonationSuccessDialog from "@/components/donate/DonationSuccessDialog";
import hyperpayMixin from "@/mixins/hyperpayMixin";

export default defineComponent({
  mixins: [hyperpayMixin],
  name: "HomeView",
  components: { DonationFailureDialog, DonationSuccessDialog, FilterCasesForm, BaseSpinner, CardBoard, CasesNavigation, CaseCard, MostafeedSection, Dialog, WaqfCard, CampaignCard },
  data() {
    return {
      redirectURI: "",
      pageModel: {},
      donationModel: {},
      selectedType: {},
      cardsConfig: {
        page: "home"
      },
      imageSlides: [],
      sliderPaused: false,
      interval: 3000,
      specialties: [],
      availableCases: [],
      completedCases: [],
      isQuickDonationOpened: false,
      types: [],
      checkoutId: "",
      browserName: "",
      cardType: "credit_card",
      selectedCaseType: "AVAILABLE",
      filteredCases: [],
      isScrolledDown: false,
      canDonate: JwtUtilService.getClientID()?.includes("doner") || !this.$store.getters.isAuthenticated,
      casesNavigationItems: [
        {
          name: 'cases',
          label: 'المرضى',
        },
        // {
        //   name: 'projects',
        //   label: 'المشاريع',
        // },
        {
          name: 'campaigns',
          label: 'الحملات',
        },
        {
          name: 'markItClose',
          label: 'قفّلها',
        },
        {
         name: 'endowments',
         label: 'الأوقاف'
        }],
      filtersOpened: false,
      selectedCondition: null,
      selectedItems: [],
      specializationOptions: [],
      regionOptions: [],
      loading: false,
      filterParams: {},
      casesFiltered: false,
      showMoreItems: [],
      pageNumber: 1,
      totalItemsCount: 0,
      displayShowMoreButton: true,
      allCasesDonationWalletId: null,
      images: {
        majorDonors: '',
        healthInitiatives: '',
        shefaaAmbassador: '',
      },
      paymentFailureMessage: "",
      showDonationFailureModal: false,
      resourcePath: "",
      paymentTransactionId: 0,
      isHyperpayInjected: false,
      showApplepaySpinner: false,
      showDonationSuccessModal: false,
      successDonationData: {},
      donationType: DONATION_TYPE.CASE,
      isSubmitted: false,
      disableFields: false
    };
  },
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  async mounted() {
    await this.getHomePageDetails();
    await CasesService.getMedicalDataDropdown().then((result) => {
      this.specializationOptions = result.data.result.case_specialty;
    });
    await EnumService.regions().then((result) => {
      this.regionOptions = result.data.result;
    });
    setTimeout(() => {
      this.createPauseButton();
    }, 300)
    this.getTotalCasesCount();
    this.getAllCasesDonationWalletId();

    this.redirectURI = process.env.VUE_APP_FE_URL + `/home`;
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
  computed: {
    setInterval() {
      return this.sliderPaused ? 99999999 : 4000;
    },
    allCasesDonationCondition() {
      return this.donationModel.selected_type === this.allCasesDonationWalletId &&
        this.donationModel.donation_amount < this.selectedType?.minimum_amount;
    },
    disableSubmit() {
      return !!(!this.donationModel.donation_amount || (this.donationModel.doner_mobile && !this.isValidMobileNumber(this.donationModel.doner_mobile)) || this.allCasesDonationCondition)
    },
  },
  methods: {
    async getHomePageDetails() {
      this.loading = true;
      await HomePageService.getHomePageDetails()
        .then(({ data: { result } }) => {
          this.imageSlides = result.banner;
          this.specialties = result.specialties;
          this.availableCases = result.cases;
          this.completedCases = result.completed_cases;
          this.filteredCases = [...this.availableCases];
          this.pageModel = result;
          this.images = {
            majorDonors: result.major_donors_image,
            healthInitiatives: result.health_initiatives_image,
            shefaaAmbassador: result.shefaa_ambassador_image,
          }
        });
      this.loading = false;
    },
    donate() {
      const postBody = {
        card_type: this.cardType,
        amount: this.donationModel.donation_amount,
        is_waqf_sehi: this.selectedType.is_waqf_wallet
      };
      DonationService.getPaymentId(postBody)
        .then(({ data: { result: checkout_id } }) => {
          this.checkoutId = checkout_id?.checkout_id;
          localStorage.setItem("donationModel", JSON.stringify(this.donationModel));
          localStorage.setItem("wallet", JSON.stringify(this.donationModel.selected_type));
          if (this.selectedType.is_waqf_wallet) {
            localStorage.setItem("is_waqf_wallet", this.selectedType.is_waqf_wallet);
          }
          this.injectCheckoutLibrary();
        })
        .catch(({ response: { data: { errors } } }) => {
          this.paymentFailureMessage = errors[0];
          this.showDonationFailureModal = true;
        });
    },
    applePayDonation() {

      this.isSubmitted = true;
      this.disableFields = true;

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
        is_waqf_sehi: this.selectedType.is_waqf_wallet
      };
      DonationService.getPaymentId(postBody)
        .then(({ data: { result: checkout_id } }) => {
          this.checkoutId = checkout_id?.checkout_id;
          localStorage.setItem("donationModel", JSON.stringify(this.donationModel));
          localStorage.setItem("wallet", JSON.stringify(this.donationModel.selected_type));
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
    getCases() {
      WalletService.getCases(0, true)
        .then(({ data: { result } }) => {
          this.types = result;
          this.donationModel.selected_type = this.types?.length ? this.types[0]?.id : {};
          this.selectedType = this.types?.length ? this.types[0] : {};
        });
    },
    async getConditionalCases(name) {
      this.casesFiltered = false
      this.loading = true;
      this.pageNumber = 1;
      this.selectedCondition = name;
      if(this.selectedCondition !== 'cases') {
        this.filtersOpened = false
      }
      await HomePageService.get[this.selectedCondition]()
          .then((response) => {
            if(this.selectedCondition === 'endowments') {
              this.selectedItems = response.data.results ? response.data.results : [];
              this.totalItemsCount = response.data.results.total_objects;
            } else if (this.selectedCondition === 'campaigns') {
              this.selectedItems = response.data.result ? response.data.result : [];
              this.totalItemsCount = response.data.result.length;
            } else {
              this.selectedItems = response.data.result.results ? response.data.result.results : [];
              this.totalItemsCount = response.data.result.total_objects;
            }
          });
      this.loading = false;
    },
    reportCampaign(id) {
      this.$confirm.require({
        message: `هل أنت متأكد من الإبلاغ عن الحملة؟`,
        acceptLabel: "نعم",
        rejectLabel: "لا",
        accept: () => {
          CampaignsService.reportCampaign(id)
              .then(({ data }) => {
                this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم الإبلاغ عن الحملة بنجاح", life: 3000 });
                this.getCampaigns();
              });
        },
        reject: () => {
          this.$confirm.close();
        }
      });
    },
    toggleFilters() {
      this.filtersOpened = !this.filtersOpened
    },
    async filterCases(filterParams) {
      this.loading = true;
      this.filtersOpened = false;
      this.filterParams = filterParams;
      this.pageNumber = 1;
      await HomePageService.get.FilteredCases(filterParams, this.pageNumber)
        .then((response) => {
          this.selectedItems = response.data?.result.results ? response.data?.result.results : [];
          this.totalItemsCount = response.data?.result.total_objects;
        })
        .catch((err) => {
          this.$toast.add({ severity: ToastSeverity.INFO, detail: "لا توجد مثل هذه الحالة", life: 3000 });
          this.selectedItems = [];
        });
      this.loading = false;
      this.casesFiltered = true;
    },
    async fetchMoreItems() {
      this.pageNumber++;
      await HomePageService.get.FilteredCases(this.filterParams, this.pageNumber)
        .then((response) => {
            this.showMoreItems = response.data?.result.results ? response.data?.result.results : [];
            this.totalItemsCount = response.data?.result.total_objects;
        })
        .catch((err) => {
          this.$toast.add({ severity: ToastSeverity.INFO, detail: "لا توجد مثل هذه الحالة", life: 3000 });
          this.selectedItems = [];
        });
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
    isValidMobileNumber(mobileNumber) {
      if (!mobileNumber) {
        return false;
      }
      return /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(mobileNumber);
    },
    onQuickDonationClicked() {
      this.isQuickDonationOpened = !this.isQuickDonationOpened;
      if (this.isQuickDonationOpened) {
        this.getCases();
        this.checkBrowserEngine();
      }
    },
    goToPrivacyPolicyPage() {
      window.open(process.env.VUE_APP_FE_URL + "/privacy-policy", "_blank");
    },
    handleScroll() {
      this.isScrolledDown = document.documentElement.scrollTop > 0;
    },
    toggleSliderAutoplay() {
      this.sliderPaused = !this.sliderPaused;
      this.changePauseButtonIcon();
    },
    changePauseButtonIcon() {
      const pauseBtnIcon = document.querySelector("#pause-button-icon");
      pauseBtnIcon.classList.contains('pi-pause') ? pauseBtnIcon.classList.remove('pi-pause') : pauseBtnIcon.classList.add('pi-pause');
      pauseBtnIcon.classList.contains('pi-play') ? pauseBtnIcon.classList.remove('pi-play') : pauseBtnIcon.classList.add('pi-play');
    },
    createPauseButton() {
      let sliderNav = this.$refs?.slider?.querySelector('.p-carousel-indicators');
      if(!sliderNav) {
        return;
      }
      let sliderNavItem = this.$refs.slider.querySelector('.p-carousel-indicator');
      if(!sliderNavItem) {
        return;
      }
      let pauseBtn = document.createElement("button");
      let pauseIcon = document.createElement("i");
      sliderNav.classList.add('align-items-center');
      pauseBtn.classList.add('p-button', 'p-button-rounded', 'd-flex', 'justify-content-center');
      pauseIcon.id = "pause-button-icon";
      pauseIcon.classList.add('pi', 'pi-pause');

      pauseBtn.style.backgroundColor = "rgba(255,255,255, 0.4)";
      pauseBtn.style.borderColor = "rgba(255,255,255, 0.4)";
      pauseBtn.style.width = "44px";
      pauseBtn.style.height = "25px";
      pauseBtn.style.marginRight = "15px";
      pauseBtn.style.marginBottom = "5px";

      pauseIcon.style.color = "#5581C4";
      pauseIcon.style.padding = "2px";
      pauseIcon.style.border = "2px solid #5581C4";
      pauseIcon.style.borderRadius = "50%";
      pauseIcon.style.fontSize = "10px";

      pauseBtn.append(pauseIcon)
      pauseBtn.addEventListener('click', () => {
        this.toggleSliderAutoplay();
      })
      sliderNav.insertBefore(pauseBtn, sliderNavItem);
    },
    getAllCasesDonationWalletId() {
      WalletService.getAllCasesDonationWalletId()
          .then(({ data: { result } }) => {
            this.allCasesDonationWalletId = result.id;
          });
    },
    getTotalCasesCount() {
      HomePageService.get.cases()
          .then(({ data: { result } }) => {
            this.$store.state.totalCases = result.total_objects;
          });
    },
    checkPaymentStatus() {
      DonationService.getPaymentStatus(this.paymentTransactionId, this.resourcePath)
        .then(({ data: { response } }) => {

          const donationModel = JSON.parse(localStorage.getItem("donationModel"));
          const postBody = {
            to_wallet: JSON.parse(localStorage.getItem("wallet")),
            amount: donationModel.donation_amount,
            donor_mobile_number: donationModel.doner_mobile,
            checkout_id: this.paymentTransactionId
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
});
</script>

<style lang="scss" scoped>
@import "../../styles/variables";

@import "@/styles/components/button";
@import "@/styles/components/tile";
@import "@/styles/layout/tile-grid";
@import "@/styles/abstracts/mixins";

.home-page {
  .header-area {
    background-color: white;
  }
  .slider-area {
    direction: ltr;
  }
  .image-slider {
    position: relative;
    &__pause {
      position: absolute;
      bottom: 0;
      left: 100px;
    }
  }

  .halat {
    padding: 18px;
    cursor: pointer;
    border-radius: 11px;
    max-width: 15%;
    margin: 1px;

    &:hover {
      background: #009688;
    }
  }

  .halat-active {
    background: #009688;
  }

  .blue-green {
    color: #2EA9A2;
  }

  .social-icons ul li a i {
    font-size: 20px;
    color: #36beb6;
  }

  .grayscale {
    filter: grayscale(1);
    -webkit-filter: grayscale(1);
  }

  .about-area {
    position: relative;
    padding-bottom: 40px;
    background: #ffffff url(../../assets/images/polygon-grey.png) no-repeat -185px;
    background-size: contain;
  }

  .halat {

    .about-icon {
      img {
        width: 54px;
        height: 54px
      }
    }

    &:hover {
      .about-title {
        color: white;
      }
    }
  }


  .about-content-dot {
    display: block;
    width: 66px;
    margin: 63px auto 2px auto;
  }

  .btn-show-all-cases {
    background-color: #00B7AE;
    color: white;
    border-radius: 50px;
    height: 70px;
    font-size: 16px;
    box-shadow: 0 14px 20px -2px rgba(0, 183, 174, 0.48);
    -webkit-box-shadow: 0 14px 20px -2px rgba(0, 183, 174, 0.48);
    -moz-box-shadow: 0 14px 20px -2px rgba(0, 183, 174, 0.48);
    text-decoration: none;

    &:hover {
      color: white;
    }
  }
}

.dir-rtl {
  direction: rtl;
}

::v-deep(.slide-item) {
  width: 100%;
  height: 550px;
  position: relative;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}

.welcome {
  display: block;
  width: 80%;
  background-color: #12B3AB;
  padding: 40px 30px 30px;
  position: absolute;
  bottom: 0;
  right: 10%;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;

  p {
    text-align: right;
    font-size: 22px;
    color: #FFFFFF;
    width: 74%;
  }

  .welcome-more {
    display: block;
    font-size: 17px;
    color: #575757;
    text-align: center;
    width: 192px;
    padding: 16px 20px;
    margin: -20px 1px 1px 20px;
    border-radius: 34px;
    background-color: #F7F7F7;
    background-image: linear-gradient(#D1D1D1, #F7F7F7);
  }
}

.s_w_donation_header_btn {
  position: fixed;
  right: -1px;
  top: 167px;
  z-index: 101;
  width: 130px;
  text-align: right;
  color: #FFFFFF;
  padding: 0;
  vertical-align: middle;
  margin-top: -1px;
  transition: all .5s;

  .donation-wrapper {
    border-radius: $border-radius-default 0 0 $border-radius-default;
    background-color: $color-complementary;
    box-shadow: $box-shadow-tile;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: $color-complementary-hover;
    }

    .donate-text {
      color: $color-primary;
      background-color: white;
    }

    i.pi {
      transition: transform .2s ease-in-out;
    }
  }



  img {
    width: 24px;
    height: 24px;
  }

  &.only-icon {
    transform: translateX(88px);
  }
  &.expanded {
    transform: translateX(0);
    i.pi {
      transform: rotate(45deg);
    }
  }
}

.s_w_donation {
  position: fixed;
  right: 0;
  top: 207px;
  z-index: 100;
  -webkit-box-shadow: -12px 13px 5px -6px rgb(114 115 114 / 9%);
  -moz-box-shadow: -12px 13px 5px -6px rgba(114, 115, 114, 0.09);
  background: #FFFFFF 0 0 no-repeat padding-box;
  box-shadow: 0 2px 10px #5582c51a;
  opacity: 0.98;
  border-radius: 10px;

  .case-container {

    border-bottom: 1px solid $color-secondary;

    .case {
      padding: 10px;
      flex: 1;
      cursor: pointer;

      &.selected {
        color: $color-primary;
        border-bottom: 2px solid $color-primary;
        background-color: #E2F3F4;
      }

      &:not(:last-child) {
        border-left: 1px solid $color-secondary;
      }

      &:first-child {
        border-top-right-radius: 8px;
      }

      &:last-child {
        border-top-left-radius: 8px;
      }
    }
  }
}

.s_w_donation_p {
  font-size: 15px;
  font-weight: bolder;
  letter-spacing: 0;
  color: #AEB0B0;
  opacity: 1;
}

.card_icons input {
  display: none;
}

.card_icons label {
  cursor: pointer;
}

.s_w_pay_radio:checked ~ label img {
  border: 2px solid #12b3ab;
  border-radius: 24px;
}

.payment_brand_logo {
  width: 100%;
  background: #FFFFFF 0 0 no-repeat padding-box;
}

.s_w_donation_btn {
  background: #12B3AB;
  border-radius: 25px;
  text-align: center;
  color: #FFFFFF !important;

  &:hover {
    background: #189491 !important;
  }

  img {
    width: 40px;
  }
}

.tags {
  .tag {
    margin: 0 0.5rem;
    padding: 5px 0 9px;
    text-align: center;
    color: #12B3AB;
    border: 1px solid #12B3AB;
    border-radius: 8px;
    cursor: pointer;
    flex: 1;

    &:hover {
      opacity: 0.7;
    }
  }
}

.payment-methods {

  .item {
    height: 50px;
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
      width: 50px;
      height: 30px;
    }
  }
}

.color-primary {
  color: #12B3AB;
}

.width-20 {
  width: 20%;
}

.width-10 {
  width: 10%;
}

.width-180p {
  width: 180px;
}

.width-450p {
  width: 450px;
}

.cases-area {
  background: $color-primary-background url(../../assets/images/polygon.png) no-repeat right;

  p {
    margin-bottom: 0;
  }

  .cases-area-all {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 125px;
    margin: 0 150px;
    min-height: 500px;
    padding-bottom: 35px;
    background-size: 30%;
    &--additional-section {
      padding-top: 50px;
    }
  }
  .all-cases-btn {
    display: block;
    width: 75%;
    color: #fff;
    background-size: 100%;
    text-align: center;
    font-size: 32px;
    font-family: "DINNextLTW23-Regular", serif;
    padding: 32px 0 95px 0;
    margin: 50px auto 10px;

    &:hover {
      color: #4F4F4F;
    }
  }

  .btn-shadow {
    box-shadow: 0 0 3px 9px rgba(230, 247, 247, 1);
    -webkit-box-shadow: 0 0 3px 9px rgba(230, 247, 247, 1);
    -moz-box-shadow: 0 0 3px 9px rgba(230, 247, 247, 1);
  }

  .btn-unselected {
    color: #1ab3ab;
    background-color: #F6F6F6;
    box-shadow: 0 3px 10px rgb(0 0 0 / 17%);
  }

  .btn-selected {
    color: white;
    background: #1ab3ab;
    box-shadow: 0 3px 10px rgb(0 0 0 / 17%);

    &:hover {
      color: white;
      background: #1ab3ab;
    }
  }

  .available {
    border-radius: 0 20px 20px 0;
  }

  .completed {
    border-radius: 20px 0 0 20px;
  }

  a {
    color: white;
    text-decoration: none;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

  p {
    margin-bottom: 0;
  }
}

.pointer {
  cursor: pointer;
}

.error-message {
  position: absolute;
  bottom: -23px;
  right: .75rem;
  font-size: 14px;
  color: #e24c4c;
}

:deep(.p-float-label label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 14px !important;
}

::v-deep(.p-carousel-indicators) {
  position: absolute;
  bottom: 0;
  margin: auto;
  width: 100%;
}

::v-deep(.p-carousel .p-carousel-indicators .p-carousel-indicator button) {
  width: 3rem !important;
  height: 0.3rem !important;
  border-radius: 8px;
}
::v-deep(.p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button) {
  background-color: $color-complementary;
}

.p-button-outlined {
  width: 150px;
  border-radius: 20px;

  a {
    color: #14B8A6;
  }
}

.summary {
  z-index: 100;
  margin-top: 120px;
  text-shadow: rgba(black, .2) 1px 0 10px;
  &__text {
    margin-bottom: 15px;
  }
  .p-button {
    a {
      color: white;
      text-decoration: none;
    }
  }
}

.w-200 {
  width: 200px;
}

.w-65 {
  width: 65%;
}

.w-35 {
  width: 35%;
}

.p-button {
  height: 40px;
}

::v-deep(.s_w_donation .p-inputnumber-input),
::v-deep(.s_w_donation .p-inputtext){
  height: 40px !important;
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
    height: 50px !important;
    object-fit: cover;
    object-position: center;
    padding: 0 0.5rem;
    margin: 0 5px;
    border: 1px solid #ced4da;
    border-radius: 8px;

    &--mada {
      height: 60px;
    }

    &--apple {
      height: 30px;
    }
  }

  &--checked {
    border-color: $color-primary;
  }
}

@media (max-width: 1200px) {
  ::v-deep(.slide-item) {
    width: 100%;
    height: 400px;
    position: relative;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }
}

@include respond('xl') {
  .s_w_donation_header_btn {
    top: 12%;
    &.only-icon {
      transform: translateX(91px);
    }
  }
  .s_w_donation {
    top: 16.7%;
  }
  .cases-area {
    .cases-area-all {
      padding-top: 100px;
      margin: 0 75px;
      &--additional-section {
        padding-top: 50px;
      }
    }
  }
}
@include respond('lg') {
  .cases-area {
    .cases-area-all {
      padding-top: 70px;
      margin: 0 50px;
      &--additional-section {
        padding-top: 30px;
      }
    }
  }
}
@include respond('md') {
  .cases-area {
    .cases-area-all {
      padding-top: 50px;
      &--additional-section {
        padding-top: 30px;
      }
    }
  }
}
@include respond('sm') {
  .cases-area {
    .cases-area-all {
      margin: 0 30px;
    }
  }
}

.form-cont {
  width: 100%;
}

</style>
