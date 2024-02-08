<template>
  <section class="datatable-view">
    <ConfirmDialog appendTo="#app" :draggable="false" :breakpoints="{'600px': '75vw', '640px': '100vw'}" :style="{width: '30vw'}"></ConfirmDialog>
    <Button @click="goToCreate" class="p-button p-button-primary p-button-rounded"
    >إضافة حالة جديدة</Button
    >

    <Card class="mt-4">
      <template #content>
        <DataTable
          :value="state.casesDynamic"
          :paginator="true"
          :rows="5"
          v-model:filters="state.filters"
          filterDisplay="menu"
          :globalFilterFields="['id', 'fullname', 'identificationNumber']"
          responsiveLayout="scroll"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
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
              <Dropdown
                v-model="state.selectedStatus"
                :options="state.statuses"
                optionLabel="name"
                :placeholder="state.statuses[0].name"
                name="statuses"
                id="statuses"
                class="mx-3"
                @change="onStatusChanged"
              />
              <Button
                class="p-button p-button-rounded p-button-secondary me-auto"
                @click="exportToExcel"
              >
                <i class="excel-icon mx-1"></i>
                <span>رفع إلى Excel</span>
              </Button>
            </div>
          </template>
          <Column field="id" header="#"></Column>
          <Column field="fullname" header="المريض"></Column>
          <Column field="identificationNumber" header="رقم الهوية"></Column>
          <Column field="dateGregorian" header="التاريخ"></Column>
          <Column field="age" header="العمر"></Column>
          <Column field="nationality" header="الجنسية"></Column>
          <Column field="sex" header="النوع"></Column>
          <Column field="specialization" header="التخصص"></Column>
          <Column
            field="amountRequested"
            header="المبلغ المطلوب/تم جمعه"
          >
            <template #body="slotProps">
              {{ slotProps.data.amountRequested }} / <span class="color-primary">{{ slotProps.data.amountCollected }}</span>
            </template>
          </Column>
          <Column field="status" header="الحالة">
            <template #body="slotProps">
              <Badge
                :severity="statusSeverity(slotProps.data.status)"
                :value="statusLabel(slotProps.data.status)"
              ></Badge>
            </template>
          </Column>
          <Column field="id">
            <template #body="slotProps">
              <div @click="selectCase(slotProps.data.id)">
                <SplitButton
                  icon="pi pi-ellipsis-v"
                  :model="state.selectButtonItems"
                  appendTo="#app"
                ></SplitButton>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </section>
</template>

<script setup>
import {FilterMatchMode, ToastSeverity} from "primevue/api";
import { onMounted, reactive } from "vue";
import CaseService from "@/services/case-service";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { displayGender } from "@/helpers/helpers"
import JWTService from "@/services/jwt.util.service";
import JwtUtilService from "@/services/jwt.util.service";
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const state = reactive({
  cases: [],
  casesDynamic: [],
  filters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  },
  statuses: [
    { id: "draft", name: "مسودة" },
    { id: "active", name: "نشط" },
    { id: "rejected", name: "مرفوض" },
    { id: "all", name: "الكل" },
  ],
  selectedStatus: null,
  selectButtonItems: [
    {
      label: "تعديل الحالة",
      icon: "pi pi-pencil",
      command: () => {
        router.push(`/admin-panel/cases/edit/${state.selectedCase}`);
      },
    },
    {
      label: "عرض الحالة",
      icon: "pi pi-eye",
      command: () => {
        router.push(`/admin-panel/cases/view/${state.selectedCase}`);
      },
    },
    {
      label: "حذف الحالة",
      icon: "pi pi-trash",
      command: () => {
        confirm.require({
          header: 'هل أنت متأكد من حذف الحالة؟',
          acceptLabel: 'تأكيد',
          rejectLabel: 'إغلاق',
          acceptClass: 'p-button-rounded p-button-primary px-5 mx-2',
          rejectClass: 'p-button-rounded p-button-secondary px-5 mx-2',
          accept: () => {
            removeCase(state.selectedCase);
            toast.add({severity:'success', detail:'تم الحذف بنجاح', closable: false, contentStyleClass: 'direction-rtl', life: 3000});
          },
        });
      },
    },
  ],
  selectedCase: null,
});

const getList = async () => {
  const { data } = await CaseService.getList();
  state.cases = data.result.map((e) => ({
    id: e.id,
    fullname: `${e.first_name} ${e.last_name} ${e.father_name}`,
    identificationNumber: e.identity_number,
    dateGregorian: e.gregorian_birthdate,
    age: e.age,
    nationality: e.nationality,
    sex: displayGender(e.gender),
    specialization: e.job,
    amountRequested: e.amount,
    amountCollected: "0",
    status: e.status,
  }));
  state.casesDynamic = state.cases;
};

const selectCase = (id) => {
  state.selectedCase = id;
};

const removeCase = async (id) => {
  await CaseService.removeCase(id);
  await getList()
};

const onStatusChanged = () => {
  state.casesDynamic = state.cases.filter((c) => {
    return state.selectedStatus.id === "all"
      ? c
      : c.status === state.selectedStatus.id;
  });
};
const statusSeverity = (status) => {
  if (status === "draft") {
    return "info";
  } else if (status === "accepted") {
    return "success";
  } else if (status === "rejected") {
    return "danger";
  }
};
const statusLabel = (status) => {
  if (status === "draft") {
    return "مسودة";
  } else if (status === "accepted") {
    return "وافقت";
  } else if (status === "rejected") {
    return "مرفوض";
  } else if (status === "Technical_Audit") {
    return "التدقيق الفني";
  } else {
    return status
  }
};

const goToCreate = async () => {
  try {
    const charityId = localStorage.getItem('user_charity_id')
    await CaseService.canAddCase(charityId);
    await router.push('/admin-panel/cases/create')
  } catch (e) {
    toast.add({
      severity: ToastSeverity.ERROR,
      detail: e.response.data.errors[0],
      life: 3000,
    });
  }
}

const exportToExcel = async () => {
  await CaseService.exportExcel('/charity/case/export')
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
