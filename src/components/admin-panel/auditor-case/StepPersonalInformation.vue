<template>
  <div>
    <div v-if="!editMode" class="welcome-container row">
      <div class="col-12 title">البيانات الشخصية</div>
    </div>

    <form
      class="form-personal-information w-100"
      @submit.prevent="submit(!v$.$invalid)"
    >
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label" data-cy="identity-type">
              <InputText
                id="identityType"
                type="text"
                :disabled="!dataToBeModified.includes('identityType')"
                v-model="caseIdentityInformation.identityType"
                class="w-100"
              />
              <label for="identityType">نوع الهوية</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('identityType')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label" data-cy="identity-number">
              <InputText
                id="identityNumber"
                type="text"
                :disabled="!dataToBeModified.includes('identityNumber')"
                v-model="caseIdentityInformation.identityNumber"
                class="w-100"
              />
              <label for="identityNumber">رقم الهوية</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('identityNumber')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label" data-cy="gregorian-birthdate">
              <InputText
                id="gregorianBirthdate"
                type="text"
                :disabled="!dataToBeModified.includes('gregorianBirthdate')"
                v-model="caseIdentityInformation.gregorianBirthdate"
                class="w-100"
              />
              <label for="gregorianBirthdate">تاريخ الميلاد (ميلادي)</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('gregorianBirthdate')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label" data-cy="hijri-birthdate">
              <InputText
                id="hijriBirthdate"
                type="text"
                :disabled="!dataToBeModified.includes('hijriBirthdate')"
                v-model="caseIdentityInformation.hijriBirthdate"
                class="w-100"
              />
              <label for="hijriBirthdate">تاريخ الميلاد (هجري)</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('hijriBirthdate')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row" :class="{ 'mt-4': !editMode }">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="firstname"
                type="text"
                :disabled="!dataToBeModified.includes('firstName')"
                v-model="payload.firstName"
                class="w-100"
              />
              <label for="firstname">الاسم الأول</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('firstName')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="fatherName"
                type="text"
                :disabled="!dataToBeModified.includes('fatherName')"
                v-model="payload.fatherName"
                class="w-100"
              />
              <label for="fatherName">اسم الأب</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('fatherName')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="familyName"
                type="text"
                :disabled="!dataToBeModified.includes('lastName')"
                v-model="payload.lastName"
                class="w-100"
              />
              <label for="familyName">اسم العائلة</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('lastName')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="nationality"
                type="text"
                :disabled="!dataToBeModified.includes('nationality')"
                v-model="payload.nationality"
                class="w-100"
              />
              <label for="nationality">الجنسية</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('nationality')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label" data-cy="id-expiration">
              <InputText
                id="idExpiration"
                type="text"
                :disabled="!dataToBeModified.includes('idExpiration')"
                v-model="payload.idExpiration"
                class="w-100"
              />
              <label for="idExpiration">تاريخ انتهاء الهوية</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('idExpiration')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="sex"
                type="text"
                :disabled="!dataToBeModified.includes('gender')"
                v-model="payload.gender"
                class="w-100"
              />
              <label for="sex">الجنس</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('gender')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="age"
                type="text"
                :disabled="!dataToBeModified.includes('age')"
                v-model="payload.age"
                class="w-100"
              />
              <label for="age">العمر</label>
            </span>
            <span class="font-smaller" v-if="!dataToBeModified.includes('age')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row mt-4" :class="{ 'row-align': editMode }">
        <div class="form-label-group mb-3 mt-auto">
          <div
            v-if="
              dataToBeModified.includes('area') ||
              dataToBeModified.includes('city')
            "
          >
            <label class="top-label">المنطقة</label>
            <Dropdown
              class="w-100"
              optionLabel="name"
              optionValue="id"
              :disabled="
                !(
                  dataToBeModified.includes('area') ||
                  dataToBeModified.includes('city')
                )
              "
              v-model="payload.area"
              @change="getCitiesOptions"
              :options="props.regionOptions"
              placeholder="المنطقة"
            />
          </div>

          <span
            v-else-if="props.regionOptions && props.regionOptions.length"
            class="p-float-label"
            data-cy="region"
          >
            <InputText
              id="region"
              type="text"
              disabled
              v-model="
                props.regionOptions.find((each) => each.id === payload.area)
                  .name
              "
              class="w-100"
            />
            <label for="region">المنطقة</label>
          </span>
        </div>
      </div>

      <div class="row">

        <div class="form-label-group mb-3 mt-4">
          <div
            v-if="
              dataToBeModified.includes('area') ||
              dataToBeModified.includes('city')
            "
          >
            <label class="top-label">المدينة</label>
            <Dropdown
              v-if="state.cityOptions.length"
              class="w-100"
              optionLabel="name"
              optionValue="id"
              :disabled="
                !(
                  dataToBeModified.includes('area') ||
                  dataToBeModified.includes('city')
                )
              "
              :filter="true"
              emptyFilterMessage="لا يوجد نتائج"
              v-model="payload.city"
              :options="state.cityOptions"
              placeholder="المدينة"
              emptyMessage="Choose region first"
            />
          </div>
          <span
            v-else-if="props.cityOptions && props.cityOptions.length"
            class="p-float-label"
            data-cy="city"
          >
            <InputText
              id="city"
              type="text"
              disabled
              v-model="state.cityName"
              class="w-100"
            />
            <label for="city" class="top-label" style="margin-right: 0rem"
              >المدينة</label
            >
          </span>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label" data-cy="address">
              <InputText
                class="w-100"
                id="address"
                type="text"
                :disabled="!dataToBeModified.includes('address')"
                v-model="payload.address"
                :class="{ 'p-invalid': v$.address.$invalid && state.validated }"
              />
              <label for="address">الحي</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('address')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <div class="mt-4">
            <span class="p-float-label" data-cy="phone-number">
              <InputMask
                mask="05-99999999"
                class="w-100"
                name="mobile"
                id="mobile"
                :disabled="!dataToBeModified.includes('mobile_number')"
                :class="{
                  'p-invalid': v$.mobileNumber.$invalid && state.validated,
                }"
                v-model="payload.mobileNumber"
              />
              <label for="mobile">رقم الهاتف</label>
            </span>
            <span
              class="font-smaller"
              v-if="!dataToBeModified.includes('mobile_number')"
              >هذا الحقل لا يمكن تحريره</span
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-label-group mb-3">
          <label class="top-label">صورة الهوية</label>
          <div
            v-if="dataToBeModified.includes('id_photo') || !props.payload.idPhoto"
            :class="{
              'file-input-invalid': v$.idPhoto.$invalid && state.validated,
            }"
          >
            <FileUpload
              @select="fileSelected($event, 'idPhoto')"
              name="photo"
              url="./upload"
              accept="image/jpg, image/jpeg, image/png, .pdf"
              chooseLabel="صورة الهوية"
              chooseIcon="pi pi-upload"
              :disabled="readOnly || !dataToBeModified.includes('id_photo')"
              :multiple="false"
              :showCancelButton="false"
              :showUploadButton="false"
              :previewWidth="!state.form.idPhoto.objectURL ? 0 : 70"
            >
              <template
                v-if="props.payload.idPhoto && state.initialImageLoaded"
                #content>
                <div class="p-fileupload-file">
                  <img
                    :src="props.payload.idPhoto"
                    class="p-fileupload-file__image"
                    alt="Photo id" />
                  <span class="p-fileupload-file__file-name">
                    {{getFileName()}}
                  </span>
                  <div
                    class="d-flex justify-content-between align-items-center">
                    <Button
                      @click.stop="downloadDocument(props.payload.idPhoto)"
                      class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center"
                    >
                      <div class="download-icon"></div>
                      تحميل
                    </Button>
                    <Button
                      v-if="dataToBeModified.includes('id_photo')"
                      style="margin-right: 0.5rem"
                      icon="pi pi-times"
                      @click="removeFile()"
                      class="p-button-outlined p-button-danger p-button-rounded"
                    />
                  </div>
                </div>
              </template>
            </FileUpload>
          </div>
          <div
            v-else-if="props.payload.idPhoto"
            class="d-flex justify-content-between align-items-center attachment-photo">
            <div class="d-flex justify-content-between align-items-center">
              <img
                :src="props.payload.idPhoto"
                class="file-image"
                alt="Photo id"
                height="53"
                width="71"
              />
              <span class="file-name" data-cy="photo-name">{{ getFileName() }}</span>
            </div>
            <div>
              <Button
                @click.stop="downloadDocument(props.payload.idPhoto)"
                class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center"
              >
                <div class="download-icon"></div>
                تحميل
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="row border-top-spacer" v-if="!editMode">
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
import { defineProps, reactive, onMounted } from "vue";
import Dropdown from "primevue/dropdown";
import InputMask from "primevue/inputmask";
import FileUpload from "primevue/fileupload";
import EnumService from "@/services/enum.service";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import MediaService from "@/services/media.service";

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
  cityName: ""
});

