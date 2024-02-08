import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class HomePageService {

  static getHomePageDetails() {
    const url = `${baseURL}/homepage`;

    return axios.get(url);
  }

  static get = {
    pageSize: 9,
    cases() {
      const url = `${baseURL}/charity/case/cards?page_size=${this.pageSize}`;
      return axios.get(url);
    },
    projects() {
      const url = `${baseURL}/charity/group/cards?page_size=${this.pageSize}`;
      return axios.get(url);
    },
    campaigns() {
      const url = `${baseURL}/campaign/cards?page_size=${this.pageSize}`;
      return axios.get(url);
    },
    endowments() {
      const url = `${baseURL}/waqf/cards?page_size=${this.pageSize}`;
      return axios.get(url);
    },
    markItClose() {
      const url = `${baseURL}/charity/case/section/mark-it-close?page_size=${this.pageSize}`;
      return axios.get(url);
    },
    FilteredCases(queryParams: any, pageNumber: Number) {
      const url = `${baseURL}/charity/case/cards?region=${queryParams.region}&specialty=${queryParams.specialization}&search=${queryParams.caseId}&patient_type=${queryParams.type}&page_size=${this.pageSize}&page=${pageNumber}`;
      return axios.get(url);
    }
  }
}

export default HomePageService;
