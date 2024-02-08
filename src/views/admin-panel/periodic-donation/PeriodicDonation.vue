<template>
  <ConfirmDialog appendTo="#app" :draggable="false"></ConfirmDialog>
  <section v-if="state.subscriptions.length" v-for="(subscription, index) in state.subscriptions" :key="subscription.id" class="periodic-donation">
    <Card>
      <template #content>
        <div class="periodic-donation__details details" >

          <div class="details__detail details__detail--switch switch" v-if="!state.loading">
            <span class="switch__label">{{state.subscriptions[index].status === 'paused' ? 'تفعيل الخدمة' : 'إيقاف الخدمة'}}</span>
            <InputSwitch class="switch__input"
                         v-model="state.subscriptions[index].status"
                         trueValue="active"
                         falseValue="paused"/>
            <div class="switch__mask" @click="handleSwitch(index, subscription.id)"></div>
          </div>
          <div class="details__detail details__detail--title">
            <span class="title fw-bold">تفعيل التبرع الدوري</span>
            <span class="subtitle">قم بتفعيل خدمة التبرع الدوري وسنقوم باستقطاع مبلغ بشكل دوري من حسابك ليصل إلى فرص التبرع ذات الأولوية تلقائياً.</span>
          </div>
          <div class="details__detail details__detail--period">
            <span class="label">تكرار التبرع</span>
            <span class="content color-primary" v-if="subscription.donation_period === 'monthly'">شهري</span>
            <span class="content color-primary" v-else>يومي</span>
          </div>
          <div class="details__detail details__detail--amount">
            <span class="label">مبلغ التبرع</span>
            <span class="content">
              <span class="content__big">{{ parseFloat(subscription.amount) }}</span>
              <span class="content__currency">ر.س</span>
            </span>
          </div>
          <div class="details__detail details__detail--type">
            <span class="label">نوع التبرع</span>
            <span class="content">{{ subscription.specialty_name ? subscription.specialty_name : 'الأشد حاجة' }}</span>
          </div>
          <div class="details__detail details__detail--counter">
            <span class="label">مرات التبرع</span>
            <span class="content">
              <span class="content__big" v-if="subscription.payments_list?.length">{{ subscription.payments_list?.length }}</span>
              <span class="content__big" v-else>0</span>
            </span>
          </div>
          <div class="details__detail details__detail--date">
            <span class="label">تاريخ الإنشاء</span>
            <span class="content">
              <span class="content__date">{{ toIndianDigits(formatCreationDate(subscription.created_on)) }}</span>
            </span>
          </div>
          <div class="details__detail details__detail--total">
            <span class="label">إجمالي التبرعات</span>
            <span class="content">
              <span class="content__big color-primary">{{ calculateSum(index) }}</span>
              <span class="content__currency color-primary">ر.س</span>
            </span>
          </div>
          <div class="details__detail details__detail--card">
            <span class="label">بطاقة الدفع</span>
            <span class="content color-primary">XXXXXXXXXXXX{{ subscription.l4d_card_number }}</span>
          </div>
        </div>
        <div v-if="state.subscriptions[index].status === 'active'" class="periodic-donation__table mt-3">
          <DataTable :value="state.subscriptions[index].payments_list" paginator :rows="5">
            <template #empty>لا توجد مدفوعات حتى الآن</template>
            <Column field="amount" header="مبلغ التبرع" :sortable="true">
              <template #body="slotProps">
                <span>
                  {{ parseFloat(slotProps.data.amount) }}
                </span>
                <span>ر.س</span>
              </template>
            </Column>
            <Column field="created_on" header="التاريخ" :sortable="true">
              <template #body="slotProps">
                <span>
                  {{ formatCreationDate(slotProps.data.created_on) }}
                </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </section>
  <section v-else class="periodic-donation">
    <Card>
      <template #content>
        <div class="periodic-donation__details details" >
          <div class="details__detail details__detail--switch switch">
            <span class="switch__label">تفعيل الخدمة</span>
            <InputSwitch class="switch__input"
                         trueValue="active"
                         falseValue="paused"/>
            <div class="switch__mask" @click="goToPage"></div>
          </div>
          <div class="details__detail details__detail--title">
            <span class="title fw-bold">تفعيل التبرع الدوري</span>
            <span class="subtitle">قم بتفعيل خدمة التبرع الدوري وسنقوم باستقطاع مبلغ بشكل دوري من حسابك ليصل إلى فرص التبرع ذات الأولوية تلقائياً.</span>
          </div>
        </div>
      </template>
    </Card>
  </section>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useRouter, useRoute } from "vue-router";
