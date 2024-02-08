<template>
  <section>
    <div class="welcome-container row">
      <div class="col-12 title">بيانات الممثل الجديد</div>
    </div>

    <form class="form-step1 w-100 mt-4">
      <div class="form-label-group mb-4">
        <div class="col-lg-12 mt-1">
          <span class="p-float-label">
            <InputText
              class="w-100"
              id="identityNumber"
              v-model="state.form.identityNumber"
              :class="{
                'p-invalid': v$.identityNumber.$invalid && state.validated,
              }"
              maxLength="10"
              oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
            />
            <label for="identityNumber">رقم الهوية</label>
          </span>
        </div>
      </div>

      <div class="form-label-group mb-4">
        <div class="col-lg-12 mt-1">
          <span class="p-float-label">
            <InputText
              class="w-100"
              id="email"
              type="email"
              v-model="state.form.email"
              :class="{
                'p-invalid': v$.email.$invalid && state.validated,
              }"
              maxlength="100"
            />
            <label for="email">البريد الإلكتروني</label>
          </span>
        </div>
      </div>

      <div class="form-label-group mb-4">
        <div class="col-lg-12 mt-1">
          <span class="p-float-label">
            <InputText
              class="w-100"
              name="mobile"
              maxLength="10"
              id="mobile"
              :class="{
                'p-invalid': v$.mobileNumber.$invalid && state.validated,
              }"
              v-model="state.form.mobileNumber"
            />
            <label for="mobile">الجوال</label>
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
                dateFormat="yy-mm-dd"
                v-model="state.form.gregorianBirthdate"
                :class="{'p-invalid': v$.gregorianBirthdate.$invalid && state.validated}"
                :maxDate="gregorianMaxDate"
                :showIcon="true"
              />
              <label for="gregorian_birthdate">تاريخ الميلاد (ميلادي)</label>
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
                dateFormat="yy-mm-dd"
                v-model="state.form.hijriBirthdate"
                :class="{'p-invalid': v$.hijriBirthdate.$invalid && state.validated}"
                :maxDate="hijriMaxDate"
                :showIcon="true"
                :monthNames="$store.state.hijriMonthNames"
                :monthNamesShort="$store.state.hijriMonthNamesShort"
              />
              <label for="hijri_birthdate">تاريخ الميلاد (هجري)</label>
            </span>
          </div>
        </div>
      </div>

      <div class="row border-top-spacer">
        <div class="col-lg-6">
          <router-link to="/admin-panel/charity-representative">
            <Button
              id="close-btn"
              label="إغلاق"
              class="p-button p-button-rounded p-button-secondary px-5 mx-2 w-100"
              type="button"
            />
          </router-link>
        </div>
        <div class="col-lg-6">
          <Button
            id="tracking-btn"
            label="متابعة"
            class="p-button p-button-rounded p-button-primary px-5 mx-2 w-100"
            type="button"
            @click="submit"
          />
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, defineProps } from "vue";
import { useRouter } from "vue-router";
import InputMask from "primevue/inputmask";
import Calendar from "@/components/layout/calendar";
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

const isValidIdentityNumber = () => {
  return /^1[0-9]{9}$/.test(state.form.identityNumber);
}

const isValidEmail = () => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.form.email);
};

const isValidMobileNumber = () => {
  return /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(state.form.mobileNumber);
};

const rules = {
  identityNumber: { required, isValidIdentityNumber },
  email: { required, isValidEmail },
  mobileNumber: { required, isValidMobileNumber },
  hijriBirthdate: { required },
  gregorianBirthdate: { required },
};

const v$ = useVuelidate(rules, state.form);

const gregorianMaxDate = new Date();
const dateHijriObj = toHijri(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
const hijriMaxDate = new Date(dateHijriObj.hy, dateHijriObj.hm - 1, dateHijriObj.hd);

const convertDateType = (toType) => {
  if (toType === 'hijri') {
     const hijriDate = toHijri(state.form.gregorianBirthdate.getFullYear(), state.form.gregorianBirthdate.getMonth() + 1, state.form.gregorianBirthdate.getDate());
    state.form.hijriBirthdate = new Date(hijriDate.hy, hijriDate.hm - 1, hijriDate.hd)
  }
  if (toType === 'gregorian') {
    const gregorianDate = toGregorian(state.form.hijriBirthdate.getFullYear(), state.form.hijriBirthdate.getMonth() + 1, state.form.hijriBirthdate.getDate());
    state.form.gregorianBirthdate = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd)
  }
}

const goBack = () => {
  router.push("/admin-panel/charity-representatives");
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
a {
  text-decoration: none;
}
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
  right: 0.75rem;
}
</style>
