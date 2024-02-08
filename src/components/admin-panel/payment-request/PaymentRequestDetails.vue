<template>
  <main class="edit-case d-flex flex-column align-items-start">
    <Card>
      <template #header>
        <div class="row">
          <div class="col-12">تعديل طلب</div>
        </div>
      </template>
      <template #content>
        <form>
          <div class="row">
            <div class="col-6">
              <div class="form-label-group mb-3">
                <div class="mt-4">
                  <span class="p-float-label" data-cy="invoice-number">
                    <InputText
                        id="invoiceNumber"
                        type="text"
                        :disabled="!state.isCharityManager || !editMode"
                        v-model="paymentRequestData.invoice_number"
                        class="w-100"
                    />
                    <label for="invoiceNumber">رقم الفاتورة</label>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="form-label-group">
                <div class="mt-4">
                <span class="p-float-label" data-cy="amount">
                  <InputNumber
                      id="amount"
                      type="text"
                      :disabled="!state.isCharityManager || !editMode"
                      v-model="paymentRequestData.amount"
                      class="w-100"
                  />
                  <label for="amount">مبلغ العلاج</label>
                </span>
                  <p v-if="error">
                  <p class="text-danger">{{ error }}</p>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-label-group mb-3">
                <div class="mt-4" data-cy="hospital">
                <span class="p-float-label">
                  <Dropdown
                      class="w-100"
                      id="PaymentRequestHospital"
                      optionLabel="name"
                      optionValue="id"
                      :disabled="!state.isCharityManager || !editMode"
                      v-model="paymentRequestData.hospital"
                      :options="hospitals"
                      filter
                      placeholder="جهة العلاج"/>
                    <label for="PaymentRequestHospital">جهة العلاج</label>
                </span>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="form-label-group mb-3">
                <div class="mt-4">
            <span class="p-float-label">
              <InputText
                  id="createdOn"
                  type="text"
                  :disabled="true"
                  v-model="paymentRequestData.created_on"
                  class="w-100"
              />
              <label for="createdOn">تاريخ الانشاء</label>
            </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="form-label-group">
                <div class="mt-4">
                <span class="p-float-label">
                  <InputText
                      id="status"
                      type="text"
                      :disabled="true"
                      v-model="paymentRequestData.status"
                      class="w-100"
                  />
                  <label for="status">حالة الطلب</label>
                </span>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mt-0">
                <label
                    class="color-secondary"
                    v-if="paymentRequestData.status === PAYMENT_REQUEST_ENUM.Waiting_Transfer_Confirmation ||
                        paymentRequestData.status === PAYMENT_REQUEST_ENUM.Waiting_Transfer">
                  ايصال الحوالة
                </label>
                <label class="color-secondary" v-else>فاتورة العلاج</label>
                <div class="association-logo">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="logo"></div>
                    <div class="logo-name"
                         :title="attachmentData.attachment?.name || attachmentData.attachment"
                         data-cy="invoice-file">
                      {{ attachmentData.attachment?.name || attachmentData.attachment }}
                    </div>
                    <div class="d-flex align-items-center">
                      <button
                          :disabled="!isCharityManager"
                          class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                          @click.stop="$refs.attachment.$el.click()"
                          type="button">
                        <div class="upload-icon"></div>
                        رفع المرفق
                      </button>
                    </div>
                  </div>
                </div>
                <InputText
                    ref="attachment"
                    class="d-none"
                    type="file"
                    accept=".pdf"
                    @change.stop="fileChange($event, 'attachment')"
                />
              </div>
            </div>
          </div>
          <br/>
          <hr/>
          <div>
            <div class="row">
              <div class="title fs-4 fw-bold mb-4">
                طباعة و تحميل
              </div>
              <div class="col-md-2" v-if="state.invoiceLink">
                <a
                    v-if="paymentRequestData.status === PAYMENT_REQUEST_ENUM.Charity_Payment_Completed || paymentRequestData.status === PAYMENT_REQUEST_ENUM.Waiting_Audit_1"
                    :href="state.baseBEUrl + '/media/' + state.invoiceLink"
                    class="link-color"
                    target="_blank">الفاتورة</a>
                <label></label>
              </div>
              <div class="col-md-2" v-if="state.financialRequestLink">
                <a
                    v-if="userPermission === USER_TYPE_AR.First_Audit || userPermission === USER_TYPE_AR.Second_Audit || userPermission === USER_TYPE_AR.Financial_Reviewer || userPermission === USER_TYPE_AR.Transfer_Manager || paymentRequestData.status === PAYMENT_REQUEST_ENUM.Charity_Payment_Completed"
                    :href="state.baseBEUrl + '/media/' + state.financialRequestLink"
                    class="link-color"
                    target="_blank">مطالبة مالية</a>
                <label></label>
              </div>
              <div class="col-md-2" v-if="state.exchangeOrderLink">
                <a
                    v-if="userPermission === USER_TYPE_AR.Financial_Reviewer || userPermission === USER_TYPE_AR.Transfer_Manager || paymentRequestData.status === PAYMENT_REQUEST_ENUM.Charity_Payment_Completed"
                    :href="state.baseBEUrl + '/media/' + state.exchangeOrderLink"
                    class="link-color"
                    target="_blank">أمر الصرف</a>
                <label></label>
              </div>
              <div class="col-md-2" v-if="state.completionSpeechLink">
                <a
                  v-if="paymentRequestData.status === PAYMENT_REQUEST_ENUM.Charity_Payment_Completed"
                    :href="state.baseBEUrl + '/media/' + state.completionSpeechLink"
                    class="link-color"
                    target="_blank">خطاب التعميد</a>
                <label></label>
              </div>
              <div class="col-md-2"
                   v-if="state.exchangeReceiptLink">
                <a
                    v-if="(userPermission === USER_TYPE_AR.Transfer_Manager || userPermission === USER_TYPE_AR.Second_Audit) && paymentRequestData.status === PAYMENT_REQUEST_ENUM.Charity_Payment_Completed"
                    :href="state.baseBEUrl + '/media/' + state.exchangeReceiptLink"
                    class="link-color"
                    target="_blank">إيصال الحوالة</a>
                <label></label>
              </div>
            </div>
          </div>
        </form>
      </template>
    </Card>
  </main>