import {useToast} from "primevue/usetoast";

import DonationService from "@/services/donation.service";
import { formatCreationDate, toIndianDigits } from "@/helpers/helpers";

import InputSwitch from "primevue/inputswitch";
import JwtUtilService from "@/services/jwt.util.service";

const router = useRouter();
const route = useRoute();
const confirm = useConfirm();
const toast = useToast();

const state = reactive({
  checked: false,
  subscriptions: [],
  loading: true,
  table: [{amount: 150, date: '6/10/2022 1:38 م'}, {amount: 150, date: '6/10/2022 1:38 م'}, {amount: 150, date: '6/10/2022 1:38 م'}],
  isAdmin: JwtUtilService.getClientID()?.includes("admin"),
});

const handleSwitch = (index, id) => {
  if (state.subscriptions[index].status === 'active') {
    deleteSubscription(id, index);
  } else {
    activateSubscription(id, index);
  }
}
const goToPage = () => {
  router.push({ name: 'periodic-donation' });
};
const calculateSum = (index) => {
  return state.subscriptions[index].payments_list?.length
      ? parseInt(state.subscriptions[index].amount) * state.subscriptions[index].payments_list?.length
      : 0;
};

const deleteSubscription = (id, index) => {
  confirm.require({
    header: 'هل أنت متأكد من وقف الخدمة',
    message: 'في حال ايقاف خدمة التبرع الدوري، سيتم حذف البطاقة البنكية المسجلة بالكامل',
    acceptLabel: 'تأكيد',
    rejectLabel: 'إغلاق',
    acceptClass: 'p-button-rounded p-button-primary px-5 mx-2',
    rejectClass: 'p-button-rounded p-button-secondary px-5 mx-2',
    accept: async () => {
      await DonationService.deleteSubscription(id)
          .then(() => {
            state.subscriptions.splice(index, 1);
            toast.add({
              severity: 'success',
              summary: 'تم حذف الخدمة بنجاح',
              life: 3000,
            });
          })
          .catch(() => {
            toast.add({
              severity: 'error',
              summary: 'حدث خطأ أثناء حذف الخدمة',
              life: 3000,
            });
          });
    },
  });
};

const pauseSubscription = (id, index) => {
  confirm.require({
    header: 'هل أنت متأكد من تفعيل الخدمة',
    acceptLabel: 'تأكيد',
    rejectLabel: 'إغلاق',
    acceptClass: 'p-button-rounded p-button-primary px-5 mx-2',
    rejectClass: 'p-button-rounded p-button-secondary px-5 mx-2',
    accept: async () => {
      await DonationService.pauseSubscription(id)
          .then(() => {
            state.subscriptions[index].status = 'paused';
            toast.add({
              severity: 'success',
              summary: 'تم إيقاف الخدمة مؤقتًا بنجاح',
              life: 3000,
            });
          })
    },
  });
};

const activateSubscription = (id, index) => {
  confirm.require({
    header: 'هل أنت متأكد من وقف الخدمة',
    message: 'في حال ايقاف خدمة التبرع الدوري، سيتم حذف البطاقة البنكية المسجلة بالكامل',
    acceptLabel: 'تفعيل الخدمة',
    rejectLabel: 'إغلاق',
    acceptClass: 'p-button-rounded p-button-primary px-5 mx-2',
    rejectClass: 'p-button-rounded p-button-secondary px-5 mx-2',
    accept: async () => {
      await DonationService.activateSubscription(id)
          .then(() => {
            state.subscriptions[index].status = 'active';
            toast.add({
              severity: 'success',
              summary: 'تم تفعيل الخدمة بنجاح',
              life: 3000,
            });
          });
    },
  });
};


