import axios from "axios";
import JWTService from "@/services/jwt.util.service";
import JwtUtilService from "@/services/jwt.util.service";

const baseURL = process.env.VUE_APP_API_URL;

class WaqfService {

  static getWaqf({ search, page, page_size, order_by, sort }: any) {
    let url = `${baseURL}/waqf/?page=${page}&page_size=${page_size}`;
    url += search && search !== "" ? `&search=${search}` : "";
    url += order_by ? `&order_by=${order_by}` : "";
    url += sort ? `&sort=${sort}` : "";

    return axios.get(url);
  }

  static async exportToExcel() {
    let url = `${baseURL}/waqf/export`;
    const token = JWTService.getToken(JwtUtilService.access_token_key);
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      },
    });
    // @ts-ignore
    const blob = await res.blob();
    const newBlob = new Blob([blob]);
    const newUrl = window.URL.createObjectURL(newBlob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = newUrl;
    a.download = 'data.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  static getWaqfCard({ page, page_size }: any) {
    let url = `${baseURL}/waqf/cards?page=${page}&page_size=${page_size}`;

    return axios.get(url);
  }

  static createWaqf(requestBody: any = {}) {
    const url = `${baseURL}/waqf/`;

    return axios.post(url, requestBody);
  }

  static getWaqfDetails(id: number) {
    const url = `${baseURL}/waqf/${id}/`;

    return axios.get(url);
  }

  static deleteWaqf(id: number) {
    const url = `${baseURL}/waqf/${id}/`;

    return axios.delete(url);
  }
}

export default WaqfService;
