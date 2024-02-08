import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class GiftCards {

    static getTypes() {
        let url = `${baseURL}/charity/gift-types`;

        return axios.get(url);
    }

    static send(data: any) {
        let url = `${baseURL}/charity/gift/`;

        return axios.post(url, data);
    }
}

export default GiftCards;
