<template>
  <section class="reset-password inner-page pb-5">
    <div class="container">
      <div class="form-cont">
        <div class="header row">
          <div class="col-12 title">تغيير كلمة المرور</div>
        </div>
        <div class="row">
          <form @submit.prevent="resetPassword">
            <div class="form-label-group">
              <span class="p-float-label">
                <Password
                  id="current-password"
                  v-model="model.currentPassword"
                  class="w-100"
                  :feedback="false"
                />
                <label for="current-password">كلمة المرور الحالية</label>
              </span>
            </div>
            <div class="form-label-group mt-4">
              <span class="p-float-label">
                <Password
                  id="new-password"
                  v-model="model.newPassword"
                  class="w-100"
                  :feedback="false"
                />
                <label for="new-password">كلمة المرور الجديدة</label>
              </span>
            </div>
            <div class="form-label-group mt-4">
              <span class="p-float-label">
                <Password
                  id="confirm-password"
                  v-model="model.confirmNewPassword"
                  class="w-100"
                  :feedback="false"
                />
                <label for="confirm-password">تأكيد كلمة المرور</label>
              </span>
            </div>
            <div class="mt-5 d-flex justify-content-between">
              <div class="mx-2 flex-1">
                <Button
                  label="إغلاق"
                  class="p-button-primary p-button-rounded close-btn w-100"
                  @click="close"
                />
              </div>
              <div class="mx-2 flex-1">
                <Button
                  label="تأكيد"
                  class="p-button-primary p-button-rounded w-100"
                  type="submit"
                  :disabled="
                    !model.confirmNewPassword ||
                    !model.newPassword ||
                    !model.currentPassword
                  "
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Password from "primevue/password";
import AuthService from "@/services/auth.service";
import { ToastSeverity } from "primevue/api";
import { STORE_ENUM } from "@/store/store.enums";

export default {
  name: "ResetPassword",
  components: { Password },
  data() {
    return {
      model: {
        currentPassword: null,
        newPassword: null,
        confirmNewPassword: null,
        userType: ""
      }
    };
  },
  mounted() {
    this.userType = this.$route.query.type;
  },
  methods: {
    resetPassword() {
      AuthService.resetPassword({
        old_password: this.model.currentPassword,
        password: this.model.newPassword,
        confirm_password: this.model.confirmNewPassword
      })
        .then(({ data: { result } }) => {
          this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: result, life: 3000 });
          this.signout();
        });
    },
    signout() {
      AuthService.logout()
      .then(() => {
        this.$store
          .dispatch(STORE_ENUM.SIGN_OUT)
          .then(() => {
            let redirectURL = "";
            if (this.userType === "admin") {
              redirectURL = "/login/admin";
            } else {
              redirectURL = "/sign-in?tab=0";
            }
            this.$router.push(redirectURL);
          })
          .catch(() => {
            this.$toast.add({ severity: ToastSeverity.ERROR, detail: "حدث خطأ في النظام", life: 3000 });
          });
      })
    },
    close() {
      this.$router.push('/');
    }
  }
};
</script>

<style lang="scss" scoped>
.reset-password {
  .container {
    padding: 0 0 45px 0;
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

    a {
      text-decoration: none;
    }

    ::v-deep(.close-btn) {
      background: #d9d9d9;
      border-color: #d9d9d9;
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

  .flex-1 {
    flex: 1;
  }
}
</style>
