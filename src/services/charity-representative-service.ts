import axios from 'axios';

const baseURL = process.env.VUE_APP_API_URL;

class CharityRepresentativeService {
    static getRepresentativeList() {
        const url = `${baseURL}/account/representative`;
        return axios.get(url);
    }
    static sendRepresentative(formData: any) {
        const url = `${baseURL}/account/representative`;
        return axios.post(url, formData);
    }

    static canAddUser(charityId: string) {
        const url = `${baseURL}/charity/can-add-representative/${charityId}`;
        return axios.get(url);
    }

    static getRepresentative(userId: string) {
        const url = `${baseURL}/account/representative/${userId}`;
        return axios.get(url);
    }

    static activateRepresentative(userId: string, activate: boolean) {
        const url = `${baseURL}/account/representative/${userId}`;
        return axios.patch(url, {
            is_active: activate
        });
    }

    static removeRepresentative(userId: string) {
        const url = `${baseURL}/account/representative/${userId}`;
        return axios.delete(url);
    }

    static preValidateUser(formData: any) {
        const url = `${baseURL}/account/representative/pre-validate/`;
        return axios.post(url, formData);
    }
}

export default CharityRepresentativeService;
