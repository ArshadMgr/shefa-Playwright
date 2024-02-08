<template>
  <ConfirmDialog></ConfirmDialog>
  <Button class="p-button p-button-primary p-button-rounded mb-3"
          v-if="state.isCharityManager" @click="goToCreate">
    <span data-cy="add-new-case">
      إضافة حالة جديدة
    </span>
  </Button>
  <BaseTable @getList="getList"
             :cases="state.cases"
             :isAllStatusesSelected="state.isAllStatusesSelected"
             :isReadyToBePublished="state.isReadyToBePublished"
             :statuses="state.statuses"
             :totalItemsCount="state.totalItemsCount"
             :queryParams="state.queryParams"
             :showPin="state.showPin"
             :isReturnedToCharityStatus="state.showRemainingDuration"
             @actionSelected="onActionSelection"
             v-if="state.queryParams"/>
</template>

<script setup>
import {onMounted, reactive, watch} from "vue";
import CaseService from "@/services/case-service";
import {useRouter, useRoute} from "vue-router";
import {useToast} from "primevue/usetoast";
import {CASE_STATUS, PAYMENT_REQUEST_ACTION, PAYMENT_REQUEST_ENUM} from "@/services/enum.service";
import BaseTable from "@/components/layout/BaseTable.vue";
import JwtUtilService from "@/services/jwt.util.service";
import {ToastSeverity} from "primevue/api";
import {useConfirm} from "primevue/useconfirm";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const state = reactive({
  cases: [],
  queryParams: {
    case_status: route.query.case_status || null,
    page: 1,
    page_size: 15,
    export_file: false,
    order_by: null,
    sort: null,
    search_case_id: null,
    search_id: null,
  },
  showPin: false,
  showRemainingDuration: false,
  isCharityManager: JwtUtilService.getClientID()?.includes("charity"),
  isReadyToBePublished: false
});

const getList = async (queryParams) => {
  state.queryParams = {...state.queryParams, ...queryParams};
  const {
    data: {results: {all_statuses_dropdown, cases, file_url, en_remaining_duration_col}, total_objects}
  } = await CaseService.getAuditorsList(state.queryParams);
  if (state.queryParams.export_file) {
    window.open(file_url, "_blank");
  } else {
    state.cases = cases?.map((e) => ({
      id: e.id,
      patient_name: e.patient_name,
      identity_number: e.identity_number,
      created_on: e.created_on,
      age: e.age,
      nationality: e.nationality,
      type: e.type,
      gender: e.gender,
      specialty: e.specialty,
      charity_name: e.charity_name,
      required_amount: e.required_amount,
      collected_amount: e.collected_amount,
      status: e.status?.name,
      color: e.color?.code,
      payment_request: e.payment_request,
      is_read: e.is_read,
      order_number: e.order_number,
      remaining_duration: e.remaining_duration,
      publish_duration: e.publish_duration,
      phases: e?.phases?.map(phase => {
        return {
          ...phase,
          case_id: e.id,
          status: phase.status?.name,
          patient_name: e.patient_name,
          identity_number: e.identity_number,
          created_on: e.created_on,
          age: e.age,
          nationality: e.nationality,
          type: e.type,
          specialty: e.specialty,
          charity_name: e.charity_name,
          color: e.color.code,
          publish_duration: phase.publish_duration,
          audit_user_actions: phase.audit_user_actions.map(action => {
            if (e.status.value === CASE_STATUS.Multiple_Phases) {
              if (
                  action.value === PAYMENT_REQUEST_ACTION.edit_payment_request ||
                  action.value === PAYMENT_REQUEST_ACTION.view_payment_request
              ) {
                const oldUrl = action.url.split('/')[4]
                const strMatch = oldUrl.match(/\d+/g);
                const newUrl = action.url.replace(strMatch, phase.payment_request_id)
                return {
                  ...action,
                  label: action.name,
                  url: newUrl,
                  case: e,
                  command: () => {
                    onActionSelection(e.id, action.type, action.value, action.name);
                  }
                };
              }
            }
            return {
              ...action,
              label: action.name,
              case: e,
              command: () => {
                onActionSelection(phase.id, action.type, action.value, action.name);
              }
            };
          })
        };
      }),

      audit_user_actions: e.audit_user_actions?.map(action => {
        if (
            action.value === PAYMENT_REQUEST_ACTION.edit_payment_request ||
            action.value === PAYMENT_REQUEST_ACTION.view_payment_request
        ) {
          const oldUrl = action.url.split('/')[4]
          const strMatch = oldUrl.match(/\d+/g);
          const newUrl = action.url.replace(strMatch, e.payment_request_id)
          return {
            ...action,
            label: action.name,
            url: newUrl
          };
        }
        return {
          ...action,
          label: action.name
        };
      }),
      has_phases: !!e?.phases?.length,
      show_phases_table: false
    }));

    for (let charityCase of state.cases) {
      if (charityCase.has_phases) {
        for (let phase of charityCase.phases) {
          if (phase.status === PAYMENT_REQUEST_ENUM.Payment_Request_Manager_Cancellation) {
            phase.status = PAYMENT_REQUEST_ENUM.Manager_Cancellation
          }
        }
      }
      if (charityCase.status === PAYMENT_REQUEST_ENUM.Payment_Request_Manager_Cancellation) {
        charityCase.status = PAYMENT_REQUEST_ENUM.Manager_Cancellation
      }
    }
    state.casesDynamic = state.cases;
    state.totalItemsCount = total_objects || 15;
    state.statuses = all_statuses_dropdown;
  }

  state.showRemainingDuration = en_remaining_duration_col;
  state.isReadyToBePublished = state.queryParams.case_status === CASE_STATUS.Ready_to_be_Published;
  state.queryParams.export_file = false;
};

