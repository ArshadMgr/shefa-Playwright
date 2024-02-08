<template>
  <section class="datatable-view">
    <router-link :to="'/admin-panel/waqf/create'">
      <Button class="p-button p-button-primary p-button-rounded">
        إنشاء وقف
      </Button>
    </router-link>
    <Card class="mt-4">
      <template #content>
        <DataTable
          :value="waqfs"
          :paginator="false"
          :rows="10"
          :rowHover="true"
          filterDisplay="menu"
          responsiveLayout="scroll"
          :resizableColumns="true"
          columnResizeMode="fit"
          @sort="sort($event)"
        >
          <template #empty>
            <div class="text-center">
              لا يوجد أوقاف
            </div>
          </template>
          <template #header>
            <div class="d-flex justify-content-start align-items-center">
              <span class="p-input-icon-right input-wrapper">
                <i class="pi pi-search" />
                <InputText
                  class="w-100 min-w-360"
                  placeholder="ابحث حسب اسم الوقف"
                  @input="createDebounce($event.target.value)"
                />
              </span>
              <Button
                class="p-button p-button-rounded p-button-secondary me-auto"
                @click.prevent="exportToExcel">
                <i class="excel-icon mx-1"></i>
                <span>رفع إلى Excel</span>
              </Button>
            </div>
          </template>
          <Column field="id" header="رقم الوقف" sortable sortField="id_" class="w-25"></Column>
          <Column field="name" header="اسم الوقف" sortable sortField="name_" class="w-25"></Column>
          <Column field="created_on" header="تاريخ الانشاء" sortable sortField="created_on_"></Column>
          <Column field="target" header="المبلغ المطلوب" sortable sortField="target_">
            <template #body="slotProps">
              {{ Math.ceil(slotProps.data?.target).toLocaleString("en-US")  }}
            </template>
          </Column>
          <Column field="balance" header="المبلغ الذي تم جمعه" sortable sortField="balance_">
            <template #body="slotProps">
              {{ Math.ceil(slotProps.data?.balance).toLocaleString("en-US")  }}
            </template>
          </Column>
          <Column field="coverage_ratio" header="نسبة التغطية" sortable sortField="coverage_ratio">
            <template #body="slotProps">
              {{ slotProps.data?.coverage_ratio.replace('.00', '') }}
            </template>
          </Column>
          <Column field="donations_count" header="عدد المتبرعين" sortable sortField="donations_count"></Column>
          <Column field="number_of_visits" header="عدد الزوار" sortable sortField="number_of_visits"></Column>
          <Column field="waqf_duration" header="مدة الوقف/المتبقي منها"></Column>
          <Column field="isActive">
            <template #body="slotProps">
              <InputSwitch v-model="slotProps.data.is_active"
                           @change="onWaqfActivation(slotProps.data.is_active, slotProps.data.id)" />
            </template>
          </Column>
        </DataTable>
        <div class="mt-2">
          <Paginator :rows="15" :totalRecords="totalItemsCount" @page="onPageChange($event)"></Paginator>
        </div>
      </template>
    </Card>
  </section>
</template>

<script>
import WaqfService from "@/services/waqf.service";
import InputSwitch from "primevue/inputswitch";
import { ToastSeverity } from "primevue/api";

export default {
  name: "List",
  components: { InputSwitch },
  data() {
    return {
      waqfs: [],
      statuses: [],
      case_status: null,
      queryParams: {
        page: 1,
        page_size: 15,
        order_by: null,
        sort: null,
        search: ""
      },
      totalItemsCount: 15
    };
  },
  methods: {
    getWaqf(queryParams) {
      WaqfService.getWaqf(queryParams)
        .then(({ data: { result } }) => {
          this.waqfs = result.results;
          this.totalItemsCount = result.total_objects;
        });
    },
    sort(event) {
      switch (event.sortField) {
        case "id_":
          this.queryParams.order_by = "id";
          break;
        case "name_":
          this.queryParams.order_by = "name";
          break;
        case "created_on_":
          this.queryParams.order_by = "created_on";
          break;
        case "balance_":
          this.queryParams.order_by = "balance";
          break;
        case "target_":
          this.queryParams.order_by = "target";
          break;
      }
      this.queryParams.sort = event.sortOrder === 1 ? "asc" : "desc";
      this.getWaqf(this.queryParams);
    },
    onPageChange(event) {
      this.queryParams.page = event.page + 1;
      this.getWaqf(this.queryParams);
    },
    createDebounce(text) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(async () => {
        this.searchText = text;
        this.queryParams.search = text;
        this.getWaqf(this.queryParams);
      }, 1000);
    },
    onWaqfActivation(ActivationValue, id) {
      const successMessage = ActivationValue ? "تم تفعيل الوقف بنجاح" : "تم إلغاء تفعيل الوقف بنجاح";
      WaqfService.deleteWaqf(id)
        .then(() => {
          this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: successMessage, life: 3000 });
        });
    },
    exportToExcel() {
      WaqfService.exportToExcel()
    }
  },
  mounted() {
    this.getWaqf(this.queryParams);
  }
};
</script>

<style lang="scss" scoped>

@import "@/styles/variables";

a {
  text-decoration: none;
}

::v-deep(.p-datatable) {
  .p-datatable-tbody > tr > td {
    text-align: right;
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
</style>
