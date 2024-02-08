<template>
  <div class="donate__card donate__view col-md-6 section">
    <div class="case-view inner-section">
      <h1 class="case-view__heading fw-bolder" data-cy="story-title">{{ payload.story_title || payload.full_title || payload.name}}</h1>
      <div class="case-view__image-wrapper position-relative">
        <img class="case-view__image w-100" :src="payload.image" alt="case image" data-cy="case-image"
             v-if="type === 'campaign' && payload.image">
        <img class="case-view__image w-100" src="@/assets/images/test-image.png" alt="case image"
             v-else-if="type === 'campaign' && !payload.image" data-cy="case-image">
        <img class="case-view__image w-100" :src="payload.image_path" alt="case image"
             v-else-if="type === 'waqf' && payload.image_path" data-cy="case-image">
        <img class="case-view__image w-100" :src="payload.urls?.case_image[0]" alt="case image"
             v-else-if="payload.urls?.case_image" data-cy="case-image">
        <div v-if="payload.urls?.charity_image" class="charity-image position-absolute">
          <img class="charity-image__hex" src="@/assets/icons/hex.svg" alt="hex">
          <img class="charity-image__charity position-absolute" :src="payload.urls?.charity_image" data-cy="charity-image" alt="صورة الجمعية">
        </div>
        <div :class="['share-tag position-absolute', { 'expanded': payload.isExpanded }]"
             @click="payload.isExpanded = !payload.isExpanded">
          <i class="pi pi-share-alt mx-2 share-icon"></i>
          <a :href="whatsappLink" data-cy="whatsapp-share-link">
            <i class="pi pi-whatsapp fs-5 mx-2 whatsapp-icon" />
          </a>
          <a :href="facebookLink" data-cy="fb-share-link">
            <i class="pi pi-facebook fs-5 mx-2 facebook-icon" />
          </a>
          <a :href="twitterLink" data-cy="twitter-share-link">
            <i class="pi pi-twitter fs-5 mx-2 twitter-icon" />
          </a>
        </div>
      </div>
      <div class="case-view__details details">
        <div class="details__data">
          <div v-if="payload.id" class="details__detail d-flex justify-content-center align-items-center">
            <span v-if="type === 'campaign'" class="accent fw-lighter">رقم الحملة </span>
            <span v-else-if="type === 'waqf'" class="accent fw-lighter">رقم الوقف</span>
            <span v-else class="accent fw-lighter">رقم الحالة </span>
            <span class="fw-semibold mx-1" data-cy="case-id">{{ payload.id }}#</span>
          </div>
          <div v-if="payload.area_name" class="details__detail d-flex justify-content-center align-items-center" :class="{'text-center': type === 'campaign'}">
            <i class="pi pi-map-marker accent mx-2" v-if="type !== 'campaign'"></i>
            <span class="fw-semibold" data-cy="area-name">{{ payload.area_name || state.campaignTypes[payload?.typ] }}</span>
          </div>
          <div v-if="payload.specialty_name" class="details__detail d-flex justify-content-center align-items-center">
            <i class="speciality-icon mx-2"></i>
            <span class="fw-semibold" data-cy="speciality-name">{{ payload.specialty_name }}</span>
          </div>
          <div v-if="payload.interval" class="details__detail d-flex justify-content-center align-items-center">
            <i class="pi pi-clock color-primary--lighter mx-2"></i>
            <span class="fw-semibold" data-cy="payload-interval">{{ payload.interval }} أيام</span>
          </div>
        </div>
        <ProgressBar class="details__progressbar" :value="payload.amountPercentage" :showValue="true" data-cy="progress-bar" />
        <div v-if="type === 'campaign'" class="details__money">
          <div>
            <div class="accent--complementary">تم جمعه</div>
            <div class="details__currency fw-semibold" data-cy="target-amount">{{ Math.ceil(payload.balance).toLocaleString("en-US") + 'ريال' }}</div>
          </div>
          <div>
            <div class="accent--complementary">المطلوب</div>
            <div class="details__currency fw-semibold" data-cy="target-amount">{{ Math.ceil(payload.target).toLocaleString("en-US") + ' ريال' }}</div>
          </div>
        </div>
        <div v-else-if="type === 'waqf'" class="details__money">
          <div>
            <div class="accent--complementary">تم جمعه</div>
            <div class="details__currency fw-semibold" data-cy="collected-amount">{{ Math.ceil(payload.balance).toLocaleString("en-US") + ' ريال' }}</div>
          </div>
          <div>
            <div class="accent--complementary">المطلوب</div>
            <div class="details__currency fw-semibold" data-cy="remaining-amount">{{ Math.ceil(payload.target).toLocaleString("en-US") + ' ريال' }}</div>
          </div>
        </div>
        <div v-else class="details__money">
          <div>
            <div class="accent--complementary">تم جمعه</div>
            <div class="details__currency fw-semibold" data-cy="collected-amount">{{ Math.ceil(payload.collected_amount).toLocaleString("en-US") + ' ريال' }}</div>
          </div>
          <div>
            <div class="accent--complementary">المتبقي</div>
            <div class="details__currency fw-semibold" data-cy="remaining-amount">{{ Math.ceil(payload.remainingAmount).toLocaleString("en-US") + ' ريال' }}</div>
          </div>
        </div>
      </div>
      <div class="case-view__story">
        {{ payload.story || payload.description }}
      </div>
      <div class="case-view__numbers numbers">
        <div class="numbers__card mb-3 mb-lg-0">
          <img class="numbers__icon" src="@/assets/icons/icon-mostafeed-blue.svg" alt="mostafeed">
          <div class="accent--complementary">عدد الزيارات</div>
          <div class="color-primary fw-bold fs-4" data-cy="number-of-visits">
            {{ payload.number_of_visits || 0 }}
          </div>
        </div>
        <div class="numbers__card mb-3 mb-lg-0">
          <img class="numbers__icon" src="@/assets/icons/icon-donations-blue.svg" alt="mostafeed">
          <div class="accent--complementary">عدد المتبرعين</div>
          <div class="color-primary fw-bold fs-4" data-cy="number-of-donors">
            {{ payload.number_of_donors || 0}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import ProgressBar from "primevue/progressbar";
import {CAMPAIGN_TYPES} from "@/services/campaigns.service";
import AmbassadorService from "@/services/ambassador.service";
import JwtUtilService from "@/services/jwt.util.service";

const route = useRoute();
const store = useStore();

const props = defineProps({
  payload: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: false
  }
})
const state = reactive({
  sharableLink: `${process.env.VUE_APP_FE_URL}/donate-campaign/${route.params.case_id}`,
  canShareTrackableLink: JwtUtilService.getClientID()?.includes("doner") && store.getters.isAuthenticated,
  FEURL: process.env.VUE_APP_FE_URL,
  campaignTypes: CAMPAIGN_TYPES,
})

