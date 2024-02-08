<template>
  <section class="forget-password inner-page pb-5">
    <div class="container">
      <div class="form-cont" v-if="!setPasswordPhase">
        <div class="header row" v-if="!hasEmailBeenSent">
          <div class="col-12 title">هل نسيت كلمة المرور؟</div>
          <div class="col-12 sub-title">
            سيتم إرسال رابط إعادة تعيين كلمة المرور على بريدك الإلكتروني
          </div>
        </div>
        <div class="row mt-5">
          <form @submit.prevent="sendEmail()">
            <div class="form-label-group" v-if="!hasEmailBeenSent">
              <div class="mt-3">
                <span class="p-float-label">
                  <InputText
                    id="email"
                    type="email"
                    v-model="email"
                    class="w-100"
                    @blur="checkEmailValidity"
                  />
                  <label for="email">البريد الإلكتروني</label>
                </span>
              </div>
            </div>
            <div
              class="confirmation-msg d-flex flex-column justify-content-center align-items-center pb-5"
              v-if="hasEmailBeenSent"
            >
              <div class="check-circle mb-2">
                <i class="pi pi-check"></i>
              </div>
              <div class="txt">
                <span>
                  تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
                </span>
              </div>
            </div>
            <button
              id="forget"
              class="btn btn-lg btn-primary btn-block forget-password-btn mt-5 mb-3"
              type="submit"
              v-if="!hasEmailBeenSent"
              :disabled="!isValidEmail"
            >
              تعيين كلمة مرور جديدة
            </button>
            <button
              id="back-to-login"
              class="btn btn-lg btn-block back-to-login-btn mt-5 mb-3"
              v-if="hasEmailBeenSent"
            >
              <router-link to="/sign-in?tab=1">
                <div>العودة إلى تسجيل الدخول</div>
              </router-link>
            </button>
          </form>
        </div>
      </div>
      <div class="form-cont" v-if="setPasswordPhase">
        <div class="header row" v-if="!newPasswordChangedSuccessfully">
          <div class="col-12 title">تغيير كلمة المرور</div>
        </div>
        <div class="row" v-if="!newPasswordChangedSuccessfully">
          <form @submit.prevent="sendNewPassword()">
            <div class="form-label-group mt-4">
              <span class="p-float-label">
                <Password
                  id="new-password"
                  v-model="password"
                  class="w-100"
                  :feedback="false"
                />
                <label for="new-password">كلمة المرور الجديدة</label>
              </span>
            </div>
            <div class="form-label-group mt-5">
              <span class="p-float-label">
                <Password
                  id="confirm-password"
                  v-model="confirmPassword"
                  class="w-100"
                  :feedback="false"
                />
                <label for="confirm-password">تأكيد كلمة المرور</label>
              </span>
            </div>
            <div class="d-flex mt-5">
              <button
                id="close"
                class="btn btn-lg btn-block back-to-login-btn ms-4"
                type="button"
              >
                <router-link to="/sign-in?tab=1">
                  <div>إغلاق</div>
                </router-link>
              </button>
              <button
                id="confirm"
                class="btn btn-lg btn-primary btn-block forget-password-btn"
                type="submit"
                :disabled="!(password && confirmPassword) || (password?.length && confirmPassword?.length && password !== confirmPassword)"
              >
                تأكيد
              </button>
            </div>
          </form>
        </div>
        <div class="confirmation-msg d-flex flex-column justify-content-center align-items-center pb-5"
          v-else>
          <div class="check-circle mb-2">
            <i class="pi pi-check"></i>
          </div>
          <div class="txt">
            <span>
              تم تغيير كلمة المرور بنجاح
            </span>
          </div>
        </div>
        <button
          id="back-to-login-1"
          class="btn btn-lg btn-block back-to-login-btn mt-5 mb-3"
          v-if="newPasswordChangedSuccessfully"
        >
          <router-link to="/sign-in?tab=1">
            <div>العودة إلى تسجيل الدخول</div>
          </router-link>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import AuthService from "@/services/auth.service";
import { ToastSeverity } from "primevue/api";
import Password from "primevue/password";

export default {
  name: "ForgetPassword",
  components: { Password },
  data() {
    return {
      email: null,
      hasEmailBeenSent: false,
      setPasswordPhase: "",
      password: "",
      confirmPassword: "",
      isValidEmail: false,
      newPasswordChangedSuccessfully: false,
      userType: ''
    };
  },
  methods: {
    sendEmail() {
      if (!this.isValidEmail) {
        return;
      }
      AuthService.forgetPasswordSendEmail(this.email.toLowerCase(), this.userType)
        .then(({ data: { result } }) => {
          this.hasEmailBeenSent = true;
          this.$toast.add({
            severity: ToastSeverity.SUCCESS,
            detail: "تم إرسال رابط إعادة تعيين كلمة المرور على بريدك الإلكتروني",
            life: 3000
          });
        });
    },
    sendNewPassword() {
      AuthService.setPassword(this.password, this.confirmPassword, this.$route.query?.token)
        .then(({ data: { result } }) => {
          this.newPasswordChangedSuccessfully = true;
        });
    },
    checkEmailValidity() {
      if (!this.email) {
        this.isValidEmail = false;
        return;
      }
      this.isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email);
    }
  },
  mounted() {
    this.setPasswordPhase = this.$route.query?.token;
    this.userType = this.$route.query?.type;
  }
};
</script>

<style lang="scss" scoped>
.forget-password {
  .container {
    padding: 0 0 45px 0;
  }

  .no-account {
    color: #4777ba;

    .create-account-txt {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .header {
    padding-bottom: 15px;
    margin-bottom: 15px;
    font-size: 18px;

    .title {
      margin-bottom: 10px;
      font-size: 28px;
      font-weight: bold;
    }
  }

  .form-cont {
    display: block;
    padding: 1px 108px 94px 108px;
    margin: 5px auto;
    width: 50%;
    direction: rtl;
    text-align: right;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    font-weight: lighter;
    background-image: linear-gradient(rgba(255, 255, 255, 0), #f7f7f7);

    ::v-deep(.form-label-group) {
      .p-inputtext {
        width: 100%;
      }
    }

    .forget-password {
      a {
        color: #3f3f3f;
        text-decoration: none;
      }

      .forget-password-text {
        color: #5581c4;
        cursor: pointer;

        &:hover {
          color: #345994;
        }
      }
    }

    .confirmation-msg {
      border-bottom: 2px solid #ececec;

      .check-circle {
        background: #e4f8f0;
        padding: 2rem;
        border-radius: 50%;

        i {
          color: #1ea97c;
          font-size: 35px;
        }
      }

      .txt {
        text-align: center;
        color: #1ea97c;
        font-size: 25px;
      }
    }
  }

  .logo {
    width: 30px;
    margin-left: 10px;
  }

  .forget-password-btn {
    width: 100%;
    border-radius: 25px;
    padding: 10px;
    background: #38c5be;
    border: none;
    font-size: 22px;
  }

  .back-to-login-btn {
    width: 100%;
    border-radius: 25px;
    padding: 10px;
    background: #d9d9d9;
    border: none;
    font-size: 22px;

    a {
      text-decoration: none;
      color: black;
    }
  }

  .btn:not(:disabled):not(.disabled) {
    cursor: pointer;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
  }

  .dir-rtl {
    direction: rtl;
  }

  :deep(.p-float-label > label) {
    left: 0 !important;
    right: 0.55rem;
    font-size: 16px;
  }
}
</style>
