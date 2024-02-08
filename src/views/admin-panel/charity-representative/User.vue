<template>
  <main class="edit-case d-flex flex-column align-items-end">
    <ConfirmDialog appendTo="#app" :draggable="false" :breakpoints="{'600px': '75vw', '640px': '100vw'}"
                   :style="{width: '30vw', display: 'flex', alignItems: 'center'}"></ConfirmDialog>
    <router-link to="/admin-panel/charity-representative">
      <Button class="p-button p-button-rounded p-button-secondary mb-4 button-smaller" icon="pi pi-times" iconPos="left" label="العودة إلى لائحة الممثلين"/>
    </router-link>
    <Card>
      <template #header>
        <div class="row">
          <div class="col-2">اسم ممثل الجمعية</div>
          <div class="col-2">رقم الهوية</div>
          <div class="col-2">رقم الجوال</div>
          <div class="col-3">البريد الالكتروني</div>
          <div class="col-3">الحالة</div>
        </div>
      </template>
      <template #content>
        <div class="row">
          <div class="col-2">{{ state.representative.fullname }}</div>
          <div class="col-2">{{ state.representative.nationalId }}</div>
          <div class="col-2">{{ state.representative.mobileNumber }}</div>
          <div class="col-3">{{ state.representative.email }}</div>
          <div class="col-3">
            <Badge :severity="statusSeverity" :value="statusLabel"></Badge>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="border-top-spacer my-2 pb-4">
          <Button class="p-button p-button-primary p-button-rounded mx-1" @click="activate" :disabled="state.representative.status === 'active'"> تفعيل </Button>
          <Button class="p-button p-button-secondary p-button-rounded mx-1" @click="deActivate" :disabled="state.representative.status === 'inactive'"> تعطيل الفعالية </Button>
          <Button class="p-button p-button-primary p-button-rounded mx-1 p-button-danger" @click="remove"> إزالة </Button>
        </div>
      </template>
    </Card>
  </main>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import {computed, onMounted, reactive} from "vue";
import CharityRepresentativeService from "@/services/charity-representative-service";
import {useToast} from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";


const route = useRoute()
const router = useRouter()
const toast = useToast();
const confirm = useConfirm();


const state = reactive({
  statuses: [
    { id: "active", name: "نشط" },
    { id: "inactive", name: "غير نشط" },
  ],
  representative: {
    fullname: "",
    nationalId: '',
    mobileNumber: '',
    email: '',
    status: "",
  },
})

const getRepresentative = async () => {
  const { data } = await CharityRepresentativeService.getRepresentative(`${route.params.id}`);
  state.representative.fullname = `${data.result.first_name} ${data.result.father_name} ${data.result.last_name}`
  state.representative.nationalId = data.result.national_id
  state.representative.mobileNumber = data.result.mobile_number
  state.representative.email = data.result.email
  state.representative.status = data.result.is_active ? 'active' : 'inactive'
}

const statusSeverity = computed(() => {
  if (state.representative.status.toLowerCase() === "active") {
    return "success";
  } else if (state.representative.status.toLowerCase() === "inactive") {
    return "danger";
  }
});

const statusLabel = computed(() => {
  if (state.representative.status.toLowerCase() === "active") {
    return "نشط";
  } else if (state.representative.status.toLowerCase() === "inactive") {
    return "غير نشط";
  }
});

const activate = () => {
  confirm.require({
    header: 'هل أنت متأكد من تفعيل هذا الممثل؟',
    acceptLabel: 'تأكيد',
    rejectLabel: 'إغلاق',
    acceptClass: 'p-button-rounded p-button-primary px-5 mx-2',
    rejectClass: 'p-button-rounded p-button-secondary px-5 mx-2',
    accept: async () => {
      try {
        await CharityRepresentativeService.activateRepresentative(`${route.params.id}`, true)
      } catch (e) {
        toast.add({
          severity: 'error',
          detail: e.response.data.errors[0],
          closable: false,
          life: 3000,
        });
      } finally {
        toast.add({
          severity:'success',
          detail:'تغير وضع الممثل',
          closable: false,
          contentStyleClass: 'direction-rtl',
          life: 3000
        });
        router.push('/admin-panel/charity-representative')
      }
    },
  });
}

