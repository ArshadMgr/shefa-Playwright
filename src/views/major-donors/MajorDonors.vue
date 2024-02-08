<template>
  <div class="major-donors mt-4">
    <HeadingPanel title="كبار المانحين" subtitle="        قائمة بكبار المانحين من المؤسسات والأفراد الذين تبرعوا من باب الخير والكرم."/>
    <section class="major-donors__card mt-4">
      <Card>
        <template #header>
          <Divider align="center">
            <img class="major-donors__medal" src="../../assets/images/major-donors/platinum.svg" alt="medal-platinum">
          </Divider>
        </template>
        <template #content>
          <div v-if="state.donors?.Platinum?.length > 0 && !state.loading" class="major-donors__donors">
            <div v-for="(donor, index) in state.donors.Platinum" class="donor">
              <div class="donor__place">{{index + 1}}</div>

              <div class="donor__content">
                <span class="donor__name">{{donor.display_name}}</span>
                <span class="donor__amount">{{donor.total_donation_amount}} ريال سعودي</span>
              </div>
            </div>
            <Button v-if="state.counters.Platinum > state.donors.Platinum.length" @click="fetchMoreDonors('Platinum')"
                    class="major-donors__show-more p-button p-button-outlined p-button-rounded p-button-primary bg-white px-4"
                    :label="!state.fetchingMore.Platinum ? 'عرض المزيد' : null"
                    :icon="state.fetchingMore.Platinum ? 'pi pi-spin pi-spinner' : null"
                    :style="{'pointer-events': state.loading ? 'none' : 'unset'}"/>
          </div>
          <BaseSpinner v-else-if="state.loading"/>
          <span v-else class="major-donors__empty-list text-center">
            لا يوجد متبرعين حاصلين على هذا الوسام بعد
          </span>
        </template>
      </Card>
    </section>
    <section class="major-donors__card mt-4">
      <Card>
        <template #header>
          <Divider align="center">
            <img class="major-donors__medal" src="../../assets/images/major-donors/diamond.svg" alt="medal-platinum">
          </Divider>
        </template>
        <template #content>
          <div v-if="state.donors?.Diamond?.length > 0 && !state.loading" class="major-donors__donors">
            <div v-for="(donor, index) in state.donors.Diamond" class="donor">
              <div class="donor__place">{{index + 1}}</div>

              <div class="donor__content">
                <span class="donor__name">{{donor.display_name}}</span>
                <span class="donor__amount">{{donor.total_donation_amount}} ريال سعودي</span>
              </div>
            </div>
            <Button v-if="state.counters.Diamond > state.donors.Diamond.length" @click="fetchMoreDonors('Diamond')"
                    class="major-donors__show-more p-button p-button-outlined p-button-rounded p-button-primary bg-white px-4"
                    :label="!state.fetchingMore.Diamond ? 'عرض المزيد' : null"
                    :icon="state.fetchingMore.Diamond ? 'pi pi-spin pi-spinner' : null"
                    :style="{'pointer-events': state.loading ? 'none' : 'unset'}"/>
          </div>
          <BaseSpinner v-else-if="state.loading"/>
          <span v-else class="major-donors__empty-list text-center">
            لا يوجد متبرعين حاصلين على هذا الوسام بعد
          </span>
        </template>
      </Card>
    </section>
    <section class="major-donors__card mt-4">
      <Card>
        <template #header>
          <Divider align="center">
            <img class="major-donors__medal" src="../../assets/images/major-donors/gold.svg" alt="medal-platinum">
          </Divider>
        </template>
        <template #content>
          <div v-if="state.donors?.Gold?.length > 0 && !state.loading" class="major-donors__donors">
            <div v-for="(donor, index) in state.donors.Gold" class="donor">
              <div class="donor__place">{{index + 1}}</div>

              <div class="donor__content">
                <span class="donor__name">{{donor.display_name}}</span>
                <span class="donor__amount">{{donor.total_donation_amount}} ريال سعودي</span>
              </div>
            </div>
            <Button v-if="state.counters.Gold > state.donors.Gold.length" @click="fetchMoreDonors('Gold')"
                    class="major-donors__show-more p-button p-button-outlined p-button-rounded p-button-primary bg-white px-4"
                    :label="!state.fetchingMore.Gold ? 'عرض المزيد' : null"
                    :icon="state.fetchingMore.Gold ? 'pi pi-spin pi-spinner' : null"
                    :style="{'pointer-events': state.loading ? 'none' : 'unset'}"/>
          </div>
          <BaseSpinner v-else-if="state.loading"/>
          <span v-else class="major-donors__empty-list text-center">
            لا يوجد متبرعين حاصلين على هذا الوسام بعد
          </span>
        </template>
      </Card>
    </section>
    <section class="major-donors__card mt-4">
      <Card>
        <template #header>
          <Divider align="center">
            <img class="major-donors__medal" src="../../assets/images/major-donors/silver.svg" alt="medal-platinum">
          </Divider>
        </template>
        <template #content>
          <div v-if="state.donors?.Silver?.length > 0 && !state.loading" class="major-donors__donors">
            <div v-for="(donor, index) in state.donors.Silver" class="donor">
              <div class="donor__place">{{index + 1}}</div>

              <div class="donor__content">
                <span class="donor__name">{{donor.display_name}}</span>
                <span class="donor__amount">{{donor.total_donation_amount}} ريال سعودي</span>
              </div>
            </div>
            <Button v-if="state.counters.Silver > state.donors.Silver.length" @click="fetchMoreDonors('Silver')"
                    class="major-donors__show-more p-button p-button-outlined p-button-rounded p-button-primary bg-white px-4"
                    :label="!state.fetchingMore.Silver ? 'عرض المزيد' : null"
                    :icon="state.fetchingMore.Silver ? 'pi pi-spin pi-spinner' : null"
                    :style="{'pointer-events': state.loading ? 'none' : 'unset'}"/>
          </div>
          <BaseSpinner v-else-if="state.loading"/>
          <span v-else class="major-donors__empty-list text-center">
            لا يوجد متبرعين حاصلين على هذا الوسام بعد
          </span>
        </template>
      </Card>
    </section>
    <section class="major-donors__card mt-4">
      <Card>
        <template #header>
          <Divider align="center">
            <img class="major-donors__medal" src="../../assets/images/major-donors/bronze.svg" alt="medal-platinum">
          </Divider>
        </template>
        <template #content>
          <div v-if="state.donors?.Bronze?.length > 0 && !state.loading" class="major-donors__donors">
            <div v-for="(donor, index) in state.donors.Bronze" class="donor">
              <div class="donor__place">{{index + 1}}</div>

              <div class="donor__content">
                <span class="donor__name">{{donor.display_name}}</span>
                <span class="donor__amount">{{donor.total_donation_amount}} ريال سعودي</span>
              </div>
            </div>
          </div>
          <BaseSpinner v-else-if="state.loading"/>
          <span v-else class="major-donors__empty-list text-center">
            لا يوجد متبرعين حاصلين على هذا الوسام بعد
          </span>
        </template>
      </Card>
    </section>
  </div>