const createLink = async () => {
  if (props.type === 'campaign') {
    state.sharableLink = `${state.FEURL}/donate-campaign/${route.params.campaign_id}`;
  } else if (props.type === 'waqf') {
    state.sharableLink = `${state.FEURL}/donate-waqf/${route.params.waqf_id}`;
  } else if (props.type === 'case') {
    state.sharableLink = `${state.FEURL}/donate-case/${route.params.case_id}`;
  }
  if (state.canShareTrackableLink && props.type !== 'campaign' && props.type !== 'waqf') {
    await AmbassadorService.postCaseNumber({case: props.payload.id}).then((response) => {
      const result = response.data.result;
      state.sharableLink = `${state.FEURL}/ambassador-link/${result.id}`;
    });
  }
};
const facebookLink = computed( () => {
  return `https://www.facebook.com/sharer.php?u=${state.sharableLink}`
});
const twitterLink = computed(() => {
  return `https://twitter.com/share?url=${state.sharableLink}`;
});
const whatsappLink = computed(() => {
  return `https://wa.me/?text=${state.sharableLink}`;
});

onMounted(() => {
  createLink();
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";

.donate {
  &__card {
    max-width: 612px;
    border-radius: $border-radius-default;
    box-shadow: $box-shadow-card-stronger;
    background-color: white;
    margin: 0 8px;
    padding: 23px 24px 50px;
  }
}
.case-view {
  &__heading {
    font-size: 24px;
    margin: 0 0 36px;
  }
  &__image {
    height: 222px;
    border: 1px solid #E9E9E9;
    border-radius: $border-radius-default;
    box-shadow: $box-shadow-tile;
    object-fit: cover;
  }
  &__details {
    width: 100%;
    margin-top: 14px;
    padding: 20px 11px 15px;
    border: 1px solid #ececec;
    border-radius: $border-radius-default;
    .details {
      &__data {
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      &__detail {
        padding-left: 6px;
      }
      &__progressbar {
        margin-top: 26px;
      }
      &__money {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-top: 13px;
      }
    }
  }
  &__story {
    margin-top: 20px;
    font-size: 21px;
    color: $color-font-lighter;
    word-wrap: break-word;
  }
  &__numbers {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 12px;
    .numbers {
      &__card {
        display: flex;
        flex-flow: column;
        align-items: center;
        padding: 15px;
        flex-grow: 1;
        border-radius: $border-radius-default;
        box-shadow: $box-shadow-tile;
        &:nth-of-type(1) {
          margin-left: 16px;
        }
        &:last-child {
          margin-right: 16px;
        }
      }
      &__icon {
        width: 32px;
        height: 32px;
      }
    }
  }
}
.charity-image {
  top: 15px;
  left: 17px;
  width: fit-content;
  &__hex {
    width: 79px;
    height: 91px;
    z-index: 1;
    opacity: .4;
  }
  &__charity {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: 60px;
    height: 60px;
    border-radius: $border-radius-default;
  }
}
.accent {
  color: $color-primary-lighter;
  &--complementary {
    color: $color-complementary;
  }
}

.share-tag {
  right: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  padding: 0.8rem 1.5rem;
  background-color: #14B8A6;
  color: white;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
  cursor: pointer;
  bottom: 1rem;
  transition: all .6s ease-in-out;

  .whatsapp-icon,
  .facebook-icon,
  .twitter-icon {
    display: none;
  }

  &.expanded {
    width: 140px;

    .share-icon {
      display: none;
    }

    .whatsapp-icon,
    .facebook-icon,
    .twitter-icon {
      display: block;
    }
  }
}

.color-primary {
  color: $color-primary;
}
a {
  color: white;
}
::v-deep(.p-progressbar) {
  background: #E7F7F7;
  border-radius: $border-radius-big;
}
::v-deep(.p-progressbar .p-progressbar-value) {
  background: $color-gradient-primary;
  border-radius: $border-radius-big;
  box-shadow: $box-shadow-progressbar;
}

@include respond('lg') {
  .donate {
    &__card {
      width: 100%;
    }
  }
  .charity-image {
    top: 10px;
    left: 12px;
    &__hex {
      width: 56px;
      height: 64px;
    }
    &__charity {
      width: 40px;
      height: 40px;
    }
  }
}
@include respond('md') {
  .donate {
    &__card {
      padding: 11px 12px 25px;
    }
  }
  .case-view {
    font-size: 14px;
    &__heading {
      margin: 0 0 20px;
    }
    &__image {
      height: 190px;
    }
    &__details {
      .details {
        &__progressbar {
          margin-top: 10px;
        }
      }
    }
    &__story {
      font-size: 16px;
    }
    &__numbers {
      .numbers {
        &__card {
          padding: 6px;
          &:nth-of-type(1) {
            margin-left: 6px;
          }
          &:last-child {
            margin-right: 6px;
          }
        }
      }
    }
  }
}
</style>
