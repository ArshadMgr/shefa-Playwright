import axios from 'axios';

const baseURL = process.env.VUE_APP_API_URL;

class UserProfileService {

  static getProfileInfo() {
    const url = `${baseURL}/account/donor/profile/`;

    return axios.get(url);
  }

  static updateProfileInfo(model = {}) {
    const url = `${baseURL}/account/donor/profile/`;

    return axios.patch(url, model);
  }

  static getCharityManagerInfo() {
    const url = `${baseURL}/account/charity-manager/`;

    return axios.get(url);
  }

  static updateCharityManagerInfo({ mobile_number, email }: any) {
    const url = `${baseURL}/account/charity-manager/`;

    return axios.patch(url, { mobile_number, email });
  }
}

export default UserProfileService;