const rules = {
  address: { required },
  mobileNumber: { required },
  idPhoto: { required },
};

const v$ = useVuelidate(rules, state.form);

const fileSelected = (event, keyName) => {
  state.initialImageLoaded = false;
  state.form[keyName] = event.files[0];
  props.payload[keyName] = event.files[0];
};
const getFileName = () => {
  return typeof props.payload.idPhoto === 'string' ? props.payload.idPhoto.split("/")[
    props.payload.idPhoto.split("/").length - 1
  ]: props.payload.idPhoto?.name;
};
const removeFile = () => {
  props.payload.idPhoto = "";
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
  emit("previous");
};

const submit = () => {
  state.validated = true;
  if (v$.value.$invalid) {
    return;
  }
  state.submitted = true;
  emit("submit", state.form);
};

onMounted(() => {
  state.cityName = props.cityOptions?.find((each) => each.id === props.payload.city)?.name
})

defineExpose({ state: state.form });
</script>

<style lang="scss" scoped>
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
.download-icon {
  background: url("../../../assets/icons/download-gray.svg");
  width: 14.5px;
  height: 14.5px;
  margin: 0 0.3rem;
}

.download-icon {
  transform: rotate(180deg);
}

.attachment-photo {
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  padding: 1rem;
}

.file-name {
  font-size: 14px;
  color: #8c8c8c;
  margin-right: 0.5rem;
}

.download-btn {
  border-radius: 25px;
  font-size: 14px;
  background-color: #d9d9d9;
  color: #3f3f3f;
  border: none;
}

.download-btn:hover {
  background-color: #b2b2b2;
  color: #3f3f3f;
}
</style>
