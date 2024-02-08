<template>
  <ShareDialog :visible="displayShareDialog"
            header="ساهم في العلاج عن طريق المشاركة مع الاخرين"
            :authenticated="false"
            :sharableLink="sharableLink"
            :facebookLink="facebookLink"
            :twitterLink="twitterLink"
            :whatsappLink="whatsappLink"
            @close="closeShareDialog"
            @copy="copyLink" />
    <Card class="card-board__item case-card-item d-flex flex-column" data-cy="waqf-card">
      <template #header>
        <div class="position-relative">
          <img class="condition-img" :src="waqf.image_path" alt="">
          <div v-if="waqf.remaining_period"
               class="remaining-period px-3 py-1 position-absolute d-flex align-items-center justify-content-center opacity-50 bg-black rounded-5 text-white">
            <div class="pi pi-clock px-2"></div>
            <div class="pb-1">المدة المتبقية {{ waqf.remaining_period }} أيام</div>
          </div>
        </div>
        <div class="remaining_amount_card" data-cy="remaining-amount">
          <div class="percentage-card pointer">
            <span>المتبقي <span> {{ (waqf.target - waqf.balance).toLocaleString("en-US") }} </span> ريال</span>
            <div class="progress mt-3">
              <div class="progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0"
                   :style="{width: calculatePercentage <= 100 ? calculatePercentage + '%' : '100%'}"
                   aria-valuemax="100">
                <span v-if="calculatePercentage >= 20" class="progress-bar__percentage">{{calculatePercentage <= 100 ? calculatePercentage + '%' : '100%'}}</span>
              </div>
              <div class="hint" style="right: 9%">
                {{ Math.trunc(calculatePercentage) }}%
              </div>
            </div>
          </div>
          <div class="remaining_amount_card__details">
          <span data-cy="case-id">
            <span class="color-complementary">#</span>
            {{ waqf.id }}
          </span>
            <span class="color-complementary">تفاصيل الوقف</span>
          </div>
        </div>

      </template>
      <template #content>
        <div class="case-card-item__content mt-3">
          <div class="row w-100 m-0 pb-2">
            <div class="my-2 fw-bold fs-6 title" data-cy="case-title">
              {{ waqf.name }}
            </div>
            <div class="condition-description mt-2" data-cy="case-description">
              {{ waqf.description }}
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="cta d-flex justify-content-center align-items-end w-100 p-3">
          <router-link v-if="canDonate && (waqf.target - waqf.balance > 0)" :to="'/donate-waqf/' + waqf.id" class="w-100">
            <Button class="p-button-primary w-100"
                    data-cy="donate-now"
                    label="تبرع الآن"
                    :disabled="!canDonate || (waqf.target - waqf.balance === 0)"/>
          </router-link>
          <div v-else>
            تبرع الآن
          </div>
          <Button @click.stop="openShareDialog" class="p-button-secondary me-3 button-share" icon="pi pi-share-alt" data-cy="share-button" />

        </div>
      </template>
    </Card>
</template>

<script>
import ShareDialog from "@/components/layout/ShareDialog";

import JwtUtilService from "@/services/jwt.util.service";
import ToastService from "primevue/toastservice";
import { ToastSeverity } from "primevue/api";

export default {
  name: "waqf-card",
  components: { ShareDialog },
  data() {
    return {
      canDonate: JwtUtilService.getClientID()?.includes("doner") || !this.$store.getters.isAuthenticated,
      displayShareDialog: false,
      sharableLink: `${process.env.VUE_APP_FE_URL}/donate-waqf/${this.waqf?.id}`,
    };
  },
  props: {
    waqf: {}
  },
  mounted() {
    if(!this.$props.waqf?.end_date) {
      return;
    }
    let remaining_period_in_days = Math.ceil((new Date(this.$props.waqf?.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    this.$props.waqf.remaining_period = remaining_period_in_days > 0 ? remaining_period_in_days : 0;
  },
  methods: {
    openShareDialog() {
      this.displayShareDialog = true;
    },
    closeShareDialog() {
      this.displayShareDialog = false;
    },
    copyLink() {
      navigator.clipboard.writeText(this.sharableLink);
      if(this.sharableLink) {
        this.$toast.add({severity: ToastSeverity.SUCCESS, detail: "تم نسخه بنجاح", life: 3000})
      }
    },
    isBrowserMobile() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        return true;
      } else {
        return false;
      }
    },
  },
  computed: {
    calculatePercentage() {
      return Math.trunc((this.waqf.balance / this.waqf.target) * 100);
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/components/case-card";
</style>
