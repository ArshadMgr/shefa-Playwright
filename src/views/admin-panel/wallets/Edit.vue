<template>
  <Card class="mx-auto">
    <template #content>
      <div class="title fs-4 fw-bold mb-4">
        تعديل المحفظة
      </div>
      <form>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span class="p-float-label">
                  <InputText
                    id="walletName"
                    v-model="walletDetails.name"
                    class="w-100"
                  />
                  <label for="walletName">اسم المحفظة</label>
                </span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span class="p-float-label">
                  <InputNumber
                    id="balance"
                    v-model="walletDetails.balance"
                    class="w-100"
                    :disabled="true"
                  />
                  <label for="balance">المبلغ المضاف</label>
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
            label="تعديل"
            class="p-button-primary p-button-rounded mx-2 width-180"
            @click.stop="submit"
            :disabled="!walletDetails.name"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<script>

import WalletService from "@/services/wallet.service";
import { ToastSeverity } from "primevue/api";

export default {
  name: "Edit",
  data() {
    return {
      walletDetails: {},
      walletId: this.$route.params.id
    };
  },
  mounted() {
    this.getWalletDetails();
  },
  methods: {
    getWalletDetails() {
      WalletService.getWalletDetails(this.walletId)
        .then(({ data: { result } }) => {
          this.walletDetails = result;
        });
    },
    submit() {
      WalletService.updateWalletDetails(this.walletId, this.walletDetails.name)
        .then(({ data: { result } }) => {
          this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم تعديل المعلومات بنجاح", life: 3000 });
        });
    },
    close() {
      this.$router.push("/admin-panel/wallets");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.logo {
  height: 50px;
  flex: 0 0 70px;
  background-color: #d9d9d9;
  margin-left: 1rem;
}

.logo-name {
  color: #8c8c8c;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap !important;
}

.download-btn,
.modify-btn {
  border-radius: 25px;
  font-size: 14px;
  background-color: #d9d9d9;
  color: #3f3f3f;
  border: none;

  &:hover {
    background-color: #b2b2b2;
    color: #3f3f3f;
  }
}

.association-logo {
  height: 80px;
  border-radius: 5px;
  border: 1px dashed #d9d9d9;
  padding: 10px 20px;
}

::v-deep(.p-card) {
  max-width: 500px;
  box-shadow: $box-shadow-card;
  border-radius: $border-radius-default;
  margin-bottom: 8rem;

  .p-card-body {
    box-shadow: none;
  }
}

:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 16px;
}

.color-secondary {
  color: $color-font-lighter;
}
</style>
