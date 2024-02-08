<template>
  <div>
    <section class="datatable-view">
      <router-link :to="'/admin-panel/campaigns/create'" v-if="!isAdmin">
        <Button class="p-button p-button-primary p-button-rounded w-100 w-lg-auto justify-content-center mb-3 mb-xl-0">
          إنشاء حملة
        </Button>
      </router-link>
      <Card :class="['d-none d-xl-block', { 'mt-4': !isAdmin }]">
        <template #content>
          <DataTable
            :value="campaigns"
            :paginator="false"
            dataKey="id"
            :rows="10"
            :rowHover="true"
            filterDisplay="menu"
            responsiveLayout="scroll"
            @sort="sort($event)"
            :resizableColumns="true"
            columnResizeMode="fit"
          >
            <template #empty>
              <div class="text-center">
                لا يوجد حملات
              </div>
            </template>
            <template #header>
              <div class="d-flex justify-content-start align-items-center">
                <span class="p-input-icon-right input-wrapper">
                  <i class="pi pi-search" />
                  <InputText
                    class="w-100 min-w-430"
                    placeholder="ابحث حسب اسم الحملة، اسم الحالة، اسم المتبرع، نوع المرض"
                    @input="createDebounce($event.target.value)"
                  />
                </span>
                <Dropdown
                  v-model="queryParams.filter_by"
                  :options="types"
                  optionLabel="name"
                  optionValue="value"
                  placeholder="اختر نوع الحملة"
                  name="types"
                  id="types"
                  class="mx-3"
                  @change="getCampaigns(queryParams)"
                />
                <Dropdown
                  v-model="queryParams.specialty"
                  :options="specialities"
                  optionLabel="name"
                  optionValue="value"
                  placeholder="اختر التخصص"
                  name="specialities"
                  id="specialities"
                  class="mx-3"
                  @change="getCampaigns(queryParams)"
                />
                <Dropdown
                  v-model="queryParams.status"
                  :options="statuses"
                  optionLabel="name"
                  optionValue="value"
                  placeholder="اختر الحالة"
                  name="statuses"
                  id="statuses"
                  class="mx-3"
                  @change="getCampaigns(queryParams)"
                />
                <Button
                  class="p-button p-button-rounded p-button-secondary me-auto"
                  @click.prevent="exportToExcel">
                  <i class="excel-icon mx-1"></i>
                  <span>رفع إلى Excel</span>
                </Button>
              </div>
            </template>
            <Column field="is_reported">
              <template #body="slotProps">
                <i class="pi pi-exclamation-circle text-danger" v-if="slotProps.data?.is_reported"
                   title="تم الإبلاغ عن الحملة"></i>
              </template>
            </Column>


            <Column field="id" header="رقم الحملة" sortable sortField="id_">
              <template #body="slotProps">
                <div>
                  {{ slotProps.data?.id || '-' }}
                </div>
              </template>
            </Column>
            <Column field="full_title" header="اسم الحملة" sortable sortField="full_title_">
              <template #body="slotProps">
                <router-link :to="`/donate-campaign/${slotProps.data?.id}`" class="color-primary color-primary--hover">
                  {{ slotProps.data?.full_title || '-' }}
                </router-link>
              </template>
            </Column>
            <Column field="created_by_mobile_number" header="جوال المنشئ">
              <template #body="slotProps">
                <div>
                  {{ slotProps.data?.created_by_mobile_number || '-' }}
                </div>
              </template>
            </Column>
            <Column field="typ" header="نوع الحملة" sortable sortField="typ_">
              <template #body="slotProps">
                <div>
                  {{ slotProps.data?.typ === 'Most_Urgent' &&
                     slotProps.data?.specialty_name !== 'الأشد حاجة' ?
                     slotProps.data?.specialty_name :
                     campaignTypes[slotProps.data?.typ] || '-' }}
                </div>
              </template>
            </Column>
            <Column field="target" header="المبلغ المطلوب/الدعم" sortable sortField="target_">
              <template #body="slotProps">
                <div>
                  {{ (Math.ceil(slotProps.data?.balance).toLocaleString("en-US") + '/' + Math.ceil(slotProps.data?.target).toLocaleString("en-US")) || '-' }} ر.س
                </div>
              </template>
            </Column>
            <Column field="completion_percentage" header="نسبة التغطية"
                    v-if="isAdmin">
              <template #body="slotProps">
                <div>
                  {{ slotProps.data?.completion_percentage || '0' }}
                </div>
              </template>
            </Column>
            <Column field="number_of_donors" header="عدد المتبرعين" sortable sortField="number_of_donors_">
              <template #body="slotProps">
                <div>
                  {{ slotProps.data?.number_of_donors || '0' }}
                </div>
              </template>
            </Column>
            <Column field="number_of_visits" header="عدد الزائرين" sortable sortField="number_of_visits_">
              <template #body="slotProps">
                <div>
                  {{ slotProps.data?.number_of_visits || '0' }}
                </div>
              </template>
            </Column>
            <Column field="interval" header="مدة الحملة/المتبقي منها" sortable sortField="interval_">
              <template #body="slotProps">
                <div>
                  {{ (slotProps.data?.remaining_duration + '/' + slotProps.data?.interval) || '-' }} يوم
                </div>
              </template>
            </Column>
            <Column field="created_on" header="تاريخ الإنشاء" sortable sortField="created_on_">
              <template #body="slotProps">
                <div>
                  {{ slotProps.data?.created_on || '-' }}
                </div>
              </template>
            </Column>
            <Column field="created_on" header="الحالة" sortField="created_on_">
              <template #body="slotProps">
                <div>
                  {{ slotProps.data?.status || '-' }}
                </div>
              </template>
            </Column>
            <Column field="id">
              <template #body="slotProps">
                <div class="d-flex justify-content-start align-items-center"
                     v-if="slotProps.data?.is_system_admin && !slotProps.data?.is_cancelled">
                  <div class="icon-container bg-light rounded-3 py-2 px-3 mx-1"
                       title="حذف"
                      @click="deleteCampaign(slotProps.data?.id)">
                    <i class="pi pi-trash"></i>
                  </div>

                  <div class="icon-container bg-light rounded-3 py-2 px-3 mx-1"
                       v-if="slotProps.data?.is_reported"
                       title="حذف"
                       @click="removeReport(slotProps.data?.id)">
                    <img class="icon" src="../../../assets/icons/unreport.svg">
                  </div>
                </div>
                <Share :sharableLink="FEURL + '/donate-campaign/' + slotProps.data?.id" v-if="isDoner"></Share>
              </template>
            </Column>
          </DataTable>
          <div class="mt-2">
            <Paginator :rows="15" :totalRecords="totalItemsCount" @page="onPageChange($event)"></Paginator>
          </div>
        </template>
      </Card>
      <div class="d-xl-none mobile-card">
        <div v-if="campaigns?.length">
          <Card v-for="(item, key) in campaigns" :key="key">
            <template #content>


              <div class="item d-flex justify-content-between text-end pb-3 mb-3">
                <div class="flex-3">
                  <span>رقم الحملة</span>
                </div>
                <div class="flex-2 fw-bold">
                  {{ item?.id || '-' }}
                </div>
              </div>
              <div class="item d-flex justify-content-between text-end pb-3 mb-3">
                <div class="flex-3">
                  <span>اسم الحملة</span>
                </div>
                <div class="flex-2 fw-bold">
                  {{ item?.full_title || '-' }}
                </div>
              </div>
              <div class="item d-flex justify-content-between text-end pb-3 mb-3">
                <div class="flex-3">
                  <span>جوال المنشئ</span>
                </div>
                <div class="flex-2 fw-bold">
                  {{ item?.created_by_mobile_number || '-' }}
                </div>
              </div>
              <div class="item d-flex justify-content-between text-end pb-3 mb-3">
                <div class="flex-3">
                  <span>نوع الحملة</span>
                </div>
                <div class="flex-2 fw-bold">
                  {{ campaignTypes[item.typ] || '-' }}
                </div>
              </div>
              <div class="item d-flex justify-content-between text-end pb-3 mb-3">
                <div class="flex-3">
                  <span>المبلغ المطلوب/الدعم</span>
                </div>
                <div class="flex-2 fw-bold">
                  {{ (item?.balance + '/' + item?.target) || '-' }} ر.س
                </div>
              </div>
              <div class="item d-flex justify-content-between text-end pb-3 mb-3">
                <div class="flex-3">
                  <span>عدد المتبرعين</span>
                </div>
                <div class="flex-2 fw-bold">
                  {{ item.number_of_donors || '-' }}
                </div>
              </div>
              <div class="item d-flex justify-content-between text-end pb-3 mb-3">
                <div class="flex-3">
                  <span>عدد الزائرين</span>
                </div>
                <div class="flex-2 fw-bold">
                  {{ item.number_of_visits || '-' }}
                </div>
              </div>
              <div class="item d-flex justify-content-between text-end pb-3 mb-3">
                <div class="flex-3">
                  <span>مدة الحملة/المتبقي منها</span>
                </div>
                <div class="flex-2 fw-bold">
                  {{ (item?.remaining_duration + '/' + item?.interval) || '-' }} يوم
                </div>
              </div>
              <div class="item d-flex justify-content-between text-end pb-3 mb-3">
                <div class="flex-3">
                  <span>تاريخ الإنشاء</span>
                </div>
                <div class="flex-2 fw-bold">
                  {{ item.created_on || '-' }}
                </div>
              </div>
              <div class="item d-flex justify-content-between text-end pb-3 mb-3">
                <div class="flex-3">
                  <span>الحالة</span>
                </div>
                <div class="flex-2 fw-bold">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="mb-2">{{ item.status || '-' }}</div>
                    <Share :sharableLink="FEURL + '/donate-campaign/' + item?.id" v-if="isDoner"></Share>
                  </div>
                </div>
              </div>
            </template>
          </Card>
          <div class="mt-2">
            <Paginator :rows="15" :totalRecords="totalItemsCount" @page="onPageChange($event)"></Paginator>
          </div>
        </div>
        <div class="text-center fw-bold fs-5" v-else>
          لا يوجد حملات
        </div>
      </div>
    </section>
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>

