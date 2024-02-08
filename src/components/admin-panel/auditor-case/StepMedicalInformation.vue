<template>
  <div v-if="!editMode" class="welcome-container row">
    <div class="col-12 title">بيانات الحالة الطبية والخطة العلاجية</div>
  </div>

  <form class="form form-medical-information w-100">
    <div class="form-medical-information__first-group">
      <div class="form-label-group mb-3">
        <div class="mt-4">
          <label class="top-label">
            التقرير الطبي
            <BaseTooltip placement="left">
              <template #trigger>
                <i class="pi pi-info-circle icon-primary icon-primary--with-text"/>
              </template>
              <template #content>
                <span>توجيهات / معايير يجب توفرها في المرفق لقبوله :</span>
                <ul class="mt-2 mb-0">
                  <li>&#x2022; تاريخه لا يزيد عن 3 أشهر </li>
                  <li>&#x2022; بيان التاريخ المرضي</li>
                  <li>&#x2022; بيان الحاجة الى الإجراء الطبي </li>
                  <li>&#x2022; توقيع الاستشاري المعالج </li>
                </ul>
              </template>
            </BaseTooltip>
          </label>
          <div
            v-if="dataToBeModified.includes('medical_report') ||
              !props.payload.medicalReport"
            :class="{'file-input-invalid': v$.medicalReport.$invalid && state.validated}">
            <FileUpload
              @select="fileSelected($event, 'medicalReport')"
              name="medicalReport"
              url="./upload"
              accept=".pdf"
              chooseLabel="التقرير الطبي"
              chooseIcon="pi pi-upload"
              :disabled="readOnly || !dataToBeModified.includes('medical_report')"
              :multiple="false"
              :showCancelButton="false"
              :showUploadButton="false">
              <template
                v-if="
                  props.payload.medicalReport &&
                  state.medicalReportLoaded &&
                  editMode"
                #content>
                <div class="p-fileupload-file">
                  <span class="p-fileupload-file__file-name">
                    {{ getFileName("medicalReport") }}
                  </span>
                  <div class="d-flex justify-content-between align-items-center">
                    <Button
                      @click.stop="downloadDocument(props.payload.medicalReport)"
                      class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center">
                      <div class="download-icon"></div>
                      تحميل
                    </Button>
                    <Button
                      v-if="dataToBeModified.includes('medical_report')"
                      style="margin-right: 0.5rem"
                      icon="pi pi-times"
                      @click="removeFile('medicalReport')"
                      class="p-button-outlined p-button-danger p-button-rounded"
                    />
                  </div>
                </div>
              </template>
            </FileUpload>
          </div>
          <div
            v-else-if="props.payload.medicalReport"
            class="d-flex justify-content-between align-items-center attachment-photo">
            <div>
              <span class="file-name" data-cy="medical-report-file-name">{{ getFileName("medicalReport") }}</span>
            </div>
            <div>
              <Button
                @click.stop="downloadDocument(props.payload.medicalReport)"
                class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center">
                <div class="download-icon"></div>
                تحميل
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-label-group mb-3">
        <div class="mt-4 row" :class="{ 'flex-column-reverse': editMode }">
          <span class="col" data-cy="financial-cost">
            <label v-if="!editMode" class="top-label" for="financialCost">
              التكلفة المالية
            </label>
            <InputNumber
              id="financialCost"
              mode="decimal"
              locale="sa-SA"
              :disabled="readOnly || !(dataToBeModified.includes('amount'))"
              v-model="payload.amount"
              :class="{ 'p-invalid': v$.amount.$invalid && state.validated }"
              required
              class="w-100"
            />
          </span>
          <div
            class="col-sm col-sm-auto mt-auto mb-auto"
            :class="{ row: !editMode }">
            <label v-if="editMode" class="top-label">التكلفة المالية</label>
            <BaseTooltip :placement="!editMode && !readOnly ? 'right' : 'left'">
              <template #trigger>
                <i class="pi pi-info-circle icon-primary icon-primary--with-text"/>
              </template>
              <template #content>
                <span>يرجى كتابة التكلفة المالية للعلاج بدون إضافة النسبة التشغيلية</span>
              </template>
            </BaseTooltip>
          </div>
        </div>
      </div>

      <div class="form-label-group mb-3">
        <div class="mt-4">
          <label class="top-label">
            مرفق التكلفة المالية
            <BaseTooltip placement="left">
              <template #trigger>
                <i class="pi pi-info-circle icon-primary icon-primary--with-text"/>
              </template>
              <template #content>
                <span>توجيهات / معايير يجب توفرها في المرفق لقبوله :</span>
                <ul class="mt-2 mb-0">
                  <li>&#x2022;كتابة التكلفة المالية للعلاج مع الضريبة دون إضافة النسبة التشغيلية </li>
                  <li>&#x2022;تفصيل للإجراءات التي يطلبها الطبيب للمريض </li>
                </ul>
              </template>
            </BaseTooltip>
          </label>
          <div
            v-if="
              dataToBeModified.includes('amount_attachment') ||
              !props.payload.amountAttachment"
            :class="{'file-input-invalid': v$.amountAttachment.$invalid && state.validated }">
            <FileUpload
              @select="fileSelected($event, 'amountAttachment')"
              name="amountAttachment"
              url="./upload"
              accept=".pdf"
              chooseLabel="مرفق التكلفة المالية"
              chooseIcon="pi pi-upload"
              :disabled="readOnly || !(dataToBeModified.includes('amount_attachment'))"
              :multiple="false"
              :showCancelButton="false"
              :showUploadButton="false">
              <template
                v-if="props.payload.amountAttachment &&
                      state.amountAttachmentLoaded &&
                      editMode"
                #content>

                <div class="p-fileupload-file">
                  <span class="p-fileupload-file__file-name">
                    {{ getFileName("amountAttachment") }}
                  </span>
                  <div class="d-flex justify-content-between align-items-center">
                    <Button
                      @click.stop="downloadDocument(props.payload.amountAttachment)"
                      class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center">
                      <div class="download-icon"></div>
                      تحميل
                    </Button>
                    <Button
                      v-if="dataToBeModified.includes('amount_attachment')"
                      style="margin-right: 0.5rem"
                      icon="pi pi-times"
                      @click="removeFile('amountAttachment')"
                      class="p-button-outlined p-button-danger p-button-rounded"
                    />
                  </div>
                </div>
              </template>
            </FileUpload>
          </div>
          <div v-else-if="props.payload.amountAttachment && state.amountAttachmentLoaded"
            class="d-flex justify-content-between align-items-center attachment-photo">
            <span class="file-name" data-cy="financial-cost-file-name">{{ getFileName("amountAttachment") }}</span>
            <div>
              <Button @click.stop="downloadDocument(props.payload.amountAttachment)"
                class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center">
                <div class="download-icon"></div>
                تحميل
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h5 class="mt-5">هل ترغب بتقسيم العلاج على مراحل؟</h5>
    <div class="form-label-group mb-3">
      <div class="mt-4 row">
        <div class="col col-sm-auto checkbox-wrapper" data-cy="divide-true">
          <RadioButton
            name="divide"
            inputId="divideTrue"
            id="divideTrue"
            disabled
            :value="true"
            v-model="props.payload.splitIntoPhases"
          />
          <label for="divideTrue" class="me-3">نعم</label>
        </div>
        <div class="col col-sm-auto checkbox-wrapper" data-cy="divide-false">
          <RadioButton
            name="divide"
            inputId="divideFalse"
            id="divideFalse"
            disabled
            :value="false"
            v-model="props.payload.splitIntoPhases"
          />
          <label for="divideFalse" class="me-3">لا</label>
        </div>
      </div>
    </div>

    <div
      class="phases-divider mt-4"
      v-if="editMode && props.payload.splitIntoPhases">
      <h6 class="phases-divider__heading">مراحل العلاج</h6>
    </div>

    <Transition name="slide">
      <div
        v-if="props.payload.splitIntoPhases"
        class="form-medical-information__phases">
        <TransitionGroup name="slide" tag="ul">
          <li v-for="(stage, index) in props.payload.phases" :key="index"
            :class="['stage', { 'stage__with-border': !editMode }]">
            <div :class="['form-label-group mb-3', { stage__input: editMode }]">
              <div v-if="index !== 0 && index !== 1"
                :class="['stage-action stage-action--to-right', { 'stage-action--higher': !editMode }]">
              </div>
              <div :class="['mt-4 row', { 'flex-column-reverse': editMode }]">
                <span class="col">
                  <label
                    :for="`costSplit${index}`"
                    v-if="!editMode"
                    class="top-label">
                    مبلغ مرحلة العلاج
                  </label>
                  <InputNumber
                    :id="`costSplit${index}`"
                    mode="decimal"
                    locale="sa-SA"
                    :disabled="readOnly || !(
                        dataToBeModified.includes('amount') ||
                        dataToBeModified.includes('treatment_phases_section')
                      )"
                    v-model="stage.amount"
                    :class="['w-100', {
                      'p-invalid':
                        v$.phases.$each.$response.$errors[index].amount &&
                        v$.phases.$each.$response.$errors[index].amount
                          .length &&
                        state.validated,
                    }]"
                  />
                </span>
                <div :class="['col-sm col-sm-auto mt-auto mb-auto', { row: !editMode }]">
                  <label v-if="editMode" class="top-label">
                    التكلفة المالية
                  </label>
                  <BaseTooltip :placement="!editMode && !readOnly ? 'right' : 'left'">
                    <template #trigger>
                      <i class="pi pi-info-circle icon-primary icon-primary--with-text"/>
                    </template>
                    <template #content>
                      <span>يرجى كتابة التكلفة المالية للعلاج بدون إضافة النسبة التشغيلية</span>
                    </template>
                  </BaseTooltip>
                </div>
              </div>
            </div>
            <div
              :class="['form-label-group mb-3', { stage__file: editMode }]">
              <div class="mt-4">
                <label class="top-label">
                  مرفق التكلفة المالية
                  <BaseTooltip placement="left">
                    <template #trigger>
                      <i class="pi pi-info-circle icon-primary icon-primary--with-text"/>
                    </template>
                    <template #content>
                      <span>توجيهات / معايير يجب توفرها في المرفق لقبوله :</span>
                      <ul class="mt-2 mb-0">
                        <li>&#x2022;كتابة التكلفة المالية للعلاج مع الضريبة دون إضافة النسبة التشغيلية </li>
                        <li>&#x2022;تفصيل للإجراءات التي يطلبها الطبيب للمريض </li>
                      </ul>
                    </template>
                  </BaseTooltip>
                </label>
                <div
                  v-if="
                    dataToBeModified.includes('amount_attachment') ||
                    dataToBeModified.includes('treatment_phases_section') ||
                    !props.payload.phases[index].attachment"
                  :class="{
                    'file-input-invalid':
                      v$.phases.$each.$response.$errors[index].attachment &&
                      v$.phases.$each.$response.$errors[index].attachment.length &&
                      state.validated}">
                  <FileUpload
                    @select="fileSelected($event, `costSplitAttachment${index}`, index)"
                    :name="`costSplitAttachment${index}`"
                    url="./upload"
                    accept=".pdf"
                    chooseLabel="مرفق التكلفة المالية"
                    chooseIcon="pi pi-upload"
                    :disabled="readOnly ||
                      !(dataToBeModified.includes('amount_attachment') ||
                        dataToBeModified.includes('treatment_phases_section'))"
                    :multiple="false"
                    :showCancelButton="false"
                    :showUploadButton="false">
                    <template
                      v-if="
                        props.payload.phases[index].attachment &&
                        editMode"
                      #content>

                      <div class="p-fileupload-file">
                        <span class="p-fileupload-file__file-name">
                          {{ getFileName(`costSplitAttachment${index}`, true, index) }}
                        </span>
                        <div class="d-flex justify-content-between align-items-center">
                          <Button
                            @click.stop="downloadDocument(props.payload.phases[index].attachment)"
                            class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center">
                            <div class="download-icon"></div>
                            تحميل
                          </Button>
                          <Button
                            v-if="
                              dataToBeModified.includes('amount_attachment') ||
                              dataToBeModified.includes('treatment_phases_section')"
                            style="margin-right: 0.5rem"
                            icon="pi pi-times"
                            @click="
                              removeFile(`costSplitAttachment${index}`, true, index)"
                            class="p-button-outlined p-button-danger p-button-rounded"
                          />
                        </div>
                      </div>
                    </template>
                  </FileUpload>
                </div>
                <div
                  v-else-if="
                    props.payload.phases[index].attachment"
                  class="d-flex justify-content-between align-items-center attachment-photo">
                  <div>
                    <span class="file-name">
                      {{ getFileName(`costSplitAttachment${index}`, true, index) }}
                    </span>
                  </div>
                  <div>
                    <Button
                      @click.stop="downloadDocument(props.payload.phases[index].attachment)"
                      class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center">
                      <div class="download-icon"></div>
                      تحميل
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </TransitionGroup>
      </div>
    </Transition>

    <div
      v-if="
        caseData.specialty ||
        caseData.actionType ||
        caseData.actionDescription ||
        caseData.evaluation">
      <div class="phases-divider mt-4">
        <h6 class="phases-divider__heading">بيانات التدقيق الطبي</h6>
      </div>

      <div class="form-medical-information__first-group">
        <div class="form-label-group mb-3" v-if="caseData.specialty">
          <div class="mt-4" data-cy="specialty">
            <label class="top-label">التخصص</label>
            <Dropdown
              :disabled="!dataToBeModified.includes('specialty')"
              optionLabel="name"
              optionValue="id"
              v-model="payload.specialty"
              class="w-100"
              :class="{
                'p-invalid': v$.specialty.$invalid && state.validated,
              }"
              :options="props.medicalOptions.caseSpecialty"
              placeholder="التخصص"
            />
          </div>
        </div>
        <div class="form-label-group mb-3" v-if="caseData.actionType">
          <div class="mt-4" data-cy="action-type">
            <label class="top-label">نوع الإجراء</label>
            <Dropdown
              :disabled="!dataToBeModified.includes('actionType')"
              optionLabel="name"
              optionValue="id"
              v-model="payload.actionType"
              class="w-100"
              :class="{
                'p-invalid': v$.actionType.$invalid && state.validated,
              }"
              :options="props.medicalOptions.caseActionType"
              placeholder="نوع الإجراء"
            />
          </div>
        </div>
        <div class="form-label-group mb-3" v-if="caseData.actionDescription">
          <div class="mt-4" data-cy="action-description">
            <label class="top-label">وصف الإجراء</label>
            <Dropdown
              :disabled="!dataToBeModified.includes('actionDescription')"
              optionLabel="name"
              optionValue="id"
              v-model="payload.actionDescription"
              class="w-100"
              :class="{
                'p-invalid': v$.actionDescription.$invalid && state.validated,
              }"
              :options="props.medicalOptions.caseActionDescription"
              placeholder="وصف الإجراء"
            />
          </div>
        </div>
        <div class="form-label-group mb-3" v-if="caseData.evaluation">
          <div class="mt-4" data-cy="case-evaluation">
            <label class="top-label">تقييم الحالة</label>
            <Dropdown
              :disabled="!dataToBeModified.includes('evaluation')"
              optionLabel="name"
              optionValue="id"
              v-model="payload.evaluation"
              class="w-100"
              :class="{
                'p-invalid': v$.evaluation.$invalid && state.validated,
              }"
              :options="props.medicalOptions.caseEvaluation"
              placeholder="تقييم الحالة"
            />
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script setup>
import { defineProps, reactive, onMounted } from "vue";
import FileUpload from "primevue/fileupload";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import MediaService from "@/services/media.service";
import { useToast } from "primevue/usetoast";
import BaseTooltip from "@/components/layout/BaseTooltip";

