<template>
  <div>
    <div class="welcome-container row">
      <div class="col-12 title">بيانات مدير الجمعية:</div>
    </div>

    <form class="form-step1 w-100 mt-4" @submit.prevent="submit(!v$.$invalid)">
      <div class="form-label-group mb-3">
        <div class="col-lg-12 mt-1">
          <span class="p-float-label">
            <label for="identityType" class="top-label">نوع الهوية</label>
            <Dropdown
              class="w-100"
              id="identityType"
              optionLabel="label"
              optionValue="value"
              v-model="payload.identityType"
              :class="{
                'p-invalid': v$.identityType.$invalid && state.validated,
              }"
              :options="identityTypes"
              :disabled="state.submitted"
              placeholder="نوع الهوية"
              required
            />
          </span>
        </div>
      </div>

      <div class="form-label-group mb-3">
        <div class="col-lg-12 mt-1">
          <span class="p-float-label">
            <InputText
              class="w-100"
              id="identityNumber"
              v-model="payload.identityNumber"
              :class="{
                'p-invalid': v$.identityNumber.$invalid && state.validated,
              }"
              :disabled="state.submitted"
              placeholder="رقم الهوية"
            />
          </span>
        </div>
      </div>

      <div class="row mt-1">
        <div class="form-label-group col-lg-6">
          <div class="mt-4">
            <span class="p-float-label">
              <Calendar
                @date-select="convertDateType('hijri')"
                class="w-100"
                id="gregorian_birthdate"
                v-model="payload.gregorianBirthdate"
                :class="{
                  'p-invalid':
                    v$.gregorianBirthdate.$invalid && state.validated,
                }"
                dateFormat="yy-mm-dd"
                :showIcon="true"
                :disabled="state.submitted"
              />
              <label for="gregorian_birthdate" class="right-label"
                >تاريخ الميلاد (ميلادي)</label
              >
            </span>
          </div>
        </div>

        <div class="form-label-group col-lg-6">
          <div class="mt-4">
            <span class="p-float-label">
              <HijriCalendar
                @date-select="convertDateType('gregorian')"
                class="w-100"
                id="hijri_birthdate"
                v-model="payload.hijriBirthdate"
                :class="{
                  'p-invalid': v$.hijriBirthdate.$invalid && state.validated,
                }"
                dateFormat="yy-mm-dd"
                :showIcon="true"
                :disabled="state.submitted"
              />
              <label for="hijri_birthdate" class="right-label"
                >تاريخ الميلاد (هجري)</label
              >
            </span>
          </div>
        </div>
      </div>

      <div class="row border-top-spacer">
        <div class="col-lg-6">
          <button
            id="close-btn"
            class="btn btn-lg btn-secondary btn-block close-btn"
            type="button"
            @click.stop="goBack"
          >
            إغلاق
          </button>
        </div>
        <div class="col-lg-6">
          <button
            id="tracking-btn"
            class="btn btn-lg btn-primary btn-block tracking-btn"
            type="submit"
          >
            متابعة
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, defineProps, watch } from "vue";
import { useRouter } from "vue-router";
import Calendar from "primevue/calendar";
import { toGregorian, toHijri } from "hijri-converter";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const props = defineProps({
  payload: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const emit = defineEmits(["submit"]);

const state = reactive({
  form: Object.assign({}, props.payload),
  validated: false,
  submitted: false,
});

const rules = {
  identityType: { required },
  identityNumber: { required, identityNumberValidate },
  hijriBirthdate: { required },
  gregorianBirthdate: { required },
};

const v$ = useVuelidate(rules, state.form);

const identityTypes = [
  {
    label: "هوية وطنية",
    value: "saudi_national",
  },
  {
    label: "إقامة",
    value: "resident",
  },
  {
    label: "تأشيرة",
    value: "visa",
  },
];

const convertDateType = (toType) => {
  if (toType === "hijri") {
    const hijriDate = toHijri(
      props.payload.gregorianBirthdate.getFullYear(),
      props.payload.gregorianBirthdate.getMonth() + 1,
      props.payload.gregorianBirthdate.getDate()
    );
    props.payload.hijriBirthdate = new Date(
      hijriDate.hy,
      hijriDate.hm - 1,
      hijriDate.hd
    );
  }
  if (toType === "gregorian") {
    const gregorianDate = toGregorian(
      props.payload.hijriBirthdate.getFullYear(),
      props.payload.hijriBirthdate.getMonth() + 1,
      props.payload.hijriBirthdate.getDate()
    );
    props.payload.gregorianBirthdate = new Date(
      gregorianDate.gy,
      gregorianDate.gm - 1,
      gregorianDate.gd
    );
  }
};

function identityNumberValidate() {
  if (
    props.payload.identityType === "saudi_national" &&
    props.payload.identityNumber[0] !== "1"
  ) {
    return false;
  }
  if (
    props.payload.identityType === "resident" &&
    props.payload.identityNumber[0] !== "2"
  ) {
    return false;
  }

  if (
    props.payload.identityType === "visa" &&
    props.payload.identityNumber.length !== 10
  ) {
    return false;
  }
  return !!props.payload.identityNumber.length;
}

const goBack = () => {
  router.push("/admin-panel/auditors-list");
};

const submit = () => {
  state.validated = true;
  if (v$.value.$invalid) {
    return;
  }
  state.submitted = true;
  emit("submit", state.form);
};
</script>

<style lang="scss" scoped>
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

.border-top-spacer {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
}
.top-label {
  margin-right: 0.75rem;
  font-size: 14px;
  color: #8c8c8c;
}
.p-float-label label {
  left: 0;
  right: 0.75rem;
  font-size: 14px;
  color: #8c8c8c !important;
}
</style>
