<template>
  <section class="cases-list my-5">
    <DataTable
      :value="state.cases"
      :paginator="true"
      :rows="15"
      :scrollable="true"
      :rowClass="showCheckbox"
      @rowReorder="onRowReorder"
      @rowSelect="onRowSelect"
      @rowUnselect="onRowUnselect"
      @rowClick="viewCase"
      :rowHover="true"
      scrollHeight="400px"
      v-model:filters="state.filters"
      v-model:selection="state.selectedCases"
      v-model:expandedRows="state.expandedRows"
      filterDisplay="menu"
      :globalFilterFields="['id', 'full_name', 'identity_number']"
      responsiveLayout="scroll"
      paginatorTemplate="PrevPageLink PageLinks NextPageLink"
      class="table-cases"
      :class="{ 'table-edit': editMode }"
    >
      <template #header>
        <div class="d-flex justify-content-start align-items-center">
          <span class="p-input-icon-right input-wrapper">
            <i class="pi pi-search" />
            <InputText
              class="w-100"
              v-model="state.filters['global'].value"
              placeholder="ابحث حسب رقم الحالة، اسم المريض، أو رقم الهوية"
            />
          </span>
        </div>
      </template>
      <Column v-if="!editMode" :expander="true" headerStyle="width: 1rem" />
      <Column
        v-if="!editMode"
        selectionMode="multiple"
        headerStyle="width: 1rem"
      />
      <Column v-if="editMode && !readOnly" :rowReorder="true" headerStyle="width: 1rem" class="color-primary"/>
      <Column field="phase_index" header="رقم الحالة">
              <template #body="slotProps">
          <span>{{ slotProps.data.type === 'phase' ? slotProps.data.phase_index : slotProps.data.id }}</span>
        </template>
      </Column>
      <Column field="full_name" header="اسم المريض"></Column>
      <Column field="identity_number" header="رقم الهوية"></Column>
      <Column field="specialty" header="التخصص"></Column>
      <Column v-if="editMode" field="status" header="الحالة">
        <template #body="slotProps">
          <span class="color-primary">{{ slotProps.data.status.name }}</span>
        </template>
      </Column>
      <Column v-if="editMode" field="amount" header="المبلغ المطلوب/تم جمعه">
        <template #body="slotProps">
          {{ slotProps.data.progress.goal }}/<span class="color-primary">0</span>
        </template>
      </Column>
      <Column v-if="editMode && !readOnly" field="delete">
        <template #body="slotProps">
          <Button v-if="slotProps.data.type === 'phase'" @click="deleteItem(slotProps.data.id, 'phase', slotProps.index)" icon="pi pi-minus" class="p-button-rounded p-button-outlined p-button-secondary" style="min-width: unset; width: 1.6rem; height: 1rem;"/>
          <Button v-else @click="deleteItem(slotProps.data.id, 'case', slotProps.index)" icon="pi pi-minus" class="p-button-rounded p-button-outlined p-button-secondary" style="min-width: unset; width: 1.6rem; height: 1rem;"/>
        </template>
      </Column>
      <Column v-if="!editMode" field="charity" header="الجمعية"></Column>
      <template v-if="!editMode" #expansion="slotProps">
        <DataTable
          :value="slotProps.data.phases"
          v-model:selection="state.selectedPhases"
          @rowSelect="onRowSelect"
          @rowUnselect="onRowUnselect"
          class="table-phases"
        >
          <template #header></template>
          <Column selectionMode="multiple"> </Column>
          <Column field="index" header="رقم الحالة">
            <template #body="slotPropsNested">
              <span> {{slotPropsNested.data.phase_index}}</span>
            </template>
          </Column>
          <Column field="fullname" header="اسم المريض">
            <template #body>
              {{ slotProps.data.full_name }}
            </template>
          </Column>
          <Column field="identityNumber" header="رقم الهوية">
            <template #body>
              {{ slotProps.data.identity_number }}
            </template>
          </Column>
          <Column field="specialty" header="التخصص">
            <template #body>
              {{ slotProps.data.specialty }}
            </template>
          </Column>
          <Column field="charityName" header="الجمعية">
            <template #body>
              {{ slotProps.data.charity_name }}
            </template>
          </Column>
        </DataTable>
      </template>
    </DataTable>
  </section>
