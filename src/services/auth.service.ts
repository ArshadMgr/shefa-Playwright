import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class AuthService {
  static login(model = {}) {
    const url = `${baseURL}/account/donor/register`;

    return axios.post(url, model);
  }

  static sendSigninOTP(mobile_number = 0) {
    const url = `${baseURL}/account/donor/register`;

    return axios.post(url, { mobile_number });
  }

  static donerSignup(mobile_number = 0) {
    const url = `${baseURL}/account/donor/register`;

    return axios.post(url, { mobile_number });
  }

  static sendSignupOTP(mobile_number = 0) {
    const url = `${baseURL}/account/donor/register`;

    return axios.post(url, { mobile_number });
  }

  static tokenExchange({ params = {}, config = {}, realm = "" }) {
    const url = process.env.VUE_APP_KEYCLOAK_URL + `/realms/${realm}/protocol/openid-connect/token`;

    return axios.post(url, params, config);
  }

  static getRefreshToken({ params = {}, config = {}, realm = "" }) {
    const url = process.env.VUE_APP_KEYCLOAK_URL + `/realms/${realm}/protocol/openid-connect/token`;

    return axios.post(url, params, config);
  }

  static getUserInformation() {
    const url = `${baseURL}/account/user-profile`;

    return axios.get(url);
  }

  static forgetPasswordSendEmail(email: string, type: string) {
    let url = `${baseURL}/account/password-reset-request/`;
    url += type ? `?type=${type}`: '';

    return axios.post(url, { email });
  }

  static setPassword(password: string, confirm_password: string, token: string) {
    const url = `${baseURL}/account/password-reset/`;

    return axios.patch(url, { password, confirm_password, token });
  }

  static resetPassword({old_password, password, confirm_password}: any) {
    const url = `${baseURL}/account/set-password/`;

    return axios.patch(url, { old_password, password, confirm_password });
  }

  static logout() {
    const url = `${baseURL}/account/logout`;

    return axios.get(url);
  }

  static getLastAgreement() {
    const url = `${baseURL}/charity/request/last-agreement/`;

    return axios.get(url);
  }

  static uploadSignedAgreement(file: any) {
    const url = `${baseURL}/charity/request/upload-singed-agreement/`;

    return axios.post(url, { file });
  }
}

export default AuthService;
