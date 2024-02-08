<template>
  <Dialog
    :visible="display"
    :closable="false"
    :showHeader="false"
    :modal="true"
    contentStyle="padding:1.5rem 3rem !important"
  >
    <div v-if="parseInt(counter, 10) >= 0">
      <div class="title mb-3 text-end">
        {{ headerMessage }}
      </div>
      <form class="mb-3 d-flex align-items-center justify-content-center">
        <input
          type="number"
          v-model="num1"
          class="digit"
          :min="0"
          :max="9"
          ref="num1"
          @input="this.$refs.num2.focus()"
          @focus="this.num1 = null"
          autofocus
        />
        <input
          type="number"
          v-model="num2"
          class="digit"
          :min="0"
          :max="9"
          ref="num2"
          @input="this.$refs.num3.focus()"
          @keyup.delete="!num2 ? this.$refs.num1.focus() : ''"
          @focus="this.num2 = null"
        />
        <input
          type="number"
          v-model="num3"
          class="digit"
          :min="0"
          :max="9"
          ref="num3"
          @input="this.$refs.num4.focus()"
          @keyup.delete="!num3 ? this.$refs.num2.focus() : ''"
          @focus="this.num3 = null"
        />
        <input
          type="number"
          v-model="num4"
          class="digit"
          :min="0"
          :max="9"
          ref="num4"
          @input="this.$refs.num5.focus()"
          @keyup.delete="!num4 ? this.$refs.num3.focus() : ''"
          @focus="this.num4 = null"
        />
        <input
          type="number"
          v-model="num5"
          class="digit"
          :min="0"
          :max="9"
          ref="num5"
          @input="this.$refs.num6.focus()"
          @keyup.delete="!num5 ? this.$refs.num4.focus() : ''"
          @focus="this.num5 = null"
        />
        <input
          type="number"
          v-model="num6"
          class="digit"
          :min="0"
          :max="9"
          ref="num6"
          @input="this.$refs.num6.blur()"
          @focus="this.num6 = null"
          @keyup.delete="!num6 ? this.$refs.num5.focus() : ''"
        />
      </form>
      <div class="send-again-link-cont d-flex justify-content-center">
        <div class="counter mx-4">0:{{ counter }}</div>
        <div
          class="send-again-link pb-4"
          @click="resendOTP"
          :class="{ 'disabled-link': !isUserAllowedToResend }"
        >
          إرسال رمز التحقق مرة أخرى؟
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-around mt-3">
        <div class="w-50 px-3">
          <Button
            class="p-button-rounded px-5 w-100"
            :class="{'button-loading' : this.loading}"
            @click.stop="submit"
            :disabled="!isOTPFilled || this.loading"
            :label="this.loading && counter !== 0 ? '' : 'تحقق'"
            :icon="this.loading && counter !== 0 ? 'pi pi-spin pi-spinner' : ''"
          />
        </div>
        <div class="w-50 px-3">
          <Button
            class="p-button-rounded verification-btn w-100"
            @click.stop="close"
            label="إغلاق"
          />
        </div>
      </div>
    </div>
    <div v-else class="text-center color-primary">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import OTPService from "@/services/otp.service";
import { ToastSeverity } from "primevue/api";

