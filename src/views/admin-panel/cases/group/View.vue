<template>
  <main class="d-flex flex-column">
    <ConfirmDialog appendTo="#app" :draggable="false" />
    <Button
      @click="goBack"
      class="p-button-rounded p-button-secondary mb-4 align-self-end"
      icon="pi pi-times"
      label="إغلاق المجموعة"
    />
    <GeneralDetails :payload="state.group" />
    <form>
      <Card>
        <template #header>
          <strong>تفاصيل المجموعة</strong>
        </template>
        <template #content>
          <BaseSpinner v-if="!state.detailsLoaded"/>
          <Details v-else :payload="state.details" :read-only="true" ref="details" />
          <Divider heading="حالات المجموعة" />
          <BaseSpinner v-if="!state.listLoaded"/>
          <CasesList
            v-else
            :payload="state.list"
            :edit-mode="true"
            :read-only="true"
            ref="casesList"
          />
        </template>
      </Card>
      <BaseSpinner v-if="!state.logsLoaded"/>
      <LogTable v-else :payload="state.logs"/>
    </form>
  </main>
</template>

<script setup>
import GeneralDetails from "@/components/admin-panel/group-case/GeneralDetails.vue";
import Details from "@/components/admin-panel/group-case/Details.vue";
import CasesList from "@/components/admin-panel/group-case/CasesList.vue";
import LogTable from "@/components/admin-panel/group-case/LogTable.vue";
import Divider from "@/components/layout/Divider.vue";
import BaseSpinner from "@/components/layout/BaseSpinner.vue";

import { reactive, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import CaseService from "@/services/case-service";
import { snakeToCamel, formatCreationDate } from "@/helpers/helpers";

const router = useRouter();
const route = useRoute();

const state = reactive({
  cases: [],
  phases: [],
  list: [],
  group: {
    cases: [],
    phases: [],
  },
  details: {
    title: "",
    photo: "",
    story: "",
    url: '',
  },
  logs: [],
  generalDetailsLoaded: false,
  detailsLoaded: false,
  listLoaded: false,
  logsLoaded: false
});

const getGroup = async () => {
  const { data } = await CaseService.getGroup(`${route.params.id}`);
  const resultEntries = Object.entries(data.result);
  const results = {};
  for (let entry of resultEntries) {
    results[snakeToCamel(entry[0])] = entry[1];
  }
  state.group = results;

  state.group.publishedAt = formatCreationDate(state.group.publishedAt);
  state.group.createdBy = "Jerry";

  state.details.title = state.group.title;
  state.details.photo = state.group.photo;
  state.details.story = state.group.story;
  state.details.url = state.group.urls.photo;

  getGroupItems();

  state.generalDetailsLoaded = true;
  state.detailsLoaded = true;
};

const getGroupItems = async () => {
  const { data } = await CaseService.getGroupItems(`${route.params.id}`);
  const resultEntries = Object.entries(data.result);
  const results = {};
  for (let entry of resultEntries) {
    results[snakeToCamel(entry[0])] = entry[1];
  }
  state.list = results.items;
  state.listLoaded = true;
}

const getLogs = async () => {
  const { data } = await CaseService.getGroupLogs(`${route.params.id}`);
  const logs = data.result;
  logs.forEach((log) => {
    let resultEntries = Object.entries(log);
    let results = {};
    for (let entry of resultEntries) {
      results[snakeToCamel(entry[0])] = entry[1];
    }
    results.createdOn = formatCreationDate(results.createdOn);
    results.updatedOn = formatCreationDate(results.updatedOn);
    state.logs.push(results)
  });
  state.logsLoaded = true;
};

const goBack = () => {
  router.push("/admin-panel/cases/group");
};

onMounted(() => {
  Promise.all([getGroup(), getLogs()]);
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
    font-weight: bold;
  }
  .p-card-body {
    padding-top: 0;
    padding-bottom: 0;
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