<template>
  <div class="bg-white p-4 form-cont m-auto rounded-3 mb-5 dir-ltr">
    <form :action="redirectURI" class="paymentWidgets"
          :data-brands="dataBrands"></form>
  </div>

  <DonationSuccessDialog :showModal="showDonationSuccessModal"
                         :data="successDonationData"
                         :donationType="donationType"
                         heading="تم تفعيل خدمة التبرع الدوري بنجاح"
                         message="شكراً لمساهمتك في شفاء , و أجزل الله لك المثوبة والعطاء"
                         buttonLabel="صفحة التبرع الدوري"
                         :periodicDonation="true"
                         :buttonLink="true"
                         v-if="showDonationSuccessModal"
                         @close="showDonationSuccessModal = false"></DonationSuccessDialog>

  <DonationFailureDialog :showModal="showDonationFailureModal"
                         :message="paymentFailureMessage"
                         v-if="showDonationFailureModal"
                         @close="showDonationFailureModal = false"></DonationFailureDialog>
</template>

<script>
import hyperpayMixin from "@/mixins/hyperpayMixin";
import DonationService from "@/services/donation.service";
import { DONATION_TYPE } from "@/services/enum.service";
import DonationSuccessDialog from "@/components/donate/DonationSuccessDialog";
import DonationFailureDialog from "@/components/donate/DonationFailureDialog";

export default {
  mixins: [hyperpayMixin],
  name: "Checkout",
  components: {DonationFailureDialog, DonationSuccessDialog},
  data() {
    return {
      cardType: "credit_card",
      redirectURI: "",
      showDonationSuccessModal: false,
      successDonationData: {},
      donationType: DONATION_TYPE.CASE,
      paymentFailureMessage: "",
      showDonationFailureModal: false,
      resourcePath: "",
      paymentTransactionId: 0,
    }
  },
  mounted() {
    this.cardType = this.$route.query.card_type;
    if (this.$route.query.reference_id) {
      this.isAmbassador = true;
      this.referenceId = this.$route.query.reference_id;
    }

    this.redirectURI = process.env.VUE_APP_FE_URL + `/periodic-donation-checkout`;

    if (this.$route.query.id && this.$route.query.resourcePath) {
      this.resourcePath = this.$route.query.resourcePath;
      this.paymentTransactionId = this.$route.query.id;

      this.checkPaymentStatus();
    }
  },
  methods: {
    checkPaymentStatus() {
      DonationService.getPaymentStatus(this.paymentTransactionId, this.resourcePath)
        .then(({ data: { response } }) => {

          const donationModel = JSON.parse(localStorage.getItem("donationModel"));
          const postBody = {
            to_wallet: JSON.parse(localStorage.getItem("wallet")),
            amount: donationModel.donation_amount,
            donor_mobile_number: donationModel.doner_mobile,
            checkout_id: this.paymentTransactionId,
            on_behalf_donor_name: donationModel.on_behalf_donor_name,
            gifted_to: donationModel.gifted_to === "أخرى" ? donationModel.gifted_to_text : donationModel.gifted_to,
            donor_relation: donationModel.donor_relation === "أخرى" ? donationModel.donor_relation_text : donationModel.donor_relation,
            gifted_mobile_number: donationModel.gifted_mobile_number,
            on_behalf_donation: donationModel.on_behalf_donation,
            link_of_the_donated_on_object: window.location.href
          };

          DonationService.donate(postBody)
            .then(({ data: { result: { donation_success_data } } }) => {
              this.successDonationData = donation_success_data;
              this.donationType = this.successDonationData.type;
              this.showDonationSuccessModal = true;
            })
            .finally(() => {
              localStorage.removeItem("donationModel");
              localStorage.removeItem("wallet");
            });
        })
        .catch(({ response: { data: { errors } } }) => {
          this.paymentFailureMessage = errors[0];
          this.showDonationFailureModal = true;
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.form-cont {
  width: fit-content;
}

.dir-ltr {
  direction: ltr;
}
</style>
