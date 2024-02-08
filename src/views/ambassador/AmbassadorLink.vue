<template>
  <section class="d-flex justify-content-center px-4 py-5">
    <BaseSpinner v-if="state.loading && !state.error "/>
    <span v-else>{{state.error}}</span>
  </section>
</template>

<script setup>
import BaseSpinner from "@/components/layout/BaseSpinner.vue";

import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';

import AmbassadorService from "@/services/ambassador.service";

const route = useRoute();
const router = useRouter();

const state = reactive({
  loading: false,
  error: '',
  link: '',
});

const getLinkParams = async () => {
  try {
    state.loading = true;
    const { data } = await AmbassadorService.getLink(route.params.id)
    state.link = `/donate-case/${data.result.case}?${data.result.params.name}=${data.result.params.value}`;
    router.push(state.link);
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  Promise.all([getLinkParams()]);
});
</script>
