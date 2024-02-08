import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class DonationsLogService {

  static getLogs({ page, page_size }: any) {
    let url = `${baseURL}/wallet/donor-transactions/?page=${page}&page_size=${page_size}`;

    return axios.get(url);
  }
}

export default DonationsLogService;
