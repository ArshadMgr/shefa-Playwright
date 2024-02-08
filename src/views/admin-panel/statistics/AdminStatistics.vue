<template>
  <div class="statistics">
    <div class="row">
      <div class="col-6">
        <Card>
          <template #header>
            <strong> إحصائيات التبرعات </strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div class="box-cotainer" v-else-if="payload.A1">
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">مبلغ التبرعات</div>
                <div class="col-2" style="text-align: left">
                  {{ (payload.A1.overall.amount).toLocaleString("en-US") }}
                </div>
              </div>
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">عدد المتبرعين</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.A1.overall.count }}
                </div>
              </div>
            </div>
            <div v-else>لاتوجد بيانات</div>
          </template>
        </Card>
      </div>

      <div class="col-12" v-if="payload.A2">
        <div class="mb-2">إحصائيات كل مرض على حدة</div>
      </div>

      <div class="col-6" v-for="(each, index) in payload.A2" :key="index">
        <Card>
          <template #header>
            <strong> {{ each.speciality }} </strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div v-else-if="each" class="box-cotainer row">
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">مبلغ التبرعات</div>
                <div class="col-2" style="text-align: left">
                  {{ (each.data.amount).toLocaleString("en-US") }}
                </div>
              </div>
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">عدد الطلبات</div>
                <div class="col-2" style="text-align: left">
                  {{ each.data.count }}
                </div>
              </div>
              <div
                class="row mt-3"
                v-if="
                  each.data.statuses &&
                  (each.data.statuses.ready ||
                    each.data.statuses.completed ||
                    each.data.statuses.paused ||
                    each.data.statuses.cancelled)
                "
              >
                <div class="col-3" />
                <div class="col-6">
                  <div class="text-center mb-2">حالات الطلبات</div>
                  <div>
                    <Pie
                      :options="chartOptions"
                      :data="getA2chartData(each.data.statuses)"
                    />
                  </div>
                </div>
                <div class="col-3" />
              </div>
            </div>
            <div v-else>لاتوجد بيانات</div>
          </template>
        </Card>
      </div>

      <div class="col-6">
        <Card>
          <template #header>
            <strong> إحصائيات التبرع السريع</strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div v-else-if="payload.A3">
              <div class="box-cotainer" v-if="payload.A3.quick_waqf">
                <div class="mb-2">وقف</div>
                <div class="row">
                  <div
                    class="col-1 color-box"
                    :style="{
                      'background-color':
                        '#' + Math.floor(Math.random() * 16777215).toString(16),
                    }"
                  ></div>
                  <div class="col-9">مبلغ التبرعات</div>
                  <div class="col-2" style="text-align: left">
                    {{ (payload.A3.quick_waqf.total).toLocaleString("en-US") }}
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col-1 color-box"
                    :style="{
                      'background-color':
                        '#' + Math.floor(Math.random() * 16777215).toString(16),
                    }"
                  ></div>
                  <div class="col-9">عدد المتبرعين</div>
                  <div class="col-2" style="text-align: left">
                    {{ payload.A3.quick_waqf.dcount }}
                  </div>
                </div>
              </div>
              <div
                class="box-cotainer mt-3"
                v-if="payload.A3.quick_most_urgent"
              >
                <div class="mb-2">حالات حرجة</div>
                <div class="row">
                  <div
                    class="col-1 color-box"
                    :style="{
                      'background-color':
                        '#' + Math.floor(Math.random() * 16777215).toString(16),
                    }"
                  ></div>
                  <div class="col-9">مبلغ التبرعات</div>
                  <div class="col-2" style="text-align: left">
                    {{ (payload.A3.quick_most_urgent.total).toLocaleString("en-US") }}
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col-1 color-box"
                    :style="{
                      'background-color':
                        '#' + Math.floor(Math.random() * 16777215).toString(16),
                    }"
                  ></div>
                  <div class="col-9">عدد المتبرعين</div>
                  <div class="col-2" style="text-align: left">
                    {{ payload.A3.quick_most_urgent.dcount }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else>لاتوجد بيانات</div>
          </template>
        </Card>
      </div>

      <div class="col-6">
        <Card>
          <template #header>
            <strong> إحصائيات الإهداءات</strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div class="box-cotainer" v-else-if="payload.A4">
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">مبلغ التبرعات</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.A4.total }}
                </div>
              </div>
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">عدد المتبرعين</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.A4.dcount }}
                </div>
              </div>
            </div>
            <div v-else>لاتوجد بيانات</div>
          </template>
        </Card>
      </div>

      <div class="col-6">
        <Card>
          <template #header>
            <strong> إحصائيات الحملات</strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div class="box-cotainer" v-else-if="payload.A5">
              <div v-if="payload.A5.campaigns">
                <div class="row">
                  <div
                    class="col-1 color-box"
                    :style="{
                      'background-color':
                        '#' + Math.floor(Math.random() * 16777215).toString(16),
                    }"
                  ></div>
                  <div class="col-9">مبلغ التبرعات</div>
                  <div class="col-2" style="text-align: left">
                    {{ (payload.A5.campaigns.total).toLocaleString("en-US") }}
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col-1 color-box"
                    :style="{
                      'background-color':
                        '#' + Math.floor(Math.random() * 16777215).toString(16),
                    }"
                  ></div>
                  <div class="col-9">عدد الحملات</div>
                  <div class="col-2" style="text-align: left">
                    {{ payload.A5.campaigns.dcount }}
                  </div>
                </div>
              </div>
              <div class="row mt-3">
                <div
                  class="col-6"
                  v-if="
                    payload.A5.campaigns_counts &&
                    payload.A5.campaigns_counts.length
                  "
                >
                  <div class="mb-2 text-center">عدد المتبرعين لكل حملة</div>
                  <div>
                    <Pie
                      :options="chartOptions"
                      :data="getChartData(payload.A5.campaigns_counts)"
                    />
                  </div>
                </div>
                <div
                  class="col-6"
                  v-if="
                    payload.A5.campaigns_amounts &&
                    payload.A5.campaigns_amounts.length
                  "
                >
                  <div class="mb-2 text-center">مبلغ التبرعات لكل حملة</div>
                  <div>
                    <Pie
                      :options="chartOptions"
                      :data="getChartData(payload.A5.campaigns_amounts)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-else>لاتوجد بيانات</div>
          </template>
        </Card>
      </div>

      <div class="col-6">
        <Card>
          <template #header>
            <strong> إحصائيات الأوقاف</strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div class="box-cotainer" v-else-if="payload.A6">
              <div v-if="payload.A6.waqfs">
                <div class="row">
                  <div
                    class="col-1 color-box"
                    :style="{
                      'background-color':
                        '#' + Math.floor(Math.random() * 16777215).toString(16),
                    }"
                  ></div>
                  <div class="col-9">مبلغ التبرعات</div>
                  <div class="col-2" style="text-align: left">
                    {{ (payload.A6.waqfs.total).toLocaleString("en-US") }}
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col-1 color-box"
                    :style="{
                      'background-color':
                        '#' + Math.floor(Math.random() * 16777215).toString(16),
                    }"
                  ></div>
                  <div class="col-9">عدد الأوقاف</div>
                  <div class="col-2" style="text-align: left">
                    {{ payload.A6.waqfs.dcount }}
                  </div>
                </div>
              </div>
              <div class="row mt-3">
                <div
                  class="col-6"
                  v-if="
                    payload.A6.waqfs_counts && payload.A6.waqfs_counts.length
                  "
                >
                  <div class="mb-2 text-center">عدد المتبرعين لكل وقف</div>
                  <div>
                    <Pie
                      :options="chartOptions"
                      :data="getChartData(payload.A6.waqfs_counts)"
                    />
                  </div>
                </div>
                <div
                  class="col-6"
                  v-if="
                    payload.A6.waqfs_amounts && payload.A6.waqfs_amounts.length
                  "
                >
                  <div class="mb-2 text-center">مبلغ التبرعات لكل وقف</div>
                  <div>
                    <Pie
                      :options="chartOptions"
                      :data="getChartData(payload.A6.waqfs_amounts)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-else>لاتوجد بيانات</div>
          </template>
        </Card>
      </div>

      <div class="col-6">
        <Card>
          <template #header>
            <strong> إحصائيات المتبرعين </strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div class="box-cotainer" v-else-if="payload.B1">
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">عدد المتبرعين المسجلين</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.B1.registered_users.total }}
                </div>
              </div>
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">عدد المتبرعين غير المسجلين</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.B1.unregistered_users.total }}
                </div>
              </div>
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">عدد المتبرعين النشطين</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.B1.active_users }}
                </div>
              </div>
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">عدد المتبرعين غير النشطين</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.B1.inactive_users }}
                </div>
              </div>
            </div>
            <div v-else>لاتوجد بيانات</div>
          </template>
        </Card>
      </div>

      <div class="col-6">
        <Card>
          <template #header>
            <strong> إحصائيات الجمعيات </strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div class="box-cotainer" v-else-if="payload.B2">
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">عدد الجمعيات المسجلة</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.B2.charity_count }}
                </div>
              </div>
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">عدد الجمعيات النشطة</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.B2.active_charity }}
                </div>
              </div>
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">عدد الجمعيات غير النشطة</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.B2.inactive_charity }}
                </div>
              </div>
            </div>
            <div v-else>لاتوجد بيانات</div>
          </template>
        </Card>
      </div>

      <div class="col-6">
        <Card>
          <template #header>
            <strong> عدد الطلبات في كل مرحلة </strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div class="box-cotainer" v-else-if="payload.C1">
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">قبل النشر</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.C1.groups_operations.before_publish }}
                </div>
              </div>
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">بعد النشر</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.C1.groups_operations.published }}
                </div>
              </div>
              <div class="row">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                ></div>
                <div class="col-9">بعد إكتمال المبلغ</div>
                <div class="col-2" style="text-align: left">
                  {{ payload.C1.groups_operations.donation_completed }}
                </div>
              </div>
            </div>
            <div v-else>لاتوجد بيانات</div>
          </template>
        </Card>
      </div>

      <div class="col-6">
        <Card>
          <template #header>
            <strong> الجمعيات الأكثر تفاعل </strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <template v-else-if="payload.D1">
              <DataTable
                :value="payload.D1.top_charities"
                :paginator="true"
                :rows="10"
                responsiveLayout="scroll"
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
              >
                <Column field="charity__name" header="الجمعية"></Column>
                <Column field="dcount" header="عدد المرضى المستفيدين"></Column>
              </DataTable>
            </template>
            <div v-else>لاتوجد بيانات</div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import AdminPanelService from "@/services/admin-panel.service";
