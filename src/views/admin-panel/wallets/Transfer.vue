<template>
  <Card class="mx-auto">
    <template #content>
      <div class="title fs-4 fw-bold mb-4">
        تحويل مبلغ من المحفظة
      </div>
      <form>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <Dropdown
                  optionLabel="name"
                  optionValue="id"
                  v-model="transferModel.to_wallet"
                  class="w-100"
                  :options="cases"
                  placeholder="رقم الطلب"
                  :filter="true"
                  @change="getWallet"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span class="p-float-label">
                  <InputNumber
                    id="value"
                    v-model="transferModel.amount"
                    class="w-100"
                  />
                  <label for="value">المبلغ</label>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Button
            label="إغلاق"
            class="p-button-secondary p-button-rounded mx-2 width-180"
            @click="close"
          />
          <Button
            label="تحويل"
            class="p-button-primary p-button-rounded mx-2 width-180"
            @click.stop="transfer"
            :disabled="!transferModel.amount || !transferModel.to_wallet"
          />
          <Button
              @click="fillInput"
              label="اغلاق الحالة"
              class="p-button-primary p-button-rounded mx-2 width-180"
              :disabled="!transferModel.to_wallet"
          />
        </div>
      </form>
    </template>
  </Card>
  <ConfirmDialog></ConfirmDialog>
</template>

<script>
import WalletService from "@/services/wallet.service";
import { ToastSeverity } from "primevue/api";
import CaseService from "@/services/case-service";

export default {
  name: "Transfer",
  data() {
    return {
      transferModel: {
        amount: null,
        from_wallet: Number(this.$route.params.id)
      },
      walletId: this.$route.params.id,
      cases: [],
      currentWallet: null,
    };
  },
  methods: {
    async getWallet(val) {
      const { data } = await WalletService.getWalletDetails(val.value)
      this.currentWallet = data.result
      this.fillInput()
    },
    fillInput () {
      let amount = this.currentWallet.target - this.currentWallet.balance
      this.transferModel.amount = amount > 0 ? amount : 0
    },
    transfer() {
      this.$confirm.require({
        message: `هل أنت متأكد من تحويل المبلغ؟`,
        acceptLabel: "نعم",
        rejectLabel: "لا",
        accept: () => {
          WalletService.transferFromWallet(this.transferModel)
            .then(({ data: { response } }) => {
              this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تمت عملية التحويل بنجاح", life: 3000 });
              this.$router.push("/admin-panel/wallets");
            })
        },
        reject: () => {
          this.$confirm.close();
        }
      });
    },
    close() {
      this.$router.push("/admin-panel/wallets");
    },
    getCases() {
      WalletService.getCases(this.walletId)
      .then(({ data }) => {
        this.cases = data.result;
      })
    }
  },
  mounted() {
    this.getCases();
  }
};
</script>

<style lang="scss" scoped>
:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 16px;
}
</style>
