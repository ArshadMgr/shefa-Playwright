<template>
  <ConfirmDialog appendTo="#app" :draggable="false" :breakpoints="{'600px': '75vw', '640px': '100vw'}" :style="{width: '30vw'}"></ConfirmDialog>
  <Card class="custom-card">
    <template #content>
      <DataTable
          :value="state.cases"
          :paginator="true"
          :rows="7"
          expandedRowIcon="pi-bars"
          collapsedRowIcon="pi-list"
          v-model:filters="state.filters"
          v-model:selection="state.selectedCases"
          v-model:expandedRows="state.expandedRows"
          filterDisplay="menu"
          :globalFilterFields="['id','title']"
          responsiveLayout="scroll"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
          class="table-cases"
      >
        <template #header>
          <div class="d-flex justify-content-start align-items-center">
            <span class="p-input-icon-right input-wrapper">
              <i class="pi pi-search" />
              <InputText
                  class="w-100"
                  v-model="state.filters['global'].value"
                  placeholder="ابحث حسب رقم المجموعة، أو عنوان المجموعة"
              />
            </span>
            <Dropdown
                v-model="state.selectedStatus"
                :options="state.statuses"
                optionLabel="name"
                v-if="state.statuses.length"
                :placeholder="state.statuses[0].name"
                name="statuses"
                id="statuses"
                class="mx-3"
                @change="onStatusChanged"
            />
            <Button
                class="p-button p-button-rounded p-button-secondary me-auto"
                @click="exportToExcel"
            >
              <i class="excel-icon mx-1"></i>
              <span>رفع إلى Excel</span>
            </Button>
          </div>
        </template>
        <Column field="id" header="رقم المجموعة" sortable></Column>
        <Column field="title" header="عنوان المجموعة" sortable></Column>
        <Column field="published_at" header="تاريخ النشر" sortable>
          <template #body="slotProps">
            <span v-if="slotProps.data.published_at">
            {{ formatCreationDate(slotProps.data.published_at) }}
            </span>
            <span v-else>-</span>
          </template>
        </Column>
        <Column field="total_items" header="عدد الحالات" sortable>
          <template #body="slotProps">
            <span v-if="slotProps.data.total_items">{{slotProps.data.total_items}}</span>
            <span v-else>-</span>
          </template>
        </Column>
        <Column field="progress.goal" header="المبلغ المطلوب / تم جمعه" sortable>
          <template #body="slotProps">
            {{ slotProps.data.progress.goal }} / <span class="color-primary">
              {{ slotProps.data.progress.current }}</span>
          </template>
        </Column>
        <Column field="status.value" header="الحالة" sortable>
          <template #body="slotProps">
            <span :class="statusColorClasses(slotProps.data.status.value, slotProps.data.displaying)">
              {{ slotProps.data.status.name }}
            </span>
          </template>
        </Column>
        <Column field="displaying" header="حالة العرض" sortable>
          <template #body="slotProps">
            <span v-if="slotProps.data.displaying_label" class="visibility">
              {{ slotProps.data.displaying_label }}
            </span>
            <span v-else class="visibility">
              -
            </span>
          </template>
        </Column>
        <Column field="id">
          <template #body="slotProps">
            <div class="d-flex justify-content-start align-items-center">
              <div class="icon-container bg-light rounded-3 py-2 px-3 mx-1"
                   v-for="(action, index) in getActions(slotProps.data.actions, slotProps.data.id)" :key="index"
                   v-tooltip="action.label"
                   @click="actionHandler(action, slotProps.data.id)">
                <i :class="action.icon"></i>
              </div>
            </div>
          </template>
        </Column>
        <template #empty>
          <h4 class="d-block text-xxl-center mt-4">لا يوجد نتائج</h4>
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import {reactive, watch} from "vue";
import { FilterMatchMode } from "primevue/api";
import {formatCreationDate} from "@/helpers/helpers";
import CaseService from "@/services/case-service";
import { convertToFormData } from "@/helpers/ConvertToFormData";
import { useConfirm } from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import CharityRepresentativeService from "@/services/charity-representative-service";
import { useRouter } from "vue-router";

const props = defineProps({
  payload: {
    type: Array,
    required: true,
  },
  statuses: {
    type: Array,
    required: true,
  },
  phases: {
    type: Object,
    required: false,
  },
});

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();
const emit = defineEmits([ "changedGroupVisibility" ])

const state = reactive({
  cases: Object.assign([], props.payload),
  statuses: [{ value: 'all', name: 'الكل' }, ...props.statuses],
  selectedStatus: null,
  filters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  },
  selectedCases: null,
  expandedRows: [],
});

watch(() => props.payload, (newPayload) => {
  state.cases = Object.assign([], newPayload)
})
watch(() => props.statuses, (newStatuses) => {
  state.statuses = [{ value: 'all', name: 'all' }, ...newStatuses]
})

const onStatusChanged = () => {
  state.cases = props.payload.filter((group) => {
    return state.selectedStatus?.value === "all"
        ? group
        : group.status.value === state.selectedStatus.value;
  });
};

const getActions = (actions, id) => {
  const actionsValues = Object.values(actions)
  actionsValues.map(e => e.label = e.name)
  actionsValues.map(e => {
    if (e.value !== 'show' && e.value !== 'hide') {
      return e
    }
    if (e.url) delete e.url
    return e
  })
  return actionsValues
};

const actionHandler = (action, id) => {
  if (action.value === 'edit' || action.value === 'view') {
    router.push(action.url);
  }
  confirm.require({
    header: action.value === 'hide' ? 'هل أنت متأكد من إخفاء المجموعة؟': 'هل أنت متأكد من إظهار المجموعة؟',
    acceptLabel: 'تأكيد',
    rejectLabel: 'إغلاق',
    acceptClass: 'p-button-rounded p-button-primary px-5 mx-2',
    rejectClass: 'p-button-rounded p-button-secondary px-5 mx-2',
    accept: async () => {
      try {
        await CaseService.editGroup(id, convertToFormData({
          displaying: action.value === 'hide' ? 'Hidden' : 'Visible'
        }, false))
        emit('changedGroupVisibility')
        toast.add({
          severity:'success',
          detail:'تم تغيير الرؤية بنجاح',
          closable: false,
          contentStyleClass: 'direction-rtl',
          life: 3000
        });
      } catch (e) {
        toast.add({
          severity: 'error',
          detail: e.response.data.errors[0],
          closable: false,
          life: 3000,
        });
      }
    },
  });
}

const exportToExcel = async () => {
  await CaseService.exportExcel('/charity/group/export')
};

const statusColorClasses = (status, visibility) => {
  const statusClass = status ? `status-color__${status.toLowerCase()}` : '';
  const visibilityClass = visibility ? visibility.toLowerCase() : '';
  return `${statusClass} ${visibilityClass}`;
}

defineExpose({ state: state });
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

a {
  text-decoration: none;
}
.custom-card {
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
  min-width: 370px;
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
::v-deep(.p-splitbutton:hover) {
  .p-splitbutton-defaultbutton {
    color: $color-primary !important;
  }
}
::v-deep(.p-tieredmenu.p-tieredmenu-overlay) {
  direction: rtl;
}
.visibility {
  color: $color-status-grey;
}
.status-color {
  &__draft {
    color: $color-status-grey;
  }
  &__published {
    color: $color-primary;
  }
  &__published.hidden {
    color: $color-status-red;
  }
  &__completed {
    color: $color-status-green;
  }
}
</style>