const deActivate = async () => {
    confirm.require({
    header: 'هل أنت متأكد من تعطيل الفعالية لهذا الممثل؟',
    acceptLabel: 'تأكيد',
    rejectLabel: 'إغلاق',
    acceptClass: 'p-button-rounded p-button-primary px-5 mx-2',
    rejectClass: 'p-button-rounded p-button-secondary px-5 mx-2',
    accept: async () => {
      try {
        await CharityRepresentativeService.activateRepresentative(`${route.params.id}`, false)
      } catch (e) {
        toast.add({
          severity: 'error',
          detail: e.response.data.errors[0],
          closable: false,
          life: 3000,
        });
      } finally {
        toast.add({
          severity:'success',
          detail:'تغير وضع الممثل',
          closable: false,
          contentStyleClass: 'direction-rtl',
          life: 3000
        });
        router.push('/admin-panel/charity-representative')
      }
    },
  });
}

const remove = () => {
    confirm.require({
    header: 'هل أنت متأكد من إزالة هذا الممثل؟',
    acceptLabel: 'تأكيد',
    rejectLabel: 'إغلاق',
    acceptClass: 'p-button-rounded p-button-primary px-5 mx-2',
    rejectClass: 'p-button-rounded p-button-secondary px-5 mx-2',
    accept: async () => {
      try {
        await CharityRepresentativeService.removeRepresentative(`${route.params.id}`);
      } catch (e) {
        toast.add({
          severity: 'error',
          detail: e.response.data.errors[0],
          closable: false,
          life: 3000,
        });
      } finally {
        toast.add({
          severity:'success',
          detail:'تمت إزالة ممثل المؤسسة الخيرية',
          closable: false,
          contentStyleClass: 'direction-rtl',
          life: 3000
        });
        router.push('/admin-panel/charity-representative')
      }
    },
  });
}

onMounted(() => getRepresentative())
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

::v-deep(.form-personal-information) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 3rem;
}
::v-deep(.form-insurance-information) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 3rem;
}
::v-deep(.form-medical-information__first-group) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 3rem;
}
::v-deep(.form-medical-information__stages) {
  .stage {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 3rem;
    align-items: end;
  }
  .stage__input {
    display: flex;
    flex-direction: column;
  }
  .stage__file {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
}
::v-deep(.stages-divider) {
  position: relative;
  width: 100%;
  height: 0;
  border-top: 1px solid #d9d9d9;
  .stages-divider__heading {
    position: absolute;
    right: 2rem;
    top: -0.7rem;
    padding: 0 0.7rem;
    background-color: white;
  }
}
::v-deep(.form-social-survey) {
  .form-social-survey__select-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 3rem;
  }
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

::v-deep(.p-button) {
  font-size: 18px;
  padding-right: 2rem;
  padding-left: 2rem;
  .p-button-icon-left {
    margin: 0 0 0 .5rem;
  }
}
::v-deep(.p-button-danger) {
  background-color: $color-button-danger-bcg;
  border-color: $color-button-danger-bcg;
  color: $color-button-danger-font;
}
::v-deep(.p-button.p-button-danger:enabled:hover) {
  background-color: $color-button-danger-hover-bcg;
  border-color: $color-button-danger-hover-bcg;
  color: $color-button-danger-font;
}
::v-deep(.p-button-secondary) {
  background-color: $color-secondary;
  border-color: $color-secondary;
  color: $color-font-dark;
  .pi {
    font-size: 14px;
  }
  &:hover {
    background-color: $color-secondary-hover;
    border-color: $color-secondary-hover;
  }
}
::v-deep(.p-button.p-button-secondary:enabled:hover) {
  background-color: $color-secondary-hover;
  border-color: $color-secondary-hover;
    color: $color-font-dark;
}

::v-deep(.p-fileupload) {
  border: 1px dashed #ced4da;
  border-radius: 6px;
  .p-fileupload-buttonbar {
    border: none;
    background-color: transparent;
  }
  .p-button,
  .p-button-icon-only {
    background-color: #d9d9d9;
    border-color: #d9d9d9;
    color: #3f3f3f;
    transition: 0.1s;
    border-radius: 25px;
    &:hover,
    &:active,
    &:focus {
      background-color: #565e64;
      border-color: #565e64;
      color: #fff;
      box-shadow: none;
      .p-focus {
        box-shadow: none;
      }
    }
  }
  .p-fileupload-content {
    border: none;
    padding: 0;
  }
  .p-fileupload-file {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border: none;
    .p-badge {
      display: none;
    }
  }
  .p-fileupload-row,
  .p-fileupload-file {
    font-size: 14px;
    color: #8c8c8c;
  }
  input[accept=".pdf"] ~ .p-fileupload-content img {
    display: none;
  }
}
::v-deep(.p-inputtext) {
  &:disabled {
    background-color: #ececec;
  }
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

a {
  text-decoration: none;
}
.border-top-spacer {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem
}

::v-deep(.p-dialog .p-dialog-footer) {
  text-align: center;
}

</style>
