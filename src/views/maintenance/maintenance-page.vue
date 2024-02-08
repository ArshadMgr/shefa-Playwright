<template>
  <div class="bg-white p-4 text-center">
    <div class="title mb-3 fw-bold">الموقع تحت الصيانة</div>
    <div class="shape mb-3">
      <div class="shape__container">
        <img src="../../assets/icons/maintenance-icon.svg" alt="maintenance icon"
             class="shape__icon">
        <img src="../../assets/icons/hex-shape.svg" alt="hex-shape">
      </div>
    </div>
    <div class="fs-4">
      <div>
        عذراً، نقوم الآن بعمل صيانة للموقع حتى نستطيع خدمتك
      </div>
      <div>
        بشكل أفضل يرجى معاودة زيارة الموقع لاحقاً.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "maintenance-page"
};
</script>

<style lang="scss" scoped>

@import "@/styles/variables";

.title {
  font-size: 40px;
  color: $color-footer-bcg;
}

.shape {

  width: 280px;
  height: 310px;
  margin: auto;

  &__container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  &__icon {
    width: 104px;
    aspect-ratio: 1;
    z-index: 1;
    position: absolute;
    bottom: 7rem;
  }
}

</style>