</template>
<script setup>
import {FilterMatchMode} from "primevue/api";
import {useToast} from "primevue/usetoast";
import {reactive, computed, onMounted, ref, onUpdated, defineProps, watch} from "vue";
import {useRoute} from "vue-router";
import JwtUtilService from "@/services/jwt.util.service";
import {PAYMENT_REQUEST_ENUM, USER_TYPE_AR} from "@/services/enum.service";

const emit = defineEmits(["fileChange"])
const props = defineProps({
  editMode: {
    type: Boolean,
    required: false,
    default: false,
  },
  paymentRequestData: {},
  userPermission: {},
  attachmentData: {},
  enStatuses: [],
  exchangeOrderLink: "",
  financialRequestLink: "",
  completionSpeechLink: "",
  invoiceLink: "",
  exchangeReceiptLink: "",
  hospitals: [],
  isCharityManager: "",
  error: "",
});
const state = reactive({
  filters: {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  },
  isCharityManager: JwtUtilService.getClientID()?.includes("charity"),
  baseBEUrl: "",
  exchangeOrderLink: "",
  financialRequestLink: "",
  completionSpeechLink: "",
  invoiceLink: "",
  exchangeReceiptLink: "",
});

const toast = useToast();
const route = useRoute();

const fileChange = (event, key) => {
  emit("file-change", event, key);
}

onMounted(() => {
  state.baseBEUrl = process.env.VUE_APP_API_URL
})

watch(() => props.financialRequestLink, async (param) => {
  if (param) {
    state.financialRequestLink = param
  }
})

watch(() => props.exchangeOrderLink, async (param) => {
  if (param) {
    state.exchangeOrderLink = param
  }
})

watch(() => props.completionSpeechLink, async (param) => {
  if (param) {
    state.completionSpeechLink = param
  }
})

watch(() => props.exchangeReceiptLink, async (param) => {
  if (param) {
    state.exchangeReceiptLink = param
  }
})
watch(() => props.invoiceLink, async (param) => {
  if (param) {
    state.invoiceLink = param
  }
})

</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/helpers";

.link-color {
  color: #00B6AD;
}

::v-deep(.p-datatable) {
  .p-datatable-header {
    background: white;
    border-top: none;
    padding: 0 0 1rem 0;
  }

  .p-datatable-thead > tr:nth-child(1) > th {
    border-bottom: none;
  }

  .p-datatable-thead > tr > th {
    text-align: right;
  }

  .p-datatable-thead > tr > th.column__amount-requested {
    padding-left: 0;
  }

  .p-datatable-thead > tr > th.column__amount-collected {
    padding-right: 0;
  }

  .p-datatable-tbody > tr > td {
    text-align: right;

    a {
      display: block;
      color: black;
      text-decoration: none;
    }
  }

  .color-primary {
    color: $color-primary;
  }

  .p-dropdown-label:not(.p-placeholder) {
    text-transform: uppercase;
  }

  .p-paginator {
    position: absolute;
    bottom: -10rem;
    left: 0;
    background-color: transparent;
    border-bottom: none;
    padding-left: 0;

    .p-paginator-icon {
      transform: rotate(180deg);
    }

    .p-paginator-next,
    .p-paginator-prev {
      padding-right: 5px;
      padding-left: 5px;
      border-radius: $border-radius-small;
      color: $color-primary;
    }

    .p-paginator-next {
      &::before {
        content: "الصفحة التالية";
      }
    }

    .p-paginator-prev {
      &::after {
        content: "الصفحة السابقة";
      }
    }

    .p-disabled {
      display: none;
    }

    .p-paginator-page {
      min-width: 1.7rem;
      height: 1.7rem;
      border-radius: $border-radius-small;
    }

    .p-paginator-page.p-highlight {
      background-color: $color-primary;
      color: white;
    }
  }
}

