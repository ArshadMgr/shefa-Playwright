<template>
  <div class="bg-white">
    <div v-if="cases?.length">
      <div class="row mx-2 mx-md-4">
        <div class="text-center fw-bold fs-2 py-5">قفّلها</div>
        <CardBoard type="markItClose" :items="cases" />
      </div>
      <div class="row mt-5">
        <Paginator :rows="3" :totalRecords="totalItemsCount" @page="onPageChange($event)"></Paginator>
      </div>
    </div>
    <div v-else>
      <div class="text-center fw-bold fs-2 py-5">لا توجد حالات لاقفالها</div>
    </div>
  </div>
</template>

<script>
import CardBoard from "@/components/home/CardBoard";
import CaseService from "@/services/case-service";

export default {
  name: "cases-list",
  components: { CardBoard },
  data() {
    return {
      cases: [],
      queryParams: {
        page: 1,
        page_size: 3
      },
      totalItemsCount: 3
    };
  },
  mounted() {
    this.getCards(this.queryParams);
  },
  methods: {
    getCards(queryParams) {
      CaseService.getMarkCloseCases(queryParams)
          .then(({ data: { result } }) => {
            this.cases = result?.results;
            this.totalItemsCount = result?.total_objects;
          });
    },
    onPageChange(event) {
      this.queryParams.page = event.page + 1;
      this.getCards(this.queryParams);
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
