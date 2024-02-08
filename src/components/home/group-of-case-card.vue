<template>
    <Card class="card-board__item case-card-item d-flex flex-column">
      <template #header>
        <div class="position-relative">
          <img class="condition-img" :src="group.photo" alt="">
        </div>
      </template>
      <template #content class="flex-grow-1">
        <div class="mt-3">
          <div class="row w-100 m-0 pb-2">
            <div class="my-2 fw-bold fs-6 title">
              {{ group.title }}
            </div>
            <span class="fw-semibold condition-description mt-2">{{ group.story }}</span>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="cta d-flex justify-content-center align-items-end w-100 p-3">
          <router-link :to="'/cases-list?group=' + group.id" class="w-100">
            <Button class="p-button-primary w-100" label="عرض الحالات"/>
          </router-link>
        </div>
      </template>
    </Card>
</template>

<script>
export default {
  name: "group-of-case-card",
  data() {
    return {};
  },
  props: {
    group: {}
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/components/case-card";
</style>
