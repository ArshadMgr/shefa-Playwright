<template>
  <div>
    <div v-if="!editMode" class="welcome-container row">
      <div class="col-12 title">بيانات المسح الاجتماعي</div>
    </div>

    <form class="form-social-survey w-100" @submit.prevent="submit(!v$.$invalid)">
      <div class="form-social-survey__select-group">
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="marital-status">
            <label v-if="editMode" class="top-label">الحالة الاجتماعية</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              :disabled="readOnly"
              v-model="state.form.maritalStatus"
              class="w-100"
              :class="{'p-invalid': v$.maritalStatus.$invalid && state.validated}"
              :options="props.options.maritalStatus"
              placeholder="الحالة الاجتماعية"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="social-status">
            <label v-if="editMode" class="top-label">الوضع الاجتماعي</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              class="w-100"
              :disabled="readOnly"
              v-model="state.form.socialStatus"
              :class="{'p-invalid': v$.socialStatus.$invalid && state.validated}"
              :options="props.options.socialStatus"
              placeholder="الوضع الاجتماعي"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="can-serve-himself">
            <label v-if="editMode" class="top-label">خدمة المريض لنفسه</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              :disabled="readOnly"
              v-model="state.form.canServeHimself"
              class="w-100"
              :class="{'p-invalid': v$.canServeHimself.$invalid && state.validated}"
              :options="props.options.canServeHimself"
              placeholder="خدمة المريض لنفسه"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <label v-if="editMode" class="top-label">المهنة</label>
            <span class="p-float-label" data-cy="job-input">
              <InputText
                optionLabel="label"
                optionValue="id"
                :disabled="readOnly"
                v-model="state.form.job"
                class="w-100"
                :class="{'p-invalid': v$.job.$invalid && state.validated}"
                placeholder="المهنة"
                maxlength="100"
              />
            </span>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="jobless-input">
            <label v-if="editMode" class="top-label">الانقطاع عن العمل أو المهام اليومية</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              :disabled="readOnly"
              v-model="state.form.jobless"
              class="w-100"
              :class="{'p-invalid': v$.jobless.$invalid && state.validated}"
              :options="props.options.jobless"
              placeholder="الانقطاع عن العمل أو المهام اليومية"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="accommodation-type">
            <label v-if="editMode" class="top-label">نوع السكن</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              :disabled="readOnly"
              v-model="state.form.accommodationType"
              :class="{'p-invalid': v$.accommodationType.$invalid && state.validated}"
              class="w-100"
              :options="props.options.accommodationType"
              placeholder="نوع السكن"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="accommodation-ownership">
            <label v-if="editMode" class="top-label">ملكية السكن</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              :disabled="readOnly"
              v-model="state.form.accommodationOwnership"
              class="w-100"
              :class="{'p-invalid': v$.accommodationOwnership.$invalid && state.validated}"
              :options="props.options.accommodationOwnership"
              placeholder="ملكية السكن"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="annual-wage">
            <label v-if="editMode" class="top-label">الإيجار السنوي</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              :disabled="readOnly"
              v-model="state.form.annualWage"
              :options="props.options.annualWage"
              class="w-100"
              :class="{'p-invalid': v$.annualWage.$invalid && state.validated}"
              placeholder="الإيجار السنوي"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="number-of-family-members">
            <label v-if="editMode" class="top-label">عدد أفراد الأسرة</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              :disabled="readOnly"
              v-model="state.form.numberOfFamilyMembers"
              :options="props.options.numberOfFamilyMembers"
              :class="{'p-invalid': v$.numberOfFamilyMembers.$invalid && state.validated}"
              class="w-100"
              placeholder="عدد أفراد الأسرة"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="patient-income">
            <label v-if="editMode" class="top-label">دخل المريض</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              :disabled="readOnly"
              v-model="state.form.patientIncome"
              :options="props.options.patientIncome"
              :class="{'p-invalid': v$.patientIncome.$invalid && state.validated}"
              placeholder="دخل المريض"
              class="w-100"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="family-income">
            <label v-if="editMode" class="top-label">دخل الأسرة</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              :disabled="readOnly"
              v-model="state.form.familyIncome"
              class="w-100"
              :class="{'p-invalid': v$.familyIncome.$invalid && state.validated}"
              :options="props.options.familyIncome"
              placeholder="دخل الأسرة"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="is-member-of-zakah">
            <label v-if="editMode" class="top-label">هل المريض مستحق للزكاة</label>
            <Dropdown
              optionLabel="label"
              optionValue="id"
              class="w-100"
              :disabled="readOnly"
              v-model="state.form.worthyOfZakah"
              :class="{'p-invalid': v$.worthyOfZakah.$invalid && state.validated}"
              :options="props.options.worthyOfZakah"
              placeholder="هل المريض مستحق للزكاة"
            />
          </div>
        </div>
        <div class="form-label-group mt-4 mb-3">
          <label v-if="editMode" class="top-label">قصة الحالة “رأي الباحث الاجتماعي”</label>
          <div class="text-area-wrapper" data-cy="case-story">
            <Textarea
              v-model="state.form.story"
              placeholder="قصة الحالة “رأي الباحث الاجتماعي”"
              :class="{'p-invalid': v$.story.$invalid && state.validated}"
              :disabled="readOnly"
              :autoResize="true"
              maxlength="2000"
              rows="5"
              class="w-100"
            />
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4" data-cy="search-type">
            <label v-if="editMode" class="top-label">نوع البحث</label>
            <Dropdown
              v-if="!readOnly"
              optionLabel="label"
              optionValue="id"
              class="w-100"
              :disabled="readOnly"
              :class="{'p-invalid': v$.searchType.$invalid && state.validated}"
              v-model="state.form.searchType"
              :options="props.options.searchType"
              placeholder="نوع البحث"
            />
            <span v-else class="p-float-label">
              <InputText
                id="searchType"
                type="text"
                data-cy="search-type-input"
                disabled
                v-model="state.form.searchType"
                class="w-100"
                maxlength="100"
              />
            </span>
          </div>
        </div>
      </div>

      <div class="form-social-check-group">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <div class="accept-checkbox mt-3" data-cy="terms-and-conditions">
              <Checkbox
                v-model="state.form.termsAndConditionsFlag"
                :class="{'p-invalid': v$.termsAndConditionsFlag.$invalid && state.validated}"
                :binary="true"
                inputId="termsAgreement"
                :disabled="state.submitted || readOnly"
              />
              <label for="termsAgreement"
                >أوافق على
                <router-link target="_blank" to="/privacy-policy"
                  >الشروط والأحكام</router-link
                ></label
              >
            </div>
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
              data-cy="save-as-draft-button"
              label="حفظ الطلب كمسودة"
              class="p-button-outlined p-button-rounded mx-2 w-100"
              @click="saveAsDraft"
          />
        </div>
        <div class="col" data-cy="send-request">
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
import {defineProps, reactive} from "vue";
import {required, sameAs} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import Textarea from 'primevue/textarea';

