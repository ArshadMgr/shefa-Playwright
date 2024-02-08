<template>
  <main class="edit-case d-flex flex-column align-items-start">
    <Card v-if="state.auditorsLogs.length !== 0 && !state.isCharityManager">
      <template #header>اجراءات الطلب</template>
      <template #content>
        <StepOrderProcedures
            :payload="state.auditorsLogs"
            :filters="state.filters"
            :paymentRequestPage="true"
        />
      </template>
    </Card>
    <Card  v-if="state.charityLogs.length !== 0">
      <template #header>ملاحظات خاصة بالجمعية</template>
      <template #content>
        <StepSocietyNotes
            :payload="state.charityLogs" :filters="state.filters"
        />
      </template>
    </Card>
  </main>
</template>
<script setup>
import {FilterMatchMode} from "primevue/api";
import StepOrderProcedures from "@/components/admin-panel/auditor-case/StepOrderProcedures";
import StepSocietyNotes from "@/components/admin-panel/auditor-case/StepSocietyNotes";
import {useToast} from "primevue/usetoast";
import {reactive, computed, onMounted, ref, onUpdated, defineProps, watch} from "vue";
import {useRoute} from "vue-router";
import {
  formatCreationDate,
} from "@/helpers/helpers";
import JwtUtilService from "@/services/jwt.util.service";
import PaymentRequestService from "@/services/paymentRequest.service";
import {STORE_ENUM} from "@/store/store.enums";
import {useStore} from "vuex";

const state = reactive({
  auditorsLogs: [],
  charityLogs: [],
  filters: {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  },
  username: localStorage.getItem("username"),
  isCharityManager: JwtUtilService.getClientID()?.includes("charity")
});

const toast = useToast();
const route = useRoute();
const store = useStore();

const getCharityManagerLogs = async () => {
  const charityLogsResult = await PaymentRequestService.getPaymentRequestCharityLog(`${route.params.id}`);
  let charityLogs = [];
  if (charityLogsResult && charityLogsResult.data && charityLogsResult.data.length) {
    for (let i = 0; i < charityLogsResult.data.length; i++) {
      const element = charityLogsResult.data[i];
      if (element.payment_request_id === parseInt(`${route.params.id}`)) {
        charityLogs.push({
          id: element.id,
          user: element.user,
          validity: element.user_type,
          action: element.procedure_action,
          comment: element.comment || "-",
          date: formatCreationDate(element.created_on),
        });
      }
    }
    state.charityLogs = charityLogs;
  }
};

const getAuditorsLogs = async () => {
  const auditorsLogsResult = await PaymentRequestService.getPaymentRequestAuditorsLog(`${route.params.id}`);
  const auditorsLogs = [];
  for (let i = 0; i < auditorsLogsResult.data.length; i++) {
    const element = auditorsLogsResult.data[i];
    if (element.payment_request_id === parseInt(`${route.params.id}`)) {
      if (
          element.procedure_action !== 'Phase_Financial_Request' &&
          element.procedure_action !== 'Case_Financial_Request' &&
          element.procedure_action !== 'Case_Exchange_Order' &&
          element.procedure_action !== 'Phase_Exchange_Order'
      ) {
        auditorsLogs.push({
          id: element.id,
          user: element.user,
          validity: element.user_type,
          action: element.procedure_action,
          comment: element.comment || "-",
          date: formatCreationDate(element.created_on),
        });

      state.auditorsLogs = auditorsLogs;
      }
    }
  }
};

onMounted(() => {
  Promise.all([
    getCharityManagerLogs(),
    getAuditorsLogs(),
  ]);
});


</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/helpers";

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
</style>
