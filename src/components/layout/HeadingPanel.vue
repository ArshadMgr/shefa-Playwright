<template>
  <section class="heading-panel mt-md-4">
    <h1 class="heading-panel__title">{{ title }}</h1>
    <span class="heading-panel__subtitle">
      {{ subtitle }}
    </span>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";
.heading-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 1rem 2rem;
  border-radius: $border-radius-default;
  color: white;
  background: $color-gradient-primary;
  box-shadow: $box-shadow-blur;
  &__title {
    font-size: 2.5rem;
    font-weight: 600;
  }
  &__subtitle {
    font-size: 1.4rem;
    font-weight: 400;
  }
  @include respond(xl) {
    &__title {
      font-size: 2rem;
    }
    &__subtitle {
      font-size: 1.2rem;
    }
  }
  @include respond(md) {
    &__title {
      font-size: 1.6rem;
    }
    &__subtitle {
      font-size: 1rem;
    }
  }
}
</style>