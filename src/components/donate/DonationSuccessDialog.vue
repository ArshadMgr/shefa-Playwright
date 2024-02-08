<template>
  <Dialog
    :visible="showModal"
    :modal="true"
    :closable="false"
    class="payment-success-modal p-dialog-share"
    :showHeader="false"
    :breakpoints="{'1360px': '50vw', '1024px': '60vw', '960px': '90vw', '640px': '91vw'}" :style="{width: '35vw'}"
    data-cy="payment-success-dialog"
  >
    <div class="body">
      <div class="text-center my-4">
        <i class="pi pi-check-circle m-auto color-primary fs-large"></i>
      </div>
      <div class="my-2 text-center color-primary" v-if="$store.getters.isAuthenticated">
        {{ username }}
      </div>
      <div v-if="heading" class="color-primary text-center mb-2 fw-bold">
        {{ heading }}
      </div>
      <div v-else class="color-primary text-center mb-2 fw-bold" data-cy="payment-success-message">
        تمت عملية التبرع بنجاح
      </div>
      <div v-if="message" class="color-complementary text-center mb-3 fw-bold">
        {{ message }}
      </div>
      <div v-else class="color-complementary text-center mb-3 fw-bold" data-cy="thanks-message">
        شكراً لمساهمتك في شفاء، وأجزل الله لك المثوبة والعطاء
      </div>
      <div class="color-primary text-center mb-2" data-cy="total-donation-message">
        إجمالي التبرع
      </div>
      <div class="amount-tag rounded m-auto text-center p-1 mb-4 d-flex justify-content-center flex-row-reverse" data-cy="donation-amount">
        <span class="px-1">{{ data.amount }}</span>
        <span>ر.س</span>
      </div>
      <div class="w-75 m-auto">
        <div v-if="donationType !== donationType_.ALL_CASES_DONATION &&
                    donationType !== donationType_.ZAKAT &&
                    donationType !== donationType_.ALL_PATIENTS && !periodicDonation">
          <div v-if="!periodicDonation" class="d-block color-complementary text-center fs-6" data-cy="share-with-others-message">
            ساهم في العلاج عن طريق مشاركتك الحالة للآخرين
          </div>
          <div class="input-wrapper mt-1 mb-4" data-cy="share-with-others">
            <InputText type="text" v-model="sharableLink" disabled ref="shareInput" />
            <Button class="p-input-text__icon-wrapper" @click="copyLink">
              <i class="pi pi-copy" />
            </Button>
          </div>
        </div>
        <div v-if="periodicDonation">
          <div class="input-wrapper mt-1 mb-4">
            <InputText type="text" v-model="sharableLink" disabled ref="shareInput" />
            <Button class="p-input-text__icon-wrapper" @click="copyLink">
              <i class="pi pi-copy" />
            </Button>
          </div>
        </div>
        <div class="details-table fs-6 mb-4">
          <div class="header d-flex justify-content-between align-items-center flex-row-reverse rounded-4 px-2 px-lg-5 py-1">
            <div class="mb-2" data-cy="reference-number-label">رقم المرجع</div>
            <div class="text-black fw-bold" data-cy="reference-number">{{ data.reference_number }}</div>
          </div>
          <div class="item d-flex justify-content-between align-items-center flex-row-reverse px-3 py-2">
            <div class="mb-2 text-end" data-cy="date-time-label">التاريخ والوقت</div>
            <div class="text-black fw-bold dir-rtl text-start" data-cy="date-time">{{ data.date }}</div>
          </div>
          <div class="item d-flex justify-content-between align-items-center flex-row-reverse px-3 py-2">
            <div class="mb-2" data-cy="payment-method-label">طريقة الدفع</div>
            <div class="text-black fw-bold" data-cy="payment-method">{{ data.payment_method }}</div>
          </div>
          <div class="item d-flex justify-content-between align-items-center flex-row-reverse px-3 py-2"
               v-if="donationType !== donationType_.ALL_CASES_DONATION &&
                    donationType !== donationType_.ZAKAT &&
                    donationType !== donationType_.WAQF &&
                    donationType !== donationType_.ALL_PATIENTS && !periodicDonation">
            <div class="mb-2" data-cy="case-id-label">رقم الحالة</div>
            <div class="text-black fw-bold" data-cy="case-id">{{ data.id }}</div>
          </div>
          <div class="item d-flex justify-content-between align-items-center flex-row-reverse px-3 py-2">
            <div class="mb-2" data-cy="donation-specialty-label">نوع التبرع</div>
            <div class="text-black fw-bold" v-if="!periodicDonation" data-cy="donation-specialty">{{ data.specialty }}</div>
            <div class="text-black fw-bold" v-else>تبرع دوري</div>
          </div>
          <div class="item d-flex justify-content-between align-items-center flex-row-reverse px-3 py-2"
               v-if="donationType !== donationType_.ALL_CASES_DONATION &&
                    donationType !== donationType_.ZAKAT &&
                    donationType !== donationType_.ALL_PATIENTS && !periodicDonation">
            <div class="mb-2" data-cy="case-details-label">تفاصيل الحالة</div>
            <div class="fw-bold">
              <a :href="sharableLink" target="_blank" class="color-complementary" data-cy="case-details-link">
                إظهار تفاصيل الحالة
              </a>
            </div>
          </div>
          <div class="item d-flex justify-content-between align-items-center flex-row-reverse px-3 py-2"
               v-if="periodicDonation">
            <div class="mb-2">تفاصيل الخدمة</div>
            <div class="fw-bold">
              <router-link to="/admin-panel/periodic-donation" class="color-complementary">
                إظهار تفاصيل الخدمة
              </router-link>
            </div>
          </div>
        </div>
        <div class="text-center">
          <button
            id="submit-btn"
            class="btn btn-primary btn-lg submit-btn rounded-5 px-5"
            type="button"
            @click.prevent="close"
            data-cy="home-page">
            {{ buttonLabel ? buttonLabel :  'الصفحة الرئيسية'}}
          </button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import { ToastSeverity } from "primevue/api";
