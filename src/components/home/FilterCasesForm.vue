<template>
  <form @submit.prevent="submit" class="filters-form" >
    <strong class="filters-form__heading mt-2 d-block">التصفية حسب</strong>
    <div class="filters-form__inputs mt-4">
      <div class="filters-form__region">
        <label class="filters-form__top-label">المنطقة</label>
        <Dropdown
            class="w-100"
            data-cy="region-dropdown"
            optionValue="id"
            v-model="state.region"
            :options="props.regionOptions"
            optionLabel="name"
            :filter="true"
            placeholder="اختر المنطقة"
        />
      </div>
      <div class="filters-form__specialization">
        <label class="filters-form__top-label">التخصص</label>
        <Dropdown
            class="w-100"
            data-cy="specialization-dropdown"
            optionValue="id"
            v-model="state.specialization"
            :options="props.specializationOptions"
            optionLabel="name"
            :filter="true"
            placeholder="اختر التخصص"
        />
      </div>
      <div class="filters-form__type h-100 d-flex flex-column justify-content-between">
        <label class="filters-form__top-label">الفئة</label>
        <div class="filter-form__radio-group">
          <RadioButton input-id="man" name="man" value="1" v-model="state.type" data-cy="filter-radio-man" />
          <label for="man" class="filters-form__label">رجال</label>
          <RadioButton input-id="woman" name="woman" value="2" v-model="state.type" data-cy="filter-radio-woman" />
          <label for="woman" class="filters-form__label">نساء</label>
          <RadioButton input-id="child" name="child" value="3" v-model="state.type" data-cy="filter-radio-child" />
          <label for="child" class="filters-form__label">أطفال</label>
        </div>
      </div>
      <div class="filters-form__search">
        <span class="p-input-icon-right w-100">
            <i class="pi pi-search" />
            <InputNumber class="w-100" :useGrouping="false" v-model="state.caseId" placeholder="ابحث حسب رقم الحالة" @keydown.enter="submit" data-cy="filters-form-search-input"/>
        </span>
      </div>
      <Button type="submit" class="p-button-primary filters-form__button" label="بحث" data-cy="submit-btn" />
    </div>
  </form>
</template>

<script setup>
import {reactive} from 'vue';

const props = defineProps({
  regionOptions: {
    type: Array,
    required: true
  },
  specializationOptions: {
    type: Array,
    required: true
  }
});

const state = reactive({
  region: '',
  specialization: '',
  type: '',
  caseId: null
});

const emit = defineEmits(['submit']);

const submit = () => {
  state.caseId === null ? state.caseId = '' : state.caseId;
  emit('submit', state)
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";
.filters-form {
  position: absolute;
  bottom: -204px;
  right: 50%;
  z-index: 3;
  transform: translateX(50%);
  min-width: 1160px;
  padding: 20px 30px 50px;
  border-radius: $border-radius-small;
  box-shadow: $box-shadow-case-card;
  margin: 0 auto;
  background-color: white;
  &__inputs {
    display: grid;
    grid-template-areas: 'region specialization type search button';
    grid-template-columns: minmax(100px, 208px) minmax(100px, 208px) minmax(100px, 222px) minmax(100px, 224px) minmax(100px, 166px);
    align-items: end;
    grid-gap: 15px;
  }
  &__search {
    grid-area: search;
  }
  &__type {
    grid-area: type;
  }
  &__specialization {
    grid-area: specialization;
  }
  &__region {
    grid-area: region;
  }
  &__button {
    grid-area: button;
  }
  &__top-label, &__label {
    color: $color-font-lighter;
    margin-right: 13px;
  }
  &__label {
    margin-right: 4px;
    margin-left: 10px;
  }
  ::v-deep(.p-dropdown .p-dropdown-label.p-placeholder) {
    color: $color-font-lighter;
  }
  ::v-deep(.p-inputtext::placeholder) {
    color: $color-font-lighter;
  }
  ::v-deep(.p-inputnumber-input) {
    padding-right: 2.2rem;
  }

  @include respond('xl') {
    bottom: -287px;
    min-width: 80%;
    padding: 10px 20px;
    &__inputs {
      grid-template-areas: 'region specialization'
                            'type search'
                            'button button';
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @include respond('md') {
    bottom: -277px;
    width: 98%;
    font-size: 14px;
    ::v-deep(.p-dropdown .p-dropdown-label) {
      font-size: 14px;
    }
    ::v-deep(.p-inputtext) {
      font-size: 14px;
    }
  }
  @include respond('sm') {
    bottom: -416px;
    &__inputs {
      grid-template-areas: 'region'
                            'specialization'
                            'type'
                            'search'
                            'button';
      grid-template-columns: 1fr;
    }
  }
}
</style>
