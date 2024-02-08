<template>
  <section class="datatable-view">
    <router-link :to="'/admin-panel/wallets/create'">
      <Button class="p-button p-button-primary p-button-rounded">
        إنشاء محفظة جديدة
      </Button>
    </router-link>
    <Card class="mt-4">
      <template #content>
        <DataTable
          :value="wallets"
          :paginator="false"
          :rows="10"
          :rowHover="true"
          filterDisplay="menu"
          responsiveLayout="scroll"
          @sort="sort($event)"
        >
          <template #empty>
            <div class="text-center">
              لا يوجد محافظ
            </div>
          </template>
          <template #header>
            <div class="d-flex justify-content-start align-items-center">
              <span class="p-input-icon-right input-wrapper">
                <i class="pi pi-search" />
                <InputText
                  class="w-100 min-w-360"
                  placeholder="ابحث حسب اسم المحفظة"
                  @input="createDebounce($event.target.value)"
                />
              </span>
              <Dropdown
                v-model="queryParams.status"
                :options="statuses"
                optionLabel="label"
                optionValue="value"
                :placeholder="'جميع المحافظ'"
                name="statuses"
                id="statuses"
                class="mx-3"
                @change="onStatusChanged"
              />
            </div>
          </template>
          <Column field="id" header="رقم المحفظة" sortable sortField="id_"></Column>
          <Column field="name" header="اسم المحفظة" sortable sortField="name_"></Column>
          <Column field="created_on" header="تاريخ الإنشاء" sortable sortField="created_on_"></Column>
          <Column field="balance" header="رصيد المحفظة" sortable sortField="balance_">
            <template #body="slotProps">
              {{ Math.ceil(slotProps.data?.balance).toLocaleString("en-US")  }}
            </template>
          </Column>
          <Column field="id">
            <template #body="slotProps">
              <div class="d-flex justify-content-start align-items-center">
                <div class="icon-container bg-light rounded-3 py-2 px-3 mx-1"
                     title="تحويل مبلغ"
                     @click="transferWallet(slotProps.data?.id)"
                     v-if="slotProps.data?.is_transfer_allowed">
                  <i class="pi pi-money-bill"></i>
                </div>
                <div class="icon-container bg-light rounded-3 py-2 px-3 mx-1"
                     title="تعديل"
                     @click="editWallet(slotProps.data?.id)">
                  <i class="pi pi-pencil"></i>
                </div>
                <div class="icon-container bg-light rounded-3 py-2 px-3 mx-1"
                     title="حذف"
                     @click="deleteWallet(slotProps.data?.id)">
                  <i class="pi pi-trash"></i>
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
        <div class="mt-2">
          <Paginator :rows="15" :totalRecords="totalItemsCount" @page="onPageChange($event)"></Paginator>
        </div>
      </template>
    </Card>
  </section>
  <ConfirmDialog></ConfirmDialog>
</template>

<script>
import WalletService, { WALLET_TYPES } from "@/services/wallet.service";
import { ToastSeverity } from "primevue/api";

export default {
  name: "List",
  data() {
    return {
      wallets: [],
      statuses: [],
      queryParams: {
        search: "",
        page: 1,
        page_size: 15,
        order_by: null,
        sort: null,
        status: null
      },
      totalItemsCount: 15
    };
  },
  methods: {
    getWallets(queryParams) {
      WalletService.getWallets(queryParams)
        .then(({ data }) => {
          this.wallets = data?.results?.wallets?.map((wallet) => {
            return {
              ...wallet,
              typ: WALLET_TYPES[wallet.typ]
            };
          });
          this.statuses = data.results?.types;
          this.totalItemsCount = data?.total_objects;
        });
    },
    deleteWallet(walletId) {
      this.$confirm.require({
        message: `هل أنت متأكد من حذف المحفظة؟`,
        acceptLabel: "نعم",
        rejectLabel: "لا",
        accept: () => {
          WalletService.deleteWallet(walletId)
            .then(({ data }) => {
              this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم حذف المحفظة بنجاح", life: 3000 });
              this.getWallets(this.queryParams);
            });
        },
        reject: () => {
          this.$confirm.close();
        }
      });
    },
    editWallet(walletId) {
      this.$router.push(`/admin-panel/wallets/edit/${walletId}`)
    },
    transferWallet(walletId) {
      this.$router.push(`/admin-panel/wallets/transfer/${walletId}`)
    },
    createDebounce(text) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(async () => {
        this.searchText = text;
        this.queryParams.page = 1;
        this.queryParams.search = text;
        this.getWallets(this.queryParams);
      }, 1000);
    },
    sort(event) {
      switch (event.sortField) {
        case "id_":
          this.queryParams.order_by = "id";
          break;
        case "name_":
          this.queryParams.order_by = "name";
          break;
        case "balance_":
          this.queryParams.order_by = "balance";
          break;
        case "created_on_":
          this.queryParams.order_by = "created_on";
          break;
      }
      this.queryParams.sort = event.sortOrder === 1 ? "asc" : "desc";
      this.getWallets(this.queryParams);
    },
    onPageChange(event) {
      this.queryParams.page = event.page + 1;
      this.getWallets(this.queryParams);
    },
    onStatusChanged() {
      this.queryParams.page = 1;
      this.getWallets(this.queryParams);
    }
  },
  mounted() {
    this.getWallets(this.queryParams);
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
</style>
