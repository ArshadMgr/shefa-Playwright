<template>
  <div>
    <div class="welcome-container row">
      <div class="col-12 title">بيانات مدير الجمعية:</div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="information-container mt-2 mb-2">
          <img
            style="margin-right: 1rem"
            src="../../../assets/images/info.png"
            alt="info"
            height="20px"
            width="20px"
          />
          <div style="margin-right: 0.5rem">
            يلزم أن يكون المسجل مدير الجمعية.
          </div>
        </div>
      </div>
    </div>

    <form class="form-step1 w-100">
      <div class="form-label-group mb-3">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="national_id"
              type="number"
              v-model="payload.national_id"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    submitted && (!payload.national_id || !verified_national_id)
                      ? true
                      : false,
                },
              ]"
              :disabled="loading || $parent.verified_info.first_name"
            />
            <label for="national_id">رقم الهوية</label>
          </span>
        </div>
      </div>

      <div class="form-label-group mb-3">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="email"
              type="email"
              v-model="payload.email"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    (submitted && !payload.email) ||
                    (payload.email && !verified_email)
                      ? true
                      : false,
                },
              ]"
              :disabled="
                loading ||
                payload.is_email_verified ||
                $parent.verified_info.first_name
              "
            />
            <label for="email">البريد الإلكتروني</label>
          </span>
          <div
            v-if="payload.email && !verified_email"
            class="invalid-email-label"
            style="color: #e24c4c"
          >
            الرجاء إدخال عنوان بريد إلكتروني صالح
          </div>
        </div>
      </div>

      <div class="form-label-group">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="mobile_number"
              maxLength="10"
              v-model="payload.mobile_number"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    !!((submitted && !payload.mobile_number) ||
                    (payload.mobile_number && !verify_mobile(payload.mobile_number))),
                },
              ]"
              :disabled="
                loading ||
                payload.is_mobile_verified ||
                $parent.verified_info.first_name
              "
            />
            <label for="mobile_number">رقم الجوال</label>
          </span>
          <div
            v-if="payload.mobile_number && !verify_mobile(payload.mobile_number)"
            class="invalid-email-label"
            style="color: #e24c4c"
          >
            الرجاء إدخال رقم جوال صحيح
          </div>
        </div>
      </div>

      <div class="row">
        <div class="form-label-group col-lg-6">
          <div class="mt-4">
            <span class="p-float-label">
              <Calendar
                @date-select="convertDateType('hijri')"
                class="w-100"
                id="gregorian_birthdate"
                v-model="payload.gregorian_birthdate"
                :maxDate="$parent.gregorian_max_date"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !payload.gregorian_birthdate ? true : false,
                  },
                ]"
                :disabled="loading || $parent.verified_info.first_name"
                dateFormat="yy-mm-dd"
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
                v-model="payload.hijri_birthdate"
                :maxDate="$parent.hijri_max_date"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !payload.hijri_birthdate ? true : false,
                  },
                ]"
                :disabled="loading || $parent.verified_info.first_name"
                dateFormat="yy-mm-dd"
                :monthNames="$store.state.hijriMonthNames"
                :monthNamesShort="$store.state.hijriMonthNamesShort"
              />

              <label for="hijri_birthdate">تاريخ الميلاد (هجري)</label>
            </span>
          </div>
        </div>
      </div>

      <div class="accept-checkbox mt-3">
        <Checkbox
          v-model="payload.the_charity_manager_is_the_chairman"
          :binary="true"
          inputId="chkbox1"
          :disabled="loading"
        />
        <label for="chkbox1"> مدير الجمعية هو رئيس مجلس إدارتها؟ </label>
      </div>
      <div v-if="!payload.the_charity_manager_is_the_chairman">
        <div class="form-label-group mb-3">
          <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="chairman_name"
              type="text"
              v-model="payload.chairman_name"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    submitted && !payload.chairman_name ? true : false,
                },
              ]"
            />
            <label for="chairman_name">اسم رئيس مجلس الإدارة</label>
          </span>
          </div>
        </div>
        <div class="form-label-group">
          <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="chairman_mobile"
              maxLength="10"
              v-model="payload.chairman_mobile"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    (submitted && !payload.chairman_mobile) ||
                    (payload.chairman_mobile && !verify_mobile(payload.chairman_mobile))
                      ? true
                      : false,
                },
              ]"
              :disabled="
                loading ||
                payload.is_chairman_mobile_verified ||
                payload.the_charity_manager_is_the_chairman
              "
            />
            <label for="chairman_mobile">رقم جوال رئيس مجلس الإدارة</label>
          </span>
            <div
              v-if="payload.chairman_mobile && !verify_mobile(payload.chairman_mobile)"
              class="invalid-email-label"
              style="color: #e24c4c"
            >
              الرجاء إدخال رقم جوال صحيح
            </div>
          </div>
        </div>
      </div>
    </form>

    <div class="border-container"></div>

    <div class="row">
      <div class="col-lg-6">
        <button
          id="close-btn"
          class="btn btn-lg btn-secondary btn-block close-btn"
          type="button"
          :disabled="loading"
          @click.stop="$emit('close')"
        >
          إغلاق
        </button>
      </div>
      <div class="col-lg-6">
        <button
          id="tracking-btn"
          class="btn btn-lg btn-primary btn-block tracking-btn"
          type="button"
          :disabled="loading"
          @click.stop="submit"
        >
          متابعة
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from "primevue/checkbox";
import moment from "moment";
import { toGregorian, toHijri } from "hijri-converter";

