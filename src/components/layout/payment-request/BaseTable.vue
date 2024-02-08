<template>
  <section class="datatable-view">
    <Toast appendTo="#app"/>
    <ConfirmDialog appendTo="#app" :breakpoints="{'600px': '75vw', '640px': '100vw'}"
                   :style="{width: '30vw'}"></ConfirmDialog>
    <Card>
      <template #content>
        <DataTable
          :value="state.PaymentRequestsDynamic"
          :paginator="false"
          dataKey="id"
          :rows="15"
          v-model:filters="state.filters"
          filterDisplay="menu"
          responsiveLayout="scroll"
          @sort="sort($event)"
          :resizableColumns="true"
          columnResizeMode="fit"
          v-model:expandedRows="state.expandedRows"
          :metaKeySelection="props.queryParams.case_status !== CASE_STATUS.Waiting_Transfer"
          :selectionMode="'multiple'"
          v-model:selection="state.selectedCases"
        >
          <template #empty>
            <div class="text-center">
              لا يوجد حالات
            </div>
          </template>
          <template #header>
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex">
                <div class="mx-2">
                <span class="p-input-icon-right input-wrapper">
                  <i class="pi pi-search"/>
                  <InputText
                    class="w-100"
                    placeholder="ابحث حسب رقم الهوية"
                    @input="createDebounce($event.target.value, 'search_id')"
                  />
                </span>
                </div>
                <div class="mx-2">
                <span class="p-input-icon-right input-wrapper">
                  <i class="pi pi-search"/>
                  <InputText
                    class="w-100"
                    placeholder="ابحث حسب رقم الحالة"
                    @input="createDebounce($event.target.value, 'search_case_id')"
                  />
                </span>
                </div>
                <div class="mx-2">
                <span class="p-input-icon-right input-wrapper">
                  <i class="pi pi-search"/>
                  <InputText
                    class="w-100"
                    placeholder="ابحث حسب رقم الفاتورة"
                    @input="createDebounce($event.target.value, 'search_invoice_no')"
                  />
                </span>
                </div>
                <Dropdown
                  v-model="props.queryParams.case_status"
                  :options="state.statuses"
                  optionLabel="name"
                  :placeholder="'جميع الحالات'"
                  name="statuses"
                  id="statuses"
                  class="mx-3"
                  @change="onStatusChanged"
                  v-if="state.isAllStatusesSelected"
                />
              </div>
              <div class="d-flex justify-content-between">
                <Button
                  class="p-button p-button-rounded btn-primary me-auto mx-2"
                  @click="showPaymentConfirmationModal"
                  v-if="props.queryParams.case_status === CASE_STATUS.Waiting_Transfer"
                  :disabled="!state.selectedCases?.length"
                >
                  <i class="pi pi-money-bill mx-1 text-white"></i>
                  <span>تحويل الكل</span>
                </Button>

                <Button
                  class="p-button p-button-rounded p-button-secondary me-auto mx-2"
                  @click="exportToExcel"
                >
                  <i class="excel-icon mx-1"></i>
                  <span>رفع إلى Excel</span>
                </Button>
              </div>
            </div>
          </template>
          <Column class="filterable" headerStyle="width: 3rem"
          :selectionMode="props.queryParams.case_status === CASE_STATUS.Waiting_Transfer ? 'multiple': 'none'"></Column>
          <Column field="charity_case" header="رقم الحالة" sortable sortField="charity_case_"></Column>
          <Column field="identity_number" header="الهوية" sortable sortField="identity_number_"></Column>
          <Column field="patient" header="المريض" sortable sortField="patient_"></Column>
          <Column field="hospital" header="جهة العلاج" sortable sortField="hospital_"></Column>
          <Column field="charity" header="الجمعية" sortable sortField="charity_"></Column>
          <Column field="invoice_number" header="رقم الفاتورة" sortable sortField="invoice_number_"></Column>
          <Column field="amount" header="مبلغ العلاج" sortable sortField="amount_">
            <template #body="slotProps">
              <span>{{ Math.ceil(slotProps.data.amount).toLocaleString("en-US") }}</span>
            </template>
          </Column>
          <Column field="status" header="حالة الطلب" sortable sortField="status_"></Column>
          <Column field="color" header="الأولوية" sortable
                  sortField="color_">
            <template #body="slotProps">
              <div :style="{color: slotProps.data.color}">
                <i class="pi pi-exclamation-triangle fs-5"></i>
              </div>
            </template>
          </Column>
          <Column field="id">
            <template #body="slotProps">
              <div @click.stop="selectCase(slotProps.data.id)">
                <div class="d-flex justify-content-start align-items-center">
                  <div class="icon-container bg-light rounded-3 py-2 px-3 mx-1"
                       v-for="(action, index) in slotProps.data.audit_user_actions" :key="index"
                       v-tooltip="action.label"
                       @click="onActionClickHandler(action, slotProps.data.audit_user_actions)">
                    <i :class="action.icon"></i>
                  </div>
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
        <div class="mt-2 d-flex justify-content-between align-items-center">
          <span v-if="cases?.length">عدد الحالات الإجمالي {{ totalItemsCount }}</span>
          <Paginator v-if="showPagination && cases?.length" :rows="15" :totalRecords="props.totalItemsCount" @page="onPageChange($event)"></Paginator>
        </div>
      </template>
    </Card>
  </section>
  <ConfirmationModal :display="state.showPaymentConfirmationModal"
                     @toggleModal="state.showPaymentConfirmationModal = !state.showPaymentConfirmationModal"
                     @putCase="transferAll">
  </ConfirmationModal>
