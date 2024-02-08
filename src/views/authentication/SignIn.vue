<template>
  <section class="login-area inner-page pb-5">
    <div class="container">
      <TabView class="loginform dir-rtl" v-model:activeIndex="activeIndex" @tab-change="onTabChange($event)">
        <TabPanel header="متبرع">
          <div class="form-cont">
            <div class="login-welcome-container row">
              <div class="col-12 title">كن صديقاً لشفاء</div>
              <div class="col-12 sub-title">
                أهلاً بك من جديد لدينا سجل الدخول للإطلاع على تفاصيل حسابك
              </div>
            </div>
            <div class="row">
              <div>
                <iframe :src="donerLoginFrameUrl" class="w-100"></iframe>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="جمعية">
          <div class="form-cont">
            <div class="login-welcome-container row">
              <div class="col-12 title">كن صديقاً لشفاء</div>
              <div class="col-12 sub-title">
                أهلاً بك من جديد لدينا سجل الدخول للإطلاع على تفاصيل حسابك
              </div>
            </div>
            <div class="row">
              <iframe :src="charityLoginFrameUrl" class="w-100"></iframe>
            </div>
            <div class="d-flex text-center justify-content-center">
              <div class="forget-password">
                <router-link to="/forget-password">
                        <span class="forget-password-text"
                        >نسيت كلمة المرور ؟</span
                        >
                </router-link>
              </div>
              <span class="fw-bold px-3">.</span>
              <div class="forget-password">
                <router-link
                  class="forget-password-text"
                  to="/create-account/1?open_verification=false"
                >
                  إضافة جمعية جديدة
                </router-link>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </section>
</template>

<script>
import JwtUtilService from "@/services/jwt.util.service";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";

export default {
  name: "SignIn",
  data() {
    return {
      clientID: "shefa-doner-client",
      activeIndex: parseInt(this.$route.query.tab, 10) || 0,
      donerLoginFrameUrl: '',
      charityLoginFrameUrl: ''
    };
  },
  created() {
    window.addEventListener("message", (event) => {
      if (event.data === "terms-and-conditions") {
        window.open(window.location.origin + '/privacy-policy', "_blank")
      }
    });
  },
  mounted() {
    this.clientID = this.$route.query.tab === '1' ? "shefa-charity-client" : "shefa-doner-client";
    JwtUtilService.setClientID(this.clientID);
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

    this.donerLoginFrameUrl = process.env.VUE_APP_KEYCLOAK_URL + `/realms/shefa-doner/protocol/openid-connect/auth?client_id=shefa-doner-client&redirect_uri=${window.location.origin}/callback&grant_type=authorization_code&response_type=code&scope=openid&code_challenge=${code_challenge}&code_challenge_method=S256`;
    this.charityLoginFrameUrl = process.env.VUE_APP_KEYCLOAK_URL + `/realms/shefa-charity/protocol/openid-connect/auth?client_id=shefa-charity-client&redirect_uri=${window.location.origin}/callback&grant_type=authorization_code&response_type=code&scope=openid&code_challenge=${code_challenge}&code_challenge_method=S256`
  },
  methods: {
    onTabChange(data) {
      this.clientID = data.index === 0 ? "shefa-doner-client" : "shefa-charity-client";
      JwtUtilService.setClientID(this.clientID);
    },
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
    },
  },
  watch: {
    activeIndex(val) {
      if (
        this.$route.query.tab &&
        parseInt(this.$route.query.tab, 10) !== val
      ) {
        this.$router.push(`/sign-in?tab=${val}`);
      }
    },
    $route(val) {
      if (val.query.tab && parseInt(val.query.tab, 10) !== this.activeIndex) {
        this.$router.push(`/sign-in?tab=${parseInt(val.query.tab, 10)}`);
        this.activeIndex = parseInt(val.query.tab, 10);
      }
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
    padding: 0 1rem 2rem;

    iframe {
      height: 365px;
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
        color: #5581c4;
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

  :deep(.p-tabview .p-tabview-nav li) {
    width: 50% !important;
  }

  :deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link) {
    display: block;
    text-align: center;
    font-size: 20px;
  }

  :deep(.p-tabview
      .p-tabview-nav
      li
      .p-tabview-nav-link:not(.p-disabled):focus) {
    box-shadow: none;
  }

  :deep(.p-float-label > label) {
    left: 0 !important;
    right: 0.75rem;
    font-size: 16px;
  }

  :deep(.p-tabview-nav-container) {
    padding: 0 2rem;
  }
}
</style>
