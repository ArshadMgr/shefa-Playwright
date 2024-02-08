<template>
  <form class="form w-100" v-if="requestDetails && requestDetails.requestInfo">
    <div class="row">
      <div class="col-lg-6">
        <div class="form-label-group">
          <div class="mt-5">
            <span class="p-float-label">
              <InputText
                id="charity_name"
                type="text"
                v-model="requestDetails.requestInfo.charity_name"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.charity_name,
                  },
                ]"
                :disabled="loading"
              />
              <label for="charity_name">اسم الجمعية</label>
            </span>
          </div>
        </div>
        <div class="form-label-group">
          <div class="mt-5">
            <span class="p-float-label">
              <InputText
                id="charity_email"
                type="email"
                v-model="requestDetails.requestInfo.charity_email"
                :disabled="true"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.charity_email,
                  },
                ]"
              />
              <label for="charity_email">بريد الجمعية الإلكتروني</label>
            </span>
          </div>
        </div>
        <div class="row mt-2rem">
          <div class="form-label-group mb-3 col-lg-6">
            <label>المنطقة</label>
            <Dropdown
              optionLabel="name"
              optionValue="id"
              :disabled="loading"
              v-model="requestDetails.requestInfo.region"
              @change="regionChange"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    submitted && !requestDetails.requestInfo.region,
                },
              ]"
              :options="region_options"
              placeholder="المنطقة"
            />
          </div>
          <div class="form-label-group mb-3 col-lg-6">
            <label>المدينة</label>
            <Dropdown
              optionLabel="name"
              optionValue="id"
              :disabled="!requestDetails.requestInfo.region || loading"
              v-model="requestDetails.requestInfo.city"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    submitted && !requestDetails.requestInfo.city,
                },
              ]"
              :options="city_options"
              placeholder="المدينة"
            />
          </div>
        </div>
        <div class="form-label-group">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="chairman_name"
                type="text"
                :disabled="loading"
                v-model="requestDetails.requestInfo.chairman_name"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.chairman_name,
                  },
                ]"
              />
              <label for="chairman_name">اسم رئيس مجلس الإدارة</label>
            </span>
          </div>
        </div>
        <div class="form-label-group">
          <div class="mt-5">
            <span class="p-float-label">
              <InputText
                id="chairman_mobile"
                type="text"
                :disabled="true"
                v-model="requestDetails.requestInfo.chairman_mobile"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.chairman_mobile,
                  },
                ]"
              />
              <label for="chairman_mobile">رقم جوال رئيس مجلس الإدارة</label>
            </span>
          </div>
        </div>
        <div class="form-label-group"
             v-show="requestDetails.requestInfo.charity_type === 2 &&
                        type_options &&
                        type_options.length &&
                        type_options.find((e) => e.id === requestDetails.requestInfo.charity_type).is_specialist"
        >
          <div class="mt-3">
            <label for="charity_name">التخصص</label>
            <Dropdown
                optionLabel="name"
                optionValue="id"
                :disabled="loading"
                v-model="requestDetails.requestInfo.charity_specialization"
                :class="[
          'w-100',
          {
            'p-invalid':
              submitted && !requestDetails.requestInfo.charity_specialization &&
              requestDetails.requestInfo.charity_type === 2,
          },
        ]"
                :options="specialization_options"
                placeholder="التخصص"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="mt-0">
          <label>شعار الجمعية</label>
          <div class="association-logo">
            <div class="d-flex align-items-center justify-content-between">
              <div class="logo"></div>
              <div class="logo-name" :title="requestDetails.requestInfo.charity_logo?.name || requestDetails.requestInfo.charity_logo">
                {{ requestDetails.requestInfo.charity_logo?.name || requestDetails.requestInfo.charity_logo }}
              </div>
              <div class="d-flex align-items-center">
                <button
                  class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center"
                  style="margin-left: 0.5rem"
                  type="button"
                  @click.stop="downloadDocument(requestDetails.requestInfo.charity_logo)">
                  <div class="download-icon"></div>
                  تحميل
                </button>
                <button
                  class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                  @click.stop="$refs.charity_logo.$el.click()"
                  type="button">
                  <div class="upload-icon"></div>
                  تعديل
                </button>
              </div>
            </div>
          </div>
          <InputText
            ref="charity_logo"
            class="d-none"
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            @change.stop="(event) => $emit('fileChange', event, 'charity_logo')"
          />
        </div>
        <div class="form-label-group">
          <div class="mt-5">
            <span class="p-float-label">
              <InputText
                id="charity_phone"
                type="number"
                v-model="requestDetails.requestInfo.charity_phone"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.charity_phone,
                  },
                ]"
                :disabled="loading"
              />
              <label for="charity_phone">رقم الجمعية (جوال أو هاتف)</label>
            </span>
          </div>
        </div>
        <div class="form-label-group">
          <div class="mt-5">
            <span class="p-float-label">
              <InputText
                id="charity_website"
                type="text"
                :disabled="loading"
                v-model="requestDetails.requestInfo.charity_website"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.charity_website,
                  },
                ]"
              />
              <label for="charity_website">موقع الجمعية الإلكتروني</label>
            </span>
          </div>
        </div>
        <div class="form-label-group">
          <div class="mt-5">
            <span class="p-float-label">
              <InputText
                id="charity_location"
                type="text"
                :disabled="loading"
                v-model="requestDetails.requestInfo.charity_location"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      submitted && !requestDetails.requestInfo.charity_location,
                  },
                ]"
              />
              <label for="charity_location"
              >رابط موقع الجمعية في خرائط قوقل</label
              >
            </span>
          </div>
        </div>
        <div class="form-label-group">
          <div class="mt-3">
            <label for="charity_name">نوع الجمعية</label>
            <Dropdown
                optionLabel="name"
                optionValue="id"
                :disabled="loading"
                :options="type_options"
                v-model="requestDetails.requestInfo.charity_type"
                @change='requestDetails.requestInfo.charity_specialization=null'
                :class="[
                'w-100',
                {
                  'p-invalid':
                    submitted && !requestDetails.requestInfo.charity_type,
                },
              ]"
                placeholder="نوع الجمعية"
            />
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import Dropdown from "primevue/dropdown";

