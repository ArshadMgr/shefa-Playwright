import axios from 'axios';

// TODO: Remember to switch lines below as for development only staging is working fine
const baseURL = process.env.VUE_APP_API_URL;
// const baseURL = 'https://staging.backend.shefa.live';

class YaqeenService {
    static getUserProfile(data: Record<string, string>) {
        const url = `${baseURL}/account/yaqeen-user-profile/get-or-create/`;
        return axios.post(url, data);
    }

    static validateUser({identity_type, identifier}: any) {
        const url = `${baseURL}/account/yaqeen-user-profile/validate/${identity_type}/${identifier}`;
        return axios.get(url);
    }
}

export default YaqeenService;