export default {
  name: "verification-modal",
  components: { Dialog },
  props: [
    "display",
    "headerMessage",
    "mobileNumber",
    "email",
    "requestType",
    "model_id",
    "transferProcess",
    "selectedIds",
    "verificationError"
  ],
  emits: ["onClose"],
  updated() {
    if (!this.display) return;
  },
  unmounted() {
    this.resetData();
  },
  data() {
    return {
      num1: null,
      num2: null,
      num3: null,
      num4: null,
      num5: null,
      num6: null,
      counterInterval: null,
      counter: null,
      numberOfAttemptsPerMinute: 3,
      loading: false
    };
  },
  methods: {
    submit() {
      this.loading = true;
      if (this.numberOfAttemptsPerMinute <= 0) {
        this.$toast.add({
          severity: ToastSeverity.ERROR,
          detail:
            "لقد وصلت إلى الحد الأقصى لعدد المحاولات، يرجى المحاولة بعد انتهاء الفترة المحددة",
          life: 3000,
        });
        return;
      }

      this.numberOfAttemptsPerMinute--;
      if (this.transferProcess) {
        this.$emit("transfer", this.otp)
      } else {
        OTPService.verifyOTP({
          otp: this.otp,
          request_type: this.requestType,
          mobile_number: this.mobileNumber || "",
          email: this.email || "",
          model_id: this.model_id || 0,
        })
            .then(({ data: { result } }) => {
              this.$toast.add({
                severity: ToastSeverity.SUCCESS,
                detail: result,
                life: 3000,
              });
              this.$emit("onClose", { isOtpVerified: true });
              this.loading = false;
              this.resetData();
            })
            .catch(({ response }) => {
              this.loading = false;
              if (response.data) {
                const { errors } = response.data;
                if (
                    errors &&
                    errors.length &&
                    errors.includes("انتهت صلاحية الرمز")
                ) {
                  this.resendOTP();
                }
              }
            });
      }
    },
    resendOTP() {
      this.loading = false;
      this.resetData();
      if (this.transferProcess) {
        const id = this.selectedIds ? this.selectedIds : [this.$route.params.id];
        OTPService.paymentSendOtp(id)
            .then(({ data: { result, status, status_code } }) => {
              if (status === 200 || status_code === 201) {
                this.$toast.add({
                  severity: ToastSeverity.SUCCESS,
                  detail: result[0].message,
                  life: 3000,
                });
                this.counter = 59;
              } else if (status === 202) this.counter = result;
              this.startCounter();
              setTimeout(() => {
                this.$refs.num1.focus();
              });
            })
            .catch(e => {
              this.close()
            })
      } else {
        OTPService.resendOTP({
          request_type: this.requestType,
          mobile_number: this.mobileNumber || "",
          email: this.email || "",
          model_id: this.model_id || 0,
        }).then(({ data: { result, status } }) => {
          if (status === 200) {
            this.$toast.add({
              severity: ToastSeverity.SUCCESS,
              detail: result,
              life: 3000,
            });
            this.counter = 59;
          } else if (status === 202) this.counter = result;
          this.startCounter();
          setTimeout(() => {
            this.$refs.num1.focus();
          });
        });
      }
    },
    startCounter() {
      this.counterInterval = setInterval(() => {
        if (this.counter > 0) this.counter--;
      }, 1000);
    },
    close() {
      this.resetData();
      this.$emit("onClose", { isOtpVerified: false });
    },
    resetData() {
      this.num1 = null;
      this.num2 = null;
      this.num3 = null;
      this.num4 = null;
      this.num5 = null;
      this.num6 = null;

      this.numberOfAttemptsPerMinute = 3;
      this.counter = null;
      clearInterval(this.counterInterval);
    },
  },
  computed: {
    otp() {
      return (
        "" +
        this.num1 +
        this.num2 +
        this.num3 +
        this.num4 +
        this.num5 +
        this.num6
      );
    },
    isOTPFilled() {
      return (
        this.num1 != null &&
        this.num2 != null &&
        this.num3 != null &&
        this.num4 != null &&
        this.num5 != null &&
        this.num6 != null
      );
    },
    isUserAllowedToResend() {
      return this.counter === 0;
    },
  },
  watch: {
    display(val) {
      if (val) {
        this.resendOTP();
      }
    },
    verificationError(val) {
      if (val) {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  color: #3f3f3f;
  font-size: 20px;
}

:deep(.digit) {
  padding: 1.2rem;
  margin: 0.5rem;
  height: 50px;
  width: 50px;
  border-radius: 5px;
  border-color: #d9d9d9;
  border-width: 1px;
}

.send-again-link-cont {
  .send-again-link {
    cursor: pointer;
    text-align: center;
    color: #12b2aa;
    font-size: 12px;
    text-decoration: underline;

    &.disabled-link {
      opacity: 0.4;
      pointer-events: none;
    }
  }

  border-bottom: 1px solid #ececec;
}
.button-loading {
  border-radius: 2rem !important;
}
.verification-btn {
  background-color: #d9d9d9;
  border-color: #d9d9d9;
  border-radius: 25px;
  color: #3f3f3f;
}

.verification-btn:disabled {
  background-color: #ececec;
  border-color: #ececec;
}

.verification-btn:hover {
  background-color: #b2b2b2;
  border-color: #b2b2b2;
  color: #3f3f3f;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
