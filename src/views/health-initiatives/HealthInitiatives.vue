<template>
  <main class="health-initiatives">
    <section class="health-initiatives__tile d-flex justify-content-center align-items-center">
      <div class="tile d-flex">
        <img class="tile__picture" src="../../assets/images/health-initiatives.png" alt="Health initiatives">
        <span class="tile__text">مبادرات القطاع الصحي</span>
        <div class="tile__cover"></div>
      </div>
    </section>
    <section class="health-initiatives__content d-flex flex-column justify-content-center align-items-center">
      <h1 class="title mt-3 mt-sm-5">قريباً</h1>
      <span class="description mt-3 mt-sm-4 text-center">نحن نعمل على إنشاء تعاون مع القطاع الصحي للتبرع لحالات المرضى المختلفة التي تحتاج إلى المساعدة المالية. هذه المبادرة ستشمل التبرعات للعلاجات الطبية الثمينة، والتغطية الطبية، والتدريب والتأهيل للطبيب. ستتوفر المبادرات قريباً وسنزودكم بالمزيد من المعلومات قريباً بأذن الله.</span>
      <RouterLink to="/home">
        <Button class="button p-button p-button-rounded p-button-primary mt-3 mt-sm-4" label="العودة إلى الصفحة الرئيسية"/>
      </RouterLink>
    </section>
  </main>
</template>

<style lang="scss">
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";
@import "@/styles/components/tile";

.health-initiatives {
  padding: 50px 130px 80px;
  &__content {
    .title {
      font-size: 54px;
      font-weight: 500;
      color: $color-primary;
    }
    .description {
      max-width: 955px;
      font-size: 24px;
    }
  }
  @include respond('xl') {
    padding: 30px 90px 50px;
  }
  @include respond('md') {
    padding: 20px 40px 50px;
    &__content {
      .title {
        font-size: 30px;
      }
      .description {
        max-width: 955px;
        font-size: 18px;
      }
    }
  }
}
</style>