import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class ProjectService {

  static getGroupOfCases({ page, page_size }: any) {
    let url = `${baseURL}/charity/group/cards?page=${page}&page_size=${page_size}`;

    return axios.get(url);
  }
}

export default ProjectService;
