<template>
  <div>
    <div v-if="!editMode" class="welcome-container row">
      <div class="col-12 title">البيانات الشخصية</div>
    </div>
    <form
      class="form-personal-information w-100"
      @submit.prevent="submit(!v$.$invalid)"
    >
      <div class="row" v-if="editMode">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="identityType"
                data-cy="identity-type"
                type="text"
                disabled
                v-model="caseIdentityInformation.identityType"
                class="w-100"
                maxlength="100"
              />
              <label for="identityType">نوع الهوية</label>
            </span>
            <span class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row" v-if="editMode">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="identityNumber"
                data-cy="identity-number"
                type="text"
                disabled
                v-model="caseIdentityInformation.identityNumber"
                class="w-100"
                maxlength="100"
              />
              <label for="identityNumber">رقم الهوية</label>
            </span>
            <span class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row" v-if="editMode">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="gregorianBirthdate"
                data-cy="gregorian-birthdate"
                type="text"
                disabled
                v-model="caseIdentityInformation.gregorianBirthdate"
                class="w-100"
                maxlength="100"
              />
              <label for="gregorianBirthdate">تاريخ الميلاد (ميلادي)</label>
            </span>
            <span class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row" v-if="editMode">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="hijriBirthdate"
                data-cy="hijri-birthdate"
                type="text"
                disabled
                v-model="caseIdentityInformation.hijriBirthdate"
                class="w-100"
                maxlength="100"
              />
              <label for="hijriBirthdate">تاريخ الميلاد (هجري)</label>
            </span>
            <span class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row" :class="{ 'mt-4': !editMode }">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="firstname"
                data-cy="first-name"
                type="text"
                disabled
                v-model="payload.firstName"
                class="w-100"
                maxlength="100"
              />
              <label for="firstname">الاسم الأول</label>
            </span>
            <span class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="fatherName"
                data-cy="father-name"
                type="text"
                disabled
                v-model="payload.fatherName"
                class="w-100"
                maxlength="100"
              />
              <label for="fatherName">اسم الأب</label>
            </span>
            <span class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="familyName"
                data-cy="family-name"
                type="text"
                disabled
                v-model="payload.lastName"
                class="w-100"
                maxlength="100"
              />
              <label for="familyName">اسم العائلة</label>
            </span>
            <span class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="nationality"
                data-cy="nationality"
                type="text"
                disabled
                v-model="payload.nationality"
                class="w-100"
                maxlength="100"
              />
              <label for="nationality">الجنسية</label>
            </span>
            <span class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="idExpiration"
                data-cy="id-expiration"
                type="text"
                disabled
                v-model="payload.idExpiration"
                class="w-100"
                maxlength="100"
              />
              <label for="idExpiration">تاريخ انتهاء الهوية</label>
            </span>
            <span class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="sex"
                data-cy="sex"
                type="text"
                disabled
                v-model="payload.gender"
                class="w-100"
                maxlength="100"
              />
              <label for="sex">الجنس</label>
            </span>
            <span class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputNumber
                id="age"
                data-cy="age"
                v-model="state.form.age"
                disabled
                :class="['w-100', {
                'p-invalid': v$.age.$invalid && state.validated,
              }]"
              />
              <label for="age">العمر</label>
            </span>
            <span v-if="payload.age" class="font-smaller">هذا الحقل لا يمكن تحريره</span>
          </div>
        </div>
      </div>
      <div class="row" :class="{ 'row-align': editMode }">
        <div v-if="editMode" class="form-label-group mb-3 mt-auto">
          <div v-if="!readOnly">
            <label class="top-label">المنطقة</label>
            <Dropdown
              id="regionList"
              data-cy="region-dropdown"
              optionLabel="name"
              optionValue="id"
              :disabled="readOnly"
              v-model="state.form.area"
              @change="getCitiesOptions"
              :options="props.regionOptions"
              :filter="true"
              placeholder="المنطقة"
              :class="['w-100', {
                'p-invalid': !state.form.area && state.validated,
              }]"
            />
          </div>

          <span v-else class="p-float-label">
            <InputText
              id="region"
              data-cy="region-searchbox"
              type="text"
              disabled
              v-model="payload.area"
              class="w-100"
              maxlength="100"
            />
            <label for="region">المنطقة</label>
          </span>
        </div>
      </div>

      <div v-if="editMode" class="form-label-group mb-3 mt-auto">
        <div v-if="!readOnly">
          <label class="top-label">المدينة</label>
          <Dropdown
            v-if="state.cityOptions.length"
            id="cityList"
            optionLabel="name"
            optionValue="id"
            :disabled="(readOnly || state.cityOptions.length === 0)"
            :filter="true"
            v-model="state.form.city"
            :options="state.cityOptions"
            placeholder="المدينة"
            emptyMessage="Choose region first"
            data-cy="city-dropdown"
            :class="['w-100', {
                'p-invalid': !state.form.city && state.validated,
              }]"
          />
        </div>
        <span v-else class="p-float-label">
          <InputText
            id="city"
            type="text"
            data-cy="city-input"
            disabled
            v-model="state.form.city"
            class="w-100"
            maxlength="100"
          />
          <label for="city" class="top-label">المدينة</label>
        </span>
      </div>
      <div v-if="!editMode" class="row">
        <div class="form-label-group mb-3 col-lg-6" data-cy="state-from-area">
          <label class="top-label">المنطقة</label>

          <Dropdown
            id="regionList"
            optionLabel="name"
            optionValue="id"
            :disabled="readOnly"
            v-model="state.form.area"
            @change="getCitiesOptions"
            :options="props.regionOptions"
            :filter="true"
            placeholder="المنطقة"
            required
            :class="['w-100', {
                'p-invalid': !state.form.area && state.validated,
              }]"
          />
        </div>
        <div class="form-label-group mb-3 col-lg-6" data-cy="state-from-city">
          <label class="top-label">المدينة</label>
          <Dropdown
            id="cityList"
            optionLabel="name"
            optionValue="id"
            :disabled="(readOnly || state.cityOptions.length === 0)"
            :filter="true"
            v-model="state.form.city"
            :options="state.cityOptions"
            placeholder="المدينة"
            emptyMessage="Choose region first"
            required
            :class="['w-100', {
                'p-invalid': !state.form.city && state.validated,
              }]"
          />
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <div class="p-float-label" data-cy="address">
              <InputText
                class="w-100"
                id="address"
                type="text"
                :disabled="readOnly"
                v-model="state.form.address"
                :class="{ 'p-invalid': v$.address.$invalid && state.validated }"
                maxlength="100"
              />
              <label for="address">الحي</label>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <div class="p-float-label">
              <div class="d-flex align-items-center" data-cy="mobile">
                <InputText
                  class="w-100"
                  name="mobile"
                  id="mobile"
                  :disabled="readOnly"
                  :useGrouping="false"
                  maxLength="10"
                  :class="{
                    'p-invalid': v$.mobileNumber.$invalid && state.validated,
                  }"
                  v-model="state.form.mobileNumber"
                />
                <label for="mobile">رقم الجوال</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <label class="top-label">صورة الهوية</label>
          <div
            :class="{
              'file-input-invalid': v$.idPhoto.$invalid && state.validated,
            }"
            data-cy="id-photo-upload"
           >
            <FileUpload
              @select="fileSelected($event, 'idPhoto')"
              @remove="removeFile('idPhoto')"
              name="photo"
              url="./upload"
              accept="image/jpg, image/jpeg, image/png, .pdf"
              chooseLabel="صورة الهوية"
              chooseIcon="pi pi-upload"
              :class="{'fileupload-hide': state.form.idPhoto}"
              class="fileupload-custom"
              :disabled="readOnly"
              :multiple="false"
              :showCancelButton="false"
              :showUploadButton="false"
              :previewWidth="!state.form.idPhoto.objectURL ? 0 : 70"
            >
              <template
                v-if="
                  state.form.idPhoto &&
                  state.initialImageLoaded
                "
                #content
              >
                <div class="p-fileupload-file">
                  <img
                    v-if="state.form.idPhoto?.objectURL"
                    :src="state.form.idPhoto.objectURL"
                    class="p-fileupload-file__image"
                    alt="Photo id"
                  />
                  <span class="p-fileupload-file__file-name">{{
                    state.form.idPhoto?.objectURL ? getFileName("objectURL") : state.form.idPhoto?.name
                  }}</span>
                  <Button
                    v-if="!readOnly"
                    icon="pi pi-times"
                    label="إلغاء"
                    @click="removeFile('idPhoto')"
                    class="p-button-secondary p-button-rounded"
                  />
                  <Button
                    v-if="readOnly || editMode"
                    icon="pi pi-download"
                    label=" تحميل "
                    @click.stop="downloadDocument(payload.idPhoto.objectURL)"
                    class="p-button-secondary p-button-rounded button-download"
                  />
                </div>
              </template>
            </FileUpload>
          </div>
        </div>
      </div>

      <div class="row border-top-spacer" v-if="!editMode">
        <div class="col-lg-6">
          <Button
            id="close-btn"
            data-cy="close-button"
            class="p-button-secondary p-button-rounded mx-2 w-100"
            type="button"
            label="السابق"
            @click.stop="goBack"
          />
        </div>
        <div class="col-lg-6" data-cy="tracking-btn">
          <Button
            id="tracking-btn"
            class="p-button-primary p-button-rounded mx-2 w-100"
            type="submit"
            label="متابعة"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { defineProps, onMounted, reactive, watch } from "vue";
