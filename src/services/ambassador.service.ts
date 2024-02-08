import axios from 'axios';

const baseURL = process.env.VUE_APP_API_URL;

class AmbassadorService {
  static getList(formData: any) {
    const url = `${baseURL}/ambassador/links/`;
    return axios.get(url, formData);
  }

  static postCaseNumber(formData: any) {
    const url = `${baseURL}/ambassador/links/`;
    return axios.post(url, formData);
  }

  static getLink(id: string) {
    const url = `${baseURL}/ambassador/links/${id}`;
    return axios.get(url);
  }

  static getTopAmbassadors() {
    const url = `${baseURL}/ambassador/top-ambassadors/`;
    return axios.get(url);
  }
}

export default AmbassadorService;
