<template>
  <div></div>
</template>

<script>
import { STORE_ENUM } from "@/store/store.enums";
import JwtUtilService from "@/services/jwt.util.service";
import AuthService from "@/services/auth.service";

export default {
  name: "Callback",
  created() {
    const url = this.$route?.fullPath;
    const codeQueryParam = url.split("code=")[1];

    this.exchangeToken(codeQueryParam);
  },
  methods: {
    exchangeToken(code) {

      const realm = JwtUtilService.getClientID().split('-').slice(0,2).join('-');

      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("client_id", JwtUtilService.getClientID());
      params.append("redirect_uri", window.location.origin + "/callback");
      params.append("code", code);
      params.append("scope", "openid");
      params.append("code_verifier", JwtUtilService.getCodeVerifier());

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };

      return this.$store
        .dispatch(STORE_ENUM.TOKEN_EXCHANGE, { params, config, realm })
        .then(() => {

          AuthService.getUserInformation()
            .then(({ data: { result } }) => {
              let redirectURL = "/home";
              if (result.new_register) {
                redirectURL = "/admin-panel/user-profile";
              } else if (result.new_register === false) {
                redirectURL = "/home";
              }
              else {
                if (!result.is_password_set) {
                  redirectURL = `/reset-password?type=${result.realm?.split('-')[1]}`;
                } else if (!result.is_signed_agreement_uploaded && result.realm === 'shefa-charity') {
                  redirectURL = "/upload-signed-agreement";
                }
                else if (!result.is_agreement_approved && result.realm === 'shefa-charity') {
                  redirectURL = "/agreement-approval";
                }
              }
              localStorage.setItem("username", result.user_name);
              if (result.related_charity) {
                localStorage.setItem("user_charity_id", result.related_charity);
              }
              window.parent.location.href = window.parent.location.origin + redirectURL;
            })
          .catch(() => {
            //window.parent.location.href = window.parent.location.origin + "/home";
          });
        })
        .catch(({ message }) => {
          window.parent.location.reload();
        });
    }
  }
};
</script>

<style scoped>

</style>
