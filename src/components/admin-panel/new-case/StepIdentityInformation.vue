<template>
  <div>
    <div class="welcome-container row">
      <div class="col-12 title">بيانات الحالة:</div>
    </div>

    <form class="form-step1 w-100 mt-4" @submit.prevent="submit(!v$.$invalid)">
      <div class="form-label-group mb-3">
        <div class="col-lg-12 mt-1">
          <span class="p-float-label" data-cy="identity-type">
            <label for="identityType" class="top-label">بيانات الهويه</label>
            <Dropdown class="w-100" id="identityType" optionLabel="label" optionValue="value"
              v-model="state.form.identityType" :class="{ 'p-invalid': v$.identityType.$invalid && state.validated }"
              :options="identityTypes" :disabled="state.submitted" placeholder="نوع الهوية" required />
          </span>
        </div>
      </div>

      <div class="form-label-group mb-3">
        <div class="col-lg-12 mt-1">
          <span class="p-float-label" data-cy="identity-number-input">
            <InputText class="p-inputtext w-100" id="identityNumber" v-model="state.form.identityNumber"
              :class="{ 'p-invalid': v$.identityNumber.$invalid && state.validated }" :disabled="state.submitted"
              :placeholder="identityNumberPlaceholder(state.form.identityType)"
              oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');" maxlength="10" />
          </span>
        </div>
      </div>

      <div class="row mt-1">
        <div class="form-label-group col-lg-6">
          <div class="mt-4">
            <span class="p-float-label" data-cy="gregorian-birthdate-calendar">
              <Calendar @date-select="convertDateType('hijri')" class="w-100" id="gregorian_birthdate"
                v-model="state.form.gregorianBirthdate"
                :class="{ 'p-invalid': v$.gregorianBirthdate.$invalid && state.validated }" dateFormat="yy-mm-dd"
                :maxDate="gregorianMaxDate" :showIcon="true" :disabled="state.submitted" />
              <label for="gregorian_birthdate" class="right-label">تاريخ الميلاد (ميلادي)</label>
            </span>
          </div>
        </div>

        <div class="form-label-group col-lg-6">
          <div class="mt-4">
            <span class="p-float-label" data-cy="hijri-birthdate-calendar">
              <HijriCalendar @date-select="convertDateType('gregorian')" class="w-100" id="hijri_birthdate"
                v-model="state.form.hijriBirthdate" :class="{ 'p-invalid': v$.hijriBirthdate.$invalid && state.validated }"
                dateFormat="yy-mm-dd" :maxDate="hijriMaxDate" :showIcon="true" :disabled="state.submitted"
                :monthNames="$store.state.hijriMonthNames" :monthNamesShort="$store.state.hijriMonthNamesShort" />
              <label for="hijri_birthdate" class="right-label">تاريخ الميلاد (هجري)</label>
            </span>
          </div>
        </div>
      </div>

      <div class="row border-top-spacer">
        <div class="col-lg-6">
          <Button id="close-btn" data-cy="close-button" class="p-button-secondary p-button-rounded mx-2 w-100"
            label="إغلاق" type="button" @click.stop="goBack" />
        </div>
        <div class="col-lg-6">
          <Button id="tracking-btn" data-cy="tracking-button" class="p-button-primary p-button-rounded mx-2 w-100"
            label="متابعة" type="submit" />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, defineProps } from "vue";
import { useRouter } from 'vue-router'
import Calendar from "@/components/layout/calendar";
import { useVuelidate } from '@vuelidate/core'
import { required } from "@vuelidate/validators";
import { isValidSaudiID } from "@/helpers/helpers";
import { convertCalendars } from "@/helpers/convertCalendars";

const props = defineProps({
  payload: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const emit = defineEmits(["submit"])

const state = reactive({
  form: Object.assign({}, props.payload),
  validated: false,
  submitted: false
})

const rules = {
  identityType: { required },
  identityNumber: { required, identityNumberValidate },
  hijriBirthdate: { required },
  gregorianBirthdate: { required }
};

const v$ = useVuelidate(rules, state.form);

const identityTypes = [
  {
    label: "هوية وطنية",
    value: "national_id"
  },
  {
    label: "إقامة",
    value: "iqama_number"
  },
  {
    label: "تأشيرة",
    value: "visa_number"
  }
]

const gregorianMaxDate = new Date();
const hijriMaxDate = convertCalendars('gregorian',
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate(),
);

const convertDateType = (toType) => {
  if (toType === 'hijri') {
    if (state.form?.gregorianBirthdate) {
      state.form.hijriBirthdate = convertCalendars('gregorian',
        state.form.gregorianBirthdate.getFullYear(),
        state.form.gregorianBirthdate.getMonth() + 1,
        state.form.gregorianBirthdate.getDate(),
      );
    }
  }
  if (toType === 'gregorian') {
    if (state.form?.hijriBirthdate) {
      state.form.gregorianBirthdate = convertCalendars('hijri',
        state.form.hijriBirthdate.getFullYear(),
        state.form.hijriBirthdate.getMonth() + 1,
        state.form.hijriBirthdate.getDate(),
        { fromCal: 'islamic-umalqura' }
      );
    }
  }
}

function identityNumberValidate() {
  // validate national id & iqama number
  if (["national_id", "iqama_number"].includes(state.form.identityType))
    return isValidSaudiID(state.form.identityNumber, state.form.identityType === 'iqama_number');
  // validate visa number
  return /^[0-9]{10}$/.test(state.form.identityNumber)
}

function visaExpirationDateValidate() {
  if (state.form.identityType === 'visa_number') {
    if (!state.form.hijriVisaExpirationDate) return false;
    if (!state.form.gregorianVisaExpirationDate) return false;
  }
  return true;
}

const identityNumberPlaceholder = (type) => {
  if (type === 'iqama_number') {
    return 'رقم الاقامة'
  } else if (type === 'visa_number') {
    return 'رقم التأشيرة'
  } else {
    return 'رقم الهوية'
  }
}

const goBack = () => {
  router.push('/admin-panel/auditors-list')
}

const submit = () => {
  state.validated = true
  if (v$.value.$invalid) {
    return
  }

  emit('submit', state.form)
}
</script>

<style lang="scss" scoped>
@import "@/styles/components/button";

.welcome-container {
  .title {
    font-size: 24px;
    font-weight: bold;
  }

  .sub-title {
    font-size: 18px;
  }
}

.accept-checkbox {
  label {
    font-size: 14px;
    color: #3f3f3f;
    margin-right: 5px;
  }
}

.border-top-spacer {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem
}

.top-label {
  margin-right: 0.75rem;
  font-size: 14px;
  color: #8c8c8c;
}

:deep(.p-float-label label) {
  left: 0;
  right: 0.75rem;
  font-size: 14px;
}
</style>
