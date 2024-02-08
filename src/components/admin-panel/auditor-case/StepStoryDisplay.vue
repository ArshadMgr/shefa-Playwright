<template>
  <div
    v-for="(each, index) in payload.phases.filter(
      (each) =>
        each.story_title ||
        each.story_content ||
        (each.story_photo && each.story_photo !== '-')
    )"
    :key="index"
  >
    <div class="accept-label mt-4 text-end" v-if="index === 0">
      <span v-if="payload.phases?.length > 1">بيانات عرض المرحلة الأولى</span>
      <span v-if="payload.phases?.length === 1">بيانات عرض الحالة</span>
    </div>
    <div class="accept-label mt-4 text-end" v-if="index > 0">
      {{ index + 1 }} بيانات عرض المرحلة
    </div>
    <div class="row">
      <div class="form-label-group mb-3 col-6">
        <div class="mt-4">
          <label class="top-label">عنوان القصة</label>
          <span class="p-float-label" data-cy="story-title">
            <InputText
              class="w-100"
              id="story_title"
              v-model="each.story_title"
              placeholder="عنوان القصة"
              :disabled="isDisabled"
            />
          </span>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="form-label-group mb-3 col-6">
        <div class="text-area-wrapper" data-cy="shown-story">
          <label class="top-label">القصة المعروضة</label>
          <Textarea
            v-model="each.story_content"
            placeholder="تفاصيل القصة"
            :autoResize="true"
            rows="5"
            class="w-100"
            :disabled="isDisabled"
          />
        </div>
      </div>
      <div class="form-label-group mb-3 col-6">
        <label class="top-label">صورة القصة</label>

        <div
          class="d-flex justify-content-between align-items-center attachment-photo"
          v-if="isDisabled">
          <div class="d-flex justify-content-between align-items-center">
            <img
              :src="each.story_photo"
              class="file-image"
              alt="Photo id"
              height="53"
              width="71"
            />
            <span class="file-name" data-cy="story-photo">{{ getFileName(each.story_photo) }}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <Button
              @click.stop="downloadDocument(each.story_photo)"
              class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center"
            >
              <div class="download-icon"></div>
              تحميل
            </Button>
          </div>
        </div>
        <div v-else>
          <FileUpload
            @select="fileSelected($event, index, 'story_photo')"
            @remove="removeFile($event, index, 'story_photo')"
            :id="each.id + '_story_photo'"
            :name="'demo' + index"
            accept="image/*"
            chooseLabel="إرفاق صورة القصة"
            chooseIcon="pi pi-upload"
            :multiple="false"
            :showCancelButton="false"
            :showUploadButton="false"
            :disabled="!each.initialImageLoaded && each.story_photo"
            :class="{
              'p-invalid': !each.story_photo,
            }"
          >
            <template
              v-if="
                each.story_photo &&
                each.story_photo !== '-' &&
                each.initialImageLoaded
              "
              #content
            >
              <div class="p-fileupload-file">
                <img
                  :src="each.story_photo"
                  class="p-fileupload-file__image"
                  alt="Photo id"
                />
                <span class="p-fileupload-file__file-name">
                  {{getFileName(each.story_photo)}}
                </span>
                <div>
                  <Button
                    @click.stop="downloadDocument(each.story_photo)"
                    class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center"
                  >
                    <div class="download-icon"></div>
                    تحميل
                  </Button>
                </div>
              </div>
            </template>
          </FileUpload>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from "primevue/fileupload";
import MediaService from "@/services/media.service";

export default {
  props: ["payload", "status"],
  components: { FileUpload },
  data() {
    return {
      isDisabled:
      this.$props.status === 'مراحل متعددة' ? !(this.$props.payload?.phases[0]?.status === "Ready_to_be_Published" ||
        this.$props.payload?.phases[0]?.status === "Admin_Feedback_MA" ||
        this.$props.payload?.phases[0]?.status === "Published" ||
        this.$props.payload?.phases[0]?.status === "Temp_Pause"):

        !(this.$props.status === "جاهز للنشر" ||
          this.$props.status === "معاد من مدير النظام  إلى التسويقي" ||
          this.$props.status === "منشور" ||
          this.$props.status === "موقوف"),
    };
  },
  methods: {
    fileSelected(event, index, keyName) {
      this.payload.phases[index].initialImageLoaded = false;
      this.payload.phases[index][keyName] = event.files[0];
    },
    removeFile(event, index, keyName) {
      this.payload.phases[index][keyName] = null;
    },
    getFileName(file) {
      return file?.name || file?.split("/")[file?.split("/").length - 1];
    },
    downloadDocument(url) {
      MediaService.downloadFile(url);
    },
  },
  mounted() {
    this.payload.phases.forEach((phase) => {
      phase.initialImageLoaded = true;
    })
  }
};
</script>

<style lang="scss" scoped>
.accept-label {
  font-size: 14px;
  color: #59c9c4;
  direction: ltr;
}

.top-label {
  margin-right: 0.75rem;
  font-size: 14px;
  color: #8c8c8c;
}

.p-float-label label {
  right: 1.75rem;
  font-size: 14px;
  color: #8c8c8c !important;
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
