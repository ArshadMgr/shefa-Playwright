<template>
  <section class="datatable-view">
    <Card class="mt-4 d-none d-lg-block">
      <template #content>
        <DataTable
          :value="state.cases"
          :paginator="false"
          :rows="5"
          filterDisplay="menu"
          responsiveLayout="scroll"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
          <Column field="case" header="رقم الحالة"></Column>
          <Column field="number_of_visitors" header="عدد الزيارات"></Column>
          <Column field="collected_donation_amount" header="مبلغ التبرعات">
            <template #body="slotProps">
              {{ slotProps.data.collected_donation_amount || 0 }}
              <span> ر.س </span>
            </template>
          </Column>
          <Column field="number_of_donors" header="عدد المتبرعين"></Column>
        </DataTable>
      </template>
    </Card>

  </section>
  <div class="d-lg-none mobile-card">
    <Card v-for="(item, key) in state.cases" :key="key">
      <template #content>
        <div class="item d-flex justify-content-between text-end pb-3 mb-3">
          <div class="flex-2">
            <span>رقم الحالة</span>
          </div>
          <div class="flex-1 fw-bold">
            {{item.case}}
          </div>
        </div>
        <div class="item d-flex justify-content-between text-end pb-3 mb-3">
          <div class="flex-2">
            <span>عدد الزيارات</span>
          </div>
          <div class="flex-1 fw-bold">
            {{item.number_of_visitors}}
          </div>
        </div>
        <div class="item d-flex justify-content-between text-end pb-3 mb-3">
          <div class="flex-2">
            <span>مبلغ التبرعات</span>
          </div>
          <div class="flex-1 fw-bold">
            {{item.collected_donation_amount || 0}}
            <span> ر.س </span>
          </div>
        </div>
        <div class="item d-flex justify-content-between text-end pb-3 mb-3">
          <div class="flex-2">
            <span>عدد المتبرعين</span>
          </div>
          <div class="flex-1 fw-bold">
            {{item.number_of_donors}}
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import AmbassadorService from "@/services/ambassador.service";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const state = reactive({
  cases: []
});

const getList = async () => {
  const { data } = await AmbassadorService.getList();
  state.cases = data.result;
};

onMounted(() => getList());
</script>

<style lang="scss" scoped>
@import "@/styles/_variables.scss";

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

.mobile-card {
  .item {
    border-bottom: 1px solid #ECECEC;
  }

  .p-card {
    margin-bottom: 1rem;
    padding-bottom: 0;

    .p-card-content {
      padding: 1.25rem 0 0;
    }
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

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}
</style>
