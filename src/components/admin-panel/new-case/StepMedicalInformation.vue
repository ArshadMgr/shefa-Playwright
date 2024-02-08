<template>
  <div v-if="!editMode" class="welcome-container row">
    <div class="col-12 title">بيانات الحالة الطبية والخطة العلاجية</div>
  </div>

  <form class="form form-medical-information w-100" @submit.prevent="submit(!v$.$invalid)">
    <div class="form-medical-information__first-group">
      <div class="form-label-group mb-3">
        <div class="mt-4">
          <label class="top-label"
            >التقرير الطبي
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
          <div :class="{'file-input-invalid': v$.medicalReport.$invalid && state.validated}" data-cy="medical-report-upload">
            <FileUpload
              @select="fileSelected($event, 'medicalReport')"
              @remove="removeFile('medicalReport')"
              name="medicalReport"
              url="./upload"
              accept=".pdf"
              chooseLabel="التقرير الطبي"
              chooseIcon="pi pi-upload"
              :class="{'fileupload-hide': state.form.medicalReport}"
              class="fileupload-custom"
              :disabled="readOnly"
              :multiple="false"
              :showCancelButton="false"
              :showUploadButton="false"
            >
              <template v-if="state.form.medicalReport && state.medicalReportLoaded" #content>
                <div class="p-fileupload-file">
                  <span class="p-fileupload-file__file-name">{{getFileName('medicalReport')}}</span>
                  <Button v-if="!readOnly" icon="pi pi-times" @click="removeFile('medicalReport')" data-cy="send-medical-report" class="p-button-secondary p-button-rounded"  label="إلغاء"/>
                  <Button
                    v-if="readOnly || editMode"
                    icon="pi pi-download"
                    label=" تحميل "
                    @click.stop="downloadDocument(state.form.medicalReport)"
                    class="p-button-secondary p-button-rounded button-download"
                  />
                </div>
              </template>
            </FileUpload>
          </div>
        </div>
      </div>

      <div class="form-label-group mb-3">
        <div class="mt-4 d-flex" :class="{'flex-column-reverse': editMode}">
          <span class="flex-grow-1">
            <label v-if="!editMode" class="top-label" for="financialCost">التكلفة المالية</label>
            <div class="d-flex align-items-center" data-cy="financial-cost-input">
              <InputNumber
                id="financialCost"
                mode="decimal"
                :disabled="readOnly"
                v-model="state.form.amount"
                :class="{'p-invalid': v$.amount.$invalid && state.validated}"
                required
                class="w-100"
              />
              <span class="px-2">ر.س</span>
            </div>
          </span>
          <div class="mt-auto mx-1 mb-3" :class="{'row': !editMode}">
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
          <div data-cy="financial-cost-attachment">
            <FileUpload
              @select="fileSelected($event, 'amountAttachment')"
              @remove="removeFile('amountAttachment')"
              name="financialCostFacility"
              url="./upload"
              accept=".pdf"
              chooseLabel="مرفق التكلفة المالية"
              chooseIcon="pi pi-upload"
              :class="{'fileupload-hide': state.form.amountAttachment}"
              class="fileupload-custom"
              :disabled="readOnly"
              :multiple="false"
              :showCancelButton="false"
              :showUploadButton="false"
            >
              <template v-if="state.form.amountAttachment && state.amountAttachmentLoaded" #content>
                <div class="p-fileupload-file">
                  <span class="p-fileupload-file__file-name">{{getFileName('amountAttachment')}}</span>
                  <Button v-if="!readOnly" icon="pi pi-times" @click="removeFile('amountAttachment')" data-cy="amount-attachment-input" class="p-button-secondary p-button-rounded"  label="إلغاء" />
                  <Button
                    v-if="readOnly || editMode"
                    icon="pi pi-download"
                    label=" تحميل "
                    @click.stop="downloadDocument(state.form.amountAttachment)"
                    class="p-button-secondary p-button-rounded button-download"
                  />
                </div>
              </template>
            </FileUpload>
          </div>
        </div>
      </div>
    </div>


    <h5 class="mt-5">هل ترغب بتقسيم العلاج على مراحل؟</h5>
    <div class="form-label-group mb-3">
      <div class="mt-4 row">
        <div class="col col-sm-auto checkbox-wrapper">
          <RadioButton
            name="divide"
            inputId="divideTrue"
            data-cy="divide-true-radiobox"
            :disabled="readOnly"
            :value="true"
            v-model="state.form.splitIntoPhases"
            @click="addPhases"
          />
          <label for="divideTrue" class="me-3">نعم</label>
        </div>
        <div class="col col-sm-auto checkbox-wrapper" data-cy="divide-false">
          <RadioButton
            name="divide"
            inputId="divideFalse"
            :disabled="readOnly"
            :value="false"
            v-model="state.form.splitIntoPhases"
            @click="deletePhases"
          />
          <label for="divideFalse" class="me-3">لا</label>
        </div>
      </div>
    </div>

    <div class="phases-divider mt-4" v-if="editMode && state.form.splitIntoPhases">
      <h6 class="phases-divider__heading">مراحل العلاج</h6>
    </div>

    <Transition name="slide">
      <div v-if="state.form.splitIntoPhases" class="form-medical-information__phases">
        <TransitionGroup name="slide" tag="ul">
          <li v-for="(stage, index) in state.form.phases" :key="index" class="stage" :class="{'stage__with-border': !editMode}">
            <div class="form-label-group mb-3" :class="{'stage__input': editMode}">
              <div v-if="index !== 0 && index !== 1" class="stage-action stage-action--to-right" :class="{'stage-action--higher': !editMode}">
                <button
                  @click="deletePhase(index)"
                  data-cy="delete-phase-button"
                  :disabled="readOnly"
                  type="button"
                  class="stage-action__button"
                  :class="{'stage-action__button--disabled': readOnly}"
                >
                  <i
                    class="pi pi-minus icon-primary"
                    style="margin-left: 8px; font-size: 15px"
                  ></i
                  >إلغاء
                </button>
              </div>
              <div class="mt-4 row" :class="{'flex-column-reverse': editMode}">
                <span class="col">
                  <label :for="`costSplit${index}`" v-if="!editMode" class="top-label">مبلغ مرحلة العلاج</label>
                  <div class="d-flex align-items-center">
                    <InputNumber
                      :id="`costSplit${index}`"
                      mode="decimal"
                      data-cy="cost-split-input"
                      :disabled="readOnly"
                      v-model="stage.amount"
                      class="w-100"
                      :class="{'p-invalid': v$.phases.$each.$response.$errors[index].amount.length && state.validated}"
                    />
                    <span class="px-2">ر.س</span>
                  </div>
                </span>
                <div class="col-sm col-sm-auto mt-auto mb-auto" :class="{'row': !editMode}">
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
            <div class="form-label-group mb-3" :class="{'stage__file': editMode}">
              <div class="mt-4">
                <label class="top-label"
                  >مرفق التكلفة المالية
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
                <div>
                  <FileUpload
                    @select="fileSelected($event, `costSplitAttachment${index}`, index)"
                    @remove="removeFile(`costSplitAttachment${index}`, true, index)"
                    :name="`costSplitAttachment${index}`"
                    url="./upload"
                    data-cy="cost-split-document-upload"
                    accept=".pdf"
                    chooseLabel="مرفق التكلفة المالية"
                    chooseIcon="pi pi-upload"
                    :class="{'fileupload-hide': state.form.phases[index].attachment}"
                    class="fileupload-custom"
                    :disabled="readOnly"
                    :multiple="false"
                    :showCancelButton="false"
                    :showUploadButton="false"
                  >
                    <template v-if="state.form.phases[index].attachment && state.medicalReportLoaded" #content>
                      <div class="p-fileupload-file">
                        <span class="p-fileupload-file__file-name">{{getFileName(`costSplitAttachment${index}`, true, index)}}</span>
                        <Button v-if="!readOnly" icon="pi pi-times" @click="removeFile(`costSplitAttachment${index}`, true, index)" data-cy="remove-file-button" class="p-button-secondary p-button-rounded"  label="إلغاء" />
                        <Button
                          v-if="readOnly || editMode"
                          icon="pi pi-download"
                          label=" تحميل "
                          @click.stop="downloadDocument(state.form.phases[index].attachment)"
                          class="p-button-secondary p-button-rounded button-download"
                        />
                      </div>
                    </template>
                  </FileUpload>
                </div>
              </div>
            </div>
          </li>
        </TransitionGroup>

        <div v-if="!readOnly && state.form.phases.length < state.phasesLimit" class="stage-action">
          <button @click="addPhase" :disabled="disableAddPhaseButton()" type="button" :class="{'stage-action__button--disabled': disableAddPhaseButton()}" data-cy="add-phase-button" class="stage-action__button">
            <i
              class="pi pi-plus icon-primary"
              style="margin-left: 8px; font-size: 15px"
            ></i
            >إضافة مرحلة علاج اخرى
          </button>
        </div>
      </div>
    </Transition>
    <div v-if="!editMode || !read-only" class="row border-top-spacer">
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
import { defineProps, reactive, computed } from "vue";
import FileUpload from "primevue/fileupload";
import {required, helpers} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import MediaService from "@/services/media.service";
import BaseTooltip from "@/components/layout/BaseTooltip";

