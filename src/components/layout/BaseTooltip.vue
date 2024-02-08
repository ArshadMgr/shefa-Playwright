<template>
<div class="base-tooltip" :class="`base-tooltip--${placement}`">
  <div class="base-tooltip__trigger">
    <slot name="trigger"></slot>
  </div>
  <div class="base-tooltip__content">
    <slot name="content"></slot>
  </div>
<!--  <div class="base-tooltip__arrow"></div>-->
</div>
</template>

<script setup>
const props = defineProps({
  placement: {
    type: String,
    default: "top",
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";
.base-tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: fit-content;
  &__trigger {
    display: inline-block;
  }
  &__content {
    position: absolute;
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    max-width: 300px;
    visibility: hidden;
    opacity: 0;
    //white-space: nowrap;
    pointer-events: none;
    padding: 0.5rem 1rem;
    border-radius: $border-radius-small;
    background-color: white;
    box-shadow: $box-shadow-tile;
    font-size: 14px;
    color: $color-font-lighter;
    text-align: right;
    transition: all 0.2s ease-in-out;
    ul {
      background-color: red !important;
      list-style: circle !important;
    }
  }
  &:hover .base-tooltip__content {
      opacity: 1;
      visibility: visible;
  }


  &--top {
    .base-tooltip__content {
      top: -100%;
    }
  }
  &--right {
    .base-tooltip__content {
      top: 0;
      left: unset;
      right: 0;
      transform: translateX(100%);
    }
  }
  &--bottom {
    .base-tooltip__content {
      top: unset;
    }
  }
  &--left {
    .base-tooltip__content {
      top: 0;
      left: 0;
      transform: translateX(-100%);
    }
  }

  @include respond(sm) {
    &__content {
      max-width: 180px;
      font-size: 12px;
    }
  }
}
</style>