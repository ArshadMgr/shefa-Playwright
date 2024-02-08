<template>
  <section class="my-4">
    <DataTable
      :value="payload"
      :scrollable="true"
      scrollHeight="400px"
      responsiveLayout="scroll"
      class="log-table"
    >
      <template #header> اجراءات المجموعة </template>
      <Column field="id" header="#" :bodyStyle="columnStyle()" />
      <Column field="user" header="المستخدم" :bodyStyle="columnStyle()" />
      <Column
        field="procedureAction"
        header="الاجراء"
        :bodyStyle="columnStyle()"
      />
      <Column field="updatedOn" header="التاريخ" :bodyStyle="columnStyle()" />
    </DataTable>
  </section>
</template>

<script setup>
const props = defineProps({
  payload: {
    type: [Object, Array],
    required: true,
  },
});
const columnStyle = () => {
  return "text-align: right; border: none";
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
::v-deep(.p-datatable) {
  background-color: white;
  border-radius: $border-radius-default;
  padding-bottom: 2rem;
  box-shadow: $box-shadow-card;
  .p-datatable-header {
    background-color: white;
    border-top: none;
    border-bottom: none;
    border-radius: $border-radius-default $border-radius-default 0 0;
  }
  thead th {
    border-bottom: none;
  }

    /* width */
  ::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    border-radius: $border-radius-default;
    background: $color-secondary;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: $color-secondary-hover;
  }
}
</style>