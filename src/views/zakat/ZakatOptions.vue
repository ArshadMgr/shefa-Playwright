<template>
  <section class="zakat-page d-flex align-items-center justify-content-center">
    <Card class="zakat-page__container">
      <template #header>
        <span class="zakat-page__header d-block text-center mt-4" data-cy="zakat-options-header">الزكاة</span>
      </template>
      <template #content>
        <span class="zakat-page__subheader d-block text-center"
          >تمكنك خدمة الزكاة من حساب زكاتك وإخراجها</span
        >
        <div class="d-flex flex-column flex-sm-row align-items-center justify-content-center my-4">
          <RouterLink to="/zakat/donate" class="mx-3 my-4 my-sm-0">
            <div class="zakat-page__card">
              <div class="d-flex flex-column align-items-center justify-content-space-between">
                <i class="icon pi pi-heart mt-2"></i>
                <span class="mt-2 text-center">إخراج الزكاة</span>
              </div>
            </div>
          </RouterLink>
          <RouterLink to="/zakat/calculate" class="mx-3 my-4 my-sm-0">
            <div class="zakat-page__card">
              <div class="d-flex flex-column align-items-center justify-content-space-between">
                <i class="icon pi pi-calculator mt-2"></i>
                <span class="mt-2 text-center">حساب الزكاة</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </template>
    </Card>
  </section>
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import JwtUtilService from "@/services/jwt.util.service";
import {useHead} from "@vueuse/head";

useHead({
  title: 'الزكاة',
  meta: [
    {
      name: `description`,
      content: 'أتاحت منصة شفاء للمتبرع حاسبة الزكاة وذلك في حال رغبة المتبرع بحسبة زكاة ماله وذلك بإدخال المبلغ المراد التزكية عنه ثم تقوم المنصة بحساب مبلغ الزكاة ثم بعد ذلك يتمكن المتبرع من توكيل المنصة بالتصرف بزكاة ماله للحالات المرضية المستحقة للزكاة.',
    },
  ],
})

const router = useRouter();
const store = useStore();

const state = reactive({
  canDonate: JwtUtilService.getClientID()?.includes("doner") || !store.isAuthenticated,
})

onBeforeMount(() => {
  if(!state.canDonate) {
    router.push('/home');
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";
@import "@/styles/components/card";
.zakat-page {
  font-size: 20px;
  margin-bottom: 100px;
  &__container {
    width: 100%;
    max-width: 612px;
  }
  &__header {
    font-size: 24px;
    font-weight: bold;
    color: $color-font-black;
  }
  &__subheader {
    font-size: 20px;
  }
  &__card {
    width: 160px;
    height: 172px;
    padding: 30px;
    border-radius: $border-radius-default;
    box-shadow: $box-shadow-card-stronger;
    transition: $transition-basic;
    .p-card-content {
      padding: 0 !important;
    }
    &:hover {
      box-shadow: $box-shadow-primary;
      span {
        font-weight: bold;
      }
    }

  }
  .icon {
    font-size: 50px;
    color: $color-primary;
  }
  a {
    text-decoration: none;
    color: $color-font-dark;
  }

  @include respond('md') {
    &__container {
      width: 90%;
    }
  }
}
</style>
