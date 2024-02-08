<template>
  <section class="datatable-view">
    <Button @click="goToCreate" class="p-button p-button-primary p-button-rounded">اضافة ممثل للجمعية</Button>
    <Card class="mt-4">
      <template #content>
        <DataTable
            :value="state.representatives"
            :paginator="false"
            :rows="5"
            :rowHover="true"
            filterDisplay="menu"
            responsiveLayout="scroll"
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            @row-click="rowClicked"
        >
          <template #empty>
            <div class="text-center">
              لا يوجد ممثليين للجمعية
            </div>
          </template>
          <template #header>
            <div class="d-flex justify-content-start align-items-center">
              <Button
                  class="p-button p-button-rounded p-button-secondary me-auto"
                  @click="exportToExcel"
              >
                <i class="excel-icon mx-1"></i>
                <span>رفع إلى Excel</span>
              </Button>
            </div>
          </template>
          <Column field="fullname" header="اسم الممثل"></Column>
          <Column field="nationalId" header="رقم الهوية"></Column>
          <Column field="mobileNumber" header="رقم الجوال"></Column>
          <Column field="email" header="البريد الإلكتروني"></Column>
          <Column field="status" header="الحالة">
            <template #body="slotProps">
              <Badge
                  :severity="statusSeverity(slotProps.data.status)"
                  :value="statusLabel(slotProps.data.status)"
              ></Badge>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </section>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import CharityRepresentativeService from "@/services/charity-representative-service";
import {ToastSeverity} from "primevue/api";
import {useToast} from "primevue/usetoast";
import CaseService from "@/services/case-service";

const router = useRouter();
const toast = useToast();

const state = reactive({
  representatives: [],
  statuses: [
    { id: "active", name: "نشط" },
    { id: "inactive", name: "غير نشط" },
  ],
  selectedStatus: null,
  selectedCase: null,
});

const getList = async () => {
  const { data } = await CharityRepresentativeService.getRepresentativeList();
  state.representatives = data.map((e) => ({
    id: e.id,
    fullname: `${e.first_name} ${e.last_name} ${e.father_name}`,
    nationalId: e.national_id,
    mobileNumber: e.mobile_number,
    email: e.email,
    status: e.is_active ? 'active' : 'inactive',
  }));
};

const rowClicked = (ev) => {
  router.push(`/admin-panel/charity-representative/${ev.data.id}`)
}

const statusSeverity = (status) => {
  if (status === "active") {
    return "success";
  } else if (status === "inactive") {
    return "danger";
  } else {
    return "info";
  }
};
const statusLabel = (status) => {
  if (status === "active") {
    return "نشط";
  } else if (status === "inactive") {
    return "غير نشط" ;
  } else {
    return "حالة غير معروفةs";
  }
};

const goToCreate = async () => {
  try {
    const charityId = localStorage.getItem('user_charity_id') || 0
    await CharityRepresentativeService.canAddUser(charityId);
    await router.push('/admin-panel/charity-representative/create')
  } catch (e) {}
}

const exportToExcel = async () => {
  await CaseService.exportExcel('/account/representative/export')
};

onMounted(() => getList());
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
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

  .p-datatable-tbody > tr {
    cursor: pointer;
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
</style>

