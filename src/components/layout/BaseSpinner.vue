<template>
  <div :class="`text-center color-${color}`">
    <i class="pi pi-spin pi-spinner" :style="{fontSize: `${size}rem`}"></i>
  </div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    required: false,
    default: 'primary'
  },
  size: {
    type: Number,
    required: false,
    default: 2,
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/helpers";
</style>