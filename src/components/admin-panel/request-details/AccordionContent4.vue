<template>
  <form class="form w-100" v-if="requestDetails && requestDetails.requestInfo">
    <div class="row">
      <div class="col-lg-6">
        <div class="form-label-group mb-2" style="position: relative">
          <div class="mt-4">
            <span class="p-float-label">
              <InputText
                id="iban"
                type="text"
                v-model="requestDetails.requestInfo.iban"
                :class="[
                  'w-100',
                  {
                    'p-invalid':
                      (verify_clicked || submitted) &&
                      !requestDetails.requestInfo.iban,
                  },
                ]"
              />
              <label for="iban">رقم الآيبان</label>
            </span>
          </div>
          <div class="verified-icon" v-if="is_iban_verified">
            <img src="../../../assets/images/verified.png" alt="" />
          </div>
          <div class="verification" v-else>
            <button
              class="btn btn-lg btn-primary btn-block verify-btn"
              @click.stop="validateIBAN"
              type="button">
              تحقق
            </button>
          </div>
        </div>
        <div class="bank-name mb-3" v-if="requestDetails.requestInfo?.bank_name?.length">
          <span>اسم البنك: </span>
          <span class="value">
            {{ requestDetails.requestInfo.bank_name }}
          </span>
        </div>
        <div class="w-100 mb-4">
          <InputText
            inputId="اسم صاحب الحساب"
            id="account-holder-name"
            placeholder="اسم صاحب الحساب"
            v-model="requestDetails.requestInfo.account_holder_name"
            class="w-100"
          />
          <small id="account-holder-name-help">
            الالتزام بكتابة الاسم كما في شهادة التعريف البنكي
          </small>
        </div>
        <div class="mt-4">
          <label>تعريف الحساب البنكي</label>
          <div
            class="association-logo"
          >
            <div class="d-flex align-items-center justify-content-between">
              <div class="logo"></div>
              <div class="logo-name" :title="requestDetails.requestInfo.bank_account_attachment?.name || requestDetails.requestInfo.bank_account_attachment">
                {{ requestDetails.requestInfo.bank_account_attachment?.name || requestDetails.requestInfo.bank_account_attachment }}
              </div>
              <div class="d-flex align-items-center flex-grow-1">
                <button
                  class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center"
                  style="margin-left: 0.5rem"
                  @click.stop="downloadDocument(requestDetails.requestInfo.bank_account_attachment)"
                  type="button">
                  <div class="download-icon"></div>
                  تحميل
                </button>
                <button
                  class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                  @click.stop="$refs.bank_account_attachment.$el.click()"
                  type="button">
                  <div class="upload-icon"></div>
                  تعديل
                </button>
                <InputText
                  ref="bank_account_attachment"
                  class="d-none"
                  type="file"
                  accept="application/pdf"
                  @change.stop="(event) => $emit('fileChange', event, 'bank_account_attachment')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import AdminPanelService from "@/services/admin-panel.service";
import { ToastSeverity } from "primevue/api";
import MediaService from "@/services/media.service";

export default {
  name: "accordian-content-4",
  props: ["requestDetails"],
  emits: ["fileChange"],
  data() {
    return {
      is_iban_verified: true,
      loading: false,
      verify_clicked: false,
      submitted: false,
      firstLoad: true
    };
  },
  methods: {
    validateIBAN() {
      AdminPanelService.validateIBAN(this.requestDetails.requestInfo?.id, this.requestDetails.requestInfo?.iban)
        .then(({ data: { result } }) => {
          this.requestDetails.requestInfo.bank_name = result.bank_name;
        })
        .catch((error) => {
          this.requestDetails.requestInfo.bank_name = "";
          this.$toast.add({ severity: ToastSeverity.ERROR, detail: "رقم الآيبان غير صحيح", life: 3000 });
        });
    },
    downloadDocument(url) {
      MediaService.downloadFile(url);
    }
  },
  watch: {
    "requestDetails.requestInfo.iban": {
      handler() {
        if (!this.firstLoad) {
          this.is_iban_verified = false;
        }
        this.firstLoad = false;
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.bank-name {

  .value {
    color: #191919;
  }
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
  border-radius: 25px;
  font-size: 14px;
  background-color: #d9d9d9;
  color: #3f3f3f;
  border: none;
}

.download-btn:hover,
.modify-btn:hover {
  background-color: #b2b2b2;
  color: #3f3f3f;
}

.inquiry-link {
  font-size: 15px;
  color: #12b2aa;
  font-weight: 500;
  cursor: pointer;
}

.association-logo {
  height: 80px;
  border-radius: 5px;
  border: 1px dashed #d9d9d9;
  padding: 10px 20px;
}

:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 16px;
}

.download-icon,
.upload-icon {
  background: url("../../../assets/icons/download-gray.svg");
  width: 14.5px;
  height: 14.5px;
  margin: 0 0.3rem;
}

.download-icon {
  transform: rotate(180deg);
}

label {
  font-size: 12px;
  color: #6c757d;
}
</style>