const toast = useToast();

const props = defineProps({
  payload: {
    type: Object,
    required: true,
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
});

const emit = defineEmits(["submit", "previous"]);

const state = reactive({
  form: Object.assign({}, props.payload),
  loading: false,
  error: "",
  submitted: false,
  validated: false,
  financialCost: 0,
  medicalReportLoaded: true,
  amountAttachmentLoaded: true,
  phasesLimit: 6
});

const rules = {
  medicalReport: { required },
  amount: { required },
  phases: {
    $each: helpers.forEach({
      amount: {
        required
      }
    })
  }
};

const v$ = useVuelidate(rules, state.form);

const fileSelected = (event, keyName, index) => {
  if(keyName === 'medicalReport') {
    state.medicalReportLoaded = false;
  } else if(keyName === 'amountAttachment') {
    state.amountAttachmentLoaded = false;
  }
  if(keyName.includes('costSplitAttachment')) {
    state.form.phases[index].attachment = event.files[0]
  } else {
    state.form[keyName] = event.files[0]
  }
}
const getFileName = (file, phases = false, index = 0) => {
  if (!phases) {
    if(state.form[file].name) {
      return state.form[file].name
    }
    return state.form[file].split('/')[state.form[file].split('/').length - 1]
  } else if (state.form.phases[index].urls.attachment) {
    return state.form.phases[index].urls.attachment.split('/')[state.form.phases[index].urls.attachment.split('/').length - 1]
  } else if (state.form.phases[index].attachment) {
    return state.form.phases[index].attachment.name;
  }
};
const removeFile = (file, phases = false, index) => {
  if (!phases) {
    state.form[file] = ''
  } else {
    state.form.phases[index].attachment = ''
  }
}
const downloadDocument = (url) => {
  MediaService.downloadFile(url);
};

const deletePhases = () => {
  state.form.phases = [];
}

const addPhases = () => {
  if(!state.form.phases[0]) {
    addPhase();
    addPhase();
  } else {
    return null;
  }
}

const addPhase = () => {
  if(state.form.phases.length === (state.phasesLimit - 1)) {
    toast.add({
      severity: "info",
      summary: "Maximum phases limit reached",
      closable: false,
      life: 3000,
    });
  }

  let stageItem = {
    case: null,
    amount: '',
    attachment: null,
    urls: {
      attachment: ''
    }
  };
  state.form.phases.push(stageItem);
};
const deletePhase = (index) => {
  state.form.phases.splice(index, 1);
};

const goBack = () => {
  emit("previous", state.form);
};

const validatePhases = () => {
  if(state.form.splitIntoPhases) {
    const totalAmount = state.form.amount;
    const phasesAmount = state.form.phases.reduce((sum, current) => sum + current.amount, 0,);
    if(totalAmount !== phasesAmount) {
      toast.add({
        severity: "error",
        summary: "التكلفة المالية للحالة لا تساوي التكلفة  للمراحل العلاجية",
        closable: false,
        life: 3000,
      });
      return false;
    } else {
      return true;
    }
  } else {
    return true
  }
}

const disableAddPhaseButton = () => {
  if (!v$.value.$invalid) {
    return false;
  } else {
    return true;
  }
}

const submit = () => {
  state.validated = true
  if (v$.value.$invalid) {
    return
  }
  if (!validatePhases()) {
    return
  }
  state.submitted = true;
  emit("submit", state.form);
};

defineExpose({ state: state.form })
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/animations";
@import "@/styles/components/button";

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
  color: #8c8c8c;
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
  background: #ECECEC;
  border: 1px solid #ECECEC;
}
.file-input-invalid {
  border: 1px solid #e24c4c;
  border-radius: 5px;
}
.border-top-spacer {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem
}
ul {
  padding: 0;
}
</style>
