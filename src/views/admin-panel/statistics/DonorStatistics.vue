<template>
  <div class="sections-container d-flex row mt-lg-5 mt-lg-0">
    <div class="section col-12 col-md-6">
      <div class="content pt-3 pb-5 px-3 bg-white rounded-3 d-flex flex-column align-items-center d-lg-block">
        <div class="tag p-3 rounded-3 d-flex">
          <div class="icon-my-donations"></div>
          <span class="fw-bold fs-4">تبرعاتي</span>
        </div>
        <div class="d-flex justify-content-between px-4 flex-column flex-lg-row">
          <div class="mb-4 mb-lg-0">
            <div class="number fs-3 fw-bold">
              {{ this.statisticsData?.donations?.no_of_donations || 0 }}
            </div>
            <div class="text fs-5"> عدد مرات التبرع</div>
          </div>
          <div>
            <div class="number fs-3 fw-bold">
              <span>{{ Math.ceil(this.statisticsData?.donations?.sum_of_donations).toLocaleString("en-US") || 0 }}</span>
              <span> ر.س </span>
            </div>
            <div class="text fs-5"> مبلغ التبرعات</div>
          </div>
        </div>
      </div>
    </div>
    <div class="section col-12 col-md-6">
      <div class="content pt-3 pb-5 px-3 bg-white rounded-3 d-flex flex-column align-items-center d-lg-block">
        <div class="tag p-3 rounded-3 d-flex">
          <div class="icon-ambassador"></div>
          <span class="fw-bold fs-4">سفير شفاء</span>
        </div>
        <div class="d-flex justify-content-between px-4 flex-column flex-lg-row">
          <div class="mb-4 mb-lg-0">
            <div class="number fs-3 fw-bold">
              {{ this.statisticsData?.ambassador?.no_of_published_cases || 0 }}
            </div>
            <div class="text fs-5"> عدد الحالات المنشورة</div>
          </div>
          <div>
            <div class="number fs-3 fw-bold">
              <span>{{ Math.ceil(this.statisticsData?.ambassador?.sum_of_donations_ambassador).toLocaleString("en-US") || 0 }}</span>
              <span> ر.س </span>
            </div>
            <div class="text fs-5"> مبلغ التبرعات</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="sections-container d-flex row">
    <div class="section col-12 col-md-6">
      <div class="content pt-3 pb-5 px-3 bg-white rounded-3 d-flex flex-column align-items-center d-lg-block">
        <div class="tag p-3 rounded-3 d-flex">
          <div class="icon-campaign"></div>
          <span class="fw-bold fs-4">حملاتي</span>
        </div>
        <div class="d-flex justify-content-between px-4 flex-column flex-lg-row">
          <div class="mb-4 mb-lg-0">
            <div class="number fs-3 fw-bold">
              {{ this.statisticsData?.campaigns?.no_of_campaigns || 0}}
            </div>
            <div class="text fs-5"> عدد الحملات</div>
          </div>
          <div>
            <div class="number fs-3 fw-bold">
              <span>{{ Math.ceil(this.statisticsData?.campaigns?.sum_of_campaign_donations).toLocaleString("en-US") || 0 }}</span>
              <span> ر.س </span>
            </div>
            <div class="text fs-5"> مبلغ التبرعات للحملات</div>
          </div>
        </div>
      </div>
    </div>
    <div class="section col-12 col-md-6">
      <div class="content content--medals pt-3 pb-5 px-3 bg-white rounded-3 d-flex flex-column align-items-center d-lg-block">
        <i class="pi pi-info-circle info-button" @click="showDialog" />
        <div class="tag p-3 rounded-3 d-flex">
          <div class="icon-medal"></div>
          <span class="fw-bold fs-4">وسامي</span>
        </div>
        <div v-if="this.medals?.current_medal?.name !== 'Platinum'" class="medal-progress">
          <div class="medal-progress__wrapper">
            <img v-if="this.medals?.current_medal?.name" :src="getImgUrl(this.medals?.current_medal?.name.toLowerCase())" :alt="this.medals?.current_medal?.name.toLowerCase()" class="medal-progress__current-medal">
            <span v-else>{{this.medals?.current_medal?.label}}</span>
            <div class="medal-progress__progress-wrapper">
              <div class="medal-progress__collected-amount-wrapper" :class="tooltipClasses" :style="{'right': percentageOfRange + '%' }">
                <span class="medal-progress__collected-amount" ref="collectedAmount">{{Math.ceil(progressValue).toLocaleString("en-US") + ' ر.س'}}</span>
              </div>
              <ProgressBar :value="percentageOfRange"> {{ percentageOfRange >= 10 ? (percentageOfRange + '%')  : '' }} </ProgressBar>
            </div>
            <img :src="getImgUrl(this.medals?.next_medal?.name.toLowerCase())" :alt="this.medals?.next_medal?.name.toLowerCase()" class="medal-progress__next-medal">
          </div>
          <div class="remaining-amount">
            <span class="remaining-amount__text">المتبقي للوسام التالي</span>
            <span class="remaining-amount__amount">{{ this.medals?.current_medal?.name ? Math.ceil(remainingAmount).toLocaleString("en-US") : 1 }} ر.س</span>
          </div>
        </div>
        <div v-else class="medal-progress medal-progress--final-medal">
          <img src="../../../assets/images/major-donors/platinum.svg" alt="platinum" >
          <div class="remaining-amount">
            <span class="remaining-amount__text">أنت متبرع بلاتيني!</span>
          </div>
        </div>
      </div>
    </div>
    <Dialog
        v-model:visible="displayDialog"
        :modal="true"
        :draggable="false"
        :closable="true"
        :dismissableMask="true"
        header="تصنيف الأوسمة لكبار المانحين"
        :breakpoints="{'960px': '600px', '640px': '91vw'}" :style="{width: '50vw'}"
    >
      <div class="medals">
        <div class="medal">
          <span class="medal__text d-flex"><span> ر.س وأكثر</span><span  class="mx-1"> 1,000,000</span></span>
          <img src="../../../assets/images/major-donors/platinum.svg" alt="platinum" class="medal__image">
        </div>
        <div class="medal">
          <span class="medal__text">بين 100,000 - 999,999 ر.س</span>
          <img src="../../../assets/images/major-donors/diamond.svg" alt="diamond" class="medal__image">
        </div>
        <div class="medal">
          <span class="medal__text">بين 10,000 - 99,999 ر.س</span>
          <img src="../../../assets/images/major-donors/gold.svg" alt="gold" class="medal__image">
        </div>
        <div class="medal">
          <span class="medal__text">بين 1,000 - 9,999 ر.س</span>
          <img src="../../../assets/images/major-donors/silver.svg" alt="silver" class="medal__image">
        </div>
        <div class="medal">
          <span class="medal__text">بين 1 - 999 ر.س</span>
          <img src="../../../assets/images/major-donors/bronze.svg" alt="bronze" class="medal__image">
        </div>
        <Button @click="closeDialog" class="medals__button p-button p-button-secondary p-button-rounded mt-4" label="إغلاق"/>
      </div>
    </Dialog>
    <Dialog
        v-model:visible="isMedalAchieved"
        :modal="true"
        :draggable="false"
        :closable="true"
        :dismissableMask="false"
        :breakpoints="{'960px': '600px', '640px': '91vw'}" :style="{width: '50vw'}"
    >
      <div class="achievement">
        <h5 v-if="this.medals?.current_medal?.name === 'Bronze'" class="color-primary"><strong>كتب الله أجرك نبارك انتقالك الى وسام</strong></h5>
        <h5 v-else class="color-primary"><strong><span>كتب الله أجرك نبارك انتقالك من الوسام </span> {{previousMedalInArabic}} <span> الى الوسام</span></strong></h5>
        <img :src="getImgUrl(this.medals?.current_medal?.name.toLowerCase())" :alt="this.medals?.current_medal?.name.toLowerCase()" class="achievement__medal">
        <Button @click="closeAchievement" class="medals__button p-button p-button-secondary p-button-rounded mt-4" label="إغلاق"/>
      </div>
    </Dialog>
  </div>
