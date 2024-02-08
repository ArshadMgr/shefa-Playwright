<template>
  <div class="requests">
    <div class="title mb-4">طلبات تسجيل الجمعيات</div>
    <DataTable :value="requests" class="p-datatable-requests" :rows="15"
               dataKey="id" :rowHover="true" v-model:selection="selectedRequests" v-model:filters="filters"
               filterDisplay="menu" :loading="loading" responsiveLayout="scroll"
               @sort="sort($event)">
      <template #header>
        <div class="flex justify-content-between d-flex align-items-center">
          <div class="d-flex">
            <div>
              <span class="p-input-icon-right">
                  <i class="pi pi-search" />
                  <InputText v-model="searchText" placeholder="ابحث حسب اسم الجمعية أو رقم الترخيص"
                             @input="debounce(() => { this.onSearchChanged($event.target.value) })" />
              </span>
            </div>
            <div class="mx-3">
              <Dropdown v-model="selectedStatus" :options="statuses" optionLabel="name" placeholder="جميع الحالات"
                        name="statuses" id="statuses" @change="onStatusChanged" />
            </div>
          </div>
          <Button
            class="p-button p-button-rounded p-button-secondary me-auto"
            @click="exportToExcel"
          >
            <i class="excel-icon mx-1"></i>
            <span>رفع إلى Excel</span>
          </Button>
        </div>
      </template>
      <template #empty>
        <div class="text-center">
          لا يوجد طلبات
        </div>
      </template>
      <template #loading>
        جار تحميل الطلبات، الرجاء الانتظار
      </template>
      <Column field="charity_name" header="اسم الجمعية" sortable sortField="name" style="min-width: 14rem">
        <template #body="{data}">
          <RouterLink :to="'/admin-panel/request-details/' + data.id">
            {{ data.charity_name }}
          </RouterLink>
        </template>
      </Column>
      <Column field="id" header="رقم الطلب" sortable sortField="request_number" style="min-width: 14rem">
        <template #body="{data}">
          <RouterLink :to="'/admin-panel/request-details/' + data.id">
            <span>{{ data.id }}</span>
          </RouterLink>
        </template>
      </Column>
      <Column field="step" header="حالة الطلب" sortable sortField="status" style="min-width: 8rem">
        <template #body="{data}">
          <RouterLink :to="'/admin-panel/request-details/' + data.id">
            <StatusBadge :status="data.step" :statusKey="data.step"></StatusBadge>
          </RouterLink>
        </template>
      </Column>
      <Column field="charity_license_number" header="رقم الترخيص" sortable sortField="license_number" :filterMenuStyle="{'width':'14rem'}"
              style="min-width: 10rem">
        <template #body="{data}">
          <RouterLink :to="'/admin-panel/request-details/' + data.id">
            <span>{{ data.charity_license_number }}</span>
          </RouterLink>
        </template>
      </Column>
    </DataTable>
    <div>
      <Paginator :rows="15" :totalRecords="totalItemsCount" @page="onPageChange($event)"></Paginator>
    </div>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import AdminPanelService from "@/services/admin-panel.service";
import StatusBadge from "@/components/admin-panel/StatusBadge";

export default {
  name: "Requests",
  components: { StatusBadge },
  data() {
    return {
      requests: null,
      selectedRequests: null,
      searchText: "",
      filters: {
        "global": { value: null, matchMode: FilterMatchMode.CONTAINS }
      },
      loading: false,
      statuses: [
        { id: 0, name: "جميع الحالات", value: "" },
        { id: 1, name: "بانتظار الموافقة", value: "pending_approval" },
        { id: 2, name: "مرفوض", value: "rejected" },
        { id: 3, name: "قبول مبدئي", value: "initial_approval" },
        { id: 4, name: "بانتظار مراجعة الاتفاقية", value: "pending_agreement" },
        { id: 5, name: "مقبول", value: "approved" }
      ],
      selectedStatus: "",
      totalItemsCount: 25,
      queryParams: {
        search_text: "",
        request_status: "",
        page: 1,
        page_Size: 15,
        export_file: false,
        order_by: "",
        sort: ""
      },
      debounce: this.createDebounce()
    };
  },
  created() {
    this.getRequests();
  },
  mounted() {
  },
  methods: {
    getRequests() {
      AdminPanelService.getAdminRequests(this.queryParams).then(({ data: { results, total_objects } }) => {
        if (this.queryParams.export_file) {
          window.open(results.file_url, "_blank");
        } else {
          this.requests = results;
          this.totalItemsCount = total_objects;
        }
        this.loading = false;
        this.queryParams.export_file = false;
      });
    },
    exportToExcel() {
      this.queryParams.export_file = true;
      this.getRequests();
    },
    onStatusChanged() {
      this.queryParams.request_status = this.selectedStatus.value;
      this.queryParams.page = 1;
      this.getRequests();
    },
    onPageChange(event) {
      this.queryParams.page = event.page + 1;
      this.getRequests();
    },
    createDebounce() {
      let timeout = null;
      return function(fnc, delayMs) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          fnc();
        }, delayMs || 1000);
      };
    },
    onSearchChanged(text) {
      this.queryParams.search_text = text;
      this.getRequests();
    },
    sort(event) {
      switch (event.sortField) {
        case "name":
          this.queryParams.order_by = "charity_name";
          break;
        case "request_number":
          this.queryParams.order_by = "id";
          break;
        case "status":
          this.queryParams.order_by = "step";
          break;
        case "license_number":
          this.queryParams.order_by = "charity_license_number";
          break;
      }
      this.queryParams.sort = event.sortOrder === 1 ? 'asc' : 'desc';
      this.getRequests();
    }
  }
};
</script>

<style lang="scss" scoped>

@import "@/styles/variables";

.requests {
  height: 100%;
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 1px 1px 14px #0000001a;

  .title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .export-to-excel {
    padding: 5px 22px;
    background: #D9D9D9;
    color: #3F3F3F;
    border-radius: 25px;
    font-size: 16px;
    height: 37px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 200ms;

    span {
      padding-bottom: 5px;
    }

    i {
      padding-left: 5px;
    }

    &:hover {
      background: #c7c7c7;
    }
  }
}

::v-deep(.p-paginator) {
  .p-paginator-current {
    margin-left: auto;
  }
}

::v-deep(.p-progressbar) {
  height: .5rem;
  background-color: #D8DADC;

  .p-progressbar-value {
    background-color: #607D8B;
  }
}

::v-deep(.p-datepicker) {
  min-width: 25rem;

  td {
    font-weight: 400;
  }
}

::v-deep(.p-datatable) {
  .p-datatable-header {
    padding: 1rem;
    text-align: left;
    font-size: 1.5rem;
  }

  .p-paginator {
    padding: 1rem;
  }

  .p-datatable-thead > tr > th {
    text-align: right;
  }

  .p-datatable-tbody > tr > td {
    cursor: pointer;
    text-align: right;

    a {
      display: block;
      color: black;
      text-decoration: none;
    }
  }

  .p-dropdown-label:not(.p-placeholder) {
    text-transform: uppercase;
  }
}

::v-deep(.p-button:enabled) {
  background: #51AFA9;
  border-color: #51AFA9;
}

.p-inputtext {
  width: 305px;
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

::v-deep(.p-button-secondary) {
  font-size: 14px;
  background-color: $color-secondary !important;
  border-color: $color-secondary !important;
  color: $color-font-dark !important;

  &:hover {
    background-color: $color-secondary-hover !important;
    border-color: $color-secondary-hover !important;
  }
}

</style>