import { ToastSeverity } from "primevue/api";
import { Chart as ChartJS, ArcElement, Tooltip, LinearScale } from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, LinearScale);

export default {
  components: { Pie },
  data() {
    return {
      loading: false,
      payload: {},
      chartOptions: {
        responsive: true,
      },
    };
  },
  methods: {
    query() {
      this.loading = true;
      AdminPanelService.adminDashboard()
        .then(({ data }) => {
          this.payload = data;
        })
        .catch(({ message }) => {
          this.$toast.add({
            severity: ToastSeverity.ERROR,
            detail: message,
            life: 3000,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getChartData(data) {
      return {
        labels: data.map((each) => each.name),
        datasets: [
          {
            backgroundColor: data.map((each) => {
              return "#" + Math.floor(Math.random() * 16777215).toString(16);
            }),
            data: data.map((each) => each.count),
          },
        ],
      };
    },
    getA2chartData(data) {
      return {
        labels: [
          "عدد الطلبات الجاهزة للنشر",
          "عدد الطلبات المكتملة",
          "عدد الطلبات الموقوفة",
          "عدد الطلبات الملغية",
        ],
        datasets: [
          {
            backgroundColor: [
              "#" + Math.floor(Math.random() * 16777215).toString(16),
              "#" + Math.floor(Math.random() * 16777215).toString(16),
              "#" + Math.floor(Math.random() * 16777215).toString(16),
              "#" + Math.floor(Math.random() * 16777215).toString(16),
            ],
            data: [data.ready, data.completed, data.paused, data.cancelled],
          },
        ],
      };
    },
  },
  mounted() {
    this.query();
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.statistics {
  height: 100%;
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 1px 1px 14px #0000001a;
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
    position: relative;
    bottom: -1rem;
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

.color-box {
  background-color: #dedede;
  height: 20px;
  width: 20px;
  border-radius: 5px;
}
</style>
