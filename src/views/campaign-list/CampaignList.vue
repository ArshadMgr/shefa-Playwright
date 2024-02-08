<template>
  <div class="bg-white">
    <div class="row mx-2 mx-md-4">
      <div class="text-center fw-bold fs-2 py-5" data-cy="campaign-header">الحملات</div>
      <CardBoard type="campaigns" :items="campaigns" @reportCampaign="reportCampaign"/>
    </div>
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>

<script>
import CampaignsService, { CAMPAIGN_TYPES } from "@/services/campaigns.service";
import JwtUtilService from "@/services/jwt.util.service";
import CardBoard from "@/components/home/CardBoard";
import { ToastSeverity } from "primevue/api";
import { useHead } from '@vueuse/head'

export default {
  name: "campaign-list",
  components: { CardBoard },
  setup() {
    useHead({
      title: 'الحملات',
      meta: [
        {
          name: `description`,
          content: 'كمتبرع مسجل في منصة شفاء ويرغب في إنشاء حملة تبرعات وينوي أجرها عن متوفى أو مريض عبر مسارات التبرع المعتمدة في المنصة.',
        },
      ],
    })
  },
  data() {
    return {
      campaigns: [],
      campaignTypes: CAMPAIGN_TYPES,
      isDonor: JwtUtilService.getClientID()?.includes("doner"),
    };
  },
  mounted() {
    this.getCampaigns();
  },
  methods: {
    getCampaigns() {
      CampaignsService.getCampaignCards()
        .then(({ data }) => {
          this.campaigns = data?.result;
          this.campaigns.forEach((campaign) => {
            let remaining_period_in_days = Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            campaign.remaining_period = remaining_period_in_days > 0 ? remaining_period_in_days : 0;
          })
        });
    },
    reportCampaign(id) {
      this.$confirm.require({
        message: `هل أنت متأكد من الإبلاغ عن الحملة؟`,
        acceptLabel: "نعم",
        rejectLabel: "لا",
        accept: () => {
          CampaignsService.reportCampaign(id)
            .then(({ data }) => {
              this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم الإبلاغ عن الحملة بنجاح", life: 3000 });
              this.getCampaigns();
            });
        },
        reject: () => {
          this.$confirm.close();
        }
      });
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

a {
  text-decoration: none;
}
</style>
