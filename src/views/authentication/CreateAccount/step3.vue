<template>
  <div>
    <div class="welcome-container row">
      <div class="col-12 title">البيانات البنكية:</div>
    </div>
    <form class="form-step1 w-100">
      <div class="form-label-group" style="position: relative">
        <div class="mt-4">
          <span class="p-float-label">
            <InputText
              id="iban"
              type="text"
              v-model="payload.iban"
              :disabled="parseInt(payload.number_of_retry, 10) >= 3 || loading"
              @input="ibanChange"
              :class="[
                'w-100',
                {
                  'p-invalid':
                    !!((verify_clicked || submitted) &&
                    (!payload.iban || (payload.iban && !verified_iban))),
                },
              ]"
            />
            <label for="iban">رقم الآيبان</label>
          </span>
        </div>
        <div class="verified-icon" v-if="payload.is_iban_verified">
          <img src="../../../assets/images/verified.png" alt="" />
        </div>
        <div class="verification" v-else>
          <button
            class="btn btn-lg btn-primary btn-block verify-btn"
            type="button"
            @click="verify_iban"
            :disabled="loading"
          >
            تحقق
          </button>
        </div>
      </div>
      <div class="attachment-label mb-4 mt-2">
        {{ payload.bank_name }}
      </div>
      <div class="w-100 mb-4">
        <InputText
          inputId="اسم صاحب الحساب"
          id="account-holder-name"
          placeholder="اسم صاحب الحساب"
          v-model="payload.account_holder_name"
          class="w-100"
        />
        <small id="account-holder-name-help">
          الالتزام بكتابة الاسم كما في شهادة التعريف البنكي
        </small>
      </div>
      <div v-if="!payload.bank_account_attachment">
        <span
          :class="[
            'attachment-container',
            {
              'in-valid':
                submitted && !payload.bank_account_attachment,
            },
          ]"
          @click.stop="$refs.bank_account_attachment.$el.click()"
        >
          <img src="../../../assets/images/attachment.png" alt="attachment" />
          <span class="label">إرفاق تعريف الحساب البنكي</span>
        </span>
        <InputText
          ref="bank_account_attachment"
          class="d-none"
          type="file"
          accept="application/pdf"
          @change="(event) => bankAccountAttachmentChange(event)"
          :disabled="loading"
        />
      </div>
      <div v-else>
        <label class="association-label">إرفاق تعريف الحساب البنكي </label>
        <div
          class="association-logo d-flex align-items-center justify-content-between"
        >
          <div class="d-flex align-items-center">
            <div class="logo-name">
              <div>
                {{ payload.bank_account_attachment.name }}
              </div>
              <div>
                {{ getbytes(payload.bank_account_attachment.size) }}
              </div>
            </div>
          </div>
          <div>
            <button
              class="btn btn-lg btn-primary btn-block cancel-btn"
              @click="$emit('removeFile', 'bank_account_attachment')"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>

      <div class="attachment-label mb-3 mt-3">
        يفضل أن يكون الحساب في بنك الإنماء.
      </div>
    </form>
    <div class="border-container"></div>
    <div class="row">
      <div class="col-lg-6">
        <button
          id="close-btn"
          class="btn btn-lg btn-secondary btn-block close-btn"
          type="button"
          @click.stop="$emit('close')"
        >
          السابق
        </button>
      </div>
      <div class="col-lg-6">
        <button
          id="tracking-btn"
          class="btn btn-lg btn-primary btn-block tracking-btn"
          type="button"
          @click.stop="submit"
          :disabled="loading || !payload.is_iban_verified || !payload.account_holder_name">
          متابعة
        </button>
      </div>
    </div>
  </div>

</template>

<script>
import CharityRegisterService from "../../../services/charity-register.service";

export default {
  name: "create-account-step3",
  props: ["payload"],
  emits: ["close", "next", "fileChange", "removeFile", "verifyIBAN"],
  data() {
    return {
      loading: false,
      error: null,
      verify_clicked: false,
      submitted: false,
    };
  },
  methods: {
    ibanChange() {
      this.payload.is_iban_verified = false;
    },
    bankAccountAttachmentChange(event) {
      const allowed_extention = ["pdf"];
      const file_extention = event.target.files[0].name.split(".").pop();
      if (allowed_extention.includes(file_extention))
        this.$emit("fileChange", event, "bank_account_attachment");
    },
    getbytes(data) {
      const const_term = 1024;
      let KB, MB, GB, TB;

      KB = (data / const_term).toFixed(3);
      MB = (data / const_term ** 2).toFixed(3);
      GB = (data / const_term ** 3).toFixed(3);
      TB = (data / const_term ** 4).toFixed(3);

      if (TB > 0) {
        return TB + "TB";
      } else if (GB > 0) {
        return GB + "GB";
      } else if (MB > 0) {
        return MB + "MB";
      } else if (KB > 0) {
        return KB + "KB";
      }
    },
    submit() {
      this.submitted = true;
      if (
        this.payload.iban &&
        this.verified_iban &&
        this.payload.is_iban_verified &&
        this.payload.bank_account_attachment
      ) {
        this.$emit("next");
      }
    },
    verify_iban() {
      this.verify_clicked = true;

      if (this.payload.iban) {
        this.loading = true;
        this.error = null;
        this.payload.bank_name = null;

        CharityRegisterService.step3({
          id: this.payload.id,
          iban: this.payload.iban,
        })
          .then(({ data: { result } }) => {
            if (result.bank_name) this.payload.bank_name = result.bank_name;
            if (result.number_of_retry)
              this.payload.number_of_retry = result.number_of_retry;
            this.$emit("verifyIBAN");
          })
          .catch((error) => {
            this.error = error;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
  computed: {
    verified_iban() {
      const pattern = /^SA\d{4}[A-Z0-9]{18}$/;
      const result = pattern.test(this.payload.iban);

      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.welcome-container {
  .title {
    font-size: 24px;
    font-weight: bold;
  }
}
.attachment-container {
  cursor: pointer;
  background-color: #d9d9d9;
  border-radius: 25px;
  padding: 0.5rem 1rem;

  .label {
    color: #3f3f3f;
    font-size: 18px;
    font-weight: 500;
    margin-right: 0.5rem;
  }
}

.attachment-container.in-valid {
  border: 1px solid red !important;
  background-color: transparent !important;
}
.border-container {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
}
.tracking-btn {
  display: block;
  margin: 0 auto;
  width: 80%;
  border-radius: 25px;
  padding: 10px;
  background: #12b2aa;
  color: #ffffff;
  border: none;
  font-size: 18px;
}

.tracking-btn:hover {
  background-color: #0e8e88 !important;
  border: none;
}

.close-btn {
  display: block;
  margin: 0 auto;
  width: 80%;
  border-radius: 25px;
  padding: 10px;
  background: #d9d9d9;
  color: #3f3f3f;
  border: none;
  font-size: 18px;
}

.association-logo {
  height: 80px;
  border-radius: 5px;
  border: 1px dashed #d9d9d9;
  padding: 10px 20px;
}

association-label {
  font-size: 12px;
  left: 0rem;
  right: 0.75rem;
  position: relative;
}
.logo-name {
  color: #8c8c8c;
  font-size: 14px;
}

.cancel-btn {
  border-radius: 25px;
  font-size: 14px;
  background-color: #d9d9d9;
  color: #3f3f3f;
  border: none;
}

.cancel-btn:hover {
  background-color: #b2b2b2;
  color: #3f3f3f;
}
</style>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
