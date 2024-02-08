import JwtUtilService from "@/services/jwt.util.service";
import { STORE_ENUM } from "@/store/store.enums";
import AuthService from "@/services/auth.service";

export default {
  state: {
    authenticated: !!JwtUtilService.getToken(JwtUtilService.access_token_key),
    idToken: JwtUtilService.getToken(JwtUtilService.id_token_key),
    username: "",
  },
  getters: {
    isAuthenticated(state: any) {
      return state.authenticated;
    }
  },
  actions: {
    [STORE_ENUM.TOKEN_EXCHANGE]({ commit }: any, payload: any) {
      return new Promise((resolve, reject) => {
        AuthService.tokenExchange(payload)
          .then(({ data }) => {
            commit(STORE_ENUM.AUTHENTICATE, data);

            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    [STORE_ENUM.SIGN_OUT]({ commit }: any) {
      commit(STORE_ENUM.SIGN_OUT);
    },
    [STORE_ENUM.USERNAME]({ commit }: any, payload: any) {
      commit(STORE_ENUM.USERNAME, payload);
    },
    [STORE_ENUM.TOKEN_REFRESH]({ commit }: any) {

      const realm = JwtUtilService.getClientID()?.split("-").slice(0, 2).join("-");

      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", JwtUtilService.getToken(JwtUtilService.refresh_token_key) || "");
      params.append("client_id", JwtUtilService.getClientID() || "");

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };

      const payload = { params, config, realm };
      return new Promise((resolve, reject) => {
        AuthService.getRefreshToken(payload)
          .then(({ data }) => {
            commit(STORE_ENUM.AUTHENTICATE, data);

            resolve(data);
          })
          .catch(({ response: {data} }) => {
            reject(data);
          });
      });
    }
  },
  mutations: {
    [STORE_ENUM.AUTHENTICATE](state: any, { access_token, refresh_token, id_token }: any) {
      state.authenticated = true;

      JwtUtilService.setToken(JwtUtilService.access_token_key, access_token);
      JwtUtilService.setToken(JwtUtilService.refresh_token_key, refresh_token);
      JwtUtilService.setToken(JwtUtilService.id_token_key, id_token);
    },
    [STORE_ENUM.SIGN_OUT](state: any) {
      state.authenticated = false;

      JwtUtilService.removeToken(JwtUtilService.access_token_key);
      JwtUtilService.removeToken(JwtUtilService.id_token_key);
      JwtUtilService.removeToken(JwtUtilService.refresh_token_key);
    },
    [STORE_ENUM.USERNAME](state: any, username: string) {
      state.username = username;
    }
  }
};