const toast = useToast();

const props = defineProps({
  dataToBeModified: {
    type: Array,
    default: [],
    required: false
  },
  payload: {
    type: Object,
    required: true
  },
  caseData: {
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
  },
  medicalOptions: {
    type: Object,
    required: true
  },
  caseDetails: {
    type: Object,
    required: true
  }
});

const state = reactive({
  form: Object.assign({}, props.payload),
  loading: false,
  error: "",
  submitted: false,
  validated: false,
  financialCost: 0,
  medicalReportLoaded: true,
  amountAttachmentLoaded: true,
  caseSpecialty: ""
});

const rules = {
  medicalReport: { required },
  amount: { required },
  amountAttachment: { required },
  phases: {
    $each: helpers.forEach({
      amount: {
        required
      },
      attachment: {
        required
      }
    })
  },
  specialty: { required },
  actionDescription: { required },
  actionType: { required },
  evaluation: { required }
};

const v$ = useVuelidate(rules, state.form);

const fileSelected = (event, keyName, index) => {
  if (keyName.includes("costSplitAttachment")) {
    props.payload.phases[index].attachment = event.files[0];
  } else {
    state.form[keyName] = event.files[0];
    props.payload[keyName] = event.files[0];
  }

  if (keyName === "amountAttachment") {
    state.amountAttachmentLoaded = false;
  } else if (keyName === "medicalReport") {
    state.medicalReportLoaded = false;
  }
};

