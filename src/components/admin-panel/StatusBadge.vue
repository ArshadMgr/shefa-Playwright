<template>
  <span :class="'customer-badge status-' + statusKey">
    <span v-if="status === 'approved'">مقبول</span>
    <span v-if="status === 'pending_agreement'">بانتظار مراجعة الاتفاقية</span>
    <span v-if="status === 'pending_approval'">بانتظار الموافقة</span>
    <span v-if="status === 'initial_approval'">قبول مبدئي</span>
    <span v-if="status === 'rejected'">مرفوض</span>
  </span>
</template>

<script>
export default {
  name: "StatusBadge",
  props: ["status", "statusKey"]
};
</script>

<style lang="scss" scoped>
.customer-badge {
  padding: 0.5rem;
  border-radius: 5px;
  font-weight: bold;

  &.status-1,
  &.status-approved {
    background: #CAF1D8;
    color: #136C34;
  }

  &.status-2,
  &.status-pending_agreement {
    background: #FAEDC4;
    color: #816204;
  }

  &.status-3,
  &.status-initial_approval {
    background: #DADAFC;
    color: #363885;
  }

  &.status-4,
  &.status-rejected {
    background: #FFD0CE;
    color: #8C221C;
  }

  &.status-5,
  &.status-pending_approval {
    background: #FEDDC7;
    color: #893F0C;
  }
}
</style>
