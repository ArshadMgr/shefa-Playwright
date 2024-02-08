<template>
  <div class="bg-white">
    <div v-if="cases?.length">
      <div class="row mx-2 mx-md-4">
        <div class="text-center fw-bold fs-2 py-5" data-cy="cases-list-header">الحالات</div>
        <CardBoard type="cases" :items="cases" />
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
import CaseService from "@/services/case-service";
import { useHead } from '@vueuse/head'

export default {
  name: "cases-list",
  components: {CardBoard},
  setup() {
    useHead({
      title: 'الحالات',
      meta: [
        {
          name: `description`,
          content: 'كن عونًا لهم بعطائك',
        },
      ],
    })
  },
  data() {
    return {
      cases: [],
      queryParams: {
        page: 1,
        page_size: 9,
        group: null,
        specialty: null
      },
      totalItemsCount: 9
    };
  },
  mounted() {
    if (this.$route.query.group) {
      this.queryParams.group = this.$route.query.group;
    }
    if (this.$route.query.specialty) {
      this.queryParams.specialty = this.$route.query.specialty;
    }
    this.getCards(this.queryParams);
  },
  methods: {
    getCards(queryParams) {
      CaseService.getCaseCardList(queryParams)
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