<script>
import CampaignsService, {CAMPAIGN_TYPES} from "@/services/campaigns.service";
import JwtUtilService from "@/services/jwt.util.service";
import {ToastSeverity} from "primevue/api";
import Share from "@/components/layout/share";

export default {
  name: "List",
  components: {Share},
  data() {
    return {
      campaigns: [],
      queryParams: {
        page: 1,
        page_size: 15,
        search: "",
        order_by: null,
        sort: null,
        filter_by: "",
        specialty: "",
        status: ""
      },
      totalItemsCount: 15,
      campaignTypes: CAMPAIGN_TYPES,
      isAdmin: JwtUtilService.getClientID()?.includes("admin"),
      isDoner: JwtUtilService.getClientID()?.includes("doner"),
      types: [
        {
          name: "جميع الحملات",
          value: ""
        },
        {
          name: "المرضى الأشد حاجة",
          value: "Most_Urgent"
        },
        {
          name: "وقف صحي",
          value: "Waqf_sehi"
        }
      ],
      statuses: [
        {
          name: "مستمرة",
          value: "IN_PROGRESS"
        },
        {
          name: "منتهية",
          value: "COMPLETED"
        },
        {
          name: "ملغية",
          value: "CANCELLED"
        }
      ],
      specialities: [],
      FEURL: process.env.VUE_APP_FE_URL
    };
  },
  methods: {
    removeReport(id) {
      this.$confirm.require({
        message: `هل انت متأكد من إزالة البلاغ عن هذه الحملة؟`,
        acceptLabel: "نعم",
        rejectLabel: "لا",
        accept: () => {
          CampaignsService.unreportCampaign(id)
              .then(({ data }) => {
                this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "هل انت متأكد من إزالة البلاغ عن هذه الحملة؟", life: 3000 });
                this.getCampaigns(this.queryParams);
              })
              .finally(() => {
                this.$confirm.close();
              })
        },
        reject: () => {
          this.$confirm.close();
        }
      });
    },
    getCampaigns(queryParams) {
      CampaignsService.getCampaigns(queryParams)
        .then(({ data }) => {
          this.campaigns = data.result?.results.map((campaign) => {
            return {
              ...campaign,
              created_on: campaign.created_on?.split("T")[0],
              status: campaign.is_cancelled ? "ملغية" : campaign.is_completed ? "منتهية" : "مستمرة"
            };
          });
          this.totalItemsCount = data.result?.total_objects;

          const specialty_list = data.result.specialty_list;
          this.specialities=[]
          if (specialty_list?.length) {
            specialty_list.forEach((specialty) => {
              this.specialities.push({
                value: specialty,
                name: specialty,
              })
            })
          }
        });
    },
    deleteCampaign(id) {
      this.$confirm.require({
        message: `هل أنت متأكد من القيام بإلغاء الحملة؟`,
        acceptLabel: "نعم",
        rejectLabel: "لا",
        accept: () => {
          CampaignsService.deleteCampaign(id)
            .then(({ data }) => {
              this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم حذف الحملة بنجاح", life: 3000 });
              this.getCampaigns(this.queryParams);
            });
        },
        reject: () => {
          this.$confirm.close();
        }
      });
    },
    onPageChange(event) {
      this.queryParams.page = event.page + 1;
      this.getCampaigns(this.queryParams);
    },
    createDebounce(text) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(async () => {
        this.searchText = text;
        this.queryParams.search = text;
        this.getCampaigns(this.queryParams);
      }, 1000);
    },
    sort(event) {
      switch (event.sortField) {
        case "id_":
          this.queryParams.order_by = "id";
          break;
        case "full_title_":
          this.queryParams.order_by = "full_title";
          break;
        case "balance_":
          this.queryParams.order_by = "balance";
          break;
        case "target_":
          this.queryParams.order_by = "target";
          break;
        case "created_on_":
          this.queryParams.order_by = "created_on";
          break;
        case "typ_":
          this.queryParams.order_by = "typ";
          break;
        case "interval_":
          this.queryParams.order_by = "interval";
          break;
        case "number_of_donors_":
          this.queryParams.order_by = "number_of_donors";
          break;
        case "number_of_visits_":
          this.queryParams.order_by = "number_of_visits";
          break;
      }
      this.queryParams.sort = event.sortOrder === 1 ? "asc" : "desc";
      this.getCampaigns(this.queryParams);
    },
    exportToExcel() {
      CampaignsService.exportToExcel()
    }
  },
  mounted() {
    this.getCampaigns(this.queryParams);
  }
};
</script>

<style lang="scss" scoped>

@import "@/styles/variables";

.icon {
  width: 16px;
  height: 16px;
}

.mobile-card {
  .item {
    border-bottom: 1px solid #ECECEC;
  }

  .header {
    margin-top: -1rem;
  }

  .p-card {
    margin-bottom: 1rem;
    padding-bottom: 0;

    .p-card-content {
      padding: 1.25rem 0 0;
    }
  }
}

a {
  text-decoration: none;
}

.min-w-430 {
  min-width: 430px;
}

.flex-2 {
  flex: 2;
}

.flex-3 {
  flex: 3;
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
