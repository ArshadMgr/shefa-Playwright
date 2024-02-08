<template>
  <div>
    <div class="welcome-container row">
      <div class="col-12 title">بيانات عامة عن الجمعية:</div>
    </div>
    <form class="form-step1 w-100">
      <div class="form-label-group mb-3">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="charity_name"
              type="text"
              :disabled="loading"
              v-model="payload.charity_name"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    submitted && !payload.charity_name,
                },
              ]"
            />
            <label for="charity_name">اسم المؤسسة الخيرية</label>
          </span>
        </div>
      </div>
      <Dropdown
        optionLabel="name"
        optionValue="id"
        :disabled="loading"
        v-model="payload.charity_type"
        :class="[
          'w-100',
          {
            'p-invalid': submitted && !payload.charity_type,
          },
        ]"
        :options="type_options"
        placeholder="نوع الجمعية"
      />
      <Dropdown
        v-if="
          payload.charity_type &&
          type_options &&
          type_options.length &&
          type_options.find((e) => e.id === payload.charity_type).is_specialist
        "
        optionLabel="name"
        optionValue="id"
        :disabled="loading"
        v-model="payload.charity_specialization"
        :class="[
          'w-100 mb-2 mt-4',
          {
            'p-invalid':
              submitted && !payload.charity_specialization,
          },
        ]"
        :options="specialization_options"
        placeholder="التخصص الخيري"
      />
      <div class="row mb-2 mt-4">
        <div class="form-label-group mb-3 col-lg-6">
          <Dropdown
            :filter="true"
            emptyFilterMessage="لا يوجد نتائج"
            optionLabel="name"
            optionValue="id"
            :disabled="loading"
            v-model="payload.region"
            @change="regionChange"
            :class="[
              'w-100',
              {
                'p-invalid': submitted && !payload.region,
              },
            ]"
            :options="region_options"
            placeholder="المنطقة"
          />
        </div>
        <div class="form-label-group mb-3 col-lg-6">
          <Dropdown
            :filter="true"
            emptyFilterMessage="لا يوجد نتائج"
            optionLabel="name"
            optionValue="id"
            :disabled="!payload.region || loading"
            v-model="payload.city"
            :class="[
              'w-100',
              {
                'p-invalid': submitted && !payload.city,
              },
            ]"
            :options="city_options"
            placeholder="المدينة"
          />
        </div>
      </div>
      <div v-if="!payload.charity_logo">
        <span
          :class="[
            'attachment-container',
            { 'in-valid': submitted && !payload.charity_logo },
          ]"
          @click.stop="$refs.charity_logo.$el.click()"
        >
          <img src="../../../assets/images/attachment.png" alt="attachment" />
          <span class="label">إرفاق شعار الجمعية</span>
        </span>
        <InputText
          ref="charity_logo"
          class="d-none"
          type="file"
          accept="image/png, image/jpg"
          :disabled="loading"
          @change="(event) => charityLogoChange(event)"
        />
      </div>
      <div v-else>
        <label class="association-label">إرفاق شعار الجمعية</label>
        <div
          class="association-logo d-flex align-items-center justify-content-between"
        >
          <div class="d-flex align-items-center">
            <div class="logo">
              <img :src="getImage(payload.charity_logo)" alt="charity_logo" />
            </div>
            <div class="logo-name">
              <div>
                {{ payload.charity_logo.name }}
              </div>
              <div>
                {{ getbytes(payload.charity_logo.size) }}
              </div>
            </div>
          </div>
          <div>
            <button
              class="btn btn-lg btn-primary btn-block cancel-btn"
              @click="$emit('removeFile', 'charity_logo')"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
      <div style="color: #3f3f3f; font-size: 13px" class="mb-3 mt-3">
        يفضل أن تكون خلفية الشعار شفافة. الأبعاد: px72X72. الملفات المقبولة: PNG
        أو JPG.
      </div>
      <div class="form-label-group mb-3">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="manager_name"
              type="text"
              :disabled="true"
              v-model="fullName"
              class="w-100"
            />
            <label for="manager_name">اسم مدير الجمعية</label>
          </span>
        </div>
      </div>
      <div class="form-label-group mb-3">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="charity_phone"
              v-model="payload.charity_phone"
              maxLength="10"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    (submitted && !payload.charity_phone) ||
                    (payload.charity_phone && !verified_phone)
                      ? true
                      : false,
                },
              ]"
              :disabled="loading"
            />
            <label for="charity_phone">رقم الجمعية (جوال أو هاتف)</label>
          </span>
          <div
            v-if="payload.charity_phone && !verified_phone"
            class="invalid-email-label"
            style="color: #e24c4c"
          >
            الرجاء إدخال رقم هاتف محمول أو خط أرضي صالح
          </div>
        </div>
      </div>
      <div class="form-label-group mb-3">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="charity_email"
              type="email"
              :disabled="loading || payload.is_charity_email_verified"
              v-model="payload.charity_email"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    (submitted && !payload.charity_email) ||
                    (payload.charity_email && !verified_email)
                      ? true
                      : false,
                },
              ]"
            />
            <label for="charity_email">بريد الجمعية الإلكتروني</label>
          </span>
          <div
            v-if="payload.charity_email && !verified_email"
            class="invalid-email-label"
            style="color: #e24c4c"
          >
            الرجاء إدخال عنوان بريد إلكتروني صالح
          </div>
        </div>
      </div>
      <div class="form-label-group mb-3">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="charity_website"
              type="text"
              :disabled="loading"
              v-model="payload.charity_website"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    submitted && !payload.charity_website ? true : false,
                },
              ]"
            />
            <label for="charity_website">موقع الجمعية الإلكتروني</label>
          </span>
        </div>
      </div>
      <div class="form-label-group mb-3">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="charity_location"
              type="text"
              :disabled="loading"
              v-model="payload.charity_location"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    submitted && !payload.charity_location ? true : false,
                },
              ]"
            />
            <label for="charity_location"
              >رابط موقع الجمعية في خرائط قوقل</label
            >
          </span>
        </div>
      </div>
      <div class="border-container"></div>
      <div class="welcome-container row">
        <div class="col-12 title">بيانات ترخيص الجمعية:</div>
      </div>
      <div class="form-step1 w-100">
        <div class="form-label-group">
          <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="charity_license_number"
              type="number"
              v-model="payload.charity_license_number"
              :disabled="loading"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    !!(submitted &&
                    (!payload.charity_license_number ||
                      (payload.charity_license_number && !verifyLicense))),
                },
              ]"
            />
            <label for="charity_license_number">رقم الترخيص</label>
          </span>
          </div>
        </div>
        <div class="row mb-2">
          <div class="form-label-group mb-3 col-lg-6">
            <div class="mt-4">
            <span class="p-float-label">
              <Calendar
                @date-select="convertDateType('hijri')"
                class="w-100"
                v-model="payload.license_expiry_gregorian_date"
                :minDate="$parent.gregorian_max_date"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !payload.license_expiry_gregorian_date,
                  },
                ]"
                :disabled="loading"
                dateFormat="yy-mm-dd"
              />
              <label for="license_expiry_gregorian_date"
              >تاريخ انتهاء الترخيص (ميلادي)</label
              >
            </span>
            </div>
          </div>
          <div class="form-label-group mb-3 col-lg-6">
            <div class="mt-4">
            <span class="p-float-label">
              <HijriCalendar
                @date-select="convertDateType('gregorian')"
                class="w-100"
                id="license_expiry_hijri_date"
                v-model="payload.license_expiry_hijri_date"
                :minDate="$parent.hijri_max_date"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !payload.license_expiry_hijri_date,
                  },
                ]"
                :disabled="loading"
                dateFormat="yy-mm-dd"
                :monthNames="$store.state.hijriMonthNames"
                :monthNamesShort="$store.state.hijriMonthNamesShort"
              />
              <label for="license_expiry_hijri_date"
              >تاريخ انتهاء الترخيص (هجري)</label
              >
            </span>
            </div>
          </div>
        </div>
        <div class="mb-3 mt-3" v-if="!payload.license_attachment">
        <span
          :class="[
            'attachment-container',
            {
              'in-valid':
                submitted && !payload.license_attachment,
            },
          ]"
          @click.stop="$refs.license_attachment.$el.click()"
        >
          <img src="../../../assets/images/attachment.png" alt="attachment" />
          <span class="label">إرفاق ملف الترخيص</span>
        </span>
          <InputText
            ref="license_attachment"
            type="file"
            accept="application/pdf"
            @change="(event) => licenseAttachmentChange(event)"
            class="d-none"
            :disabled="loading"
          />
        </div>
        <div v-else>
          <label class="association-label">إرفاق ملف الترخيص </label>
          <div
            class="association-logo d-flex align-items-center justify-content-between"
          >
            <div class="d-flex align-items-center">
              <div class="logo-name">
                <div>
                  {{ payload.license_attachment.name }}
                </div>
                <div>
                  {{ getbytes(payload.license_attachment.size) }}
                </div>
              </div>
            </div>
            <div>
              <button
                class="btn btn-lg btn-primary btn-block cancel-btn"
                @click="$emit('removeFile', 'license_attachment')"
              >
                إلغاء
              </button>
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
          @click.stop="$emit('close')"
        >
          السابق
        </button>
      </div>
      <div class="col-lg-6">
        <button
          id="tracking-btn"
          class="btn btn-lg btn-primary btn-block tracking-btn"
          type="button"
          @click.stop="submit"
        >
          متابعة
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "primevue/dropdown";

