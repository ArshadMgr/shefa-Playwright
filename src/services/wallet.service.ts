import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class WalletService {

  static getWallets({ search, page, page_size, order_by, sort, status }: any) {
    let url = `${baseURL}/wallet/get-wallets/?page=${page}&page_size=${page_size}`;
    url += search && search !== "" ? `&search=${search}` : "";
    url += order_by ? `&order_by=${order_by}` : "";
    url += sort ? `&sort=${sort}` : "";
    url += status ? `&filter=${status}` : "";

    return axios.get(url);
  }

  static createWallet(requestBody: any = {}) {
    const url = `${baseURL}/wallet/create/`;

    return axios.post(url, requestBody);
  }

  static getDiseases() {
    const url = `${baseURL}/charity/cases/medical-data/dropdown`;

    return axios.get(url);
  }

  static transferFromWallet(requestBody: any = {}) {
    const url = `${baseURL}/wallet/transfer-money/`;

    return axios.post(url, requestBody);
  }

  static getCases(id = 0, quickDonation = false) {
    let url = `${baseURL}/wallet/get-to-wallets/?`;
    url += quickDonation ? `quick-donation=1` : `source=${id}`;

    return axios.get(url);
  }

  static getAllCasesDonationWalletId() {
    const url = `${baseURL}/wallet/all-cases-wallet/`;

    return axios.get(url);
  }

  static getWalletDetails(id: number) {
    const url = `${baseURL}/wallet/get-wallet/${id}`;

    return axios.get(url);
  }

  static updateWalletDetails(id: number, name: string) {
    const url = `${baseURL}/wallet/update/${id}`;

    return axios.patch(url, { name });
  }

  static getMajorDonors(limit: number = 10, offset: number = 0) {
    const url = `${baseURL}/wallet/top-donors/?limit=${limit}&offset=${offset}`;

    return axios.get(url);
  }

  static deleteWallet(id: number) {
    const url = `${baseURL}/wallet/delete/${id}`;

    return axios.delete(url);
  }
}

export default WalletService;

export enum WALLET_TYPES {
  Most_Urgent = "الأشد حاجة",
  Waqf = "وقف",
  Auto = "تلقائي",
  Custom = "مخصص",
  Internal = "داخلي"
}
