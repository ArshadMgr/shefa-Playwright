<template>
<main class="partnership-request mb-4">
  <Card>
    <template #content>
      <div class="partnership-request__wrapper">
        <div class="partnership-request__details">
          <div class="tile d-flex mb-4">
            <img class="tile__picture" src="../../assets/images/partnershipImage.png" alt="Partnership request">
            <span class="tile__text tile__text--bigger">طلب شراكة</span>
            <div class="tile__cover"></div>
          </div>
          <span class="partnership-request__text">
            تعتز منصة شفاء بالشراكة والتكامل مع القطاع العام والخاص والخيري وذلك من خلال التكامل في الأدوار لتحقيق الغايات والأهداف المشتركة في مجال العلاج الخيري، في حال رغبتكم بالشراكة نأمل التسجيل هنا
          </span>
        </div>
        <form class="partnership-request__form">
          <div class="p-float-label partnership-request__row">
              <Dropdown
                  inputId="agencyType"
                  class="w-100"
                  optionLabel="label"
                  optionValue="name"
                  v-model="state.agencyType"
                  :options="state.agencyOptions"
                  placeholder="نوع الجهة"
                  emptyMessage="لا يوجد نتائج"
              />
            <label for="agencyType">نوع الجهة</label>
          </div>
          <div class="p-float-label partnership-request__row">
            <Dropdown
                inputId="partnershipType"
                class="w-100"
                optionLabel="label"
                optionValue="name"
                v-model="state.partnershipType"
                :options="state.partnershipOptions"
                placeholder="نوع الشراكة"
                emptyMessage="لا يوجد نتائج"
            />
            <label for="agencyType">نوع الشراكة</label>
          </div>
          <div class="w-100 partnership-request__row">
            <span class="p-float-label">
              <InputText
                  inputId="organizationName"
                  v-model="state.organizationName"
                  :maxlength="150"
                  :class="['w-100',
                { 'p-invalid': state.organizationName && state.organizationName.length < 1 }]"
              />
              <label for="organizationName">اسم المنظمة</label>
            </span>
          </div>
          <div class="w-100 partnership-request__row">
            <span class="p-float-label">
            <InputText type="email" name="email" :maxlength="100"
                       id="email" v-model="state.email"
                       :class="['w-100',{ 'p-invalid': state.email && !isValidEmail() }]" />
            <label for="email">البريد الالكتروني</label>
          </span>
          </div>
          <div class="w-100 partnership-request__row">
            <span class="p-float-label">
              <InputText
                  inputId="mobileNumber"
                  v-model="state.mobileNumber"
                  :maxlength="10"
                  :class="['w-100',
                { 'p-invalid': state.mobileNumber && !isValidMobileNumber() }]"
              />
              <label for="mobileNumber">الجوال</label>
            </span>
          </div>
          <div class="w-100 partnership-request__row text-area-wrapper">
            <div class="p-float-label">
              <Textarea
                v-model="state.notes"
                inputId="notes"
                :autoResize="true"
                :maxlength="500"
                rows="5"
                :class="['w-100',
                { 'p-invalid': state.notes && state.notes.length < 1 }]"
              />
              <label for="notes">ملاحظات</label>
            </div>
          </div>
          <Button class="p-button p-button-primary p-button-rounded justify-content-center mx-auto"
                  style="width: 185px; height: 50px"
                  @click.stop="sendPartnershipRequest"
                  :disabled="buttonDisabled()" >
            <i v-if="state.loading" class="pi pi-spin pi-spinner"></i>
            <span v-else>إرسال الطلب</span>
          </Button>
        </form>
      </div>
    </template>
  </Card>
</main>
</template>

<script setup>
import { reactive } from 'vue';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

import PartnershipService from '@/services/partnership.service';

const toast = useToast();
const router = useRouter();

const state = reactive({
  agencyType: '',
  partnershipType: '',
  organizationName: '',
  email: '',
  mobileNumber: '',
  notes: '',
  loading: false,
  error: false,
  success: false,
  agencyOptions: [
    { id: 1, label: 'عام' , name: 'general'},
    { id: 2, label: 'خاص', name: 'private' },
    { id: 3, label: 'خيري', name: 'charity' },
  ],
  partnershipOptions: [
    { id: 1, label: 'دعم مالي' , name: 'financial_support'},
    { id: 2, label: 'شريك تنفيذي', name: 'implementing_partner' },
    { id: 3, label: 'اخرى', name: 'others' },
  ],
});

const isValidEmail = () => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.email);
};

const isValidMobileNumber = () => {
  return /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(state.mobileNumber);
};

const buttonDisabled = () => {
  return state.loading ||
      !state.organizationName ||
      !state.agencyType ||
      !state.partnershipType ||
      !state.email ||
      !state.mobileNumber ||
      !state.notes ||
      !isValidEmail() ||
      !isValidMobileNumber();
};

const sendPartnershipRequest = async () => {
  state.loading = true;
  await PartnershipService.sendPartnershipRequest({
    agency_type: state.agencyType,
    partnership_type: state.partnershipType,
    organization_name: state.organizationName,
    email: state.email,
    mobile_number: state.mobileNumber,
    notes: state.notes,
  }).then(() => {
    state.success = true;
    toast.add({
      severity: 'success',
      summary: 'تم إرسال الطلب بنجاح',
      detail: 'سيتم التواصل معكم في أقرب وقت',
      life: 5000,
    });
    router.push({ name: 'home' });
  }).catch(() => {
    state.error = true;
    toast.add({
      severity: 'error',
      summary: 'حدث خطأ',
      detail: 'حدث خطأ أثناء إرسال الطلب',
      life: 5000,
    });
  })
  state.loading = false;
};
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/mixins';
@import '@/styles/components/tile';
@import "@/styles/components/card";

.partnership-request {
  max-width: 1200px;
  margin: 0 auto;
  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
  }
  &__form {
    display: flex;
    flex-direction: column;
  }
  &__details {
    .tile {
      padding: 54px 20px;
    }
  }
  &__row {
    margin-bottom: 2rem;
  }
  &__text {
    display: block;
    margin-bottom: 2rem;
    font-size: 2rem;
    line-height: 2.5rem;
    color: $color-font-darker;
  }
  .input-label {
    position: absolute;
    top: -41px;
    right: 0.75rem;
    font-size: 14px;
    color: $color-font-lighter;
  }
  ::v-deep(.p-card-body) {
    padding: 43px 30px 67px 83px;
  }
  ::v-deep(.p-card-content) {
    padding: 0;
  }
  ::v-deep(.p-float-label label) {
    right: 1rem;
  }
  ::v-deep(.p-float-label textarea ~ label) {
    line-height: 2;
  }

  @include respond(xl) {
    ::v-deep(.p-card-body) {
      padding: 30px;
    }
  }
  @include respond(lg) {
    &__wrapper {
      grid-template-columns: 1fr;
    }
    &__text {
      font-size: 30px;
    }
  }
  @include respond(md) {
    &__text {
      font-size: 25px;
      line-height: 1.3;
      margin-bottom: 1rem;
    }
    ::v-deep(.p-card-body) {
      padding: 1rem;
    }
  }
}
</style>
