import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class MultiRoleService {
  static getRoles() {
    const url = `${baseURL}/account/multi-roles`;

    return axios.get(url);
  }

  static changeRole(role: string) {
    const url = `${baseURL}/account/multi-roles`;

    return axios.put(url, { active_role: role });
  }
}

export default MultiRoleService;