::v-deep(.form-personal-information) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 3rem;
}

::v-deep(.form-insurance-information) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 3rem;
}

::v-deep(.form-medical-information__first-group) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 3rem;
}

::v-deep(.form-medical-information__stages) {
  .stage {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 3rem;
    align-items: end;
  }

  .stage__input {
    display: flex;
    flex-direction: column;
  }

  .stage__file {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
}

::v-deep(.stages-divider) {
  position: relative;
  width: 100%;
  height: 0;
  border-top: 1px solid #d9d9d9;

  .stages-divider__heading {
    position: absolute;
    right: 2rem;
    top: -0.7rem;
    padding: 0 0.7rem;
    background-color: white;
  }
}

::v-deep(.form-social-survey) {
  .form-social-survey__select-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 3rem;
  }
}

::v-deep(.p-card) {
  width: 100%;
  margin-bottom: 2rem;
  box-shadow: $box-shadow-card;
  border-radius: $border-radius-default;
  overflow: hidden;

  .p-card-header {
    padding: 1rem 1.2rem;
    background-color: #d4d4d4;
  }

  .p-card-body {
    padding-top: 0;
    padding-bottom: 0;
    box-shadow: none;
  }
}

::v-deep(.p-button-secondary) {
  font-size: 14px;
  background-color: $color-secondary;
  border-color: $color-secondary;
  color: $color-font-dark;

  .pi {
    font-size: 14px;
  }

  &:hover {
    background-color: $color-secondary-hover;
    border-color: $color-secondary-hover;
  }
}

::v-deep(.p-fileupload) {
  border: 1px dashed #ced4da;
  border-radius: 6px;

  .p-fileupload-buttonbar {
    border: none;
    background-color: transparent;
  }

  .p-button,
  .p-button-icon-only {
    background-color: #d9d9d9;
    border-color: #d9d9d9;
    color: #3f3f3f;
    transition: 0.1s;
    border-radius: 25px;

    &:hover,
    &:active,
    &:focus {
      background-color: #565e64;
      border-color: #565e64;
      color: #fff;
      box-shadow: none;

      .p-focus {
        box-shadow: none;
      }
    }
  }

  .p-progressbar {
    display: none;
  }

  .p-fileupload-content {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    border: none;
    padding: 0;

    .p-fileupload-file {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-top: 1px solid $color-secondary;

      &__image {
        display: block;
        width: 40px;
        height: 40px;
      }

      &__file-name {
        font-size: 14px;
        color: $color-font-lighter;
      }

      .p-fileupload-file-actions {
        margin: 0;
      }

      .p-button {
        min-width: 48px;
      }
    }
  }

  .p-fileupload-file {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    border: none;

    .p-badge {
      display: none;
    }
  }

  .p-fileupload-row,
  .p-fileupload-file {
    font-size: 14px;
    color: #8c8c8c;
  }

  input[accept=".pdf"] ~ .p-fileupload-content img {
    display: none;
  }
}

::v-deep(.p-inputtext) {
  &:disabled {
    background-color: #ececec;
  }
}

::v-deep(.p-badge) {
  border-radius: 0;
}

::v-deep(.p-badge.p-badge-info) {
  background-color: $color-background-info;
  color: $color-font-info;
}

::v-deep(.p-badge.p-badge-success) {
  background-color: $color-background-success;
  color: $color-font-success;
}

::v-deep(.p-badge.p-badge-danger) {
  background-color: $color-background-danger;
  color: $color-font-danger;
}

a {
  text-decoration: none;
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

:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 16px;
}

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

  &:hover {
    background-color: #b2b2b2;
    color: #3f3f3f;
  }
}

.association-logo {
  height: 80px;
  border-radius: 5px;
  border: 1px dashed #d9d9d9;
  padding: 10px 20px;
}

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
</style>
