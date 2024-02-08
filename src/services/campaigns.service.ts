import axios from "axios";
import JWTService from "@/services/jwt.util.service";
import JwtUtilService from "@/services/jwt.util.service";

const baseURL = process.env.VUE_APP_API_URL;

class CampaignsService {

  static getCampaigns({ search, page, page_size, order_by, sort, filter_by, specialty, status }: any) {
    let url = `${baseURL}/campaign/?page=${page}&page_size=${page_size}`;
    url += search && search !== "" ? `&search=${search}` : "";
    url += order_by ? `&order_by=${order_by}` : "";
    url += sort ? `&sort=${sort}` : "";
    url += filter_by ? `&filter_by=${filter_by}` : "";
    url += specialty ? `&specialty=${specialty}` : "";
    url += status ? `&status=${status}` : "";

    return axios.get(url);
  }

  static async exportToExcel() {
    let url = `${baseURL}/campaign/export`;
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

  static getCampaignCards() {
    let url = `${baseURL}/campaign/cards`;

    return axios.get(url);
  }

  static createCampaign(requestBody: any = {}) {
    const url = `${baseURL}/campaign/`;

    return axios.post(url, requestBody);
  }

  static getCampaignDetails(id: number) {
    const url = `${baseURL}/campaign/${id}/`;

    return axios.get(url);
  }

  static deleteCampaign(id: number) {
    const url = `${baseURL}/campaign/${id}/`;

    return axios.delete(url);
  }

  static reportCampaign(id: number) {
    const url = `${baseURL}/campaign/report/${id}`;

    return axios.patch(url);
  }
  static unreportCampaign(id: number) {
    const url = `${baseURL}/campaign/report/${id}`;

    return axios.patch(url, {
      "is_reported": false
    });
  }
}

export default CampaignsService;

export enum CAMPAIGN_TYPES {
  Most_Urgent = "المرضى الأشد حاجة",
  Waqf_sehi = "وقف صحي",
}