const createSubscription = () => {
  router.push('/periodic-donation');
}

const fetchSubscriptions = async () => {
  state.loading = true;
  const { data } = await DonationService.getSubscriptions();
  state.subscriptions = data.result;
  state.subscriptions.forEach((subscription, index) => {
    if (subscription.status === 'paused') {
      DonationService.deleteSubscription(subscription.id).then(
          state.subscriptions.splice(index, 1)
      )
    }
    subscription.checked = subscription.status === 'active';
  });
  state.loading = false;
};

onMounted(async () => {
  if(state.isAdmin) {
    await router.push('/admin-panel/auditors-list?case_status=Admin_All');
    return;
  }
  await fetchSubscriptions()
});
</script>

<style  lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";
@import "@/styles/helpers";
@import "@/styles/components/card";
.periodic-donation {
  margin-bottom: 30px;
  max-width: 1200px;
  &__details {
    padding: 40px 20px 26px 30px;
    border: 1px solid $color-gray-lighter;
    border-radius: $border-radius-default;
  }
  .details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px 5px;
    grid-template-areas:
      "title title switch"
      "period . ."
      "amount counter total"
      "type date card";
    &__detail {
      display: flex;
      flex-direction: column;
      &--switch {
        grid-area: switch;
        justify-self: end;
        align-self: start;
      }
      &--title {
        grid-area: title;
        .title {
          font-size: 20px;
          color: $color-font-dark;
          margin-bottom: 10px;
        }
        .subtitle {
          max-width: 580px;
          font-size: 18px;
          color: $color-font-darker;
        }
      }
      &--period {
        grid-area: period;
      }
      &--amount {
        grid-area: amount;
      }
      &--type {
        grid-area: type;
      }
      &--counter {
        grid-area: counter;
      }
      &--date {
        grid-area: date;
      }
      &--total {
        grid-area: total;
      }
      &--card {
        grid-area: card;
      }
      .label {
        font-size: 18px;
        color: $color-secondary-hover;
        margin-bottom: 5px;
      }
      .content {
        font-size: 20px;
        &__currency {
          font-size: 18px;
        }
        &__big {
          font-size: 32px;
          font-weight: bold;
        }
      }
    }
    .switch {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: end;
      align-items: center;
      width: 100%;
      border-right: 1px solid $color-gray-lighter;
      cursor: pointer;
      &__label {
        margin-left: 15px;
        font-size: 12px;
      }
      &__input {
        transform: rotate(180deg);
        z-index: 2;
      }
      &__mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 50px;
        height: 100%;
        z-index: 100;
      }
    }
  }

  @include respond('md') {
    &__details {
      padding: 20px 10px 16px 15px;
    }
    .details {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px 5px;
      grid-template-areas:
        "switch switch"
        "title title"
        "period ."
        "amount counter"
        "type date"
        "total card";
      &__detail {
        &--switch {
          justify-self: start;
          align-self: start;
        }
        .title {
          font-size: 18px;
        }
        .subtitle {
          font-size: 16px;
        }
        .label {
          margin-bottom: 3px;
          font-size: 14px;
        }
        .content {
          font-size: 14px;
          &__currency {
            font-size: 12px;
          }
          &__big {
            font-size: 24px;
          }
        }
      }
    }
  }
}
::v-deep(.p-card-content) {
  padding: 0;
}
::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: right;
}
::v-deep(.p-datatable .row:last-child) {
  background-color: red;
}
::v-deep(.p-datatable) {
  .p-paginator {
    justify-content: end;
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
    .p-paginator-last,
    .p-paginator-first {
      display: none;
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

::v-deep(.p-dialog .p-dialog-footer) {
  text-align: center;
}
::v-deep(.p-dialog) {
  text-align: center;
  background-color: red !important;
}
</style>

