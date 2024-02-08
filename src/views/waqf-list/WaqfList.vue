<template>
  <div class="bg-white">
    <div v-if="waqfs?.length">
      <div class="row mx-2 mx-md-4">
        <div class="text-center fw-bold fs-2 py-5" data-cy="waqf-header">الأوقاف</div>
        <CardBoard type="endowments" :items="waqfs" />
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
import WaqfService from "@/services/waqf.service";
import {useHead} from "@vueuse/head";

export default {
  name: "waqf-list",
  components: { CardBoard },
  setup() {
    useHead({
      title: 'الأوقاف',
      meta: [
        {
          name: `description`,
          content: 'تتيح المنصة للمتبرع بالتبرع للأوقاف الصحية الخاصة بصندوق الوقف الصحي والتي يصرف ريعها للمرضى و المشاريع الصحية الخيرية.',
        },
      ],
    })
  },
  data() {
    return {
      waqfs: [],
      queryParams: {
        page: 1,
        page_size: 9
      },
      totalItemsCount: 9,
    };
  },
  mounted() {
    this.getWaqfs(this.queryParams);
  },
  methods: {
    getWaqfs(queryParams) {
      WaqfService.getWaqfCard(queryParams)
        .then(({ data }) => {
          this.waqfs = data.results;
          this.waqfs.forEach((waqf) => {
            let remaining_period_in_days = Math.ceil((new Date(waqf.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            waqf.remaining_period = remaining_period_in_days > 0 ? remaining_period_in_days : 0;
          })
          this.totalItemsCount = data?.total_objects;
        });
    },
    onPageChange(event) {
      this.queryParams.page = event.page + 1;
      this.getWaqfs(this.queryParams);
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
