<template>
  <Card class="mx-auto">
    <template #content>
      <div class="title fs-4 fw-bold mb-4">
        رفع فواتير الطلب
      </div>
      <form>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span data-cy="invoice-number">
                  <label for="PaymentRequestInvoiceNumber">رقم الفاتورة</label>
                  <InputNumber
                      id="PaymentRequestInvoiceNumber"
                      v-model="PaymentRequestToAdd.invoice_number"
                      class="w-100"
                      :useGrouping="false"
                      placeholder="رقم الفاتورة"
                  />
                </span>
              </div>
            </div>
          </div>
          <div class="col-md-6 visually-hidden">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span>
                <label for="PaymentRequestCharityCase">الحالة</label>
                  <InputNumber hidden="hidden"
                               id="PaymentRequestCharityCase"
                               v-model="PaymentRequestToAdd.charity_case"
                               class="w-100"
                               placeholder="الحالة"
                  />
                </span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span data-cy="amount">
                  <label for="PaymentRequestAmount">مبلغ العلاج</label>
                  <InputNumber
                      id="PaymentRequestAmount"
                      v-model="PaymentRequestToAdd.amount"
                      class="w-100"
                      placeholder="مبلغ العلاج"
                  />
                </span>
                <p v-if="error">
                  <p class="text-danger">{{ error }}</p>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="row">
              <div class="mt-4" data-cy="invoice-file">
                <label for="treatment_invoice">فاتورة العلاج</label>
                <div class="association-logo">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="logo"></div>
                    <div class="logo-name"
                         :title="PaymentRequestToAdd?.attachment?.name || PaymentRequestToAdd?.attachment">
                      {{ PaymentRequestToAdd?.attachment?.name || PaymentRequestToAdd?.attachment }}
                    </div>
                    <div class="d-flex align-items-center">
                      <button
                          class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                          @click.stop="$refs.attachment.$el.click()"
                          type="button">
                        <div class="upload-icon"></div>
                        رفع المرفق
                      </button>
                    </div>
                  </div>
                </div>
                <InputText
                    ref="attachment"
                    id="treatment_invoice"
                    class="d-none"
                    type="file"
                    accept=".pdf"
                    @change.stop="fileChange($event, 'attachment')"
                />
              </div>
            </div>
            <div class="row">
              <div>
                  <span class="px-1 notes-size">
                    <li>أن لا يكون تاريخ الفاتورة قبل تاريخ إضافة المريض للمنصة</li>
                    <li>وضوح معلومات المريض</li>
                    <li>بيان "وصف" الفاتورة</li>
                    <li>وضوح المبلغ الإجمالي مع الضريبة</li>
                    <li>وجود الختم</li>
                  </span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span data-cy="notes">
                  <label for="notes">ملاحظات</label>
                  <Textarea v-model="PaymentRequestToAdd.description"
                            :autoResize="true"
                            rows="3"
                            class="w-100"
                            id="notes"/>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="row ">
          <div class="col-md-6">
            <div class="form-label-group mb-3" data-cy="hospital">
                <span>
                  <label for="PaymentRequestHospital">جهة العلاج</label>
                  <Dropdown
                      class="w-100"
                      optionLabel="name"
                      optionValue="id"
                      v-model="PaymentRequestToAdd.hospital"
                      :options="hospitals"
                      placeholder="جهة العلاج"
                      filter
                      id="PaymentRequestHospital"/>
                </span>
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
              label="إرسال"
              class="p-button-primary p-button-rounded mx-2 width-180"
              @click.stop="submit"
              :disabled="!canSubmit"
              data-cy="submit"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<script>

import PaymentRequestService from "@/services/paymentRequest.service";
import {ToastSeverity} from "primevue/api";
import Textarea from "primevue/textarea";
import EnumService from "@/services/enum.service";
import CaseService from "@/services/case-service";

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

export default {
  name: "Create",
  components: {Textarea},
  data() {
    return {
      PaymentRequestToAdd: {},
      attachmentData: {},
      hospitals: [],
      error: null,
      charity_case: {},
      phase: {},
    };
  },
  mounted() {
    this.enum_hospitals();
    this.getPhaseOrCase();
  },
  methods: {
    async submit() {
      this.PaymentRequestToAdd.attachment = this.PaymentRequestToAdd.attachment ? await toBase64(this.PaymentRequestToAdd.attachment) : "";
      if (!this.$route.fullPath.includes("phase")) {
        this.PaymentRequestToAdd.charity_case = this.$router.currentRoute._value.params.id;
        this.PaymentRequestToAdd.phase = null;
      } else {
        await CaseService.getPhase(`${this.$router.currentRoute._value.params.id}`).then((phase) => {
          this.PaymentRequestToAdd.charity_case = phase.data.result.case;
        });
        this.PaymentRequestToAdd.phase = this.$router.currentRoute._value.params.id;
      }
      PaymentRequestService.createPaymentRequest(this.PaymentRequestToAdd)
          .then((data) => {
            this.$toast.add({severity: ToastSeverity.SUCCESS, detail: "تم رفع فواتير الطلب بنجاح", life: 3000});
            this.$router.push("/admin-panel/auditors-list?case_status=Donation_Completed");
          });
    },
    close() {
      this.$router.push("/admin-panel/auditors-list?case_status=Donation_Completed");
    },
    fileChange(event, key) {
      if (
          event &&
          event.target &&
          event.target.files &&
          event.target.files.length
      ) {
        this.PaymentRequestToAdd[key] = event.target.files[0];
      }
    },
    enum_hospitals() {
      this.loading = true;
      this.error = null;

      EnumService.hospitals()
          .then(({data}) => {
            if (data.result.length) this.hospitals = data.result;
          })
          .catch((error) => {
            this.error = error;
          })
          .finally(() => {
            this.loading = false;
          });
    },
    getPhaseOrCase() {
      if (!this.$route.fullPath.includes("phase")) {
        CaseService.getCase(`${this.$router.currentRoute._value.params.id}`).then((charityCase) => {
          this.charity_case = charityCase.data.result;
        });
      } else {
        CaseService.getPhase(`${this.$router.currentRoute._value.params.id}`).then((phase) => {
          this.phase = phase.data.result;
        });
      }
    },
  },
  computed: {
    canSubmit() {
      if (!this.$route.fullPath.includes("phase")) {
        if (parseInt(this.charity_case.amount) < this.PaymentRequestToAdd.amount) {
          this.error = "المبلغ اكبر من قيمة التعميد.";
          return false;
        } else {
          this.error = null;
        }
      } else {
        if (parseInt(this.phase.amount) < this.PaymentRequestToAdd.amount) {
          this.error = "المبلغ اكبر من قيمة التعميد.";
          return false;
        } else {
          this.error = null;
        }
      }
      return this.PaymentRequestToAdd.invoice_number &&
          this.PaymentRequestToAdd.amount &&
        (this.PaymentRequestToAdd?.attachment?.name || this.PaymentRequestToAdd?.attachment) &&
          this.PaymentRequestToAdd.hospital;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.notes-size {
  font-size: small;
}

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
  min-width: 120px;
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

.upload-icon {
  background: url("../../../assets/icons/download-gray.svg");
  width: 14.5px;
  height: 14.5px;
  margin: 0 0.3rem;
}
</style>
