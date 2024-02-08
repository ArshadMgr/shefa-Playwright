<template>
  <section class="datatable-view">
    <Toast appendTo="#app" />
    <ConfirmDialog appendTo="#app" :breakpoints="{'600px': '75vw', '640px': '100vw'}"
                   :style="{width: '30vw'}"></ConfirmDialog>
    <Card>
      <template #content>
        <div ref="refTableContainer">
          <DataTable
            :value="state.casesDynamic"
            :paginator="false"
            dataKey="id"
            :rows="props.queryParams.page_size"
            v-model:filters="state.filters"
            filterDisplay="menu"
            responsiveLayout="scroll"
            @sort="sort($event)"
            :resizableColumns="true"
            columnResizeMode="fit"
            selectionMode="single"
            @rowSelect.self="handleRowClick"
            v-model:expandedRows="state.expandedRows"
            data-cy="cases-table"
          >
            <template #empty>
              <div class="text-center">
                لا يوجد حالات
            </div>
          </template>
          <template #header>
            <div class="d-flex justify-content-start align-items-center">
              <div class="mx-2">
                <span class="p-input-icon-right input-wrapper">
                  <i class="pi pi-search" />
                  <InputText
                    class="w-100"
                    placeholder="ابحث حسب رقم الحالة"
                    @input="createDebounce($event.target.value, 'search_case_id')"
                  />
                </span>
              </div>
              <div>
                <span class="p-input-icon-right input-wrapper">
                  <i class="pi pi-search" />
                  <InputText
                    class="w-100"
                    placeholder="ابحث حسب رقم الهوية"
                    @input="createDebounce($event.target.value, 'search_id')"
                  />
                </span>
              </div>
              <Dropdown
                v-model="props.queryParams.case_status"
                :options="props.statuses"
                optionLabel="name"
                optionValue="value"
                :placeholder="'جميع الحالات'"
                name="statuses"
                id="statuses"
                class="mx-3"
                @change="onStatusChanged"
                v-if="props.isAllStatusesSelected"
              />
              <Dropdown
                v-model="props.queryParams.page_size"
                optionLabel="name"
                optionValue="value"
                :options="state.pageSizes"
                placeholder="عدد السجلات"
                name="page-size"
                id="page-size"
                class="mx-3"
                @change="onPageSizeChanged"
              />
              <Dropdown
                v-model="props.queryParams.phase_type"
                :options="state.treatmentPhases"
                optionLabel="name"
                optionValue="value"
                :placeholder="'مراحل العلاج'"
                name="statuses"
                id="phases"
                class="mx-3"
                @change="onPhaseChanged"
                v-if="props.isReadyToBePublished"
              />
              <BaseTableColumnToggle v-if="refTableContainer" :use-select="true" :table="refTableContainer" :watch="state.casesDynamic"/>
              <Button
                class="p-button p-button-rounded p-button-secondary me-auto"
                @click="exportToExcel"
              >
                <i class="excel-icon mx-1"></i>
                <span>رفع إلى Excel</span>
              </Button>
            </div>
          </template>
          <Column :expander="true" headerStyle="width: 1rem">
            <template #body="slotProps">
              <button class="p-row-toggler p-link" type="button"
                      v-if="slotProps.data.has_phases"
                      @click="onExpandClick(slotProps.data)">
                <span :class="['p-row-toggler-icon pi',
                                slotProps.data.show_phases_table? 'pi-chevron-down': 'pi-chevron-right']"></span>
              </button>
            </template>
          </Column>
          <Column field="order" v-if="showPin">
            <template #body="slotProps">
              <div class="pin-icon-cont rounded-3 p-2" v-if="slotProps.data.order_number > 0"
                   @click.stop="toggleCaseOrder(true, slotProps.data)">
                <div class="pin-icon"></div>
              </div>
              <div v-else class="pin-icon"
                   @click.stop="toggleCaseOrder(false, slotProps.data)"></div>
            </template>
          </Column>
          <Column field="id" header="#" sortable sortField="id_">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]" data-cy="case-id">{{ slotProps.data.id }}</div>
            </template>
          </Column>
          <Column field="patient_name" header="المريض" sortable sortField="patient_name_">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">{{ slotProps.data.patient_name }}</div>
            </template>
          </Column>
          <Column field="identity_number" header="رقم الهوية" sortable sortField="identity_number_">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]" data-cy="identity">{{ slotProps.data.identity_number }}</div>
            </template>
          </Column>
          <Column field="created_on" header="التاريخ" sortable sortField="created_on_">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">{{ slotProps.data.created_on }}</div>
            </template>
          </Column>
          <Column field="age" header="العمر" sortable sortField="age_">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">{{ slotProps.data.age }}</div>
            </template>
          </Column>
          <Column field="nationality" header="الجنسية" sortable sortField="nationality_"
                  v-if="props.queryParams.case_status !== CASE_STATUS.Published">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">{{ slotProps.data.nationality }}</div>
            </template>
          </Column>
          <Column field="type" header="الجنس" sortable sortField="type_"
                  v-if="props.queryParams.case_status !== CASE_STATUS.Published">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">{{ slotProps.data.gender }}</div>
            </template>
          </Column>
          <Column field="specialty" header="التخصص" sortable sortField="specialty_">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">{{ slotProps.data.specialty }}</div>
            </template>
          </Column>
          <Column field="charity_name" header="اسم الجمعية" sortable sortField="charity_name_"
                  v-if="!isReturnedToCharityStatus">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">{{ slotProps.data.charity_name }}</div>
            </template>
          </Column>
          <Column field="required_amount" :header="isReturnedToCharityStatus ? 'المبلغ المطلوب/الدعم': 'المبلغ المطلوب/تم جمعه'"
                  sortable sortField="required_amount_">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">
                {{ Math.ceil(slotProps.data.required_amount).toLocaleString("en-US") }} / <span class="color-primary" data-cy="collected-amount">
                {{ Math.ceil(slotProps.data.collected_amount).toLocaleString("en-US") }}</span>
              </div>
            </template>
          </Column>
          <Column field="remaining_duration" header="المدة المتبقية" sortable sortField="remaining_duration_"
                  v-if="isReturnedToCharityStatus">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">{{ slotProps.data.remaining_duration }}</div>
            </template>
          </Column>
          <Column field="status" :header="statusColumnLabel" sortable
                  sortField="status_"
                  :expander="true"
                  v-if="props.queryParams.case_status !== CASE_STATUS.Published">
            <template #body="slotProps">
              <div :style="{color: slotProps.data.color}">

                <span :class="[{ 'fw-bold': !slotProps.data.is_read }]"
                      v-if="props.isAllStatusesSelected || isReturnedToCharityStatus" data-cy="status">
                  {{ slotProps.data.status }}
                </span>

                <i class="pi pi-exclamation-triangle fs-5"
                   v-else></i>
              </div>
            </template>
          </Column>
          <Column field="publish_duration" header="مدة النشر"
                  v-if="props.queryParams.case_status === CASE_STATUS.Published">
            <template #body="slotProps">
              <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">{{ slotProps.data.publish_duration }}</div>
            </template>
          </Column>
          <Column field="id">
            <template #body="slotProps">
              <div class="d-flex justify-content-start align-items-center">
                <div class="icon-container bg-light rounded-3 py-2 px-3 mx-1"
                     v-for="(action, index) in slotProps.data.audit_user_actions" :key="index"
                     v-tooltip="action.label"
                     @click.stop="onActionClickHandler(action, slotProps.data)">
                  <i :class="action.icon"></i>

                  </div>
                </div>
              </template>
            </Column>
            <template #expansion="slotProps">
              <DataTable :value="slotProps.data.phases" responsiveLayout="scroll">
                <Column field="id" header="#" sortable sortField="id_">
                  <template #body="slotProps">
                    {{ slotProps.data.case_id }}-{{ slotProps.data.index }}
                  </template>
                </Column>
                <Column field="patient_name" header="المريض" sortable sortField="patient_name_"></Column>
                <Column field="identity_number" header="رقم الهوية" sortable sortField="identity_number_"></Column>
                <Column field="created_on" header="التاريخ" sortable sortField="created_on_"></Column>
                <Column field="age" header="العمر" sortable sortField="age_"></Column>
                <Column field="nationality" header="الجنسية" sortable sortField="nationality_"
                        v-if="props.queryParams.case_status !== CASE_STATUS.Published"></Column>
                <Column field="type" header="النوع" sortable sortField="type_"></Column>
                <Column field="specialty" header="التخصص" sortable sortField="specialty_"></Column>
                <Column field="charity_name" header="اسم الجمعية" sortable sortField="charity_name_"></Column>
                <Column field="required_amount" header="المبلغ المطلوب/تم جمعه" sortable sortField="required_amount_">
                  <template #body="slotProps">
                    {{ slotProps.data.required_amount.toLocaleString("en-US") }} / <span class="color-primary">
                {{ slotProps.data.collected_amount.toLocaleString("en-US") }}</span>
                  </template>
                </Column>
                <Column field="status" :header="props.isAllStatusesSelected ? 'الحالة': 'الأولوية'" sortable
                        sortField="status_"
                        v-if="props.queryParams.case_status !== CASE_STATUS.Published">
                  <template #body="slotProps">
                    <div :style="{color: slotProps.data.color}">
                      <i class="pi pi-exclamation-triangle fs-5" v-if="!props.isAllStatusesSelected"></i>
                      <span v-else>{{ slotProps.data.status }}</span>
                    </div>
                  </template>
                </Column>
                <Column field="publish_duration" header="مدة النشر"
                        v-if="props.queryParams.case_status === CASE_STATUS.Published">
                  <template #body="slotProps">
                    <div :class="[{ 'fw-bold': !slotProps.data.is_read }]">{{ slotProps.data.publish_duration }}</div>
                  </template>
                </Column>
                <Column field="id">
                  <template #body="slotProps">
                    <div class="d-flex justify-content-center align-items-center">
                      <div class="icon-container bg-light rounded-3 py-2 px-3 mx-1"
                           v-for="(action, index) in slotProps.data.audit_user_actions" :key="index"
                           v-tooltip="action.label"
                           @click.stop="onActionClickHandler(action, slotProps.data, true)">
                        <i :class="action.icon"></i>
                      </div>
                    </div>
                  </template>
                </Column>
              </DataTable>
            </template>
          </DataTable>
          <div class="mt-2 d-flex justify-content-between align-items-center">
            <span v-if="cases?.length">عدد الحالات الإجمالي {{ totalItemsCount }}</span>
            <Paginator :rows="pageSize" :first="firstIndex" :totalRecords="props.totalItemsCount" @page="onPageChange($event)"></Paginator>
          </div>
        </div>
      </template>
    </Card>
  </section>
  <CaseOrderingDialog :visible="state.showOrderDialog"
                      :orders="state.casesWithOrders"
                      :selected-case="state.caseToPin"
                      @close="state.showOrderDialog = false"
                      @submit="onCasePinHandler"
                      v-if="state.showOrderDialog"></CaseOrderingDialog>
