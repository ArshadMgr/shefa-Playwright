<template>
  <DataTable
    :value="payload"
    :paginator="true"
    :rows="100"
    v-model:filters="filters"
    filterDisplay="menu"
    :globalFilterFields="[
      'id',
      'user',
      'validity',
      'action',
      'comment',
      'date',
    ]"
    responsiveLayout="scroll"
    paginatorTemplate="PrevPageLink PageLinks NextPageLink"
  >
    <Column field="id" header="#"></Column>
    <Column field="user" header="المستخدم"></Column>
    <Column field="validity" header="الصلاحية"></Column>
    <Column field="action" header="البيانات التي يجب تعديلها" v-if="!paymentRequestPage"></Column>
    <Column field="action" header="الاجراء" v-else></Column>
    <Column field="comment" header="التعليق"></Column>
    <Column field="date" header="التاريخ"></Column>
  </DataTable>
</template>

<script>
import {FilterMatchMode} from "primevue/api";

export default {
  props: ["payload", "paymentRequestPage"],
  data() {
    return {
      filters: {
        global: {value: null, matchMode: FilterMatchMode.CONTAINS}
      },
    }
  }
};
</script>
