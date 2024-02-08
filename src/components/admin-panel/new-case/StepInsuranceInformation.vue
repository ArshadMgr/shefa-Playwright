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
            data-cy="insurance-company-input"
            type="text"
            v-model="state.form.insuranceCompany"
            class="w-100"
            disabled
            maxlength="100"
          />
          <label for="insuranceCompany">جهة التأمين</label>
        </span>
      </div>
    </div>

    <div class="form-label-group mb-3">
      <div class="mt-4">
        <span class="p-float-label">
          <InputText
            id="insuranceExpiry"
            data-cy="insurance-expiry-input"
            type="text"
            v-model="state.form.insuranceExpiry"
            class="w-100"
            disabled
            maxlength="100"
          />
          <label for="insuranceExpiry">تاريخ انتهاء التأمين</label>
        </span>
      </div>
    </div>

    <div class="form-label-group mb-3">
      <div class="mt-4">
        <span class="p-float-label">
          <InputText
            id="coverageMaximumAmount"
            data-cy="coverage-maximum-amount-input"
            type="text"
            v-model="state.form.coverageMaximumAmount"
            class="w-100"
            disabled
            maxlength="100"
          />
          <label for="coverageMaximumAmount">الحد الأعلى للتأمين</label>
        </span>
      </div>
    </div>

    <div class="form-label-group mb-3">
      <div class="mt-4">
        <div class="p-float-label">
          <div
            :class="{
              'file-input-invalid':
              isInsuranceRejectedFormRequired && !state.form.insuranceRejectedForm && state.submitted,
            }"
          >
            <FileUpload
              @select="fileSelected($event, 'insuranceRejectedForm')"
              @remove="removeFile('insuranceRejectedForm')"
              id="insuranceRejectedForm"
              data-cy="insurance-rejected-form-upload"
              name="demo[]"
              url="./upload"
              accept=".pdf"
              chooseLabel="خطاب رفض التأمين"
              chooseIcon="pi pi-upload"
              :class="{'fileupload-hide': state.form.insuranceRejectedForm}"
              class="fileupload-custom"
              :disabled="readOnly"
              :multiple="false"
              :showCancelButton="false"
              :showUploadButton="false"
            >
              <template
                v-if="
                  state.form.insuranceRejectedForm &&
                  state.initialInsurenceRejectedFormLoaded
                "
                #content
              >
                <div class="p-fileupload-file">
                  <span class="p-fileupload-file__file-name">{{ getFileName("insuranceRejectedForm") }}</span>
                  <Button
                    v-if="!readOnly"
                    data-cy="insurance-rejected-form-button"
                    icon="pi pi-times"
                    label="إلغاء"
                    @click="removeFile('insuranceRejectedForm')"
                    class="p-button-secondary p-button-rounded p-button-rounded"
                  />
                  <Button
                    v-if="readOnly || editMode"
                    icon="pi pi-download"
                    data-cy="download-button"
                    label=" تحميل "
                    @click.stop="downloadDocument(state.form.insuranceRejectedForm)"
                    class="p-button-secondary p-button-rounded button-download"
                  />
                </div>
              </template>
            </FileUpload>
          </div>
        </div>
      </div>
    </div>

    <div class="row border-top-spacer" v-if="!editMode">
      <div class="col-lg-6">
        <Button
          id="close-btn"
          data-cy="close-button"
          class="p-button-secondary p-button-rounded mx-2 w-100"
          label="السابق"
          type="button"
          @click.stop="goBack"
        />
      </div>
      <div class="col-lg-6" data-cy="tracking-button">
        <Button
          id="tracking-btn"
          class="p-button-primary p-button-rounded mx-2 w-100"
          label="متابعة"
          type="submit"
        />
      </div>
    </div>
  </form>
</template>
<script setup>
import { computed, defineProps, reactive } from "vue";
import FileUpload from "primevue/fileupload";
import MediaService from "@/services/media.service";

const props = defineProps({
  payload: {
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
});

const emit = defineEmits(["submit", "previous"]);

const state = reactive({
  form: Object.assign({}, props.payload),
  error: "",
  submitted: false,
  initialInsurenceRejectedFormLoaded: true
});

const fileSelected = (event, keyName) => {
  state.initialInsurenceRejectedFormLoaded = false;
  state.form[keyName] = event.files[0];
};
const getFileName = (file) => {
  if (state.form[file].name) {
    return state.form[file].name;
  } else {
    return state.form[file].split("/")[state.form[file].split("/").length - 1];
  }
};
const removeFile = (file) => {
  state.form[file] = "";
};
const downloadDocument = (url) => {
  MediaService.downloadFile(url);
};

const goBack = () => {
  let insuranceData = {};
  for (const [key, value] of Object.entries(state.form)) {
    if (value) {
      insuranceData[key] = value;
    }
  }
  emit("previous", insuranceData);
};

const submit = () => {
  state.submitted = true;
  if (isInsuranceRejectedFormRequired._value && !state.form.insuranceRejectedForm) {
    return;
  }
  let insuranceData = {};
  for (const [key, value] of Object.entries(state.form)) {
    if (value) {
      insuranceData[key] = value;
    }
  }
  emit("submit", insuranceData);
};

const isInsuranceRejectedFormRequired = computed(() => {
  return state.form.insuranceCompany ||
    state.form.insuranceExpiry ||
    state.form.coverageMaximumAmount;
});

defineExpose({ state: state.form });

</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/animations";
@import "@/styles/components/button";

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
  margin-right: 0.75rem;
  font-size: 14px;
  color: #8c8c8c;
}

.p-float-label label {
  right: 1.75rem;
  color: #8c8c8c;
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
</style>