import Dropdown from "primevue/dropdown";
import FileUpload from "primevue/fileupload";
import EnumService from "@/services/enum.service";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import MediaService from "@/services/media.service";

const props = defineProps({
  payload: {
    type: Object,
    required: true,
  },
  typeOptions: {
    type: Object,
    required: true,
  },
  regionOptions: {
    type: Object,
    required: true,
  },
  cityOptions: {
    type: Array,
    default: [],
    required: false,
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
  caseIdentityInformation: {
    type: Object,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["submit", "previous"]);

const state = reactive({
  form: Object.assign({}, props.payload),
  loading: false,
  error: "",
  cityOptions: props.cityOptions,
  submitted: false,
  validated: false,
  readOnlyInfo: {
    region: "",
    city: "",
  },
  initialImageLoaded: true,
});

watch(() => props.payload.age, (newPayload) => {
  state.form.age = newPayload;
})

const validMobileNumber = (value) => {
  return /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(value)
}

const rules = {
  address: { required },
  mobileNumber: { required, validMobileNumber },
  idPhoto: { required },
  age: { required }
};

onMounted(() => {
  getCitiesOptions({ value: state.form.area });
})

const v$ = useVuelidate(rules, state.form);

const fileSelected = (event, keyName) => {
  state.initialImageLoaded = false;
  state.form[keyName] = event.files[0];
};
const getFileName = (file) => {
  return state.form.idPhoto[file].split("/")[
    state.form.idPhoto[file].split("/").length - 1
  ];
};
const removeFile = (file) => {
  state.form[file] = "";
};

const downloadDocument = (url) => {
  MediaService.downloadFile(url);
};

const getCitiesOptions = async (regionId) => {
  try {
    state.loading = true;
    const { data } = await EnumService.cities(regionId.value);
    state.cityOptions = data.result;
  } catch (error) {
    state.error = error;
  } finally {
    state.loading = false;
  }
};
function checkIfExist(value) {
  return value ? value.label : "";
}
state.readOnlyInfo.region = checkIfExist(
  state.cityOptions[props.payload.city - 1]
);

const goBack = () => {
  const payload = {
    fatherName: props.payload.fatherName,
    firstName: props.payload.firstName,
    gender: props.payload.gender,
    idExpiration: props.payload.idExpiration,
    lastName: props.payload.lastName,
    nationality: props.payload.nationality || 'سعودي',
    age: state.form.age,
    address: state.form.address,
    area: state.form.area,
    city: state.form.city,
    idPhoto: state.form.idPhoto,
    mobileNumber: state.form.mobileNumber
  }
  emit("previous", payload);
};

const submit = () => {
  state.validated = true;
  if (v$.value.$invalid || !state.form.area || !state.form.city) {
    return;
  }
  state.submitted = true;
  const payload = {
    fatherName: props.payload.fatherName,
    firstName: props.payload.firstName,
    gender: props.payload.gender,
    idExpiration: props.payload.idExpiration,
    lastName: props.payload.lastName,
    nationality: props.payload.nationality || 'سعودي',
    age: state.form.age,
    address: state.form.address,
    area: state.form.area,
    city: state.form.city,
    idPhoto: state.form.idPhoto,
    mobileNumber: state.form.mobileNumber
  }
  emit("submit", payload);
};

defineExpose({ state: state.form });
</script>

<style lang="scss" scoped>
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
.font-smaller {
  font-size: 14px;
}
.row-align {
  align-self: start;
}
</style>