</template>

<script setup>
import {onMounted, reactive} from "vue";
import BaseSpinner from "@/components/layout/BaseSpinner.vue";
import WalletService from "@/services/wallet.service";
import HeadingPanel from "@/components/layout/HeadingPanel";

const state = reactive({
  donors: null,
  loading: false,
  fetchingMore: {
    Platinum: false,
    Diamond: false,
    Gold: false,
    Silver: false,
  },
  limit: {
    Platinum: 10,
    Diamond: 10,
    Gold: 10,
    Silver: 10,
  },
  offset: {
    Platinum: 0,
    Diamond: 0,
    Gold: 0,
    Silver: 0,
  },
  counters: [],
})

const fetchDonors = async () => {
  state.loading = true;
  const { data } = await WalletService.getMajorDonors();
  state.donors = data.result.donors;
  state.counters = data.result.counters;
  state.loading = false;
}

const fetchMoreDonors = async (medal) => {
  state.fetchingMore[medal] = true;
  state.limit[medal] += 10;
  state.offset[medal] = state.limit[medal] - 10;
  const { data } = await WalletService.getMajorDonors(state.limit[medal], state.offset[medal]);
  state.donors[medal] = [...state.donors[medal], ...data.result.donors[medal]];
  state.fetchingMore[medal] = false;
}

onMounted( () => {
  fetchDonors();
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";

.major-donors {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 80px 135px;
  &__medal {
    max-width: 78px;
  }
  &__donors {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__empty-list {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 1.4rem;
    font-weight: 400;
    color: $color-complementary;
  }
  .donor {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding: 10px 0;
    border-radius: $border-radius-default;
    box-shadow: $box-shadow-tile;
    background-color: $color-background-light-2;
    &__content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 24px 0 64px;
    }
    &__amount {
      margin-right: 10px;
      font-weight: 600;
      color: $color-complementary;
    }
    &__place {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      border-left: 1px solid $color-primary-border;
      color: $color-primary-border;
    }
    &:not(:nth-child(1)) {
      margin-top: 18px;
    }
  }
  &__show-more {
    margin-top: 30px;
  }
  ::v-deep(.p-card) {
    background-color: white;
    box-shadow: $box-shadow-case-card;
    border-radius: $border-radius-default;
  }
  ::v-deep(.p-card-header) {
    padding: 16px 1.25rem;
  }
  ::v-deep(.p-card-content) {
    padding-top: 0;
  }
  ::v-deep(.p-divider) {
    margin: 0;
  }

  @include respond(xl) {
    padding: 0 30px 100px;
    .donor {
      &__content {
        padding: 0 24px;
      }
    }
  }
  @include respond(md) {
    padding: 0 15px 50px;
    .donor {
      &:not(:nth-child(1)) {
        margin-top: 10px;
      }
      &__content {
        padding: 0 10px;
        font-size: 14px;
      }
      &__place {
        padding: 0 20px;
        font-size: 16px;
      }
    }
  }
}
</style>

