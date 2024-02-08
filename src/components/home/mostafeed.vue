<template>
  <div class="mostafeed-area bg-white">
      <div class="box d-flex align-items-center justify-content-around w-100">
          <div class="box__wrapper d-flex flex-column align-items-center justify-content-center">
            <i class="icon-mostafeed" />
            <span class="box__numbers" data-cy="number-of-completed-cases">
              {{ data.number_of_completed_cases || 0 }}
            </span>
            <div class="mb-2 box__text">مستفيد</div>
          </div>
          <div class="box__wrapper d-flex flex-column align-items-center justify-content-center">
            <i class="icon-donation" />
            <span class="box__numbers" data-cy="amount-of-donations">
              {{ data.amount_of_donations || 0 }} ر.س
            </span>
            <div class="mb-2 box__text">إجمالي مبلغ المساهمات</div>
          </div>
        </div>
  </div>
</template>

<script>
export default {
  name: "mostafeed-section",
  props: {
    data: {}
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";

.mostafeed-area {
  padding-top: 40px;
  background-size: 60%;
  direction: rtl;
  .box {
    padding: 1.5rem 1rem 2rem;
    text-align: center;
    background: $color-gradient-primary;
    border-radius: 8px;
    box-shadow: $box-shadow-tile;
    color: white;
    margin: 0 !important;
    &__icon {
      font-size: 64px;
      color: white;
    }
    &__numbers {
      font-size: 40px;
      font-weight: bolder;
    }
    &__text {
      font-size: 24px;
    }
  }
  @include respond('xl') {
    .box {
      &__icon {
        font-size: 30px;
      }
      &__numbers {
        font-size: 24px;
      }
      &__text {
        font-size: 16px;
      }
    }
  }
}

.icon-donation {
  width: 65px;
  aspect-ratio: 1;
  background: url("../../assets/icons/icon-donations-white.svg");
}

.icon-mostafeed {
  width: 65px;
  aspect-ratio: 1;
  background: url("../../assets/icons/icon-mostafeed.svg");
}
</style>
