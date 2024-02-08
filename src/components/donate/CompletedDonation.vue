<template>
  <div class="bg-white p-4 text-center">
    <div class="shape mb-3">
      <div class="shape__container">
        <i class="pi pi-check shape__text fw-bold" />
        <img class="shape__image" src="@/assets/icons/hex-shape.svg" alt="hex-shape" />
      </div>
    </div>
    <div class="mb-5 fs-4 color-primary">
      شكرًا لعطاءكم، تم اكتمال الحالة
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/variables";
.shape {

  width: 280px;
  height: 310px;
  margin: auto;

  &__container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100%;
  }

  &__text {
    color: $color-footer-bcg;
    z-index: 1;
    font-size: 140px;
  }
  &__image {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>