import EnumService from "../../../services/enum.service";
import MediaService from "@/services/media.service";

export default {
  name: "accordian-content-1",
  props: ["requestDetails"],
  emits: ["fileChange"],
  components: { Dropdown },
  data() {
    return {
      submitted: false,
      loading: false,
      error: null,
      region_options: [],
      city_options: [],
      type_options: [],
      specialization_options: [],
    };
  },
  methods: {
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
    enum_types() {
      this.loading = true;
      this.error = null;

      EnumService.types()
          .then(({data}) => {
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
    regionChange(data) {
      if (data) this.enum_cities(data.value);
    },
    downloadDocument(url) {
      MediaService.downloadFile(url);
    }
  },
  mounted() {
    this.enum_regions();
    this.enum_types();
    this.enum_specializations();
    if (
      this.requestDetails &&
      this.requestDetails.requestInfo &&
      this.requestDetails.requestInfo.region
    ) {
      this.regionChange({ value: this.requestDetails.requestInfo.region });
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  height: 50px;
  flex: 0 0 70px;
  background-color: #d9d9d9;
  margin-left: 1rem;
}

.logo-name {
  color: #8c8c8c;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap !important;
}

.download-btn,
.modify-btn {
  border-radius: 25px;
  font-size: 14px;
  background-color: #d9d9d9;
  color: #3f3f3f;
  border: none;
}

.download-btn:hover,
.modify-btn:hover {
  background-color: #b2b2b2;
  color: #3f3f3f;
}

.association-logo {
  height: 80px;
  border-radius: 5px;
  border: 1px dashed #d9d9d9;
  padding: 10px 20px;
}

:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 16px;
}

.download-icon,
.upload-icon {
  background: url("../../../assets/icons/download-gray.svg");
  width: 14.5px;
  height: 14.5px;
  margin: 0 0.3rem;
}

.download-icon {
  transform: rotate(180deg);
}

label {
  font-size: 12px;
  color: #6c757d;
}

.mt-2rem {
  margin-top: 2rem;
}
</style>
