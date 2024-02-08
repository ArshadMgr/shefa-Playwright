<template>
  <div>
    <div v-if="!editMode" class="welcome-container row">
      <div class="col-12 title">بيانات المسح الاجتماعي</div>
    </div>

    <form
      class="form-social-survey w-100"
      @submit.prevent="submit(!v$.$invalid)"
    >
      <div class="form-social-survey__select-group">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">الحالة الاجتماعية</label>
            <Dropdown
              v-if="dataToBeModified.includes('marital_status')"
              optionLabel="label"
              optionValue="id"
              v-model="payload.maritalStatus"
              class="w-100"
              :class="{
                'p-invalid': v$.maritalStatus.$invalid && state.validated,
              }"
              :options="props.options.maritalStatus"
              placeholder="الحالة الاجتماعية"
            />
            <span
              v-else-if="
                props.options.maritalStatus &&
                props.options.maritalStatus.length
              "
              class="p-float-label"
              data-cy="marital-status-value"
            >
              <InputText
                id="maritalStatus"
                type="text"
                disabled
                v-model="state.maritalStatus"
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">الوضع الاجتماعي</label>
            <Dropdown
              v-if="dataToBeModified.includes('social_status')"
              optionLabel="label"
              optionValue="id"
              class="w-100"
              v-model="payload.socialStatus"
              :options="props.options.socialStatus"
              placeholder="الوضع الاجتماعي"
            />
            <span
              v-else-if="
                props.options.socialStatus && props.options.socialStatus.length
              "
              class="p-float-label"
              data-cy="social-status-value"
            >
              <InputText
                id="socialStatus"
                type="text"
                disabled
                v-model="
                  props.options.socialStatus.find(
                    (each) => each.id === readOnlyData.socialStatus
                  ).label"
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">خدمة المريض لنفسه</label>
            <Dropdown
              v-if="dataToBeModified.includes('can_serve_himself')"
              optionLabel="label"
              optionValue="id"
              v-model="payload.canServeHimself"
              class="w-100"
              :class="{
                'p-invalid': v$.canServeHimself.$invalid && state.validated,
              }"
              :options="props.options.canServeHimself"
              placeholder="خدمة المريض لنفسه"
            />
            <span
              v-else-if="
                props.options.canServeHimself &&
                props.options.canServeHimself.length
              "
              class="p-float-label"
              data-cy="can-serve-himself-value"
            >
              <InputText
                id="canServeHimself"
                type="text"
                disabled
                v-model="
                  props.options.canServeHimself.find(
                    (each) => each.id === readOnlyData.canServeHimself
                  ).label
                "
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">المهنة</label>
            <span v-if="dataToBeModified.includes('job')" class="p-float-label">
              <InputText
                optionLabel="label"
                optionValue="id"
                :disabled="!dataToBeModified.includes('job')"
                v-model="payload.job"
                class="w-100"
                :class="{ 'p-invalid': v$.job.$invalid && state.validated }"
                placeholder="المهنة"
              />
            </span>
            <span v-else class="p-float-label">
              <InputText
                id="job"
                type="text"
                disabled
                v-model="readOnlyData.job"
                class="w-100"
                data-cy="job-value"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">الانقطاع عن العمل أو المهام اليومية</label>
            <Dropdown
              v-if="dataToBeModified.includes('jobless')"
              optionLabel="label"
              optionValue="id"
              v-model="payload.jobless"
              class="w-100"
              :class="{ 'p-invalid': v$.jobless.$invalid && state.validated }"
              :options="props.options.jobless"
              placeholder="الانقطاع عن العمل أو المهام اليومية"
            />
            <span
              v-else-if="props.options.jobless && props.options.jobless.length"
              class="p-float-label"
              data-cy="jobless-value"
            >
              <InputText
                id="jobless"
                type="text"
                disabled
                v-model="
                  props.options.jobless.find(
                    (each) => each.id === readOnlyData.jobless
                  ).label
                "
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">نوع السكن</label>
            <Dropdown
              v-if="dataToBeModified.includes('accommodation_type')"
              optionLabel="label"
              optionValue="id"
              v-model="payload.accommodationType"
              :class="{
                'p-invalid': v$.accommodationType.$invalid && state.validated,
              }"
              class="w-100"
              :options="props.options.accommodationType"
              placeholder="نوع السكن"
            />
            <span
              v-else-if="
                props.options.accommodationType &&
                props.options.accommodationType.length
              "
              class="p-float-label"
              data-cy="accommodation-type-value"
            >
              <InputText
                id="accommodationType"
                type="text"
                disabled
                v-model="
                  props.options.accommodationType.find(
                    (each) => each.id === readOnlyData.accommodationType
                  ).label
                "
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">ملكية السكن</label>
            <Dropdown
              v-if="dataToBeModified.includes('accommodation_ownership')"
              optionLabel="label"
              optionValue="id"
              v-model="payload.accommodationOwnership"
              class="w-100"
              :class="{
                'p-invalid':
                  v$.accommodationOwnership.$invalid && state.validated,
              }"
              :options="props.options.accommodationOwnership"
              placeholder="ملكية السكن"
            />
            <span
              v-else-if="
                props.options.accommodationOwnership &&
                props.options.accommodationOwnership.length
              "
              class="p-float-label"
              data-cy="accommodation-ownership-value"
            >
              <InputText
                id="accommodationOwnership"
                type="text"
                disabled
                v-model="
                  props.options.accommodationOwnership.find(
                    (each) => each.id === readOnlyData.accommodationOwnership
                  ).label
                "
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">الإيجار السنوي</label>
            <Dropdown
              v-if="dataToBeModified.includes('annual_wage')"
              optionLabel="label"
              optionValue="id"
              v-model="payload.annualWage"
              :options="props.options.annualWage"
              class="w-100"
              :class="{
                'p-invalid': v$.annualWage.$invalid && state.validated,
              }"
              placeholder="الإيجار السنوي"
            />
            <span
              v-else-if="
                props.options.annualWage && props.options.annualWage.length
              "
              class="p-float-label"
              data-cy="annual-wage-value"
            >
              <InputText
                id="annualWage"
                type="text"
                disabled
                v-model="
                  props.options.annualWage.find(
                    (each) => each.id === readOnlyData.annualWage
                  ).label
                "
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">عدد أفراد الأسرة</label>
            <Dropdown
              v-if="dataToBeModified.includes('number_of_family_members')"
              optionLabel="label"
              optionValue="id"
              v-model="payload.numberOfFamilyMembers"
              :options="props.options.numberOfFamilyMembers"
              :class="{
                'p-invalid':
                  v$.numberOfFamilyMembers.$invalid && state.validated,
              }"
              class="w-100"
              placeholder="عدد أفراد الأسرة"
            />
            <span
              v-else-if="
                props.options.numberOfFamilyMembers &&
                props.options.numberOfFamilyMembers.length
              "
              class="p-float-label"
              data-cy="number-of-family-members-value"
            >
              <InputText
                id="numberOfFamilyMembers"
                type="text"
                disabled
                v-model="
                  props.options.numberOfFamilyMembers.find(
                    (each) => each.id === readOnlyData.numberOfFamilyMembers
                  ).label
                "
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">دخل المريض</label>
            <Dropdown
              v-if="dataToBeModified.includes('patient_income')"
              optionLabel="label"
              optionValue="id"
              v-model="payload.patientIncome"
              :options="props.options.patientIncome"
              :class="{
                'p-invalid': v$.patientIncome.$invalid && state.validated,
              }"
              placeholder="دخل المريض"
              class="w-100"
            />
            <span
              v-else-if="
                props.options.patientIncome &&
                props.options.patientIncome.length
              "
              class="p-float-label"
              data-cy="patient-income-value"
            >
              <InputText
                id="patientIncome"
                type="text"
                disabled
                v-model="
                  props.options.patientIncome.find(
                    (each) => each.id === readOnlyData.patientIncome
                  ).label
                "
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">دخل الأسرة</label>
            <Dropdown
              v-if="dataToBeModified.includes('family_income')"
              optionLabel="label"
              optionValue="id"
              v-model="payload.familyIncome"
              class="w-100"
              :options="props.options.familyIncome"
              placeholder="دخل الأسرة"
            />
            <span
              v-else-if="
                props.options.familyIncome && props.options.familyIncome.length
              "
              class="p-float-label"
              data-cy="family-income-value"
            >
              <InputText
                id="familyIncome"
                type="text"
                disabled
                v-model="
                  props.options.familyIncome.find(
                    (each) => each.id === readOnlyData.familyIncome
                  ).label
                "
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">هل المريض مستحق للزكاة</label>
            <Dropdown
              v-if="dataToBeModified.includes('worthy_of_zakah')"
              optionLabel="label"
              optionValue="id"
              class="w-100"
              v-model="payload.worthyOfZakah"
              :class="{
                'p-invalid': v$.worthyOfZakah.$invalid && state.validated,
              }"
              :options="props.options.worthyOfZakah"
              placeholder="هل المريض مستحق للزكاة"
            />
            <span
              v-else-if="
                props.options.worthyOfZakah &&
                props.options.worthyOfZakah.length
              "
              class="p-float-label"
              data-cy="is-member-of-zakah-value"
            >
              <InputText
                id="worthyOfZakah"
                type="text"
                disabled
                v-model="
                  props.options.worthyOfZakah.find(
                    (each) => each.id === readOnlyData.worthyOfZakah
                  ).label
                "
                class="w-100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mt-4 mb-3">
          <label v-if="editMode" class="top-label"
            >قصة الحالة “رأي الباحث الاجتماعي”</label
          >
          <div class="text-area-wrapper" data-cy="case-story-value">
            <Textarea
              v-model="payload.story"
              placeholder="قصة الحالة “رأي الباحث الاجتماعي”"
              :class="{ 'p-invalid': v$.story.$invalid && state.validated }"
              :disabled="!dataToBeModified.includes('story')"
              :autoResize="true"
              rows="5"
              class="w-100"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label class="top-label">نوع البحث</label>
            <Dropdown
              v-if="dataToBeModified.includes('search_type')"
              optionLabel="label"
              optionValue="id"
              class="w-100"
              :class="{
                'p-invalid': v$.searchType.$invalid && state.validated,
              }"
              v-model="payload.searchType"
              :options="props.options.searchType"
              placeholder="نوع البحث"
            />
            <span
              v-else-if="
                props.options.searchType && props.options.searchType.length
              "
              class="p-float-label"
              data-cy="search-type-value"
            >
              <InputText
                id="searchType"
                type="text"
                disabled
                v-model="
                  props.options.searchType.find(
                    (each) => each.id === readOnlyData.searchType
                  ).label
                "
                class="w-100"
              />
            </span>
          </div>
        </div>
      </div>

      <div v-if="!editMode" class="row border-top-spacer">
        <div class="col">
          <Button
            id="close-btn"
            label="السابق"
            class="p-button-secondary p-button-rounded mx-2 w-100"
            type="button"
            @click.stop="goBack"
          />
        </div>
        <div class="col">
          <Button
            id="safe-as-draft"
            label="حفظ الطلب كمسودة"
            class="p-button-outlined p-button-rounded mx-2 w-100"
            @click="saveAsDraft"
          />
        </div>
        <div class="col">
          <Button
            id="tracking-btn"
            label="إرسال الطلب"
            class="p-button-primary p-button-rounded mx-2 w-100"
            type="submit"
          />
        </div>
      </div>
    </form>
  </div>
