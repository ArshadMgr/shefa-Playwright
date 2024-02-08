<template>
  <div class="divider">
    <span v-if="heading" class="divider__heading"><strong>{{ heading }}</strong></span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  heading: {
    type: String,
    required: false
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.divider {
  position: relative;
  width: 100%;
  height: 1px;
  background-color: $color-secondary;
  margin: 1rem 0;
  &__heading {
    position: absolute;
    right: 2rem;
    top: 50%;
    transform: translate(0, -50%);
    padding: 15px 20px;
    background-color: white;
  }
}
</style>