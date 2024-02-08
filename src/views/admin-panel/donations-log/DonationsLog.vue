<template>
  <div class="donations-log mt-2">
    <div class="stats mb-4 d-flex justify-content-center justify-content-lg-end fs-5">
      <div class="border-start px-4 flex-2 d-flex flex-column align-items-center ">
        <div class="donations-log__label"> مبلغ التبرعات</div>
        <div>
          <span class="fw-bold px-1 donations-log__amount">{{ Math.ceil(logDetails.sum_of_donations || 0).toLocaleString("en-US") }}</span>
          <span class="donations-log__currency">ر.س</span>
        </div>
      </div>
      <div class="px-4 flex-2 d-flex flex-column align-items-center ">
        <div class="donations-log__label"> عدد مرات التبرع</div>
        <div>
          <span class="fw-bold px-1 donations-log__amount">{{ Math.ceil(logDetails.no_of_donations || 0).toLocaleString("en-US") }} </span>
          <span class="donations-log__currency">تبرعات</span>
        </div>
      </div>
    </div>
    <div class="details bg-white rounded-3 py-4 d-none d-lg-block">
      <div class="grid px-4">
        <div class="header d-flex mb-2 p-3 rounded-3">
          <div class="item">رقم الحالة</div>
          <div class="item">نوع التبرع</div>
          <div class="item">مبلغ التبرع</div>
          <div class="item">التاريخ والوقت</div>
          <div class="item">رقم المرجع</div>
        </div>
        <div class="body">
          <div class="item-cont d-flex mb-2"
               v-for="(item, index) in logDetails.transaction_details" :key="index">
            <div class="item fw-bold">{{ item.case_id }}</div>
            <div class="item">{{ item.donation_type }}</div>
            <div class="item">
              <span class="fw-bold fs-5"> {{ Math.ceil(item.amount).toLocaleString("en-US") }} </span>
              <span> ر.س </span>
            </div>
            <div class="item date">{{ item.created_on }}</div>
            <div class="item date">{{ item.reference_number }}</div>
          </div>
        </div>
      </div>
      <div class="mt-2" v-if="totalItemsCount > 0">
        <Paginator :rows="15" :totalRecords="totalItemsCount" @page="onPageChange($event)"></Paginator>
      </div>
    </div>
  </div>
  <div class="d-lg-none mobile-card">
    <Card v-for="(item, key) in logDetails.transaction_details" :key="key">
      <template #content>
        <div class="item d-flex justify-content-between text-end pb-3 mb-3">
          <div class="flex-2">
            <span class="item__label">رقم الحالة</span>
          </div>
          <div class="flex-2 fw-bold">
            {{item.case_id}}
          </div>
        </div>
        <div class="item d-flex justify-content-between text-end pb-3 mb-3">
          <div class="flex-2">
            <span class="item__label">نوع التبرع</span>
          </div>
          <div class="flex-2 fw-bold">
            {{item.donation_type}}
          </div>
        </div>
        <div class="item d-flex justify-content-between text-end pb-3 mb-3">
          <div class="flex-2">
            <span class="item__label">مبلغ التبرع</span>
          </div>
          <div class="flex-2 fw-bold">
            {{ Math.ceil(item.amount).toLocaleString("en-US") }}
            <span> ر.س </span>
          </div>
        </div>
        <div class="item d-flex justify-content-between text-end pb-3 mb-3">
          <div class="flex-2">
            <span class="item__label">التاريخ والوقت</span>
          </div>
          <div class="flex-2 fw-bold">
            {{item.created_on}}
          </div>
        </div>
        <div class="item d-flex justify-content-between text-end pb-3">
          <div class="flex-2">
            <span class="item__label">رقم المرجع</span>
          </div>
          <div class="flex-2 fw-bold">
            {{item.reference_number}}
          </div>
        </div>
      </template>
    </Card>
    <div class="mt-2" v-if="totalItemsCount > 0">
      <Paginator :rows="15" :totalRecords="totalItemsCount" @page="onPageChange($event)"></Paginator>
    </div>
  </div>
</template>

<script>
import DonationsLogService from "@/services/donations-log.service";

export default {
  name: "donations-log",
  data() {
    return {
      queryParams: {
        page: 1,
        page_size: 15
      },
      totalItemsCount: 15,
      logDetails: {}
    };
  },
  mounted() {
    this.getLogs(this.queryParams);
  },
  methods: {
    getLogs(queryParams) {
      DonationsLogService.getLogs(queryParams)
        .then(({ data }) => {
          this.logDetails = data?.result;
          this.totalItemsCount = data?.total_objects;
        });
    },
    onPageChange(event) {
      this.queryParams.page = event.page + 1;
      this.getLogs(this.queryParams);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/variables";

.donations-log {
  .stats {
  }
  &__label {
    font-size: 16px;
    color: $color-font-lighter;
  }
  &__currency {
    font-size: 18px;
    color: $color-font-black;
  }
  &__amount {
    font-size: 24px;
    color: $color-font-black;
  }
  .details {

    box-shadow: 1px 1px 14px rgb(0 0 0 / 10%);

    .grid {

      .header {
        grid-auto-flow: column;
        background-color: #ECECEC;

        .item {
          flex: 3;

          &:first-child {
            flex: 2;
          }
        }
      }

      .body {
        .item-cont {
          padding: 1rem;
          background: #fff;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 1px 1px 14px rgb(0 0 0 / 10%);

          .item {
            flex: 3;

            &:first-child {
              flex: 2;
            }

            &.date {
              text-align: right;
              direction: ltr;
            }
          }
        }
      }
    }
  }
}

.mobile-card {
  .item {
    border-bottom: 1px solid #ECECEC;
    &__label {
      font-size: 14px;
      color: $color-font-darker;
    }
  }

  .p-card {
    margin-bottom: 1rem;
    padding-bottom: 0;

    .p-card-content {
      padding: 1.25rem 0 0;
    }
  }
}

.flex-2 {
  flex: 2;
}

.flex-3 {
  flex: 3;
}

.color-primary {
  color: $color-primary;
}

.color-light-blue {
  color: $color-light-blue;
}

.border-blue {
  border: 1px solid $color-light-blue;
}

.color-font-darker {
  color: $color-font-darker;
}

::v-deep(.p-paginator) {
  justify-content: end;
  background: inherit;

  .p-paginator-first,
  .p-paginator-prev,
  .p-paginator-next,
  .p-paginator-last {
    transform: rotate(180deg);
  }
}

::v-deep(.p-card-content) {
  padding: 0 !important;
}
::v-deep(.p-card) {
  box-shadow: $box-shadow-case-card !important;
}
</style>