import { DONATION_TYPE } from "@/services/enum.service";

export default {
  name: "DonationSuccessDialog",
  props: ["data", "showModal", "donationType", "heading", "message", "buttonLabel", "buttonLink", "periodicDonation"],
  emits: ["close"],
  data() {
    return {
      sharableLink: process.env.VUE_APP_FE_URL + "/donate-",
      username: localStorage.getItem("username"),
      donationType_: DONATION_TYPE,
      is_waqf_wallet: localStorage.getItem("is_waqf_wallet") ? JSON.parse(localStorage.getItem("is_waqf_wallet")) : false
    };
  },
  mounted() {
    if (this.periodicDonation) {
      this.sharableLink = process.env.VUE_APP_FE_URL + "/admin-panel/periodic-donation";
    } else if (this.data.is_completed && this.donationType === DONATION_TYPE.CASE) {
      this.sharableLink = process.env.VUE_APP_FE_URL + '/completed-cases';
    }
    else if(this.is_waqf_wallet) {
      this.sharableLink = process.env.VUE_APP_FE_URL + "/waqf-list";
    }
    else {

      switch (this.donationType) {
        case DONATION_TYPE.CASE: {
          this.sharableLink += "case/";
          break;
        }
        case DONATION_TYPE.WAQF: {
          this.sharableLink += "waqf/";
          break;
        }
        case DONATION_TYPE.CAMPAIGN: {
          this.sharableLink += "campaign/";
          break;
        }
      }
      this.sharableLink += this.data?.id;
    }
  },
  methods: {
    copyLink() {
      navigator.clipboard.writeText(this.sharableLink);
      if (this.sharableLink) {
        this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم النسخ بنجاح", life: 3000 });
      }
    },
    close() {
      localStorage.setItem("is_waqf_wallet", false)
      if(this.buttonLink) {
        this.$router.push("/admin-panel/periodic-donation");
      } else {
        this.$router.push("/");
      }
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.payment-success-modal {
  .amount-tag {
    width: 110px;
    background: #E7F7F7;
    color: $color-primary;
  }

  .input-wrapper {
    width: auto !important;
  }

  .details-table {
    .header {
      background: #ECECEC;
    }

    .item:not(:last-child) {
      border-bottom: 1px solid $color-secondary;
    }
  }

  .submit-btn {
    background: $color-primary;
    border-color: $color-primary;
    transition: all 0.5s;

    &:hover {
      background: $color-primary;
      border-color: $color-primary;
      opacity: 0.9;
    }
  }
}


.color-primary {
  color: $color-primary;
}

.color-complementary {
  color: $color-complementary;
}

.fs-large {
  font-size: 60px;
}

.dir-rtl {
 direction: rtl;
}
</style>