</template>

<script setup>
import BaseTableColumnToggle from '@/components/layout/BaseTableColumnToggle'
import { FilterMatchMode, ToastSeverity } from "primevue/api";
import { onMounted, reactive, ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import CaseOrderingDialog from "@/components/admin-panel/CaseOrderingDialog";
import CaseService from "@/services/case-service";
import { CASE_STATUS, PAYMENT_REQUEST_ACTION } from "@/services/enum.service";
import {useStore} from "vuex";

const refTableContainer = ref(null)
const router = useRouter();
const route = useRoute();
const toast = useToast();
const store = useStore()
const emit = defineEmits(["getList", "actionSelected"]);
const props = defineProps({
  cases: {
    type: Array,
    default: [],
    required: true
  },
  statuses: {
    type: Array,
    default: [],
    required: true
  },
  isAllStatusesSelected: {
    type: Boolean,
    default: true,
    required: true
  },
  isReadyToBePublished: {
    type: Boolean,
    default: false,
    required: true
  },
  totalItemsCount: {
    type: Number,
    default: 20,
    required: true
  },
  queryParams: {
    type: Object,
    default: {},
    required: true
  },
  showPin: {
    type: Boolean,
    default: false,
    required: true
  },
  isReturnedToCharityStatus: {
    type: Boolean,
    default: false,
    required: true
  }
});
const pageSize = computed(() => {
  return props.queryParams?.page_size ?? 20
})
const firstIndex = computed(() => {
  return (pageSize.value * (props.queryParams?.page ?? 0)) - 1
})
const state = reactive({
  casesDynamic: Object.assign([], props.cases),
  filters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  },
  selectedCase: null,
  debounce: 0,
  expandedRows: [],
  pageSizes: [
    { name: "20 صفًا", value: 20 },
    { name: "50 صفًا", value: 50 },
    { name: "100 صف", value: 100 },
  ],
  publicationPlaces: [
    {
      name: "عرض الكل",
      value: ""
    },
    {
      name: "جاهزة للنشر على شفاء",
      value: "shefa_page"
    },
    {
      name: "جاهزة للنشر على صفحة الجمعية",
      value: "charity_page"
    }
  ],
  treatmentPhases: [
    {
      name: "عرض الكل",
      value: ""
    },
    {
      name: "مرحلة علاج واحدة",
      value: "single"
    },
    {
      name: "مراحل متعددة",
      value: "multiple"
    }
  ],
  showOrderDialog: false,
  casesWithOrders: [],
  caseToPin: {},
});

