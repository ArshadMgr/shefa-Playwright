import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class AdminPanelService {
  static getAdminRequests({ search_text, request_status, page, page_Size, export_file, order_by, sort }: any) {
    let url = `${baseURL}/charity/requests?page=${page}&page_size=${page_Size}&search=${search_text}&request_status=${request_status}&export=${export_file}`;
    if (order_by) {
      url += `&order_by=${order_by}&sort=${sort}`;
    }

    return axios.get(url);
  }

  static getAdminRequestDetail(id: any) {
    let url = `${baseURL}/charity/request/${id}/`;

    return axios.get(url);
  }

  static getAdminRequestHistory(id: any) {
    let url = `${baseURL}/charity/request/${id}/history/`;

    return axios.get(url);
  }

  static getAdminRequestAgreements(id: any) {
    let url = `${baseURL}/charity/request/${id}/agreements/`;

    return axios.get(url);
  }

  static generateAdminRequestAgreement(id: any, data: any) {
    let url = `${baseURL}/charity/request/${id}/generate-agreement/`;

    return axios.patch(url, data);
  }

  static patchAdminRequestDetail(id: any, data: any) {
    let url = `${baseURL}/charity/request/${id}/`;

    return axios.patch(url, data);
  }

  static initialApprovalAdminRequestDetail(id: any, data: any) {
    let url = `${baseURL}/charity/request/${id}/initial-approval/`;

    return axios.patch(url, data);
  }

  static approveAdminRequestDetail(id: any, data: any) {
    let url = `${baseURL}/charity/request/${id}/approve/`;

    return axios.patch(url, data);
  }

  static rejectAdminRequestDetail(id: any, data: any) {
    let url = `${baseURL}/charity/request/${id}/reject/`;

    return axios.patch(url, data);
  }

  static getAdminMenu() {
    let url = `${baseURL}/charity/cases/component/sidebar/`;

    return axios.get(url);
  }

  static validateIBAN(requestID: number, iban: number) {
    let url = `${baseURL}/charity/request/${requestID}/validate-iban/`;

    return axios.patch(url, {iban});
  }

  static getUserMenuItems() {
    let url = `${baseURL}/account/menu-items`;

    return axios.get(url);
  }

  static charityDashboard() {
    let url = `${baseURL}/charity/dashboard`;

    return axios.get(url);
  }

  static adminDashboard() {
    let url = `${baseURL}/dashboard`;

    return axios.get(url);
  }

  static getDonorStatistics() {
    let url = `${baseURL}/wallet/donor-statistics/`;

    return axios.get(url);
  }
}

export default AdminPanelService;
