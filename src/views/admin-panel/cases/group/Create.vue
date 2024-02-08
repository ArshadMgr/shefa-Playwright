<template>
  <main>
    <ConfirmDialog appendTo="#app" :draggable="false" />
    <form @submit.prevent="submitGroup()">
      <Card>
        <template #header>
          <strong>تفاصيل المجموعة</strong>
        </template>
        <template #content>
          <Details
            :payload="state.details"
            ref="details"
            @filled="dataFilled"
          />
          <Divider heading="اختيار الحالات التي سيتم نشرها على شفاء" />
          <div v-if="!state.listLoaded" class="text-center color-primary">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          </div>
          <CasesList
            v-else
            :payload="state.cases"
            ref="casesList"
            @casesChosen="casesChosen"
          />
          <Divider />
          <div class="create-group__actions">
            <Button
              type="submit"
              class="p-button p-button-rounded p-button-primary mx-2"
              label="نشر"
              :disabled="saveDisabled"
            />
            <Button
              class="p-button p-button-rounded p-button-outlined mx-2"
              label="حفظ كمسودة"
              @click="submitGroup(true)"
              :disabled="saveDisabled"
            />
            <Button
              class="p-button p-button-rounded p-button-secondary mx-2"
              label="إلغاء"
              @click="cancelCreate"
            />
          </div>
        </template>
      </Card>
    </form>
  </main>
</template>

<script setup>
import Details from "@/components/admin-panel/group-case/Details.vue";
import CasesList from "@/components/admin-panel/group-case/CasesList.vue";
import Divider from "@/components/layout/Divider.vue";

import { reactive, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { ToastSeverity } from "primevue/api";
import CaseService from "@/services/case-service";
import { convertToFormData } from "@/helpers/ConvertToFormData";

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const state = reactive({
  cases: [],
  phases: [],
  group: {
    cases: [],
    phases: [],
  },
  details: {
    title: "",
    photo: "",
    story: "",
  },
  listLoaded: false,
  dataFilled: false,
  casesChosen: false,
});

const getCases = async () => {
  const { data } = await CaseService.getListForGroup();
  const cases = data.result.map((e) => ({
    id: e.id,
    full_name: `${e.first_name} ${e.last_name} ${e.father_name}`,
    identity_number: e.identity_number,
    specialty: e.specialty_name,
    charity: e.charity_name,
    split_into_phases: e.split_into_phases,
    status: e.status
  }));
  state.cases = cases;
  getPhases();
};

const getPhases = async () => {
  const { data } = await CaseService.getPhasesForGroup();
  state.phases = data.result.map((e) => ({
    id: e.id,
    case: e.case,
    specialty: e.specialty_name,
    status: e.status,
    phase_index: e.phase_index
  }));
  state.phases= state.phases.slice().sort(function(a, b) {
        return a.id - b.id;
      });
  mapPhases();
  state.listLoaded = true;
};

const mapPhases = () => {

  state.cases.forEach((item) => {
    let filterPhases = state.phases.filter((phase) => {
      return phase.case === item.id && phase.status === 'Ready_to_be_Published';
    });
    item.phases = [...filterPhases];
  });
};

const details = ref();
const casesList = ref();

const arrayToString = (arr, withObj = false, keyName) => {
  if (withObj) {
    let helperArr = [];
    for (let i = 0; i < arr.length; i++) {
      helperArr.push(arr[i][keyName]);
    }
    return helperArr.join(",");
  } else {
    return arr.join(",");
  }
};

const createGroup = async (service, message) => {
  state.group = {
    ...details.value.state,
  };
  if (casesList.value.state.selectedCases) {
    const cases = [...casesList.value.state.selectedCases];
    state.group.cases = arrayToString(cases, true, "id");
  }
  if (casesList.value.state.selectedPhases) {
    const phases = [...casesList.value.state.selectedPhases];
    state.group.phases = arrayToString(phases, true, "id");
  }

  const groupData = { ...state.group };

  if (casesList.value.state.numberOfSelected < 2) {
    toast.add({
      severity: ToastSeverity.ERROR,
      detail: "يجب تحديد مرحلتين على الأقل",
      closable: false,
      life: 3000,
    });
    return;
  }

  const formData = convertToFormData(groupData, false);

  try {
    await CaseService[service](formData);

    toast.add({
      severity: ToastSeverity.SUCCESS,
      detail: message,
      closable: false,
      life: 3000,
    });

    router.push("/admin-panel/cases/group");
  } catch (e) {}
};

const submitGroup = (draft = false) => {
  confirm.require({
    header: "هل أنت متأكد من حفظ التغييرات؟",
    acceptLabel: "تأكيد",
    rejectLabel: "إغلاق",
    acceptClass: "p-button-rounded p-button-primary px-5 mx-2",
    rejectClass: "p-button-rounded p-button-secondary px-5 mx-2",
    accept: () => {
      if (draft) {
        createGroup("createGroup", "تم حفظ التعديلات بنجاح");
      } else {
        createGroup("saveAndPublishGroup", "تم حفظ التعديلات بنجاح");
      }
    },
    reject: () => {},
  });
};

const cancelCreate = () => {
  router.push("/admin-panel/cases/group");
};

const dataFilled = (filled) => {
  state.dataFilled = filled;
};

const casesChosen = (chosen) => {
  state.casesChosen = chosen;
};

const saveDisabled = computed(() => {
  if(!state.dataFilled) {
    return true;
  } else {
    return false
  }
});

onMounted(() => {
  Promise.all([getCases()]);
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/helpers";
@import "@/styles/components/fileupload";

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
    padding-left: 6rem;
    box-shadow: none;
  }
}

::v-deep(.p-inputtext) {
  &:disabled {
    background-color: #ececec;
  }
}
::v-deep(.input-wrapper) {
  width: 360px;
}
::v-deep(.p-button) {
  min-width: 180px;
}
::v-deep(.p-button-secondary) {
  font-size: 14px;
  background-color: $color-secondary;
  border-color: $color-secondary;
  color: $color-font-dark;
  .pi {
    font-size: 14px;
  }
  &:hover {
    background-color: $color-secondary-hover !important;
    color: $color-font-dark !important;
    border-color: $color-secondary-hover !important;
  }
}
</style>
