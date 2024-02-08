<template>
  <section class="login-area inner-page pb-5">
    <div class="container">
      <div class="loginform dir-rtl">
        <div class="form-cont bg-white">
          <div class="login-welcome-container row">
            <div class="col-12 title">
              كن صديقاً لشفاء
            </div>
            <div class="col-12 sub-title">
              أهلاً بك من جديد لدينا سجل الدخول للإطلاع على تفاصيل حسابك
            </div>
          </div>
          <div class="row">
            <iframe :src="adminLoginFrameUrl" class="w-100"></iframe>
          </div>
          <div class="d-flex text-center justify-content-center">
            <div class="forget-password">
              <router-link to="/forget-password?type=admin">
                        <span class="forget-password-text"
                        >نسيت كلمة المرور ؟</span
                        >
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import InputMask from "primevue/inputmask";
import JwtUtilService from "@/services/jwt.util.service";
import Base64 from "crypto-js/enc-base64";
import sha256 from "crypto-js/sha256";

export default {
  name: "AdminSignin",
  components: { InputMask },
  data() {
    return {
      adminLoginFrameUrl: '',
    };
  },
  mounted() {
    JwtUtilService.removeToken("shefa-admin-client");
    JwtUtilService.setClientID("shefa-admin-client");

    JwtUtilService.removeCodeChallenge();
    JwtUtilService.removeCodeVerifier();
    JwtUtilService.removeIdToken();

    const code_verifier = this.generateRandomString();
    const code_challenge = encodeURI(Base64.stringify(sha256(code_verifier)))
      .replaceAll(/\+/g, "-")
      .replaceAll(/\//g, "_")
      .replaceAll(/=+$/g, "");

    JwtUtilService.setCodeVerifier(code_verifier);
    JwtUtilService.setCodeChallenge(code_challenge);

    this.adminLoginFrameUrl = process.env.VUE_APP_KEYCLOAK_URL + `/realms/shefa-admin/protocol/openid-connect/auth?client_id=shefa-admin-client&redirect_uri=${window.location.origin}/callback&grant_type=authorization_code&response_type=code&scope=openid&code_challenge=${code_challenge}&code_challenge_method=S256`;
  },
  methods: {
    generateRandomString() {
      let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      let charactersLength = characters.length;

      for (let i = 0; i < 44; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.login-area {
  .container {
    padding: 0 0 45px 0;
  }

  .login-welcome-container {
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
    padding: 0 2rem 2rem;

    iframe {
      height: 350px;
    }
  }

  .logo {
    width: 30px;
    margin-left: 10px;
  }

  .loginform {
    display: block;
    max-width: 790px;
    margin: 5px auto;
    direction: rtl;
    text-align: right;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    font-weight: lighter;
    background-image: linear-gradient(rgba(255, 255, 255, 0), #f7f7f7);

    .forget-password {

      a {
        text-decoration: none;
      }

      .forget-password-text {
        color: #5581C4;
        cursor: pointer;

        &:hover {
          color: #345994;
        }
      }
    }

  }

  .login-btn {
    width: 100%;
    border-radius: 8px;
    padding: 10px;
    background: #38c5be;
    border: none;
    font-size: 22px;
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
    right: 0.75rem;
    font-size: 16px;
  }

}
</style>
