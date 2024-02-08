<template>
  <div>
    <form class="form-procedures w-100">
      <div class="form-procedures__select-group">
        <div class="row">
          <div class="form-label-group mb-3 col-6">
            <div class="mt-4" data-cy="action-drop-down">
              <label class="top-label">الاجراء</label>
              <Dropdown
                optionLabel="name"
                optionValue="value"
                :disabled="
                  readOnly ||
                  (actionOptions &&
                    actionOptions.length === 1 &&
                    actionOptions[0].name === 'قبول وارسال للتدقيق النهائي')"
                v-model="payload.action"
                class="w-100"
                :options="actionOptions"
                placeholder="الإجراء"
              />
            </div>
          </div>
        </div>
        <div
          class="accept-checkbox my-4"
          v-if="payload.action === 'Published'">
          <Checkbox
            v-model="payload.isPeriod"
            :binary="true"
            inputId="tempPeriod"
            id="tempPeriod"
          />
          <label for="tempPeriod">نشر الحالة لفترة مؤقتة؟</label>
        </div>
        <div class="row" v-if="payload.isPeriod && payload.action === 'Published'">
          <div class="form-label-group mb-3 col-2">
            <div class="mt-4">
              <span class="p-float-label">
                <InputNumber
                  :min="0"
                  id="publishDuration"
                  v-model="payload.publishDuration"
                  class="w-100"
                />
                <label for="publishDuration" style="right: 0.75rem"
                >مدة النشر (بالأيام)</label
                >
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="payload.action === 'Technical_Feedback_Charity' ||
            payload.action === 'Medical_Feedback_Charity' ||
            payload.action === 'Admin_Feedback_Charity'"
        >
          <div class="row">
            <div class="form-label-group mb-3 col-6">
              <div class="mt-4">
                <MultiSelect
                  optionLabel="label"
                  optionValue="value"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  :filter="true"
                  emptyFilterMessage="لا يوجد نتائج"
                  :disabled="readOnly"
                  v-model="payload.dataToBeModified"
                  class="w-100"
                  :options="personelDataOptions"
                  placeholder="تحديد البيانات المطلوب تعديلها"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-label-group mb-3 col-6">
              <div class="mt-4 text-area-wrapper">
                <label class="top-label">توصية / تعليق للجمعية</label>
                <Textarea
                  v-model="payload.charityFeedbackLogComment"
                  placeholder="يرجى كتابة توصية أو تعليق للجمعية"
                  :disabled="readOnly"
                  :autoResize="true"
                  rows="5"
                  class="w-100"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="
            payload.action === 'Final_Audit' &&
            (caseDetails.status === 'بانتظار الإعداد التسويقي' ||
              caseDetails.status === 'معاد من مدير النظام  إلى التسويقي') &&
            stepMedicalInformation.phases &&
            stepMedicalInformation.phases.length
          "
        >
          <div
            v-for="(each, index) in stepMedicalInformation.phases"
            :key="index">
            <div class="accept-label mt-4" v-if="index === 0">
              <span v-if="stepMedicalInformation.phases?.length > 1">بيانات عرض المرحلة الأولى</span>
              <span v-if="stepMedicalInformation.phases?.length === 1">بيانات عرض الحالة</span>
            </div>
            <div class="accept-label mt-4" v-if="index > 0">
              {{ index + 1 }} بيانات عرض المرحلة
            </div>
            <div class="row">
              <div class="form-label-group mb-3 col-6">
                <div class="mt-4">
                  <label class="top-label">عنوان القصة</label>
                  <span class="p-float-label" data-cy="story-title">
                    <InputText
                      class="w-100"
                      :id="`story_title${index}`"
                      v-model="each.story_title"
                      placeholder="عنوان القصة"
                      :class="{
                        'p-invalid': !each.story_title && isSubmitted,
                      }"
                    />
                  </span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-label-group mb-3 col-6">
                <label class="top-label">صورة القصة</label>
                <div
                  v-if="each.story_photo && each.story_photo !== '-'"
                  class="d-flex justify-content-between align-items-center attachment-photo"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <img
                      :src="each.story_photo.objectURL || each.story_photo"
                      class="file-image"
                      alt="Photo id"
                      height="53"
                      width="71"
                    />
                    <span class="file-name">{{ getFileName(each.story_photo) }}</span>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <Button
                      @click.stop="each.story_photo = null"
                      class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center"
                    >
                      <i class="pi pi-times mx-1"></i>
                      إلغاء
                    </Button>
                  </div>
                </div>
                <div v-else :class="{
                      'file-input-invalid': !each.story_photo && isSubmitted,
                    }" 
                  data-cy="story-photo">
                  <FileUpload
                    @select="fileSelected($event, index, 'story_photo')"
                    :id="each.id + '_story_photo'"
                    name="demo[]"
                    url="./upload"
                    accept="image/*"
                    chooseLabel="إرفاق صورة القصة"
                    chooseIcon="pi pi-upload"
                    :multiple="false"
                    :showCancelButton="false"
                    :showUploadButton="false"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-label-group mb-3 col-6">
                <div class="mt-4 text-area-wrapper" data-cy="shown-story">
                  <label class="top-label">القصة المعروضة</label>
                  <Textarea
                    v-model="each.story_content"
                    placeholder="تفاصيل القصة"
                    :disabled="readOnly"
                    :autoResize="true"
                    rows="5"
                    class="w-100"
                    :id="`content${index}`"
                    :class="{
                      'p-invalid': !each.story_content && isSubmitted,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="form-label-group mb-3 col-6">
            <div class="mt-4 text-area-wrapper" data-cy="internal-notes">
              <label class="top-label">ملاحظات داخلية (اختياري)</label>
              <Textarea
                v-model="payload.caseLogComment"
                placeholder="يرجى كتابة ملاحظة"
                :disabled="readOnly"
                :autoResize="true"
                rows="5"
                class="w-100"
              />
            </div>
          </div>
        </div>
        <div
          v-if="
            (caseDetails.status === 'بانتظار التدقيق الطبي' &&
              payload.action === 'Marketing_Audit') ||
            (caseDetails.status === 'معاد من مدير النظام  إلى الطبي' &&
              payload.action === 'Final_Audit')"
        >
          <div class="row">
            <div class="form-label-group mb-3 col-6">
              <div class="mt-4" data-cy="specialty">
                <label class="top-label">التخصص</label>
                <Dropdown
                  optionLabel="name"
                  optionValue="id"
                  :disabled="readOnly"
                  v-model="stepMedicalInformation.specialty"
                  class="w-100"
                  :options="medicalOptions.caseSpecialty"
                  placeholder="التخصص"
                  :filter="true"
                  :class="{
                    'p-invalid': !stepMedicalInformation.specialty && isSubmitted,
                  }"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-label-group mb-3 col-6">
              <div class="mt-4" data-cy="action-type">
                <label class="top-label">نوع الإجراء</label>
                <Dropdown
                  optionLabel="name"
                  optionValue="id"
                  :disabled="readOnly"
                  v-model="stepMedicalInformation.actionType"
                  class="w-100"
                  :options="medicalOptions.caseActionType"
                  placeholder="نوع الإجراء"
                  :filter="true"
                  :class="{
                    'p-invalid': !stepMedicalInformation.actionType && isSubmitted,
                  }"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-label-group mb-3 col-6">
              <div class="mt-4" data-cy="action-description">
                <label class="top-label">وصف الإجراء</label>
                <Dropdown
                  optionLabel="name"
                  optionValue="id"
                  :disabled="readOnly"
                  v-model="stepMedicalInformation.actionDescription"
                  class="w-100"
                  :options="medicalOptions.caseActionDescription"
                  placeholder="وصف الإجراء"
                  :filter="true"
                  :class="{
                    'p-invalid': !stepMedicalInformation.actionDescription && isSubmitted,
                  }"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-label-group mb-3 col-6">
              <div class="mt-4" data-cy="case-evaluation">
                <label class="top-label">تقييم الحالة</label>
                <Dropdown
                  optionLabel="name"
                  optionValue="id"
                  :disabled="readOnly"
                  v-model="stepMedicalInformation.evaluation"
                  class="w-100"
                  :options="medicalOptions.caseEvaluation"
                  placeholder="تقييم الحالة"
                  :filter="true"
                  :class="{
                    'p-invalid': !stepMedicalInformation.evaluation && isSubmitted,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            class="btn cus-btn"
            @click.prevent="submit"
            data-cy="save-btn"
          >
            حفظ
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import MultiSelect from "primevue/multiselect";
import FileUpload from "primevue/fileupload";
import MediaService from "@/services/media.service";

