<template>
  <nav class="cases-navigation" data-cy="cases-navigation-bar">
    <div class="cases-navigation__items">
      <div class="cases-navigation__item cases-navigation__item--icon" :class="{ 'active active--filters': filtersOpened }" @click="toggleFilters" data-cy="case-filters"><i class="pi pi-sliders-h"/></div>
      <div v-for="item in navigationItems" class="cases-navigation__item" :class="{'active': state.activeItem === item.name}" @click="itemClicked(item.name)" :data-cy="item.name+'-tab'">{{item.label}}</div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, reactive, toRefs } from "vue";

const props = defineProps({
  navigationItems: {
    type: Object,
    required: true
  },
  filtersOpened: {
    type: Boolean,
    required: false,
    default: false
  }
})

const state = reactive({
  activeItem: null,
})

const emit = defineEmits(["itemClicked", "toggleFilters"]);
const { navigationItems } = toRefs(props);

onMounted(() => {
  itemClicked(navigationItems?.value[0]?.name);
})

const itemClicked = (name) => {
  state.activeItem = name;
  emit('itemClicked', name);
}
const toggleFilters = () => {
  if(state.activeItem !== 'cases') {
    emit('itemClicked', 'cases');
  }
  state.activeItem = 'cases';
  emit('toggleFilters');
}
</script>

<style lang="scss">
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";
.cases-navigation {
  width: 100%;
  margin: 75px auto 0 auto;
  border-bottom: 1px solid $color-primary-border;
  &__items {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    margin: auto;
    border: 1px solid $color-border-light;
    border-bottom: unset;
    border-radius: $border-radius-default  $border-radius-default 0 0;
    overflow: hidden;
  }
  &__item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 125px;
    padding: 20px;
    cursor: pointer;
    color: $color-font-lighter;
    font-weight: 600;
    transition: $transition-basic;
    overflow: hidden;
    i.pi {
      font-size: 24px;
      color: $color-primary;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      height: 5px;
      transform: translateY(5px);
      background-color: $color-primary;
      transition: $transition-basic;
    }

    &--icon {
      min-width: 60px;
    }
    &:hover {
      color: $color-primary;
      &::after {
        transform: translateY(0);
      }
    }
  }
  .active {
    background-color: rgba($color-primary, 0.2);
    color: $color-primary;
    pointer-events: none;
    &--filters {
      position: relative;
      pointer-events: unset;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 5px;
        width: 1px;
        height: 100%;
        background-color: $color-primary-border-light;
      }
    }
    &::after {
      transform: translateY(0);
    }
  }

  @include respond('lg') {
    max-width: 100%;
    margin-top: 50px;
    &__item {
      min-width: 96px;
      padding: 14px 10px;
      font-size: 14px;
      i.pi {
        font-size: 21px;
      }
    }
  }
  @include respond('md') {
    &__item {
      min-width: 60px;
      font-size: 12px;
      &--icon {
        min-width: 40px;
      }
      i.pi {
        font-size: 18px;
      }
    }
  }
}
</style>
