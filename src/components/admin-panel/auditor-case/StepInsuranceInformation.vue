<template>
  <div v-if="!editMode" class="welcome-container row">
    <div class="col-12 title">بيانات التأمين</div>
  </div>

  <form
    class="form-insurance-information w-100"
    @submit.prevent="submit"
  >
    <div class="form-label-group mb-3">
      <div class="mt-4">
        <span class="p-float-label">
          <InputText
            id="insuranceCompany"
            type="text"
            v-model="payload.insuranceCompany"
            class="w-100"
            :disabled="!dataToBeModified.includes('insuranceCompany')"
          />
          <label for="insuranceCompany" style="right: 0.75rem"
            >جهة التأمين</label
          >
        </span>
        <span
          class="font-smaller"
          v-if="!dataToBeModified.includes('insuranceCompany')"
        >
          هذا الحقل لا يمكن تحريره
        </span>
      </div>
    </div>

    <div class="form-label-group mb-3">
      <div class="mt-4">
        <span class="p-float-label">
          <InputText
            id="insuranceExpiry"
            type="text"
            v-model="payload.insuranceExpiry"
            class="w-100"
            :disabled="!dataToBeModified.includes('insuranceExpiry')"
          />
          <label for="insuranceExpiry" style="right: 0.75rem"
            >تاريخ انتهاء التأمين</label
          >
        </span>
        <span
          class="font-smaller"
          v-if="!dataToBeModified.includes('insuranceExpiry')"
        >
          هذا الحقل لا يمكن تحريره
        </span>
      </div>
    </div>

    <div class="form-label-group mb-3">
      <div class="mt-4">
        <span class="p-float-label">
          <InputText
            id="coverageMaximumAmount"
            type="text"
            v-model="payload.coverageMaximumAmount"
            class="w-100"
            :disabled="!dataToBeModified.includes('coverageMaximumAmount')"
          />
          <label for="coverageMaximumAmount" style="right: 0.75rem"
            >الحد الأعلى للتأمين</label
          >
        </span>
        <span
          class="font-smaller"
          v-if="!dataToBeModified.includes('coverageMaximumAmount')"
        >
          هذا الحقل لا يمكن تحريره
        </span>
      </div>
    </div>

    <div class="form-label-group mb-3">
      <div>
        <label for="insuranceRejectedForm" class="top-label"
          >خطاب رفض التأمين
        </label>
        <div
          v-if="dataToBeModified.includes('insurance_rejected_form')"
          :class="{
            'file-input-invalid':
              v$.insuranceRejectedForm.$invalid && state.validated,
          }"
        >
          <FileUpload
            @select="fileSelected($event, 'insuranceRejectedForm')"
            id="insuranceRejectedForm"
            name="demo[]"
            url="./upload"
            accept=".pdf"
            chooseLabel="خطاب رفض التأمين"
            chooseIcon="pi pi-upload"
            :disabled="
              state.submitted ||
              readOnly ||
              !dataToBeModified.includes('insurance_rejected_form')
            "
            :multiple="false"
            :showCancelButton="false"
            :showUploadButton="false"
          >
            <template
              v-if="
                props.payload.insuranceRejectedForm &&
                state.initialInsurenceRejectedFormLoaded
              "
              #content
            >
              <div class="p-fileupload-file">
                <span class="p-fileupload-file__file-name">{{
                  getFileName("insuranceRejectedForm")
                }}</span>
                <div class="d-flex justify-content-between align-items-center">
                  <Button
                    @click.stop="
                      downloadDocument(props.payload.insuranceRejectedForm)
                    "
                    class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center"
                  >
                    <div class="download-icon"></div>
                    تحميل
                  </Button>
                  <Button
                    v-if="dataToBeModified.includes('insurance_rejected_form')"
                    style="margin-right: 0.5rem"
                    icon="pi pi-times"
                    @click="removeFile('insuranceRejectedForm')"
                    class="p-button-outlined p-button-danger p-button-rounded"
                  />
                </div>
              </div>
            </template>
          </FileUpload>
        </div>
        <div
          v-else
          class="d-flex justify-content-between align-items-center attachment-photo"
        >
          <div>
            <span class="file-name">{{
              getFileName("insuranceRejectedForm")
            }}</span>
          </div>
          <div>
            <Button
              @click.stop="
                downloadDocument(props.payload.insuranceRejectedForm)
              "
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
</template>
<script setup>
import { defineProps, reactive, computed } from "vue";
import FileUpload from "primevue/fileupload";
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
});

const emit = defineEmits(["submit", "previous"]);

const state = reactive({
  form: Object.assign({}, props.payload),
  error: "",
  submitted: false,
  validated: false,
  initialInsurenceRejectedFormLoaded: true,
});

const requiredForInsurance = () => {
  return props.payload.insuranceCompany && props.payload.insuranceRejectedForm;
};

const rules = {
  insuranceRejectedForm: { requiredForInsurance },
};

const v$ = useVuelidate(rules, state.form);

const fileSelected = (event, keyName) => {
  state.initialInsurenceRejectedFormLoaded = false;
  state.form[keyName] = event.files[0];
  props.payload[keyName] = event.files[0];
};
const getFileName = (file) => {
  return state.form[file]?.split("/")[state.form[file]?.split("/").length - 1];
};
const removeFile = (file) => {
  state.form[file] = "";
};
const downloadDocument = (url) => {
  MediaService.downloadFile(url);
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
  emit("submit", state.form);
};

defineExpose({ state: state.form });
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
</style>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/animations";

.form {
  margin-bottom: 2rem;
  padding-block: 2rem;
  border-bottom: 1px solid #ececec;
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
.top-label {
  top: -0.75rem;
  margin-right: 0.75rem;
  font-size: 12px;
  color: #8c8c8c;
}
.p-float-label label {
  right: 1.75rem;
  font-size: 14px;
  color: #8c8c8c !important;
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
.checkbox-wrapper {
  label {
    color: #8c8c8c;
  }
}
.stage {
  width: 100%;
  border-top: 1px solid #ececec;
  margin-top: 30px;
}
.stage-action {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2rem;
  &__button {
    font-size: 18px;
    background-color: transparent;
    border: none;
    color: $color-primary;
    transition: 0.1s;
    &:hover,
    &:hover .icon-primary {
      color: #0e8e88;
    }
  }

  &--to-right {
    justify-content: start;
  }
}
.icon-primary {
  color: $color-primary;
  font-size: 20px;
  margin-right: 20px;
  margin-left: 20px;
}

.slide-enter-active {
  animation: slide-in 0.25s ease-in-out;
}
.slide-leave-active {
  animation: slide-in 0.25s ease-in-out reverse;
}
.file-input-invalid {
  border: 1px solid #e24c4c;
  border-radius: 5px;
}
input[disabled] {
  background: #ececec;
  border: 1px solid #ececec;
}

.border-top-spacer {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
}

.font-smaller {
  font-size: 14px;
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
