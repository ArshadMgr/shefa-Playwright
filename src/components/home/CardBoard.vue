<template>
  <div class="card-board">
    <CampaignsAdditionalSection v-if="type === 'campaigns'" :showUpperMessage="state.items?.length" data-aos="fade" data-aos-duration="400"/>
    <div class="card-board__items" data-aos="fade-up" data-aos-duration="300">
      <CaseCard v-if="!type" :case_="item" v-for="item in state.items" />
      <CaseCard v-if="type === 'cases'" :case_="item" v-for="item in state.items" />
      <CaseCard v-else-if="type === 'markItClose'" close :case_="item" v-for="item in state.items" />
      <CampaignCard v-else-if="type === 'campaigns'" :campaign="item" v-for="item in state.items" @reportCampaign="reportCampaign(item.id)"/>
      <GroupOfCaseCard v-else-if="type === 'projects'" :group="item" v-for="item in state.items" />
      <WaqfCard v-else-if="type === 'endowments'" :waqf="item" v-for="item in state.items" />
      <CompletedCaseCard v-else-if="type === 'completed'" :case_="item" v-for="item in state.items" />
    </div>
    <span class="card-board__message d-flex justify-content-center align-items-center" v-if="!state.items?.length">لا يوجد حالات مطابقة لمعايير التصفيات المختارة</span>
    <div v-if="state.items?.length && linkButton && itemsFiltered && displayShowMore" class="d-flex justify-content-center mt-5 mx-auto card-board__button" data-cy="show-more-cases-btn">
      <Button @click="fetchMoreItems" class="p-button p-button-outlined p-button-rounded p-button-primary bg-white px-4"
              :label="!state.loading ? 'عرض المزيد' : null"
              :icon="state.loading ? 'pi pi-spin pi-spinner' : null"
              :style="{'pointer-events': state.loading ? 'none' : 'unset'}"
      />
    </div>
    <router-link v-else-if="state.items?.length && linkButton && displayShowMore" :to="state.linkToPage" class="d-flex justify-content-center mt-5 mx-auto card-board__button">
      <Button class="p-button p-button-outlined p-button-rounded p-button-primary bg-white px-4" label="عرض المزيد" />
    </router-link>
  </div>
</template>

<script setup>
import {reactive, watch, onMounted, computed} from "vue";
import CaseCard from "@/components/home/case-card";
import CampaignCard from "@/components/home/campaign-card";
import GroupOfCaseCard from "@/components/home/group-of-case-card";
import WaqfCard from "@/components/home/waqf-card";
import CompletedCaseCard from "@/components/home/completed-case-card";
import JwtUtilService from "@/services/jwt.util.service";
import CampaignsAdditionalSection from "@/components/campaigns/CampaignsAdditionalSection.vue";

const props = defineProps({
  type: {
    type: String,
    required: false
  },
  items: {
    type: Array,
    required: true
  },
  linkButton: {
    type: Boolean,
    required: false,
    default: false
  },
  itemsFiltered: {
    type: Boolean,
    required: false,
    default: false
  },
  showMoreItems: {
    type: Array,
    required: false,
    default: []
  },
  totalItemsCount: {
    type: Number,
    required: false,
    default: 0,
  }
})

const state = reactive({
  linkToPage: '/cases-list',
  items: Object.assign([], props.items),
  loading: false,
  isDonor: JwtUtilService.getClientID()?.includes("doner"),
})

watch(() => props.items, (updatedArray) => {
  state.items = updatedArray;
});
watch(() => props.showMoreItems, (updatedArray) => {
  state.items = state.items.concat(updatedArray);
  state.loading = false;
});

const displayShowMore = computed(() => {
  return props.totalItemsCount > 9 && state.items.length !== props.totalItemsCount;
})
const emit = defineEmits(["reportCampaign"]);

const reportCampaign = (id) => {
  emit("reportCampaign", id)
}

const fetchMoreItems = () => {
  emit("fetchMoreItems")
  state.loading = true;
}

const link = () => {
  if(props.type === 'cases') {
    state.linkToPage = '/cases-list';
  } else if(props.type === 'campaigns') {
    state.linkToPage = '/campaign-list';
  } else if(props.type === 'markItClose') {
    state.linkToPage = '/mark-close';
  } else if(props.type === 'endowments') {
    state.linkToPage = '/waqf-list';
  } else if(props.type === 'completed') {
    state.linkToPage = '/completed-cases';
  } else if(props.type === 'projects') {
    state.linkToPage = '/projects';
  }
}

onMounted(() => {
  if(props.type) {
    link();
  }
})
</script>

<style lang="scss">
@import "@/styles/abstracts/mixins";
@import "@/styles/variables";
@import "@/styles/helpers";
.card-board {

  &__items {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1125px;
    margin: 0 auto;
  }
  &__item {
    flex: 0 0 calc(33% - 50px);
    min-width: 300px;
    max-width: 320px;
    margin-right: 25px;
    margin-left: 25px;
    margin-bottom: 30px !important;
  }
  &__message {
    font-size: 20px;
    color: $color-font-lighter;
  }
  &__button {
    width: fit-content;
  }
  .case-card-item {
    margin-bottom: 0;
  }

  @include respond('xl') {
    &__items {
      margin: 0;
    }
    &__item {
      flex: 0 0 calc(38% - 20px);
    }
  }
  @include respond('lg') {
    &__item {
      flex: 0 0 calc(45% - 20px);
    }
  }
}
</style>