const getFileName = (file, phases = false, index) => {
  if (!phases) {
    return typeof props.payload[file] === "string"
      ? props.payload[file]?.split("/")[
      props.payload[file]?.split("/")?.length - 1
        ]
      : props.payload[file]?.name;
  } else {
    return typeof props.payload.phases[index].attachment === "string"
      ? props.payload.phases[index].attachment?.split("/")[
      props.payload.phases[index].attachment?.split("/")?.length - 1
        ]
      : props.payload.phases[index].attachment?.name;
  }
};
const removeFile = (file, phases = false, index) => {
  if (!phases) {
    props.payload[file] = "";
  } else {
    props.payload.phases[index].attachment = "";
  }
};
const downloadDocument = (url) => {
  MediaService.downloadFile(url);
};

onMounted(() => {
  state.caseSpecialty = props.medicalOptions?.caseActionType?.find(
    (each) => each.id === props.payload.actionType
  )?.name;
});

defineExpose({ state: state.form });
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/animations";

.form {
  margin-bottom: 2rem;
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

  &__with-border {
    margin-top: 30px;
    border-top: 1px solid #ececec;
  }
}

.stage-action {
  display: flex;
  align-items: center;
  justify-content: center;

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

    &--disabled {
      color: $color-secondary;
      cursor: default;

      .icon-primary {
        color: $color-secondary;
      }

      &:hover {
        color: $color-secondary;

        .icon-primary {
          color: $color-secondary;
        }
      }
    }
  }

  &--to-right {
    justify-content: start;
  }

  &--higher {
    padding-top: 2rem;
  }
}

.icon-primary {
  color: $color-primary;
  font-size: 20px;
  margin-right: 20px;
  width: fit-content;

  &--with-text {
    margin-right: 10px;
  }
}

::v-deep(.p-radiobutton) {
  .p-hidden-accessible {
    top: unset;
  }
}

.slide-enter-active {
  animation: slide-in 0.25s ease-in-out;
}

.slide-leave-active {
  animation: slide-in 0.25s ease-in-out reverse;
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

ul {
  padding: 0;
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