export default {
  props: [
    "payload",
    "actionOptions",
    "personelDataOptions",
    "medicalOptions",
    "stepMedicalInformation",
    "caseDetails"
  ],
  emits: ["toggleConfirmationModal"],
  components: { MultiSelect, FileUpload },
  data() {
    return {
      canSubmit: true,
      isSubmitted: false
    };
  },
  methods: {
    fileSelected(event, index, keyName) {
      this.stepMedicalInformation.phases[index][keyName] = event.files[0];
    },
    getFileName(file) {
      return file.name || file.split("/")[file.split("/").length - 1];
    },
    downloadDocument(url) {
      MediaService.downloadFile(url);
    },
    submit() {
      this.isSubmitted = true;
      if(!this.payload.action || (this.payload.action !== "Final_Audit" && this.payload.action !== "Marketing_Audit")) {
        this.canSubmit = true;
      }
      else {
        this.canSubmit = !!(
          (this.payload.action === "Final_Audit" &&
            (this.caseDetails.status === "بانتظار الإعداد التسويقي" ||
              this.caseDetails.status ===
              "معاد من مدير النظام  إلى التسويقي" ||
              this.caseDetails.status ===
              "معاد من مدير النظام  إلى الفني" ||
              this.caseDetails.status ===
              "معاد من مدير النظام  إلى الطبي" ||
              this.caseDetails.status ===
              "معاد من مدير النظام  إلى الجمعية") &&
            this.stepMedicalInformation.phases?.length &&
            this.stepMedicalInformation.phases.find(
              (each) =>
                each.story_title && each.story_content && each.story_photo
            )) ||
          (this.payload.action === "Marketing_Audit" &&
            (this.caseDetails.status === "بانتظار التدقيق الطبي" && (
              this.stepMedicalInformation.specialty &&
              this.stepMedicalInformation.actionType &&
              this.stepMedicalInformation.actionDescription &&
              this.stepMedicalInformation.evaluation
            ) || this.caseDetails.status === "معاد من التسويقي إلى الفني"))
        );
      }
      if (this.canSubmit) {
        this.$emit("toggleConfirmationModal");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.accept-checkbox {
  label {
    font-size: 14px;
    color: #3f3f3f;
    margin-right: 5px;
  }
}

.accept-label {
  font-size: 14px;
  color: #59c9c4;
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

.cus-btn {
  border-radius: 25px;
  background: #12b2aa;
  color: #ffffff;
  font-size: 18px;
  border: none;
  padding: 5px 50px;
}

.cus-btn:hover {
  background: #0e8e88;
  color: #ffffff;
  border: none;
}

.file-input-invalid {
  border: 1px solid #e24c4c;
  border-radius: 5px;
}

</style>