import CharityRegisterService from "../../../services/charity-register.service";

export default {
  name: "create-account-step1",
  props: ["payload"],
  emits: ["close", "next", "openVerificationStep1"],
  components: { Checkbox },
  data() {
    return {
      loading: false,
      error: null,
      submitted: false,
    };
  },
  methods: {
    convertDateType(toType) {
      if (toType === "hijri") {
        const hijriDate = toHijri(
          this.payload.gregorian_birthdate.getFullYear(),
          this.payload.gregorian_birthdate.getMonth() + 1,
          this.payload.gregorian_birthdate.getDate()
        );
        this.payload.hijri_birthdate = new Date(
          hijriDate.hy,
          hijriDate.hm - 1,
          hijriDate.hd
        );
      }
      if (toType === "gregorian") {
        const gregorianDate = toGregorian(
          this.payload.hijri_birthdate.getFullYear(),
          this.payload.hijri_birthdate.getMonth() + 1,
          this.payload.hijri_birthdate.getDate()
        );
        this.payload.gregorian_birthdate = new Date(
          gregorianDate.gy,
          gregorianDate.gm - 1,
          gregorianDate.gd
        );
      }
    },
    submit() {
      this.submitted = true;
      if (
        this.payload.national_id &&
        this.verified_national_id &&
        this.payload.email &&
        this.verified_email &&
        this.payload.mobile_number &&
        this.verify_mobile(this.payload.mobile_number) &&
        this.payload.gregorian_birthdate &&
        this.payload.hijri_birthdate
      ) {
        if (this.payload.the_charity_manager_is_the_chairman) {
          this.payload.chairman_name = '';
          this.payload.chairman_mobile = '';
        }
        if (!this.payload.the_charity_manager_is_the_chairman && (!this.payload.chairman_name || !this.verify_mobile(this.payload.chairman_mobile))) {
          return;
        }

        const payload = {
          national_id: this.payload.national_id,
          hijri_birthdate: moment(this.payload.hijri_birthdate).format(
            "YYYY-MM-DD"
          ),
          gregorian_birthdate: moment(this.payload.gregorian_birthdate).format(
            "YYYY-MM-DD"
          ),
          mobile_number: this.payload.mobile_number,
          email: this.payload.email,
          the_charity_manager_is_the_chairman:
            this.payload.the_charity_manager_is_the_chairman,
        };

        this.loading = true;
        this.error = null;

        CharityRegisterService.step1(this.payload.id, payload)
          .then(({ data }) => {
            if (
              !this.payload.is_mobile_verified ||
              !this.payload.is_email_verified ||
              !this.$parent.verified_info.first_name
            ) {
              this.$emit("openVerificationStep1", data.result.id);
            } else {
              this.$emit("next");
            }
          })
          .catch((error) => {
            this.error = error;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    verify_mobile(number) {
      const pattern =
        /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
      const result = pattern.test(number);

      return result;
    }
  },
  computed: {
    verified_mobile() {
      const pattern =
        /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
      const result = pattern.test(this.payload.mobile_number);

      return result;
    },
    verified_email() {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = pattern.test(this.payload.email);

      return result;
    },
    verified_national_id() {
      return (
        this.payload.national_id &&
        this.payload.national_id.length &&
        this.payload.national_id.length == 10
      );
    },
  },
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
.information-container {
  color: #696cff;
  background-color: #e9e9ff;
  border-radius: 5px;
  height: 60px;
  font-size: 16px;
  border-right: 5px solid #696cff;
  display: flex;
  align-items: center;
}
.accept-checkbox {
  label {
    font-size: 14px;
    color: #3f3f3f;
    margin-right: 5px;
  }
}
.invalid-email-label {
  font-size: 14px;
  margin-top: 0.25rem;
}
.border-container {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
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
</style>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
