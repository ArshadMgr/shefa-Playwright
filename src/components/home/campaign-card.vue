<template>
  <ShareDialog :visible="displayShareDialog"
              header="ساهم في العلاج عن طريق المشاركة مع الاخرين"
              :authenticated="false"
              :sharableLink="sharableLink"
              :facebookLink="facebookLink"
              :twitterLink="twitterLink"
              :whatsappLink="whatsappLink"
              @close="closeShareDialog"
              @copy="copyLink"
  />
  <div>
    <Card class="card-board__item case-card-item case-card-item--campaign d-flex flex-column justify-content-between" data-cy="campaign-card" @click="onCaseClick">
      <template #header>
        <div class="position-relative">
          <h2 class="case-card-item__heading text-center">حملة</h2>
          <img v-if="!campaign.image" class="condition-img"
               data-cy="condition-image"
               src="@/assets/images/test-image.png"
               alt="صورة الحالة">
          <img v-else class="condition-img"
               :src="campaign.image"
               alt="صورة الحالة">
<!--          <img class="charity-image position-absolute" :src="case_.urls?.charity_image" alt="صورة الجمعية">-->
          <div v-if="campaign.remaining_period" data-cy="remaining-period"
               class="remaining-period px-3 py-1 position-absolute d-flex align-items-center justify-content-center opacity-50 bg-black rounded-5 text-white">
            <div class="pi pi-clock px-2"></div>
            <div class="pb-1">المدة المتبقية {{ campaign.remaining_period }} أيام</div>
          </div>
        </div>
        <div class="remaining_amount_card">
          <div class="percentage-card pointer">
            <span class="case-card-item__remaining-amount">المتبقي <span> {{ Math.ceil(campaign.target - campaign.balance).toLocaleString("en-US") }} </span> ريال</span>
            <div data-cy="progress-bar" class="progress mt-1">
              <div class="progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0"
                   :style="{width: calculatePercentage <= 100 ? calculatePercentage + '%' : '100%'}"
                   aria-valuemax="100">
                <span v-if="calculatePercentage >= 20" class="progress-bar__percentage">{{calculatePercentage <= 100 ? calculatePercentage + '%' : '100%'}}</span>
              </div>
              <div class="hint" style="right: 9%">
                {{ Math.trunc((campaign.balance / campaign.target) * 100) }}%
              </div>
            </div>
          </div>
          <div class="remaining_amount_card__details">
          <span>
            <span data-cy="case-id" class="color-complementary">#</span>
            {{ campaign.id }}
          </span>
          </div>
        </div>
      </template>
      <template #content>
        <div class="case-card-item__content row w-100 m-0 mt-3">
            <div class="fw-bold title text-center" :title="campaign.full_title" data-cy="case-title">
              <span>{{campaign.full_title}}</span>
            </div>
            <div class="case-card-item__goal my-4 d-flex flex-column" data-cy="case-description">
              <span class="color-primary">هدف الحملة</span>
              <span v-if="campaign.typ === 'Waqf_sehi'">وقف صحي</span>
              <span v-else>{{campaign.specialty_name}}</span>
            </div>
          </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between">
          <router-link v-if="canDonate" class="case-card-item__donate" :to="`/donate-campaign/${campaign.id}`">
            <Button class="p-button-primary w-100"
                    label="تبرع الآن"
                    data-cy="donate-campaign"
                    :disabled="!canDonate"
                    v-if="!close" />
          </router-link>
          <span v-else-if="calculatePercentage >= 100" class="d-flex align-items-center justify-content-center w-100">
          مكتمل
        </span>
          <span v-else class="d-flex align-items-center justify-content-center w-100">
          تبرع الآن
        </span>
          <Button class="p-button-secondary button-share me-2" title="إبلاغ عن الحملة"
                  @click="$emit('reportCampaign')"
                  :disabled="campaign.is_reported || !canDonate"
                  data-cy="report-campaign"
                  icon="pi pi-exclamation-circle"/>
          <Button @click.stop="openShareDialog" class="p-button-secondary button-share me-2" data-cy="share-button" icon="pi pi-share-alt" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import ShareDialog from "@/components/layout/ShareDialog";

import JwtUtilService from "@/services/jwt.util.service";
import ToastService from "primevue/toastservice";
import { ToastSeverity } from "primevue/api";

export default {
  name: "campaign-card",
  components: { ShareDialog },
  emits: ["reportCampaign"],
  data() {
    return {
      canDonate: JwtUtilService.getClientID()?.includes("doner") || !this.$store.getters.isAuthenticated,
      sharableLink: `${process.env.VUE_APP_FE_URL}/donate-campaign/${this.campaign?.id}`,
      displayShareDialog: false,
    };
  },
  props: {
    campaign: {}
  },
  mounted() {
    let remaining_period_in_days = Math.ceil((new Date(this.$props.campaign?.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    this.$props.campaign.remaining_period = remaining_period_in_days > 0 ? remaining_period_in_days : 0;
  },
  methods: {
    onShareClicked(platform) {
      const FEURL = process.env.VUE_APP_FE_URL;
      let facebookShareURL = 'https://www.facebook.com/sharer.php?u=' + FEURL + '/donate-campaign/' + this.campaign?.id;
      let whatsappShareURL = 'https://wa.me/?text=' + FEURL + '/donate-campaign/' + this.campaign?.id;
      let twitterShareURL = 'https://twitter.com/share?url=' + FEURL + '/donate-campaign/' + this.campaign?.id;

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
      return Math.trunc((this.campaign.balance / this.campaign.target) * 100);
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