onMounted(() => {
  state.isReadyToBePublished = state.queryParams.case_status === CASE_STATUS.Ready_to_be_Published;
  if (!state.queryParams.case_status) {
    state.isAllStatusesSelected = true;
  } else {
    state.isAllStatusesSelected =
        state.queryParams.case_status === CASE_STATUS.Admin_All ||
        state.queryParams.case_status === CASE_STATUS.Charity_All ||
        state.queryParams.case_status === CASE_STATUS.Marketing_Audit_All ||
        state.queryParams.case_status === CASE_STATUS.Medical_Audit_All ||
        state.queryParams.case_status === CASE_STATUS.Technical_Audit_All ||
        state.queryParams.case_status === CASE_STATUS.Cancelled;
  }

  state.showPin = state.queryParams.case_status === CASE_STATUS.Published;

  getList(state.queryParams);
});

const onActionSelection = ({ id, type, value, message }) => {
  if (value.includes("cancel")) {
    confirm.require({
      message: `هل أنت متأكد من ${message} ؟`,
      acceptLabel: "نعم",
      rejectLabel: "لا",
      accept: () => {
        cancelCase(id, type);
        confirm.close();
      },
      reject: () => {
        confirm.close();
      }
    });
  }
  else if (value.includes("publish")) {
    publishCase(id, type);
  }
  else if (value.includes("reactivate")) {
    confirm.require({
      message: `هل أنت متأكد من إعادة تفعيل الحالة؟`,
      acceptLabel: "نعم",
      rejectLabel: "لا",
      accept: () => {
        reactivateCase(id, type);
        confirm.close();
      },
      reject: () => {
        confirm.close();
      }
    });
  }
};

const goToCreate = async () => {
  const charityId = localStorage.getItem("user_charity_id");
  await CaseService.canAddCase(charityId);
  await router.push("/admin-panel/cases/create");
}

const cancelCase = (id, type) => {
  CaseService.cancelCase(id, type)
      .then(() => {
        toast.add({severity: ToastSeverity.SUCCESS, detail: "تم إلغاء الحالة بنجاح", life: 3000});
      })
      .finally(() => {
        getList(state.queryParams);
      });
};

const publishCase = (id, type) => {
  CaseService.publishCase(id, type)
      .then(() => {
        toast.add({severity: ToastSeverity.SUCCESS, detail: "تم نشر الحالة بنجاح", life: 3000});
      })
      .finally(() => {
        getList(state.queryParams);
      });
};

const reactivateCase = (id, type) => {
  CaseService.reactivateCase(id, type)
      .then(() => {
        toast.add({severity: ToastSeverity.SUCCESS, detail: "تم إعادة تفعيل الحالة بنجاح", life: 3000});
      })
      .finally(() => {
        getList(state.queryParams);
      });
};

watch(
    () => route.query, async (queryParams) => {
      if (queryParams) {
        const {case_status} = queryParams;

        if (case_status) {

          state.queryParams.case_status = case_status;
          state.isReadyToBePublished = state.queryParams.case_status === CASE_STATUS.Ready_to_be_Published;
          state.isAllStatusesSelected = case_status ?
              state.queryParams.case_status === CASE_STATUS.Admin_All ||
              state.queryParams.case_status === CASE_STATUS.Charity_All ||
              state.queryParams.case_status === CASE_STATUS.Marketing_Audit_All ||
              state.queryParams.case_status === CASE_STATUS.Medical_Audit_All ||
              state.queryParams.case_status === CASE_STATUS.Technical_Audit_All ||
              state.queryParams.case_status === CASE_STATUS.Cancelled
              : true;

          state.queryParams.page = 1;

          state.showPin = state.queryParams.case_status === CASE_STATUS.Published;

          delete state.queryParams.phase_type;
          await getList(state.queryParams);
        }
      }
    }
);

</script>

<style lang="scss" scoped>

@import "@/styles/variables";

a {
  text-decoration: none;
  color: white;
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

.min-w-360 {
  min-width: 360px;
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

::v-deep(.p-paginator) {
  .p-paginator-current {
    margin-left: auto;
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
</style>

