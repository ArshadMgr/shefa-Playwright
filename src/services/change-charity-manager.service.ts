import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class ChangeCharityManagerService {

  static assignCharityManager({ national_id, email, mobile_number, gregorian_birthdate, hijri_birthdate, is_submit }: any) {
    const url = `${baseURL}/account/charity-manager/re-assign/`;

    return axios.post(url, { national_id, email, mobile_number, gregorian_birthdate, hijri_birthdate, is_submit });
  }

  static getYaqeenInformation(national_id: any) {
    const url = `${baseURL}/account/yaqeen-user-profile/${national_id}/`;

    return axios.get(url);
  }
}

export default ChangeCharityManagerService;
