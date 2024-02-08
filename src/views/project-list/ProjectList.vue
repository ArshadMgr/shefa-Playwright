<template>
  <div class="bg-white">
    <div v-if="groupOfCases?.length">
      <div class="row mx-2 mx-md-4">
        <div class="text-center fw-bold fs-2 py-5">المشاريع</div>
        <CardBoard type="projects" :items="groupOfCases" />
      </div>
      <div class="row mt-5">
        <Paginator :rows="9" :totalRecords="totalItemsCount" @page="onPageChange($event)"></Paginator>
      </div>
    </div>
    <div v-else>
      <div class="text-center fw-bold fs-2 py-5">لا يوجد حالات</div>
    </div>
  </div>
</template>

<script>
import CardBoard from "@/components/home/CardBoard";
import ProjectService from "@/services/project.service";

export default {
  name: "project-list",
  components: { CardBoard },
  data() {
    return {
      groupOfCases: [],
      queryParams: {
        page: 1,
        page_size: 9,
      },
      totalItemsCount: 9,
    };
  },
  mounted() {
    this.getGroupOfCases(this.queryParams);
  },
  methods: {
    getGroupOfCases(queryParams) {
      ProjectService.getGroupOfCases(queryParams)
        .then(({ data }) => {
          this.groupOfCases = data.result?.results;
          this.totalItemsCount = data.result?.total_objects;
        });
    },
    onPageChange(event) {
      this.queryParams.page = event.page + 1;
      this.getGroupOfCases(this.queryParams);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {

  .p-paginator-first,
  .p-paginator-prev,
  .p-paginator-next,
  .p-paginator-last {
    transform: rotate(180deg);
  }
}
</style>
