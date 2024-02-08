import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class PartnershipService {
  static sendPartnershipRequest(requestBody: any = {}) {
    const url = `${baseURL}/partnership-request`;

    return axios.post(url, requestBody);
  }
}

export default PartnershipService;