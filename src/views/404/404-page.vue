<template>
  <div class="bg-white p-4 text-center">
    <div class="title mb-3 fw-bold">الصفحة المطلوبة غير موجودة!</div>
    <div class="shape mb-3">
      <div class="shape__container">
        <div class="shape__text fw-bold">404</div>
        <img src="../../assets/icons/hex-shape.svg" alt="hex-shape">
      </div>
    </div>
    <div class="mb-5 fs-4">
      <div>
        للأسف، لم يتم العثور على الصفحة المطلوبة، قد يكون الرابط
      </div>
      <div>
        خاطئ أو أن هذه الصفحة تم حذفها
      </div>
    </div>
    <div>
      <router-link :to="'/cases-list'">
        <Button class="p-button p-button-primary p-button-rounded px-5">
          التبرع للحالات
        </Button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "404-page"
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

  &__text {
    color: $color-footer-bcg;
    z-index: 1;
    font-size: 84px;
    position: absolute;
    bottom: 7rem;
  }
}

</style>
