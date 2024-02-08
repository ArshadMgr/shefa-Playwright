<template>
  <div class="row">
    <div class="col-12">
      <router-link
          v-if="state.permission === USER_PERMISSION.charity_manager"
          to="/admin-panel/auditors-list"
          class="align-self-end mb-4 float-lg-start">
        <Button class="p-button p-button-rounded p-button-secondary">
          <i class="pi pi-times mx-1"></i>
          إغلاق الطلب
        </Button>
      </router-link>
      <router-link
          v-else
          to="/admin-panel/payment-request"
          class="align-self-end mb-4 float-lg-start">
        <Button class="p-button p-button-rounded p-button-secondary">
          <i class="pi pi-times mx-1"></i>
          إغلاق الطلب
        </Button>
      </router-link>
    </div>
  </div>

  <PaymentRequestLogs
      :auditorsLogs="state.auditorsLogs"
      :charityLogs="state.charityLogs"
      :userPermission="state.permission"
  />

  <VerificationModal
      :display="isMobileOTPModalOpened"
      :transfer-process="true"
      :verificationError="state.verificationError"
      @transfer="saveChanges"
      @onClose="isMobileOTPModalOpened = false"
  />

  <Card class="mb-4">
    <template #content>
      <div class="w-100">
        <PaymentRequestDetails
            :paymentRequestData="state.paymentRequestData"
            :attachmentData="state.attachmentData"
            :exchangeOrderLink="state.exchangeOrderLink"
            :financialRequestLink="state.financialRequestLink"
            :completionSpeechLink="state.completionSpeechLink"
            :exchangeReceiptLink="state.exchangeReceiptLink"
            :invoiceLink="state.invoiceLink"
            :edit-mode="true"
            :error="state.error"
            @file-change="fileChange"
            :en-statuses="state.enStatuses"
            :hospitals="state.hospitals"
            :userPermission="state.permission"
            :isCharityManager="state.isCharityManager"
        />
      </div>
    </template>
  </Card>

  <Card class="mb-4"
        v-if="state.paymentRequestData.status !== PAYMENT_REQUEST_ENUM.Charity_Payment_Completed &&
     state.paymentRequestData.status !== PAYMENT_REQUEST_ENUM.Waiting_Transfer_Confirmation">
    <template #header>
      <div class="title fs-4 fw-bold p-4">
        الإجراءات
      </div>
    </template>
    <template #content>
      <PaymentRequestProcedures
          :payload="state.procedurePayload"
          :actionOptions="state.procedures"
          :paymentRequestDetails="state.paymentRequestData"
          :isCharityManager="state.isCharityManager"
      />
      <div>
        <Button
            label="إرسال"
            class="p-button-primary p-button-rounded mx-2 width-180"
            @click.stop="openOtp"
            :disabled="!canSubmit"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import {reactive, computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import PaymentRequestService from "@/services/paymentRequest.service";
import EnumService, {
  CASE_STATUS,
  PAYMENT_REQUEST_ENUM,
  PROCEDURES_MAPPING_AR,
  USER_PERMISSION
} from "@/services/enum.service";
import PaymentRequestDetails from "@/components/admin-panel/payment-request/PaymentRequestDetails.vue";
import PaymentRequestLogs from "@/components/admin-panel/payment-request/PaymentRequestLogs.vue";
import PaymentRequestProcedures from "@/components/admin-panel/payment-request/PaymentRequestProcedures.vue";
import JwtUtilService from "@/services/jwt.util.service";
import {useToast} from "primevue/usetoast";
import {ToastSeverity} from "primevue/api";

import MediaService from "@/services/media.service";
import CharityRegisterService from "@/services/charity-register.service";
import CaseService from "@/services/case-service";
import VerificationModal from "@/views/authentication/CreateAccount/verification-modal.vue";

const isMobileOTPModalOpened = ref(false)
const toast = useToast()
const route = useRoute();
const router = useRouter();
const state = reactive({
  queryParams: {
    search: "",
    case_status: route.query.case_status || null,
    page: 1,
    page_size: 15,
    export_file: false,
    order_by: null,
    sort: null,
  },
  paymentRequestData: {},
  loading: false,
  verificationError: false,
  error: '',
  auditorsLogs: [],
  charityLogs: [],
  procedurePayload: {
    action: null,
    AuditorLogComment: null,
    charityFeedbackLogComment: null,
  },
  procedures: [],
  permission: "",
  enStatuses: [],
  hospitals: [],
  isCharityManager: JwtUtilService.getClientID()?.includes("charity"),
  attachmentData: {},
  charityData: {},
  payoutData: {
    amount: "",
    beneficiary: {
      name: "",
      iban: "",
    },
  },
  exchangeOrderLink: "",
  financialRequestLink: "",
  completionSpeechLink: "",
  invoiceLink: "",
  exchangeReceiptLink: "",
  charity_case: {},
  phase: {},
});

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

const getPaymentRequestDetails = async () => {
  const {data} = await PaymentRequestService.getPaymentRequest(`${route.params.id}`);
  const resultEntries = Object.entries(data.result)
  const results = {}
  for (let entry of resultEntries) {
    results[entry[0]] = entry[1]
  }
  state.enStatuses = CASE_STATUS[results.status]
  results.status = PAYMENT_REQUEST_ENUM[results.status]
  for (let procedures of results.procedures) {
    procedures.name = PROCEDURES_MAPPING_AR[procedures.value]
  }
  state.procedures = results.procedures
  state.permission = results.permission
  state.paymentRequestData = results
  CharityRegisterService.getCharityDetails(state.paymentRequestData.charity_case__charity)
      .then((response) => {
        state.charityData = response.data.result
      })
  if (!route.fullPath.includes("phase")) {
    CaseService.getCase(`${state.paymentRequestData.charity_case}`).then((charityCase) => {
      state.charity_case = charityCase.data.result;
    });
  } else {
    CaseService.getPhase(`${state.paymentRequestData.phase}`).then((phase) => {
      state.phase = phase.data.result;
    });
  }

  EnumService.hospitals()
      .then(({data: {result}}) => {
        if (result.length) {
          for (let entry of result) {
            if (state.paymentRequestData.hospital === entry.id) {
              state.paymentRequestData.hospital = entry.id
            }
          }
        }
      })
      .catch((error) => {
      })
      .finally(() => {
      });
}

const getExchangeOrderFromPaymentRequest = async () => {
  const {data} = await PaymentRequestService.getExchangeOrder(`${route.params.id}`);
  if (data && data.results) {
    state.exchangeOrderLink = data.results.attachment
  }
};

const getFinancialRequestFromPaymentRequest = async () => {
  const {data} = await PaymentRequestService.getFinancialRequest(`${route.params.id}`);
  if (data && data.results) {
    state.financialRequestLink = data.results.attachment
  }
};
const getCompletionSpeechFromPaymentRequest = async () => {
  const {data} = await PaymentRequestService.getCompletionSpeech(`${route.params.id}`);
  if (data && data.results) {
    state.completionSpeechLink = data.results.attachment
  }
};

const getAttachmentDataInvoice = async () => {
  const {data} = await PaymentRequestService.getAttachmentDataInvoice();
  for (let item of data.reverse()) {
    if (item.type === "Invoice" && item.payment_request === parseInt(`${route.params.id}`)) {
      state.attachmentData.attachment = item.attachment
      state.invoiceLink = item.attachment
    }
    if (item.type === "Exchange_Receipt" && item.transferred_to_shefa === false && item.payment_request === parseInt(`${route.params.id}`)) {
      state.exchangeReceiptLink = item.attachment
    }
  }
};

const fileChange = async (event, key) => {
  if (
      event &&
      event.target &&
      event.target.files &&
      event.target.files.length
  ) {
    state.paymentRequestData[key] = event.target.files[0];
  }
}

function PaymentRequestPayloadFill(state) {
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Waiting_review
  ) {
    state.paymentRequestData.money_transfer_pending = true
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Waiting_review]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Feedback_Charity
  ) {
    state.paymentRequestData.return_to_charity = true
    state.paymentRequestData.charity_log_enabled = true
    state.paymentRequestData.notes = state.procedurePayload.charityFeedbackLogComment
    state.paymentRequestData.data_to_be_modified = state.procedurePayload.charityFeedbackLogComment
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Feedback_Charity]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Cancellation_Confirmation
  ) {
    state.paymentRequestData.rejected = true
    state.paymentRequestData.notes = state.paymentRequestData.AuditorLogComment
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Cancellation_Confirmation]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Closed
  ) {
    state.paymentRequestData.closed = true
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Closed]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Waiting_Audit_2
  ) {
    state.paymentRequestData.accepted = true
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Waiting_Audit_2]
  }
  if (
      state.procedurePayload.action &&
      state.enStatuses === CASE_STATUS.Feedback_Charity &&
      state.procedurePayload.action === CASE_STATUS.Waiting_Audit_1
  ) {
    state.paymentRequestData.accepted = true
    state.paymentRequestData.charity_log_enabled = true
    state.paymentRequestData.notes = state.procedurePayload.charityFeedbackLogComment
    state.paymentRequestData.data_to_be_modified = state.procedurePayload.charityFeedbackLogComment
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Waiting_Audit_1]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Financial_Reviewer_Feedback
  ) {
    state.paymentRequestData.return_to_audit = true
    state.paymentRequestData.charity_log_enabled = true
    state.paymentRequestData.notes = state.procedurePayload.charityFeedbackLogComment
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Financial_Reviewer_Feedback]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Waiting_Transfer
  ) {
    state.paymentRequestData.money_transfer_approved = true
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Waiting_Transfer]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Waiting_Transfer_Confirmation
  ) {
    state.paymentRequestData.transfer_amount_to_charity = true
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Waiting_Transfer_Confirmation]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Rejected_Invoice
  ) {
    state.paymentRequestData.rejected_invoice = true
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Rejected_Invoice]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Manager_Cancellation
  ) {
    state.paymentRequestData.rejected = true
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Manager_Cancellation]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Financial_Manager_Feedback
  ) {
    state.paymentRequestData.return_to_audit = true
    state.paymentRequestData.charity_log_enabled = true
    state.paymentRequestData.notes = state.procedurePayload.charityFeedbackLogComment
    state.paymentRequestData.data_to_be_modified = state.procedurePayload.charityFeedbackLogComment
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Financial_Manager_Feedback]
  }
  if (
      state.procedurePayload.action &&
      state.procedurePayload.action === CASE_STATUS.Charity_Payment_Completed
  ) {
    state.paymentRequestData.charity_payment_completed = true
    state.paymentRequestData.procedure_value = PROCEDURES_MAPPING_AR[CASE_STATUS.Charity_Payment_Completed]
  }
}
const onMobileModalClosed = () => {
  isMobileOTPModalOpened.value = false
}

