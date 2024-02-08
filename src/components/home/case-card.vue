<template>
  <ShareDialog :visible="displayShareDialog"
                header="ساهم في العلاج عن طريق مشاركتك الحالة للآخرين"
                :authenticated="!$store.getters.isAuthenticated"
                :sharableLink="sharableLink"
                :facebookLink="facebookLink"
                :twitterLink="twitterLink"
                :whatsappLink="whatsappLink"
                @close="closeShareDialog"
                @copy="copyLink" />
  <Card class="card-board__item case-card-item d-flex flex-column justify-content-between" @click="onCaseClick" data-cy="case-card">

    <template #header>
      <div class="position-relative">
        <img class="condition-img"
             :src="(case_.urls?.case_image && case_.urls?.case_image[0]) || case_.urls?.id_photo"
             alt="صورة الحالة" data-cy="case-image">
        <div class="charity-image position-absolute">
          <img class="charity-image__hex" src="@/assets/icons/hex.svg" alt="صورة الجمعية" >
          <img class="charity-image__charity position-absolute" :src="case_.urls?.charity_image" alt="صورة الجمعية" data-cy="charity-logo">
        </div>
        <div v-if="case_.remaining_period" data-cy="remaining-period"
          class="remaining-period px-3 py-1 position-absolute d-flex align-items-center justify-content-center opacity-50 bg-black rounded-5 text-white">
          <div class="pi pi-clock px-2"></div>
          <div class="pb-1">تنتهي بعد {{case_.remaining_period}} يوم</div>
        </div>
      </div>
      <div class="remaining_amount_card">
        <div class="percentage-card pointer" data-cy="remaining-amount-value">
          <span>المتبقي <span> {{ (case_.required_amount - case_.collected_amount).toLocaleString("en-US") }} </span> ريال</span>
          <div class="progress mt-3" data-cy="remaining-amount-progress-bar">
            <div class="progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0"
                 :style="{width: calculatePercentage <= 100 ? calculatePercentage + '%' : '100%'}"
                 aria-valuemax="100">
              <span v-if="calculatePercentage >= 20" class="progress-bar__percentage">{{calculatePercentage <= 100 ? calculatePercentage + '%' : '100%'}}</span>
            </div>
            <div class="hint" style="right: 9%">
              {{ Math.trunc((case_.collected_amount / case_.required_amount) * 100) }}%
            </div>
          </div>
        </div>
        <div class="remaining_amount_card__details">
          <span data-cy="case-id">
            <span class="color-complementary">#</span>
            {{ case_.id }}
          </span>
          <span class="color-complementary">تفاصيل الحالة</span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="mt-3">
        <div class="row">
          <div class="fw-bold title" :title="case_.story_title" data-cy="case-title">
            {{ case_.story_title }}
          </div>
          <div class="condition-description mt-2" :title="case_.story" data-cy="case-description">
            {{ case_.story }}
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="details">
        <div class="d-flex align-items-center pt-2 pb-2">
          <div class="d-flex justify-content-start align-items-center">
            <div>
              <i class="pi pi-map-marker color-primary mx-2"></i>
            </div>
            <div>
              <span class="fw-semibold" data-cy="area-name">{{ case_.area_name }}</span>
            </div>
          </div>
          <div class="col-6 text-center d-flex justify-content-center align-items-center">
            <div>
              <img class="speciality-icon mx-2" alt="speciality icon"
                   :src="case_.specialty_image"
                   v-if="case_.specialty_image">
              <img class="speciality-icon mx-2" alt="speciality icon"
                   src="../../assets/icons/generic-case-icon.svg"
                   v-else>
            </div>
            <div>
              <span class="fw-semibold" data-cy="speciality-name">{{ case_.specialty_name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="cta d-flex justify-content-between pt-4">
        <router-link v-if="case_.can_donate && canDonate" class="w-100" :to="'/donate-case/' + case_.id + close ? '?close=true' : ''">
          <Button class="p-button-primary w-100 close-btn"
                  :label="'اقفل الحالة'"
                  :disabled="!case_.can_donate || !canDonate"
                  data-cy="case-closed-button"
                  icon="pi pi-check-circle" v-if="close" />

          <Button class="p-button-primary w-100"
                  :label="'تبرع الآن'"
                  :disabled="!case_.can_donate || !canDonate"
                  data-cy="donate-now-button"
                  v-if="!close" />
        </router-link>
        <span v-else-if="calculatePercentage >= 100" class="d-flex align-items-center justify-content-center w-100">
          مكتمل
        </span>
        <span v-else class="d-flex align-items-center justify-content-center w-100">
          تبرع الآن
        </span>
        <Button @click.stop="openShareDialog" class="p-button-secondary me-3 button-share" icon="pi pi-share-alt" data-cy="share-button" />
      </div>
    </template>
  </Card>
</template>

<script>
import ShareDialog from "@/components/layout/ShareDialog.vue";
import BaseSpinner from "@/components/layout/BaseSpinner.vue";

import JwtUtilService from "@/services/jwt.util.service";
import AmbassadorService from "@/services/ambassador.service";

import ToastService from "primevue/toastservice";
import { ToastSeverity } from "primevue/api";

export default {
  name: "case-card",
  components: { BaseSpinner, ShareDialog },
  data() {
    return {
      canDonate: JwtUtilService.getClientID()?.includes("doner") || !this.$store.getters.isAuthenticated,
      canShareTrackableLink: JwtUtilService.getClientID()?.includes("doner") && this.$store.getters.isAuthenticated,
      displayShareDialog: false,
      sharableLink: `${process.env.VUE_APP_FE_URL}/donate-case/${this.case_?.id}`,
      FEURL: process.env.VUE_APP_FE_URL,
      loading: false,
    };
  },
  props: {
    case_: {},
    close: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted() {
    this.addRemainingPeriod();
  },
  watch: {
    case_(val) {
      if (val) {
        this.addRemainingPeriod();
        this.sharableLink = `${process.env.VUE_APP_FE_URL}/donate-case/${val.id}`;
      }
    },
  },
  methods: {
    onCaseClick() {
      if (this.$props.case_.can_donate && this.canDonate) {
        this.$router.push({
          path: `/donate-case/${this.$props.case_.id}${this.close ? '?close=true' : ''}`,
          query: {
            close: this.close ? 'true' : 'false'
          }
        });
      }
    },
    isBrowserMobile() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        return true;
      } else {
        return false;
      }
    },
    openShareDialog() {
      if (this.canShareTrackableLink) {
        this.createLink();
      }
      this.displayShareDialog = true;
    },
    closeShareDialog() {
      this.displayShareDialog = false;
    },
    async createLink() {
      this.loading = true;
      await AmbassadorService.postCaseNumber({case: this.case_?.id}).then((response) => {
        const result = response.data.result;
        this.sharableLink = `${this.FEURL}/ambassador-link/${result.id}`;
        this.loading = false;
      });
    },
    copyLink() {
      navigator.clipboard.writeText(this.sharableLink);
      if(this.sharableLink) {
        this.$toast.add({severity: ToastSeverity.SUCCESS, detail: "تم نسخه بنجاح", life: 3000})
      }
    },
    addRemainingPeriod() {
      let caseEndDate = new Date(this.$props.case_?.published_on).setDate(new Date(this.$props.case_?.published_on).getDate() + this.$props.case_?.publish_duration);
      let remaining_period_in_days = Math.ceil((new Date(caseEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      this.$props.case_.remaining_period = remaining_period_in_days > 0 ? remaining_period_in_days : 0;
    }
  },
  computed: {
    calculatePercentage() {
      return Math.trunc((this.case_.collected_amount / this.case_.required_amount) * 100);
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
@import "@/styles/variables";
@import "@/styles/helpers";
@import "@/styles/abstracts/mixins";

.case-card-item {
  background-color: white;
  margin-bottom: 30px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: $box-shadow-case-card;

  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .condition-img {
    min-height: 150px;
    max-height: 150px;
    width: 100%;
    height: 180px;
    border-radius: 10px;
    object-fit: cover;
    vertical-align: middle;
  }

  .charity-image {
    top: 5px;
    left: 5px;
    &__hex {
      width: 56px;
      height: 64px;
      z-index: 1;
      opacity: .4;
    }
    &__charity {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      width: 40px;
      height: 40px;
      border-radius: $border-radius-default;
    }
  }

  .remaining-period {
    bottom: 10px;
    transform: translateX(-50%);
  }

  .share-tag {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    padding: 0.8rem 1.5rem;
    background-color: $color-primary;
    color: white;
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;
    cursor: pointer;
    top: 15px;
    right: -10px;
    transition: all .2s ease-in-out;
    &:hover {
      background-color: $color-primary-hover;
    }

    .whatsapp-icon,
    .facebook-icon,
    .twitter-icon {
      display: none;
    }

    /*.expanded {
      width: 140px;

      .share-icon {
        display: none;
      }

      .whatsapp-icon,
      .facebook-icon,
      .twitter-icon {
        display: block;
      }
    }*/
  }

  .remaining_amount_card {
    width: 90%;
    margin: auto;
    background-color: white;
    border-radius: 0 0 9px 9px;
    box-shadow: $box-shadow-tile;
    z-index: 10;
    top: 140px;
    right: 23px;
    overflow: hidden;
    &__details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 600;
      background-color: $color-gray-lighter;
      border-radius: 0 0 8px 8px;
    }
  }

  .condition-description {
    color: $color-font-lighter;
    font-size: 14px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .percentage-card {
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 0.5rem 1rem;
    text-align: right;
    direction: rtl;
    font-size: 14px;
    color: $color-complementary;

    h6 {
      color: #676767;
    }
  }

  .btn-donation {
    background-color: #1ab3ab;
    color: white;
    font-size: 15px;

    &:hover {
      background-color: #0D9488;
    }

    a {
      display: block;
      margin-bottom: 8px;
    }
  }

  a {
    color: white;
    text-decoration: none;
  }

  .progress {
    position: relative;
    display: flex;
    height: 16px !important;
    width: 100% !important;
    font-size: 0.75rem;
    border-radius: 1.25rem;
    background: #E0F6F6 !important;
    overflow: visible !important;

    &:hover .hint {
      display: block !important;
    }
  }

  .progress-bar {
    background: $color-gradient-primary;
    border-radius: $border-radius-big;
    box-shadow: $box-shadow-progressbar;
    transition: width 0.6s ease;
    padding: 0;
    &__percentage {
      font-size: 12px;
    }
  }

  .hint {
    display: none;
    color: #fff;
    font-size: 11px;
    font-weight: bold;
    position: absolute;
    bottom: 135%;
    background: #36beb6;
    padding: 2px 4px 0 3px;
    border-radius: 5px;
    box-shadow: 0 6px 18px 2px rgb(0 0 0 / 23%);
    margin-right: -29px;
    width: 35px;
    text-align: center;
  }
}
.details {
  padding: 0 30px;
  font-size: 14px;
  i {
    margin-left: 5px;
  }
}
.button-share {
  width: 60px !important;
  background-color: $color-gray-lighter !important;
  border-color: $color-gray-lighter !important;
  color: $color-complementary !important;
}
.cta {
  padding: 0 30px;
  border-top: 1px solid #ececec;
}
::v-deep(.p-card-header) {
  padding: 10px 10px 0;
}
::v-deep(.p-card-body) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding: 0 !important;
}
::v-deep(.p-card-content) {
  padding: 0 30px 0 !important;
}
::v-deep(.p-card-footer) {
  padding: 0  0 20px !important;
}

::v-deep(.close-btn) {
  justify-content: center;
  .p-button-label {
    flex: none !important;
    padding: 0 .5rem !important;
  }

  .p-button-icon {
    font-size: 1.2rem !important;
  }
}

.dir-rtl {
  direction: rtl;
}

.color-primary {
  color: $color-primary;
}

.h-50p {
  height: 50px;
}
</style>