import EnumService from "../../../services/enum.service";
import {toGregorian, toHijri} from "hijri-converter";

export default {
  name: "create-account-step2",
  props: ["payload", "verified_info"],
  emits: ["close", "next", "fileChange", "charityTypeChange", "removeFile"],
  components: { Dropdown },

  data() {
    return {
      submitted: false,
      loading: false,
      error: null,
      type_options: [],
      specialization_options: [],
      region_options: [],
      city_options: [],
      fullName: `${this.verified_info.first_name} ${this.verified_info.father_name} ${this.verified_info.last_name}`,
    };
  },
  methods: {
    charityLogoChange(event) {
      const allowed_extention = ["png", "jpg"];
      const file_extention = event.target.files[0].name.split(".").pop();
      const file_size = event.target.files[0].size;
      if (allowed_extention.includes(file_extention) && file_size)
        this.$emit("fileChange", event, "charity_logo");
    },
    getImage(file) {
      return URL.createObjectURL(file);
    },
    getbytes(data) {
      const const_term = 1024;
      let KB, MB, GB, TB;

      KB = (data / const_term).toFixed(3);
      MB = (data / const_term ** 2).toFixed(3);
      GB = (data / const_term ** 3).toFixed(3);
      TB = (data / const_term ** 4).toFixed(3);

      if (TB > 0) {
        return TB + "TB";
      } else if (GB > 0) {
        return GB + "GB";
      } else if (MB > 0) {
        return MB + "MB";
      } else if (KB > 0) {
        return KB + "KB";
      }
    },
    submit() {
      this.submitted = true;
      if (
        this.payload.charity_name &&
        this.payload.charity_type &&
        this.payload.region &&
        this.payload.city &&
        this.payload.charity_logo &&
        this.payload.charity_phone &&
        this.verified_phone &&
        this.payload.charity_email &&
        this.verified_email &&
        this.payload.charity_website &&
        this.payload.charity_location &&
        this.payload.chairman_name &&
        this.payload.chairman_mobile &&
        this.verified_mobile &&
        this.payload.charity_license_number &&
        this.verifyLicense &&
        this.payload.license_expiry_hijri_date &&
        this.payload.license_expiry_gregorian_date &&
        this.payload.license_attachment
      ) {
        this.$emit("next");
      }
    },
    enum_types() {
      this.loading = true;
      this.error = null;

      EnumService.types()
        .then(({ data }) => {
          if (data.result.length) this.type_options = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    enum_specializations() {
      this.loading = true;
      this.error = null;

      EnumService.specializations()
        .then(({ data }) => {
          if (data.result.length) this.specialization_options = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    enum_regions() {
      this.loading = true;
      this.error = null;

      EnumService.regions()
        .then(({ data }) => {
          if (data.result.length) this.region_options = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    enum_cities(region_id) {
      this.loading = true;
      this.error = null;

      EnumService.cities(region_id)
        .then(({ data }) => {
          if (data.result.length) this.city_options = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    regionChange(data) {
      if (data) {
        this.enum_cities(data.value);
      }
    },
    convertDateType(toType) {
      if (toType === "hijri") {
        const hijriDate = toHijri(
          this.payload.license_expiry_gregorian_date.getFullYear(),
          this.payload.license_expiry_gregorian_date.getMonth() + 1,
          this.payload.license_expiry_gregorian_date.getDate()
        );
        this.payload.license_expiry_hijri_date = new Date(
          hijriDate.hy,
          hijriDate.hm - 1,
          hijriDate.hd
        );
      }
      if (toType === "gregorian") {
        const gregorianDate = toGregorian(
          this.payload.license_expiry_hijri_date.getFullYear(),
          this.payload.license_expiry_hijri_date.getMonth() + 1,
          this.payload.license_expiry_hijri_date.getDate()
        );
        this.payload.license_expiry_gregorian_date = new Date(
          gregorianDate.gy,
          gregorianDate.gm - 1,
          gregorianDate.gd
        );
      }
    },
    licenseAttachmentChange(event) {
      const allowed_extention = ["pdf"];
      const file_extention = event.target.files[0].name.split(".").pop();
      if (allowed_extention.includes(file_extention))
        this.$emit("fileChange", event, "license_attachment");
    },
  },
  mounted() {
    this.enum_types();
    this.enum_regions();
    this.enum_specializations();
    if(this.payload.region) {
      this.enum_cities(this.payload.region);
    }
    if (this.$props.payload.the_charity_manager_is_the_chairman) {
      this.$props.payload.chairman_name = this.fullName;
    }
  },
  computed: {
    verified_mobile() {
      const pattern =
        /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
      const result = pattern.test(this.payload.chairman_mobile);

      return result;
    },
    verified_phone() {
      const pattern1 = /^(01)([0-9]{8})$/;
      const pattern2 =
        /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;

      const result =
        pattern1.test(this.payload.charity_phone) ||
        pattern2.test(this.payload.charity_phone);

      return result;
    },
    verified_email() {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = pattern.test(this.payload.charity_email);

      return result;
    },
    verifyLicense() {
      return this.payload.charity_license_number.length &&
        this.payload.charity_license_number.length >= 1 &&
        this.payload.charity_license_number.length <= 4;
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
}
.attachment-container {
  cursor: pointer;
  background-color: #d9d9d9;
  border-radius: 25px;
  padding: 0.5rem 1rem;

  .label {
    color: #3f3f3f;
    font-size: 18px;
    font-weight: 500;
    margin-right: 0.5rem;
  }
}
.border-container {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
}

.attachment-container.in-valid {
  border: 1px solid red !important;
  background-color: transparent !important;
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

.invalid-email-label {
  font-size: 14px;
  margin-top: 0.25rem;
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

.association-logo {
  height: 80px;
  border-radius: 5px;
  border: 1px dashed #d9d9d9;
  padding: 10px 20px;
}

.association-label {
  font-size: 12px;
  left: 0rem;
  right: 0.75rem;
  position: relative;
}

.logo {
  height: 50px;
  width: 70px;
  background-color: #d9d9d9;
  margin-left: 1rem;
}
.logo img {
  height: 100%;
  width: 100%;
}
.logo-name {
  color: #8c8c8c;
  font-size: 14px;
}

.cancel-btn {
  border-radius: 25px;
  font-size: 14px;
  background-color: #d9d9d9;
  color: #3f3f3f;
  border: none;
}

.cancel-btn:hover {
  background-color: #b2b2b2;
  color: #3f3f3f;
}
</style>
