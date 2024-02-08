<template>
  <form class="form w-100" v-if="requestDetails && requestDetails.requestInfo">
    <div class="row">
      <div class="col-lg-6">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="chairman_name"
                type="text"
                :disabled="disabled"
                v-model="requestDetails.requestInfo.chairman_name"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.chairman_name,
                  },
                ]"
              />
              <label for="chairman_name">اسم مدير الجمعية</label>
            </span>
            <label class="not-edited-label">هذا الحقل لا يمكن تحريره.</label>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="national_id"
                type="number"
                v-model="requestDetails.requestInfo.national_id"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.national_id,
                  },
                ]"
                :disabled="disabled"
              />
              <label for="national_id">رقم الهوية</label>
            </span>
            <label class="not-edited-label">هذا الحقل لا يمكن تحريره.</label>
          </div>
        </div>
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="email"
                type="email"
                v-model="requestDetails.requestInfo.email"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.email,
                  },
                ]"
                :disabled="disabled"
              />
              <label for="email">البريد الإلكتروني</label>
            </span>
            <label class="not-edited-label">هذا الحقل لا يمكن تحريره.</label>
          </div>
        </div>
        <div class="form-label-group">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="mobile_number"
                type="number"
                maxLength="10"
                v-model="requestDetails.requestInfo.mobile_number"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.mobile_number,
                  },
                ]"
                :disabled="disabled"
              />
              <label for="mobile_number">رقم الجوال</label>
            </span>
            <label class="not-edited-label">هذا الحقل لا يمكن تحريره.</label>
          </div>
        </div>
        <div class="row">
          <div class="form-label-group col-lg-6">
            <div class="mt-4">
              <span class="p-float-label">
                <Calendar
                  id="gregorian_birthdate"
                  v-model="requestDetails.requestInfo.gregorian_birthdate"
                  :class="[
                    'w-100',
                    {
                      'p-invalid':
                        submitted &&
                        !requestDetails.requestInfo.gregorian_birthdate,
                    },
                  ]"
                  dateFormat="yy-mm-dd"
                  :disabled="disabled"
                />
                <label for="gregorian_birthdate">تاريخ الميلاد (ميلادي)</label>
              </span>
            </div>
          </div>

          <div class="form-label-group col-lg-6">
            <div class="mt-4">
              <span class="p-float-label">
                <HijriCalendar
                  id="hijri_birthdate"
                  v-model="requestDetails.requestInfo.hijri_birthdate"
                  :class="[
                    'w-100',
                    {
                      'p-invalid':
                        submitted && !requestDetails.requestInfo.hijri_birthdate,
                    },
                  ]"
                  dateFormat="yy-mm-dd"
                  :disabled="disabled"
                  :monthNames="$store.state.hijriMonthNames"
                  :monthNamesShort="$store.state.hijriMonthNamesShort"
                />
                <label for="hijri_birthdate">تاريخ الميلاد (هجري)</label>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import Calendar from "@/components/layout/calendar";

export default {
  name: "accordian-content-2",
  props: ["requestDetails"],
  components: { Calendar },
  data() {
    return {
      submitted: false,
      disabled: true,
      error: null,
    };
  },
};
</script>

<style lang="scss" scoped>
.not-edited-label {
  font-size: 14px;
  color: #3f3f3f;
  margin-top: 5px;
}

:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 12px;
  color: #6c757d;
}
.p-component:disabled {
  background-color: #ececec !important;
  border-color: #d9d9d9 !important;
  color: #8c8c8c !important;
}

label {
  font-size: 12px;
  color: #6c757d;
}
</style>
