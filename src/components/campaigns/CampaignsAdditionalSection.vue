<template>
  <section class="campaigns-top mb-4 d-flex align-items-center flex-column">
    <div class="campaigns-top__icon-wrapper d-flex flex-column align-items-center">
      <img src="@/assets/icons/magaphone.svg" class="campaigns-top__icon pi pi-megaphone" alt="megaphone" />
      <span class="campaigns-top__icon-label mt-2">أنشئ حملتك</span>

    </div>
    <h2 class="campaigns-top__heading mt-3 mt-xl-5 color-primary text-center">بادر في إنشاء حملتك الخاصة وشاركها مع من تحب  لتصل تبرعاتكم للمرضى المحتاجين</h2>
    <router-link v-if="state.isDonor" :to="'/admin-panel/campaigns/create'" class="mt-4">
      <Button class="p-button p-button-primary p-button-rounded justify-content-cente 4r" label="أنشئ حملتك" style="width: 185px; height: 50px"  data-cy='create-companign-btn' />
    </router-link>
    <router-link v-else :to="'/sign-in?tab=0'" class="mt-4">
      <Button class="p-button p-button-primary p-button-rounded justify-content-cente 4r" label="أنشئ حملتك" style="width: 185px; height: 50px"  data-cy='create-companign-btn'/>
    </router-link>
    <span class="campaigns-top__message mt-2 mt-xl-4" v-if="props.showUpperMessage">أكثر الحملات زيارة</span>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import JwtUtilService from "@/services/jwt.util.service";

const props = defineProps({
  showUpperMessage: {
    type: Boolean,
    required: false,
    default: true
  }
})

const state = reactive({
  isDonor: JwtUtilService.getClientID()?.includes("doner"),
});
</script>

<style lang="scss" scoped>
@import "@/styles/abstracts/mixins";
@import "@/styles/variables";
@import "@/styles/helpers";

.campaigns-top {
  max-width: 1060px;
  margin: 0 auto;
  &__icon-label {
    font-size: 20px;
    color: $color-font-lighter;
  }
  &__icon {
    max-width: 120px;
  }
  &__heading {
    font-weight: bolder;
  }
  &__message {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    font-size: 30px;
    color: $color-font-darker;
    font-weight: bolder;
  }

  @include respond('lg') {
    &__icon {
      max-width: 100px;
    }
    &__message {
      font-size: 25px;
    }
  }
  @include respond('sm') {
    &__heading {
      font-size: 20px;
    }
    &__icon {
      max-width: 80px;
    }
    &__message {
      font-size: 18px;
    }
  }
}
</style>
