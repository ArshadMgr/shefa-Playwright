<template>
  <section class="zakat-page d-flex align-items-center justify-content-center">
    <Card class="zakat-page__container">
      <template #header>
        <span class="zakat-page__header d-block text-center mt-4"
          >حساب الزكاة</span
        >
      </template>
      <template #content>
        <input class="base-input" type="text" onkeypress="return event.charCode >= 48 && event.charCode <= 57" v-model="state.enteredValue" v-on:keyup.enter="goToDonatePage" placeholder="أدخل المبلغ" v-focus/>
        <div
          class="d-flex flex-column align-items-center justify-content-center mt-4"
        >
          <span class="zakat-page__subheader mt-3">مبلغ الزكاة</span>
          <span class="zakat-page__calculated mt-3"><strong>{{ calculateZakat() }}</strong></span>
          <Button class="p-button p-button-primary p-button-rounded mt-3" label="إخراج الزكاة" style="width: 185px" @click="goToDonatePage" :disabled="!state.enteredValue"/>
          <span class="zakat-page__message mt-3"> يتم تقريب الأعداد الكسرية لأقرب عدد حقيقي</span>
        </div>
      </template>
    </Card>
  </section>
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue';
import { useRouter } from "vue-router";
import { useStore } from 'vuex'

import JwtUtilService from "@/services/jwt.util.service";

const router = useRouter();
const store = useStore();

const state = reactive({
    canDonate: JwtUtilService.getClientID()?.includes("doner") || !store.isAuthenticated,
    enteredValue: null,
})

const calculateZakat = () => {
  return Math.round((state.enteredValue / 40) * 100) / 100;
}

const roundUpZakat = () => {
  return Math.ceil(calculateZakat())
}

const goToDonatePage = () => {
  store.state.zakatCalculated = roundUpZakat();
  router.push('/zakat/donate');
}

const vFocus = {
  mounted: (el) => el.focus()
}

onBeforeMount(() => {
  if(!state.canDonate) {
    router.push('/home');
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/components/card";
@import "@/styles/components/input";
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
    font-size: 22px;
    color: $color-font-lighter;
  }
  &__calculated {
    font-size: 20px;
    color: $color-primary;
  }
}
</style>
