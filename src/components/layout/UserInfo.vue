<template>
  <div :class="['user-info', 'user-info--smaller', {'user-info--mobile': mobile}]">
    <div v-if="authenticated" class="d-flex align-items-center justify-content-between">
      <router-link v-if="isDonor" to="/admin-panel/statistics" class="ms-2">
        <img class="user-info__logo" src="@/assets/icons/user-circle-solid.svg" alt="user">
      </router-link>
      <div aria-haspopup="true"
           class="d-flex align-items-center justify-content-between"
           @click="toggle"
           aria-controls="overlay_menu"
           data-cy="user-info">
        <div class="user-info__name ms-2"><span v-if="!mobile">أهلا</span> {{ userName }}</div>
        <i class="user-info__icon pi pi-arrow-down"></i>
      </div>
      <Menu id="overlay_menu" ref="menu" :model="menuItems" :popup="true" />
    </div>
    <router-link class="d-lg-none" v-else-if="!authenticated && !state.isAdminLoginPage" to="/sign-in?tab=0">
      <div class="d-flex align-items-center justify-content-between">
        <img class="user-info__logo user-info__logo--unauthenticated" src="@/assets/icons/user-circle-solid.svg" alt="user">
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  authenticated: {
    type: Boolean,
    required: false,
    default: false,
  },
  isDonor: {
    type: Boolean,
    required: false,
    default: false,
  },
  menuItems: {
    type: Array,
    required: false,
    default: () => [],
  },
  userName: {
    type: String,
    required: false,
    default: "",
  },
  mobile: {
    type: Boolean,
    required: false,
    default: false,
  }
});

const state = reactive({
  isAdminLoginPage: false
});

const menu = ref(null);
const toggle = (event) => {
  menu.value.toggle(event);
};

watch(
  () => route.fullPath, (newVal) => {
    state.isAdminLoginPage = newVal?.includes('login/admin');
  }
);
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";

.user-info {
  cursor: pointer;
  &__name {
    color: #00837D;
  }
  &__avatar {
    width: 40px;
    height: 40px;
    padding: 8px 10px;
    color: white;
    background: #00837D;
    border-radius: 50%;
  }
  &__icon {
    font-size: 12px;
    color: $color-primary;
  }
  &--smaller {
    .user-info__name {
      font-size: 16px;
    }
    .user-info__avatar {
      width: 30px;
      height: 30px;
      font-size: 12px;
    }
    .user-info__icon {
      &--unauthenticated {
        margin-right: 5px;
      }
    }
    .user-info__logo {
      width: 35px;
      margin-bottom: 6px;
      &--unauthenticated {
        margin-bottom: 0;
        margin-left: 15px;
      }
    }
  }
  &--mobile {
    display: none;
  }
  @include respond('xl') {
    display: block;
    &__icon {
      font-size: 10px;
    }
    &--smaller {
      .user-info__name {
        font-size: 12px;
      }
      .user-info__logo {
        width: 25px;
        margin-bottom: 3px;
        &--unauthenticated {
          width: 30px;
          margin-left: 0;
        }
      }
    }
  }
}
</style>
