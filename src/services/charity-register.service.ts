import axios from 'axios';

const baseURL = process.env.VUE_APP_API_URL + '/charity';

class CharityRegisterService {
    static step1(id:any,data:any) {
        const url = `${baseURL}/register/step-1/${id}`;

        return axios.put(url,data);
    }

    static step2(id:any) {
        const url = `${baseURL}/register/step-2/${id}`;

        return axios.get(url);
    }


    static step3(data:any) {
        const url = `${baseURL}/register/step-3`;

        return axios.post(url,data);
    }


    static step4(id:any,data:any) {
        const url = `${baseURL}/register/step-4/${id}`;

        return axios.patch(url,data);
    }
    static getCharityDetails(id:any) {
        const url = `${baseURL}/charity-details/${id}`;

        return axios.get(url);
    }
}

export default CharityRegisterService;