const openOtp = async () => {
  if (
      state.procedurePayload?.action === CASE_STATUS.Waiting_Transfer_Confirmation
  ) {
    isMobileOTPModalOpened.value = true;
  } else {
    await saveChanges()
  }
}

const saveChanges = async (otp) => {
  PaymentRequestPayloadFill(state);
  if (state.procedurePayload && state.procedurePayload.AuditorLogComment) {
    state.paymentRequestData.notes = state.procedurePayload.AuditorLogComment
  }
  if (state.paymentRequestData && state.paymentRequestData.attachment) {
    state.paymentRequestData.attachment = await toBase64(state.paymentRequestData.attachment)
  }
  state.paymentRequestData.otp_code = otp
  state.verificationError = false;
  PaymentRequestService.updatePaymentRequest(state.paymentRequestData, `${route.params.id}`)
      .then(({data: {response}}) => {
        toast.add({severity: ToastSeverity.SUCCESS, detail: "تم تعديل عرض الطلب بنجاح", life: 3000});
        router.back();
      })
      .catch((error) => {
        state.verificationError = true;
      });
}


const enum_hospitals = async () => {
  state.loading = true;
  state.error = null;

  EnumService.hospitals()
      .then(({data}) => {
        if (data.result.length) state.hospitals = data.result;
      })
      .catch((error) => {
        state.error = error;
      })
      .finally(() => {
        state.loading = false;
      });
}

