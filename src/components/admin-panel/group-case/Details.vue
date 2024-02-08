<template>
  <section class="group-cases-form">
    <div class="row">
      <div class="mt-4">
        <span class="p-float-label">
          <InputText
            class="w-100"
            id="title"
            v-model="state.form.title"
            :class="{
              'p-invalid': v$.title.$invalid && state.validated,
            }"
            :disabled="state.submitted || readOnly"
          />
          <label for="title">عنوان المجموعة</label>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="mt-4">
        <div>
          <label class="top-label">صورة المجموعة</label>
          <div
            :class="{
              'file-input-invalid': v$.photo.$invalid && state.validated,
            }"
          >
            <FileUpload
              @select="fileSelected($event, 'photo')"
              @remove="removeFile($event, 'photo')"
              id="photo"
              name="photo"
              url="./upload"
              accept="image/jpg, image/jpeg, image/png"
              chooseLabel="صورة المجموعة"
              chooseIcon="pi pi-upload"
              class="fileupload-custom"
              :class="{'fileupload-hide': state.form.photo}"
              :disabled="state.submitted || readOnly"
              :multiple="false"
              :showCancelButton="false"
              :showUploadButton="false"
            >
              <template v-if="state.form.photo && state.photoLoaded" #content>
                <div class="p-fileupload-file">
                  <img
                    :src="state.form.url"
                    class="p-fileupload-file__image"
                    alt="Photo id"
                  />
                  <span class="p-fileupload-file__file-name">{{
                    getFileName("photo")
                  }}</span>
                  <Button
                    v-if="!readOnly"
                    icon="pi pi-times"
                    label="إلغاء"
                    @click="removeFile($event, 'photo')"
                    class="p-button-secondary p-button-rounded p-button-rounded"
                  />
                  <Button
                    v-if="readOnly || editMode"
                    icon="pi pi-download"
                    label=" تحميل "
                    @click.stop="downloadDocument(state.form.photo)"
                    class="p-button-secondary p-button-rounded button-download"
                  />
                </div>
              </template>
            </FileUpload>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="mt-4 mb-3">
        <label class="top-label">قصة المجموعة</label>
        <div class="text-area-wrapper">
          <Textarea
            v-model="state.form.story"
            placeholder="تفاصيل القصة"
            :class="{ 'p-invalid': v$.story.$invalid && state.validated }"
            :disabled="readOnly"
            :autoResize="true"
            rows="5"
            class="w-100"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, reactive, onUpdated } from "vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import MediaService from "@/services/media.service";

import FileUpload from "primevue/fileupload";

const props = defineProps({
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

const state = reactive({
  form: Object.assign({}, props.payload),
  loading: false,
  submitted: false,
  validated: false,
  photoLoaded: true,
});

const fileSelected = (event, keyName) => {
  state.photoLoaded = false;
  state.form[keyName] = event.files[0];
};
const getFileName = (file) => {
  return state.form[file].split("/")[state.form[file].split("/").length - 1];
};
const removeFile = (event, file) => {
  state.form[file] = "";
};
const downloadDocument = (url) => {
  MediaService.downloadFile(url);
};

const rules = {
  title: { required },
  photo: { required },
  story: { required },
};

const v$ = useVuelidate(rules, state.form);

const emit = defineEmits(["submit", "filled"]);

const submit = () => {
  state.validated = true;
  if (v$.value.$invalid) {
    return;
  }
  state.submitted = true;
  emit("submit", state.form);
};

onUpdated(() => {
  if (state.form.title && state.form.story && state.form.photo) {
    emit("filled", true);
  } else {
    emit("filled", false);
  }
});

defineExpose({ state: state.form });
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
.group-cases-form {
  color: $color-font-lighter;
  width: 60%;
}
.top-label {
  margin-right: 0.75rem;
  font-size: 13px;
  color: $color-font-lighter;
}
::v-deep(.p-inputtext) {
  &::placeholder {
    color: $color-font-lighter;
  }
}
::v-deep(.p-float-label) {
  label {
    right: 0.75rem;
    left: unset;
    font-size: 14px;
    color: $color-font-lighter;
  }
}
.link-button {
  text-decoration: none;
  .p-button {
    .p-button-icon-left {
      display: none !important;
    }
  }
  .p-button .p-button-icon-left {
    margin-left: 0.5rem !important;
  }
}
::v-deep(.p-button-icon-left) {
  margin-left: 0.5rem;
  margin-right: 0;
}
</style>