</template>

<script setup>
import { reactive, onUpdated } from "vue";
import { useRouter } from "vue-router";
import { FilterMatchMode } from "primevue/api";

const router = useRouter();

const props = defineProps({
  payload: {
    type: Array,
    required: true,
  },
  phases: {
    type: Object,
    required: false,
  },
  editMode: {
    type: Boolean,
    required: false,
    default: false,
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const state = reactive({
  cases: Object.assign([], props.payload).filter(e => !(e.split_into_phases && e.phases.length === 0)),
  filters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  },
  selectedCases: null,
  selectedPhases: null,
  expandedRows: [],
  numberOfSelected: 0
});

const showCheckbox = (data) => {
  return !data.split_into_phases ? "" : "no-checkbox";
};

const emit = defineEmits(["deleteItem", "casesChosen"]);

const deleteItem = (id, category, index) => {
  if(state.cases.length <= 2) {
    emit('deleteItem');
    return;
  }
  state.cases.splice(index, 1);
  if(category === 'case') {
    emit('deleteItem', id, 'cases');
  } else if(category === 'phase') {
    emit('deleteItem', id, 'phases');
  }
}

const onRowReorder = (event) => {
  state.cases = event.value;
}

defineExpose({ state: state });

const onRowSelect = (event) => {
  state.numberOfSelected++
  if(state.numberOfSelected >= 2) {
    emit('casesChosen', true)
  } else {
    emit('casesChosen', false)
  }
}
const onRowUnselect = (event) => {
  state.numberOfSelected--
  if(state.numberOfSelected >= 2) {
    emit('casesChosen', true)
  } else {
    emit('casesChosen', false)
  }
}

const viewCase = (event) => {
  let url;
  if(event.data.type==='case') {
    url = `/admin-panel/auditor-case-detail/view/${event.data.case_id}`
  } else {
    url = `/admin-panel/auditor-case-detail/view/${event.data.id}?obj_type=phase`
  }
  window.open(url, '_blank');
}

</script>

<style lang="scss" scoped>
@import "@/styles/variables";

::v-deep(.p-datatable) {
  margin-bottom: 6rem;
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
  .p-datatable-tbody > tr:not(.p-highlight):hover {
    cursor: pointer;
  }
  .p-datatable-row-expansion:hover {
    background-color: white !important;
    cursor: default !important;
  }
  .color-primary {
    color: $color-primary;
  }

  .p-dropdown-label:not(.p-placeholder) {
    text-transform: uppercase;
  }

  .p-paginator {
    position: absolute;
    bottom: -5rem;
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

  .p-row-toggler-icon {
    color: $color-blue;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    border-radius: $border-radius-default;
    background: $color-secondary;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: $color-secondary-hover;
  }
  .p-datatable-thead {
    th:nth-of-type(1) {
      display: none;
    }
    .p-checkbox {
      display: none;
    }
  }
  tr {
    td:nth-of-type(1) {
      display: none;
    }
  }
  tr.no-checkbox {
    td:nth-of-type(1) {
      display: flex;
    }
  }
  .p-datatable-row-expansion {
    tr {
      background-color: $color-secondary-lighter;
    }
    tr[role="row"]:last-child {
      td {
        border: none;
      }
    }
    td:nth-of-type(1) {
      display: block;
      padding-top: 0;
      padding-bottom: 0;
    }
    td[role="cell"] {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }
  .no-checkbox {
    .p-selection-column {
      display: none;
    }
  }
  .p-datatable-table {
    margin: 0;

    tbody {
      tr:nth-child(1) {
        border-top: none;
      }
    }
  }
}

::v-deep(.p-datatable.table-edit) {
  .p-datatable-thead {
    th:nth-of-type(1) {
      display: block;
    }
  }
  tr {
    td:nth-of-type(1) {
      display: flex;
    }
  }
}

::v-deep(.p-datatable.table-phases) {
  margin-bottom: 0;
  .p-datatable-thead,
  .p-datatable-header {
    display: none;
  }
  .p-datatable-tbody > tr:not(.p-highlight):hover {
    background: $color-secondary-lighter;
    cursor: default;
  }
  tr.p-highlight {
    background: #F0FDFA;
    color: #0F766E;
  }
}
</style>