const canSubmit = computed(() => {
  if (!route.fullPath.includes("phase")) {
    if (parseInt(state.charity_case.amount) < state.paymentRequestData.amount) {
      state.error = "المبلغ اكبر من قيمة التعميد.";
    } else {
      state.error = null;
    }
  } else {
    if (parseInt(state.phase.amount) < state.paymentRequestData.amount) {
      state.error = "المبلغ اكبر من قيمة التعميد.";
    } else {
      state.error = null;
    }
  }
  return state.paymentRequestData.amount && state.procedurePayload.action;
});

onMounted(() => {
  Promise.all([
    getPaymentRequestDetails(),
    getExchangeOrderFromPaymentRequest(),
    getFinancialRequestFromPaymentRequest(),
    getCompletionSpeechFromPaymentRequest(),
    enum_hospitals(),
    getAttachmentDataInvoice(),
  ]);
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/helpers";

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

::v-deep(.form-medical-information__phases) {
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

::v-deep(.phases-divider) {
  position: relative;
  width: 100%;
  height: 0;
  border-top: 1px solid #d9d9d9;

  .phases-divider__heading {
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

::v-deep(.p-disabled) {
  background-color: #ececec;
  border-color: #d9d9d9;
}

::v-deep(.p-inputtext:disabled) {
  border-color: #d9d9d9;
}

::v-deep(.p-inputtextarea:disabled) {
  background-color: #ececec;
  border-color: #d9d9d9;
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

:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 16px;
}
</style>