</template>

<script>
import AdminPanelService from "@/services/admin-panel.service";
import ProgressBar from 'primevue/progressbar';
export default {
  name: "DonorStatistics",
  components: {
    ProgressBar
  },
  data() {
    return {
      statisticsData: {},
      displayDialog: false,
      medals: null,
      tooltipPosition: 'dynamic',
      percentage: 0,
      isMedalAchieved: false,
    }
  },
  methods: {
    showDialog() {
      this.displayDialog = true;
    },
    closeDialog() {
      this.displayDialog = false;
    },
    closeAchievement() {
      this.isMedalAchieved = false;
    },
    getImgUrl(img) {
      if(!img) {
        return null;
      }
      else {
        let images = require.context('../../../assets/images/major-donors/', false, /\.svg$/)
        return images('./' + img + ".svg")
      }
    },
    setPercentage() {
      this.percentage = this.medals?.total_donation_amount ?
          (Math.floor((this.medals?.total_donation_amount / (this.medals?.current_medal?.threshold?.max + 1)) * 100) > 100
              ? 100
              : Math.floor((this.medals?.total_donation_amount / (this.medals?.current_medal?.threshold?.max + 1)) * 100))
          : 0;
    },
    checkTooltipPosition() {
      if (this.percentage <= 10) {
        this.tooltipPosition = 'right';
      } else if (this.percentage >= 90) {
        this.tooltipPosition = 'left';
      } else {
        this.tooltipPosition = 'dynamic';
      }
    },
  },
  computed: {
    percentageOfRange() {
      if(!this.medals?.current_medal?.name) {
        return 0;
      } else {
        return this.percentage;
      }
    },
    progressValue() {
      return this.statisticsData?.donations?.sum_of_donations ? this.statisticsData?.donations?.sum_of_donations : 0;
    },
    remainingAmount() {
      if(!this.medals?.current_medal?.name) {
        return 0;
      } else {
        return (this.medals?.current_medal?.threshold?.max - this.medals?.total_donation_amount) + 1;
      }
    },
    previousMedalInArabic() {
      if(!this.medals?.current_medal?.name) {
        return null;
      } else {
        return this.medals?.current_medal?.name.toLowerCase() === 'platinum' ? 'الماسي'
            : this.medals?.current_medal?.name.toLowerCase() === 'diamond' ? 'الذهبي'
            : this.medals?.current_medal?.name.toLowerCase() === 'gold' ? 'الفضي'
            : this.medals?.current_medal?.name.toLowerCase() === 'silver' ? 'البرونزي'
            : null;
      }
    },
    tooltipClasses() {
      return {
        'tooltip-position--left': this.tooltipPosition === 'left',
        'tooltip-position--right': this.tooltipPosition === 'right',
      }
    }
  },
  async beforeMount() {
    await AdminPanelService.getDonorStatistics()
        .then(({ data: { result } }) => {
          this.statisticsData = result;
          this.medals = result.medals;
          this.isMedalAchieved = result.is_medal_achieved ? result.is_medal_achieved : false;
          this.setPercentage();
          this.checkTooltipPosition();
        });
  },
};
</script>

