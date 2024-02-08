<template>
  <BaseTable @getList="getList"
             :cases="state.cases"
             :statuses="state.statuses"
             :totalItemsCount="state.totalItemsCount"
             :queryParams="state.queryParams"
             :showPagination="state.showPagination"
             @transferAll="openOptModal"
             @selected-cases="state.selectedIds = $event"
             v-if="state.queryParams"/>
  <VerificationModal
      :display="state.showOptModal"
      :transfer-process="true"
      :selected-ids="state.selectedIds"
      @transfer="transferAll"
      @onClose="state.showOptModal = false"
  />
</template>

<script setup>
import {onMounted, reactive, watch} from "vue";
import PaymentRequestService from "@/services/paymentRequest.service";
import {useRouter, useRoute} from "vue-router";
import {useToast} from "primevue/usetoast";
import BaseTable from "@/components/layout/payment-request/BaseTable.vue";
import JwtUtilService from "@/services/jwt.util.service";
import VerificationModal from "@/views/authentication/CreateAccount/verification-modal.vue";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const state = reactive({
  selectedIds: [],
  cases: [],
  queryParams: {
    search_id: "",
    search_case_id: "",
    search_invoice_no: "",
    case_status: route.query.case_status || null,
    page: 1,
    page_size: 15,
    export_file: false,
    order_by: null,
    sort: null
  },
  showPagination: true,
  isCharityManager: JwtUtilService.getClientID()?.includes("charity")
});

const getList = async (queryParams) => {
  state.queryParams = {...state.queryParams, ...queryParams};
  const {
    data: {results: {all_statuses_dropdown, cases, file_url}, total_objects}
  } = await PaymentRequestService.getPaymentRequestList(state.queryParams);
  if (state.queryParams.export_file) {
    window.open(file_url, "_blank");
  } else {
    state.cases = cases?.map((e) => ({
      id: e.id,
      invoice_number: e.invoice_number,
      amount: e.amount,
      status: e.status?.name,
      charity_case: e.charity_case,
      phase: e.phase,
      hospital: e.hospital,
      patient: e.patient,
      identity_number: e.identity_number,
      charity: e.charity,
      color: e.color?.code,
      procedures: e.procedures,
      permission: e.permission,
      audit_user_actions: e.audit_user_actions?.map(action => {
        if (action['value'] === 'view_charity_case') {
          return {...action, label: action.name, url: action.url + '&returnUrl=payment-request'};
        } else {
          return {...action, label: action.name};
        }
      })
    }));

    state.casesDynamic = state.cases;
    state.totalItemsCount = total_objects || 15;
    state.statuses = all_statuses_dropdown;
  }
};

const openOptModal = () => {
  state.showOptModal = true;
}

const transferAll = async (otpCode) => {
  try {
    const {
      data: { results }
    } = await PaymentRequestService.transferAll(state.selectedIds, otpCode);
    state.showOptModal = false;

    toast.add({
      severity:'success',
      detail:'تم التحويل بنجاح',
      closable: false,
      contentStyleClass: 'direction-rtl',
      life: 3000
    });

    await getList(state.queryParams);
  }
  catch {}
}

onMounted(() => getList(state.queryParams));

watch(
  () => route.query, async (queryParams) => {
    if (queryParams) {
      const {case_status} = queryParams;

      if (case_status) {

        state.queryParams.case_status = case_status;
        state.queryParams.page = 1;
        state.showPagination = false;
        setTimeout(()=> {
          state.showPagination = true;
        })
        await getList(state.queryParams);
      }
    }
  }
);

</script>

<style lang="scss" scoped>

@import "@/styles/variables";

a {
  text-decoration: none;
  color: white;
}

::v-deep(.p-card) {
  box-shadow: $box-shadow-card;
  border-radius: $border-radius-default;
  margin-bottom: 8rem;
  padding-bottom: 2rem;

  .p-card-body {
    padding-top: 0;
    box-shadow: none;
  }
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

.input-wrapper {
  min-width: 313px;
}

::v-deep(.p-dropdown) {
  border: none;
}

::v-deep(.p-button-secondary) {
  font-size: 14px;
  background-color: $color-secondary;
  border-color: $color-secondary;
  color: $color-font-dark;

  &:hover {
    background-color: $color-secondary-hover !important;
    border-color: $color-secondary-hover !important;
  }
}

::v-deep(.p-splitbutton) {
  .p-splitbutton-defaultbutton {
    position: absolute;
    width: 2rem;
    height: 2rem;
    border-radius: $border-radius-small;
    background-color: #e9e9e9;
    border-color: #e9e9e9;
    color: $color-font-dark;
  }

  .p-splitbutton-menubutton {
    width: 2rem;
    height: 2rem;
    border-radius: $border-radius-small;
    background: transparent;
    border-color: transparent;
  }

  .pi-chevron-down {
    display: none;
  }
}

::v-deep(.min-w-420) {
  min-width: 420px;
}

::v-deep(.p-splitbutton:hover) {
  .p-splitbutton-defaultbutton {
    color: $color-primary !important;
  }
}

::v-deep(.p-tieredmenu.p-tieredmenu-overlay) {
  direction: rtl;
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

::v-deep(.p-paginator) {
  .p-paginator-current {
    margin-left: auto;
  }
}

::v-deep(.p-paginator) {
  justify-content: end;

  .p-paginator-first,
  .p-paginator-prev,
  .p-paginator-next,
  .p-paginator-last {
    transform: rotate(180deg);
  }
}
</style>

