<template>
  <main class="edit-case d-flex flex-column align-items-start">

    <Button @click="goBack" class="p-button p-button-rounded p-button-secondary align-self-end mb-4 float-lg-start">
      <i class="pi pi-times mx-1"></i>
      إغلاق الطلب
    </Button>

    <div class="w-100">
      <PaymentRequestLogs
          :auditorsLogs="state.auditorsLogs"
          :charityLogs="state.charityLogs"
          :userPermission="state.permission"
      />
    </div>

    <Card>
      <template #content>
        <div class="w-100">
          <PaymentRequestDetails
              :paymentRequestData="state.paymentRequestDetails"
              :attachmentData="state.attachmentData"
              :exchangeOrderLink="state.exchangeOrderLink"
              :financialRequestLink="state.financialRequestLink"
              :completionSpeechLink="state.completionSpeechLink"
              :exchangeReceiptLink="state.exchangeReceiptLink"
              :invoiceLink="state.invoiceLink"
              :en-statuses="state.enStatuses"
              :edit-mode="false"
              :hospitals="state.hospitals"
              :userPermission="state.permission"
              :isCharityManager="state.isCharityManager"
          />
        </div>
      </template>
    </Card>

  </main>
</template>
<script setup>
import {reactive, computed, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import PaymentRequestService from "@/services/paymentRequest.service";
import EnumService, {CASE_STATUS, PAYMENT_REQUEST_ENUM, USER_PERMISSION} from "@/services/enum.service";
import PaymentRequestDetails from "@/components/admin-panel/payment-request/PaymentRequestDetails.vue";
import PaymentRequestLogs from "@/components/admin-panel/payment-request/PaymentRequestLogs.vue";

const route = useRoute();
const router = useRouter();

const state = reactive({
  paymentRequestDetails: {},
  loading: false,
  error: '',
  auditorsLogs: [],
  charityLogs: [],
  enStatuses: [],
  attachmentData: {},
  hospitals: [],
  exchangeOrderLink: "",
  financialRequestLink: "",
  completionSpeechLink: "",
  invoiceLink: "",
  exchangeReceiptLink: "",
  permission: "",
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
  state.permission = results.permission
  state.paymentRequestDetails = results
  EnumService.hospitals()
      .then(({data: {result}}) => {
        if (result.length) {
          for (let entry of result) {
            if (state.paymentRequestDetails.hospital === entry.id) {
              state.paymentRequestDetails.hospital = entry.id
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
  for (let item of data) {
    if (item.type === "Invoice" && item.payment_request === parseInt(`${route.params.id}`)) {
      state.attachmentData.attachment = item.attachment
      state.invoiceLink = item.attachment
    }
    if (item.type === "Exchange_Receipt" && item.transferred_to_shefa === false && item.payment_request === parseInt(`${route.params.id}`)) {
      state.exchangeReceiptLink = item.attachment
    }
  }
};

const goBack = () => {
  state.permission === USER_PERMISSION.charity_manager ?
    router.push("/admin-panel/auditors-list") :
    router.back();
};

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

onMounted(() => {
  Promise.all([
    getPaymentRequestDetails(),
    getExchangeOrderFromPaymentRequest(),
    getFinancialRequestFromPaymentRequest(),
    getCompletionSpeechFromPaymentRequest(),
    enum_hospitals(),
    getAttachmentDataInvoice(),
  ])
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
