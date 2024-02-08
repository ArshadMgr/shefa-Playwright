<template>
  <section>
    <Button @click="goToCreate" class="p-button p-button-primary p-button-rounded mb-4"
      >نشر مجموعة من الحالات كحالة واحدة</Button>
    <GroupList v-if="state.listLoaded" :statuses="state.statuses" :payload="state.groups" @changedGroupVisibility="getGroupList"></GroupList>
    <BaseSpinner v-else/>
  </section>
</template>

<script setup>
import {reactive} from 'vue'
import CaseService from "@/services/case-service";
import {useRouter} from "vue-router";
import GroupList from "@/components/admin-panel/group-case/GroupList";
import BaseSpinner from "@/components/layout/BaseSpinner";

const router = useRouter()

const state = reactive({
  groups: [],
  statuses: [],
  listLoaded: false
})

const goToCreate = () => {
  router.push('/admin-panel/cases/group/create')
}

const getGroupList = async () => {
  const { data: groupList } = await CaseService.getGroupList();

  state.groups = groupList.result
  state.listLoaded = true;
};

const getGroupStatuses = async () => {
  const { data } = await CaseService.getGroupStatuses()
  state.statuses = data.result.statuses
}

getGroupList()
getGroupStatuses()
</script>