watch(() => props.cases, (newCases) => {
  state.casesDynamic = Object.assign([], newCases);
});

const onStatusChanged = () => {
  emit("getList", props.queryParams);
};

const onPublishChanged = () => {
  emit("getList", props.queryParams);
};

const onPhaseChanged = () => {
  emit("getList", props.queryParams);
};

const onPageSizeChanged = ($ev) => {
  let noOfRows = $ev?.value ?? 20;
  let maxPage = Math.floor((props.totalItemsCount ?? 0) / noOfRows);
  let page = props.queryParams.page <= maxPage ? props.queryParams.page - 1 : maxPage;
  onPageChange({
    page: page,
    rows: noOfRows,
  })
};

const createDebounce = (text, prop) => {
  clearTimeout(state.debounce);
  state.debounce = setTimeout(async () => {
    const firstStateQueryParams = {
      search: "",
      case_status: route.query.case_status || null,
      page: 1,
      page_size: 20,
      export_file: false,
      order_by: null,
      sort: null
    }
    props.queryParams[prop] = text;
    emit("getList", firstStateQueryParams);
  }, 1000);
};

const exportToExcel = async () => {
  props.queryParams.export_file = true;
  emit("getList", props.queryParams);
};

const sort = async (event) => {
  switch (event.sortField) {
    case "id_":
      props.queryParams.order_by = "id";
      break;
    case "patient_name_":
      props.queryParams.order_by = "patient_name";
      break;
    case "identity_number_":
      props.queryParams.order_by = "identity_number";
      break;
    case "created_on_":
      props.queryParams.order_by = "created_on";
      break;
    case "age_":
      props.queryParams.order_by = "age";
      break;
    case "nationality_":
      props.queryParams.order_by = "nationality";
      break;
    case "type_":
      props.queryParams.order_by = "type";
      break;
    case "specialty_":
      props.queryParams.order_by = "specialty";
      break;
    case "charity_name_":
      props.queryParams.order_by = "charity_name";
      break;
    case "required_amount_":
      props.queryParams.order_by = "required_amount";
      break;
    case "status_":
      props.queryParams.order_by = "status";
      break;
  }
  props.queryParams.sort = event.sortOrder === 1 ? "asc" : "desc";
  emit("getList", props.queryParams);
};