</template>

<script setup>
import {FilterMatchMode} from "primevue/api";
import {reactive, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useToast} from "primevue/usetoast";
import { CASE_STATUS, PAYMENT_REQUEST_ACTION, USER_TYPE } from "@/services/enum.service";
import JwtUtilService from "@/services/jwt.util.service";
import ConfirmationModal from "@/components/admin-panel/auditor-case/ConfirmationModal";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const emit = defineEmits(['getList', 'transferAll', 'selectedCases'])
const props = defineProps({
  cases: {
    type: Array,
    default: [],
    required: true
  },
  queryParams: {
    type: Object,
    default: {},
    required: true
  },
  totalItemsCount: {
    type: Number,
    default: 15,
    required: true
  },
  showPagination : {
    type: Boolean,
    default: true
  },
})

const state = reactive({
  PaymentRequestsDynamic: Object.assign([], props.cases),
  filters: {
    global: {value: null, matchMode: FilterMatchMode.EQUALS}
  },
  searchText: "",
  statuses: [],
  selectedStatus: null,
  selectedPaymentRequest: null,
  queryParams: {
    search: "",
    case_status: route.query.case_status || null,
    page: 1,
    page_size: 15,
    export_file: false,
    order_by: null,
    sort: null,
    user_id: route.query.user_id || 1,
    user_type: route.query.user_type || USER_TYPE.Technical_Audit
  },
  debounce: 0,
  totalItemsCount: 25,
  userType: USER_TYPE,
  isCharityManager: JwtUtilService.getClientID()?.includes("charity"),
  selectedCases: [],
  showPaymentConfirmationModal: false
});


watch(() => props.cases, (newCases) => {
  state.PaymentRequestsDynamic = Object.assign([], newCases)
});

const selectCase = (id) => {
  state.selectedPaymentRequest = id;
};

const onStatusChanged = () => {
  state.PaymentRequestsDynamic = props.cases.filter((c) => {
    return props.queryParams.case_status.id === "all"
      ? c
      : c.status === props.queryParams.case_status.id;
  });
};

const createDebounce = (text, prop) => {
  clearTimeout(state.debounce);
  state.debounce = setTimeout(async () => {
    state.searchText = text;
    props.queryParams[prop] = text;
    emit('getList', props.queryParams)
  }, 1000);
};

const exportToExcel = async () => {
  props.queryParams.export_file = true;
  emit('getList', props.queryParams)
};

const sort = async (event) => {
  switch (event.sortField) {
    case "charity_case_":
      props.queryParams.order_by = "charity_case";
      break;
    case "identity_number_":
      props.queryParams.order_by = "identity_number";
      break;
    case "patient_":
      props.queryParams.order_by = "patient";
      break;
    case "hospital_":
      props.queryParams.order_by = "hospital";
      break;
    case "charity_":
      props.queryParams.order_by = "charity";
      break;
    case "invoice_number_":
      props.queryParams.order_by = "invoice_number";
      break;
    case "amount_":
      props.queryParams.order_by = "amount";
      break;
    case "status_":
      props.queryParams.order_by = "status";
      break;
  }
  props.queryParams.sort = event.sortOrder === 1 ? "asc" : "desc";
  emit('getList', props.queryParams)
};

const onPageChange = async (event) => {
  props.queryParams.page = event.page + 1;
  emit('getList', props.queryParams)
};

const showPaymentConfirmationModal = () => {
  state.showPaymentConfirmationModal = true;
}

const transferAll = () => {
  emit('transferAll', state.selectedCases);
};

const onActionClickHandler = (action, item, isPhase = false) => {

  if (!isPhase) {
    if (action.url) {
      router.push(action.url);
    } else {
      emit("actionSelected", { id: item.id, type: action.type, value: action.value, message: action.name });
    }
  }
  else {
    if (action.case?.status.value === CASE_STATUS.Multiple_Phases) {
      if (
        action.value === PAYMENT_REQUEST_ACTION.edit_payment_request ||
        action.value === PAYMENT_REQUEST_ACTION.view_payment_request
      ) {
        router.push(action.url);
      }
      else {
        emit("actionSelected", { id: action.case?.id, type: action.type, value: action.value, message: action.name });
      }
    }
    else {
      router.push(action.url);
    }
  }
};

watch(() => state.selectedCases, (newSelectedCases) => {
  emit('selectedCases', newSelectedCases.map(e => e.id))
});
</script>

<style lang="scss" scoped>

@import "@/styles/variables";

a {
  text-decoration: none;
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
  min-width: 200px;
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

.min-w-360 {
  min-width: 360px;
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

.icon-payment-request {
  display: inline-block;
  background: url("../../../assets/icons/view-invoice.svg") no-repeat;
  width: 16px;
  height: 20px;
}

</style>