const props = defineProps({
  payload: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    required: true
  },
  regionOptions: {
    type: Object,
    required: true
  },
  editMode: {
    type: Boolean,
    required: false,
    default: false
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(["submit", "previous"])

const state = reactive({
  form: Object.assign({}, props.payload),
  validated: false,
  submitted: false,
})

const rules = {
  maritalStatus: { required },
  socialStatus: { required },
  canServeHimself: { required },
  job: { required },
  jobless: { required },
  accommodationType: { required },
  accommodationOwnership: { required },
  annualWage: { required },
  numberOfFamilyMembers: {required},
  patientIncome: {required},
  familyIncome: {required},
  worthyOfZakah: {required},
  story: { required },
  searchType: { required },
  termsAndConditionsFlag: { sameAs: sameAs(true) },
};

const v$ = useVuelidate(rules, state.form);

const saveAsDraft = () => {
  state.validated = true
  if (v$.value.$invalid) {
    return
  }
  state.submitted = true
  emit('submit-draft', state.form)
}

const goBack = () => {
  emit("previous", state.form)
};

const submit = () => {
  state.validated = true
  if (v$.value.$invalid) {
    return
  }
  state.submitted = true
  emit('submit', state.form)
}

defineExpose({ state: state.form })
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/components/button";
.welcome-container {
  .title {
    font-size: 24px;
    font-weight: bold;
  }
}
.p-float-label label {
  right: 0.75rem;
}
.field * {
  display: block;
}
.top-label {
  margin-right: 0.75rem;
  font-size: 12px;
  color: #6c757d;
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

a {
  color: $color-primary;
  &:hover {
    color: $color-primary-hover
  }
}

input[disabled] {
  background: #ECECEC;
  border: 1px solid #ECECEC;
}
.file-input-invalid {
  border: 1px solid #e24c4c;
  border-radius: 5px;
}
.border-top-spacer {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem
}
</style>