const onPageChange = async (event) => {
  props.queryParams.page = event.page + 1;
  props.queryParams.page_size = event.rows
  emit("getList", props.queryParams);
};

const onExpandClick = (row) => {
  row.show_phases_table = !row.show_phases_table;
  state.expandedRows = row.show_phases_table ? [row] : [];
};

const toggleCaseOrder = (isPinned, selectedCase) => {

  state.caseToPin = selectedCase;

  if (!isPinned) {

    CaseService.getFeaturedCases()
      .then(({ data: { result } }) => {
        state.casesWithOrders = result.sort((a, b) => (a.order_number > b.order_number) ? 1 : ((b.order_number > a.order_number) ? -1 : 0));
        state.showOrderDialog = true;
      });
  }
  else {
    state.showOrderDialog = true;
  }
};

const onCasePinHandler = (order) => {
  CaseService.pinUnpinCase(state.caseToPin?.id, order)
    .then(({ data: { result } }) => {
      toast.add({ severity: ToastSeverity.SUCCESS, detail: 'تم التعديل بنجاح', life: 3000 });
      emit("getList", props.queryParams);
      state.showOrderDialog = false;
    });
};

const handleRowClick = ($ev) => {
  if ($ev.data.is_read === false) {
    store.commit('CHANGE_COUNT', $ev.data.status)
  }
  setTimeout(() => {
    let data = $ev?.data;
    if(data) {
      let viewAction = data?.audit_user_actions?.filter((el) => {
        return el.value === 'view'
      })
      if(viewAction?.length > 0) {
        onActionClickHandler(viewAction[0], data, true)
      }
    }
  }, 150);
}

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
        if (action.url) {
          router.push(action.url);
        }
        emit("actionSelected", { id: item.id, type: action.type, value: action.value, message: action.name });
      }
    }
    else {
      router.push(action.url);
    }
  }
};

const statusColumnLabel = computed(() => {
  if (props.queryParams.case_status === CASE_STATUS.Ready_to_be_Published) {
    return "مدة الانتظار";
  } else if (props.isAllStatusesSelected || props.isReturnedToCharityStatus) {
    return "الحالة";
  } else {
    return "الأولوية";
  }
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

::v-deep(.p-datatable-row-expansion) {
  .p-datatable-thead {
    visibility: collapse;
  }

  td {
    background-color: #F9F9F9;
  }

  > td {
    padding: 0 !important;
  }
}

.pin-icon {
  width: 24px;
  aspect-ratio: 1;
  background: url("../../assets/icons/pin-icon.svg");
  cursor: pointer;
}

.pin-icon-cont {
  background: #E2F6F6;
}

.icon-container {
  cursor: pointer;
}

.icon-payment-request {
  display: inline-block;
  background: url("../../assets/icons/view-invoice.svg") no-repeat;
  width: 16px;
  height: 20px;
}
</style>

