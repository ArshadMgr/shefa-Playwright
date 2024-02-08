<template>
  <Card class="mx-auto">
    <template #content>
      <div class="title fs-4 fw-bold mb-4">
        إنشاء محفظة
      </div>
      <form>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span class="p-float-label">
                  <InputText
                    id="walletName"
                    v-model="walletToAdd.name"
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
                    v-model="walletToAdd.balance"
                    class="w-100"
                  />
                  <label for="balance">المبلغ المضاف</label>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="mt-0">
              <label class="color-secondary">إثبات التوكيل</label>
              <div class="association-logo">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="logo"></div>
                  <div class="logo-name"
                       :title="walletToAdd.proof_of_power_of_attorney?.name || walletToAdd.proof_of_power_of_attorney">
                    {{ walletToAdd.proof_of_power_of_attorney?.name || walletToAdd.proof_of_power_of_attorney }}
                  </div>
                  <div class="d-flex align-items-center">
                    <button
                      class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                      @click.stop="$refs.proof_of_power_of_attorney.$el.click()"
                      type="button">
                      <div class="upload-icon"></div>
                      رفع المرفق
                    </button>
                  </div>
                </div>
              </div>
              <InputText
                ref="proof_of_power_of_attorney"
                class="d-none"
                type="file"
                accept=".pdf, .Doc, Docx"
                @change.stop="fileChange($event, 'proof_of_power_of_attorney')"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mt-0">
              <label class="color-secondary">إثبات الحوالة المالية</label>
              <div class="association-logo">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="logo"></div>
                  <div class="logo-name"
                       :title="walletToAdd.proof_of_wire_transfer?.name || walletToAdd.proof_of_wire_transfer">
                    {{ walletToAdd.proof_of_wire_transfer?.name || walletToAdd.proof_of_wire_transfer }}
                  </div>
                  <div class="d-flex align-items-center">
                    <button
                      class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                      @click.stop="$refs.proof_of_wire_transfer.$el.click()"
                      type="button">
                      <div class="upload-icon"></div>
                      رفع المرفق
                    </button>
                  </div>
                </div>
              </div>
              <InputText
                ref="proof_of_wire_transfer"
                class="d-none"
                type="file"
                accept=".pdf, .Doc, Docx"
                @change.stop="fileChange($event, 'proof_of_wire_transfer')"
              />
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span class="p-float-label">
                  <InputText
                    id="bankName"
                    v-model="walletToAdd.name_of_transferring_bank"
                    class="w-100"
                  />
                  <label for="walletName">اسم البنك المحول منه</label>
                </span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <Dropdown v-model="walletToAdd.zone" :options="regions" optionLabel="name" optionValue="id"
                          placeholder="اختر المنطقة" :filter="true"
                          name="region" id="region" class="w-100" />
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <Dropdown
                  optionLabel="name"
                  optionValue="id"
                  v-model="walletToAdd.disease"
                  class="w-100"
                  :options="diseases"
                  placeholder="أوجه صرف المبلغ"
                  :filter="true"
                />
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
            class="p-button-primary p-button-rounded mx-2 width-180"
            @click.stop="create"
            :disabled="!(walletToAdd.name &&
             walletToAdd.balance &&
             walletToAdd.proof_of_wire_transfer &&
             walletToAdd.name_of_transferring_bank &&
             walletToAdd.disease && !loading)"
            :label="!loading ? 'حفظ' : null"
            :icon="loading ? 'pi pi-spin pi-spinner' : null"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<script>

import WalletService from "@/services/wallet.service";
import { ToastSeverity } from "primevue/api";
import EnumService from "@/services/enum.service";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default {
  name: "Create",
  data() {
    return {
      walletToAdd: {},
      diseases: [],
      regions: [],
      loading: false,
    };
  },
  mounted() {
    this.getRegions();
    this.getDiseases();
  },
  methods: {

    async create() {
      this.loading = true;
      const proof_of_power_of_attorney =
        this.walletToAdd.proof_of_power_of_attorney ? await toBase64(this.walletToAdd.proof_of_power_of_attorney)
          : null;
      const proof_of_wire_transfer =
        this.walletToAdd.proof_of_wire_transfer ? await toBase64(this.walletToAdd.proof_of_wire_transfer)
          : null;

      const payload = {
        balance: this.walletToAdd.balance,
        disease: this.walletToAdd.disease,
        name: this.walletToAdd.name,
        name_of_transferring_bank: this.walletToAdd.name_of_transferring_bank,
        proof_of_wire_transfer: proof_of_wire_transfer,
        ...(proof_of_power_of_attorney && {
          proof_of_power_of_attorney: proof_of_power_of_attorney
        }),
        ...(this.walletToAdd.zone && {
          zone: this.walletToAdd.zone
        })
      };

      WalletService.createWallet(payload)
        .then(({ data: { response } }) => {
          this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم إنشاء المحفظة بنجاح", life: 3000 });
          this.$router.push("/admin-panel/wallets");
        })
        .catch((error) => {
          //this.$toast.add({ severity: ToastSeverity.ERROR, detail: "تم إنشاء المحفظة بنجاح", life: 3000 });
          this.loading = false;
        });
    },
    close() {
      this.$router.push("/admin-panel/wallets");
    },
    getDiseases() {
      WalletService.getDiseases()
        .then(({ data: { result: { case_specialty } } }) => {
          this.diseases = case_specialty;
        });
    },
    getRegions() {
      EnumService.regions()
        .then(({ data: { result } }) => {
          this.regions = result;
        });
    },
    fileChange(event, key) {
      if (
        event &&
        event.target &&
        event.target.files &&
        event.target.files.length
      ) {
        this.walletToAdd[key] = event.target.files[0];
      }
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