<style lang="scss" scoped>

@import "@/styles/variables";
@import "@/styles/helpers";
@import "@/styles/abstracts/mixins";

.sections-container {
  .section {
    margin: 2rem 0 1.5rem;

    .content {
      box-shadow: 0 0 4px #3F3F3F1A;
      position: relative;
      &--medals {
        padding-bottom: 30px !important;
      }
    }

    .tag {
      position: relative;
      top: -40px;
      max-width: 220px;
      color: #12B2AA;
      background-color: #E7F7F7;

    }

    .text {
      color: $color-font-darker;
    }

    .info-button {
      position: absolute;
      top: 20px;
      left: 20px;
      color: $color-primary;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
}

.number {
  color: #12B2AA;
}

div[class*="icon-"] {
  width: 35px;
  aspect-ratio: 1;
  background-repeat: no-repeat;
  margin: 0 .5rem;
}

.icon-campaign {
  background: url("../../../assets/icons/icon-my-donations.svg");
}

.icon-ambassador {
  background: url("../../../assets/icons/ambassador-icon.svg");
}

.icon-my-donations {
  background: url("../../../assets/icons/icon-calculator.svg");
}

.icon-medal {
  background: url("../../../assets/icons/icon-medal.svg");
}
.medals {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  padding: 10px 110px 0;
}
.medal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
  &:not(:last-child) {
    border-bottom: 1px solid $color-border-light;
  }
  .medal__text {
    font-size: 1.125rem;
    color: $color-font-darker;
  }
  &__image {
    width: 62px;
  }
}
.medal-progress {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: end;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-align: center;
  }
  &__current-medal {
    width: 69px;
  }
  &__next-medal {
    width: 48px;
  }
  &__progress-wrapper {
    display: flex;
    align-items: center;
    height: 80px;
    position: relative;
    width: 71%;
  }
  &__collected-amount-wrapper {
    position: absolute;
    top: 0;
    right: 50%;
    transform: translateX(50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    &::before {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: 10px;
      background-color: $color-primary;
    }
  }
  &__collected-amount {
    padding: 3px 15px;
    font-size: 12px;
    font-weight: 400;
    border-radius: $border-radius-big;
    background-color: $color-primary;
    color: white;
  }
  .tooltip-position {
    &--left {
      .medal-progress__collected-amount {
        margin-left: 35px;
      }
    }
    &--right {
      .medal-progress__collected-amount {
        margin-right: 35px;
      }
    }
  }
  .remaining-amount {
    margin-top: 10px;
    font-size: 12px;
    color: $color-font-lighter;
    &__amount {
      color: $color-font-dark;
      margin-right: 5px;
    }
  }

  &--final-medal {
    align-items: center;
    img {
      width: 50%;
    }
    .remaining-amount {
      font-size: 16px;
    }
  }
}
.achievement {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
  &__medal {
    width: 200px;
    padding: 30px 0;
  }
}
::v-deep(.p-button-secondary) {
  width: 182px;
  font-size: 18px;
  background-color: $color-secondary;
  border-color: $color-secondary;
  color: $color-font-dark;
}
::v-deep(.p-button.p-button-secondary:enabled:hover) {
  background-color: $color-secondary-hover;
  border-color: $color-secondary-hover;
  color: $color-font-dark;
}
::v-deep(.p-progressbar) {
  width: 100%;
  height: 12px;
  border-radius: 0;
}
::v-deep(.p-progressbar .p-progressbar-value) {
  background: $color-gradient-primary;
  font-size: 10px;
  box-shadow: $box-shadow-progressbar;
}
::v-deep(.p-progressbar .p-progressbar-label) {
  line-height: unset;
}

@include respond(xl) {
  .medals {
    padding: 10px 0 0;
  }
  .medal-progress {
    max-width: 500px;
    &__progress-wrapper {
      width: 77%;
    }
  }
}
@include respond(md) {
  .medal-progress {
    &__current-medal {
      width: 70px;
    }
    &__next-medal {
      width: 49px;
    }
  }
  .remaining-amount {
    margin: auto;
  }
}
@include respond(sm) {
  .medal-progress {
    &__progress-wrapper {
      width: 65%;
    }
  }
}
@include respond(xs) {
  .medal-progress {
    &__progress-wrapper {
      width: 59%;
    }
  }
}
</style>