</template>
<script setup>
import { defineProps, onMounted, reactive, watch } from "vue";
import { required, sameAs } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import Textarea from "primevue/textarea";
import CaseService from "@/services/case-service";
import EnumService from "@/services/enum.service";

const props = defineProps({
  dataToBeModified: {
    type: Array,
    default: [],
    required: false,
  },
  payload: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  regionOptions: {
    type: Object,
    required: true,
  },
  editMode: {
    type: Boolean,
    required: false,
    default: false,
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
  readOnlyData: {
    type: Object,
    required: false,
  },
});
const emit = defineEmits(["submit", "previous"]);

const state = reactive({
  form: Object.assign({}, props.payload),
  validated: false,
  submitted: false,
  socialStatus: "",
  maritalStatus: ''
});

const rules = {
  maritalStatus: { required },
  canServeHimself: { required },
  job: { required },
  jobless: { required },
  accommodationType: { required },
  accommodationOwnership: { required },
  annualWage: { required },
  numberOfFamilyMembers: { required },
  patientIncome: { required },
  worthyOfZakah: { required },
  story: { required },
  searchType: { required },
  publishOnCharityPage: { sameAs: sameAs(true) },
  termsAndConditionsFlag: { sameAs: sameAs(true) },
  shefaaExclusiveFlag: { sameAs: sameAs(true) },
};

const v$ = useVuelidate(rules, props.payload);

const saveAsDraft = () => {
};

const goBack = () => {
  emit("previous");
};

const submit = () => {
  state.validated = true;
  if (v$.value.$invalid) {
    return;
  }
  state.submitted = true;
  emit("submit", props.payload);
};

onMounted(() => {
  state.maritalStatus = props.options?.maritalStatus?.find(
    (each) => each.id === props.readOnlyData.maritalStatus
  )?.label
})

watch(() => props.options, (newPayload) => {
  state.maritalStatus = props.options?.maritalStatus?.find(
    (each) => each.id === props.readOnlyData.maritalStatus
  )?.label
})

defineExpose({ state: props.payload });
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
.welcome-container {
  .title {
    font-size: 24px;
    font-weight: bold;
  }
}
.p-float-label label {
  right: 0.75rem;
  font-size: 14px;
  color: #8c8c8c !important;
}
.field * {
  display: block;
}
.top-label {
  margin-right: 0.75rem;
  font-size: 14px;
  color: #8c8c8c;
}
.text-area-wrapper {
  display: flex;
}
.accept-checkbox {
  label {
    font-size: 14px;
    color: #3f3f3f;
    margin-right: 5px;
  }
}
.checkbox-info {
  font-size: 12px;
  color: #8c8c8c;
}
.tracking-btn {
  display: block;
  margin: 0 auto;
  width: 80%;
  border-radius: 25px;
  padding: 10px;
  background: #12b2aa;
  color: #ffffff;
  border: none;
  font-size: 18px;
}
.tracking-btn:hover {
  background-color: #0e8e88 !important;
  border: none;
}
.close-btn {
  display: block;
  margin: 0 auto;
  width: 80%;
  border-radius: 25px;
  padding: 10px;
  background: #d9d9d9;
  color: #3f3f3f;
  border: none;
  font-size: 18px;
}

a {
  color: $color-primary;
  &:hover {
    color: $color-primary-hover;
  }
}

::v-deep(.p-button.p-button-secondary) {
  background: #d9d9d9;
  border-color: #d9d9d9;
  color: #3f3f3f;
  &:hover {
    background-color: #b2b2b2;
    border-color: #b2b2b2;
    color: #3f3f3f;
  }
}

input[disabled] {
  background: #ececec;
  border: 1px solid #ececec;
}
.file-input-invalid {
  border: 1px solid #e24c4c;
  border-radius: 5px;
}
.border-top-spacer {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
}
</style>
