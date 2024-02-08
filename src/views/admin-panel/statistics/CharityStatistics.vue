<template>
  <div class="statistics">
    <div class="row">
      <div class="col-6">
        <Card>
          <template #header>
            <strong> احصائيات الحالات - عام </strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div class="box-cotainer" v-else-if="payload.overall">
              <div class="row" v-for="(each, index) in list" :key="index">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color': each['color'],
                  }"
                ></div>
                <div class="col-5">
                  {{ each["label"] }}
                </div>
                <div class="col-6" style="text-align: left">
                  {{ payload.overall[each["value"]] }}
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
            <strong> احصائيات الحالات - اليوم </strong>
          </template>
          <template #content>
            <div v-if="loading" class="text-center color-primary">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <div class="box-cotainer" v-else-if="payload.today">
              <div class="row" v-for="(each, index) in list" :key="index">
                <div
                  class="col-1 color-box"
                  :style="{
                    'background-color': each['color'],
                  }"
                ></div>
                <div class="col-5">
                  {{ each["label"] }}
                </div>
                <div class="col-6" style="text-align: left">
                  {{ payload.today[each["value"]] }}
                </div>
              </div>
            </div>
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

export default {
  data() {
    return {
      loading: false,
      list: [
        {
          label: "انتظار",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          value: "waiting",
        },
        {
          label: "مرفوضة",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          value: "rejected",
        },
        {
          label: "منشورة",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          value: "published",
        },
        {
          label: "موقوفة",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          value: "hold",
        },
        {
          label: "ملغية",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          value: "canceled",
        },
        {
          label: "معادة",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          value: "returned",
        },
        {
          label: "بانتظار الفاتورة",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          value: "donation_completed",
        },
        {
          label: "مكتملة",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          value: "completed",
        },
      ],
      payload: {},
    };
  },
  methods: {
    query() {
      this.loading = true;
      AdminPanelService.charityDashboard()
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

.color-box {
  background-color: #dedede;
  height: 20px;
  width: 20px;
  border-radius: 5px;
}
</style>
