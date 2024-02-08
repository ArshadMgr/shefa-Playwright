import axios from 'axios';
import {convertToFormData} from '@/helpers/ConvertToFormData';
import JWTService from "@/services/jwt.util.service";
import JwtUtilService from "@/services/jwt.util.service";

const baseURL = process.env.VUE_APP_API_URL;

class CaseService {
    static getInsuranceData(identityNumber: string) {
        const url = `${baseURL}/charity/check-insurance/${identityNumber}`;
        return axios.get(url);
    }

    static canAddCase(charityId: string) {
        const url = `${baseURL}/charity/can-create-case/${charityId}`;
        return axios.get(url);
    }
    static getMarkCloseCases() {
        const url = `${baseURL}/charity/case/section/mark-it-close?page=1&page_size=1000`;
        return axios.get(url);
    }

    static getSurveyDropdown() {
        const url = `${baseURL}/charity/case/dropdowns`;
        return axios.get(url);
    }

    static getMedicalDataDropdown() {
        const url = `${baseURL}/charity/cases/medical-data/dropdown`;
        return axios.get(url);
    }

    static createCase(formData: any, phases: any) {
        const url = `${baseURL}/charity/case`;
        return axios.post(url, formData).then(async (response) => {
            const result = response.data.result;
            if(result.split_into_phases) {
                phases.forEach((phase: any) => phase.case = result.id)
                for(let i = 0; i < phases.length; i++) {
                    const phase = phases[i]
                    const formDataPhase = convertToFormData({...phase}, false)
                    await this.createPhase(formDataPhase)
                }
            }
        });
    }

    static getList() {
        const url = `${baseURL}/charity/case`;
        return axios.get(url);
    }

    static getGroupList() {
        const url = `${baseURL}/charity/group`;
        return axios.get(url);
    }

    static getListForGroup() {
        const url = `${baseURL}/charity/case?status=Ready_to_be_Published,Multiple_Phases&grouped=false&publish_on_charity_page=false`;
        return axios.get(url);
    }

    static getCase(id: string) {
        const url = `${baseURL}/charity/case/${id}`;
        return axios.get(url);
    }

    static getCaseDetail(id: string, obj_type: string) {
        let qs=''
        if(obj_type) qs=`?obj_type=${obj_type}`
        const url = `${baseURL}/charity/case/details/${id}${qs}`;
        return axios.get(url);
    }

    static putCaseDetail(id: string, data: any, obj_type = "case") {
        const url = `${baseURL}/charity/case/details/${id}?obj_type=${obj_type}`;
        return axios.put(url,data);
    }

    static editCase(id: string, data: any) {
        const url = `${baseURL}/charity/case/${id}`;
        return axios.patch(url, data);
    }

    static removeCase(id: string) {
        const url = `${baseURL}/charity/case/${id}`;
        return axios.delete(url);
    }

    static preValidateCase(formData: any) {
        const url = `${baseURL}/charity/case/pre-validate/`;
        return axios.post(url, formData);
    }

    static createPhase(formData: any) {
        const url = `${baseURL}/charity/case/phases`;
        return axios.post(url, formData);
    }

    static editPhase(id: string, formData: any) {
        const url = `${baseURL}/charity/case/phases/${id}`;
        return axios.patch(url, formData);
    }

    static getPhases() {
        const url = `${baseURL}/charity/case/phases`;
        return axios.get(url);
    }

    static getPhasesForGroup() {
        const url = `${baseURL}/charity/case/phases?grouped=false`;
        return axios.get(url);
    }

    static getPhase(id: string) {
        const url = `${baseURL}/charity/case/phases/${id}`;
        return axios.get(url);
    }

    static createGroup(formData: any) {
        const url = `${baseURL}/charity/group`;
        return axios.post(url, formData);
    }

    static async saveAndPublishGroup(formData: any) {
        const url = `${baseURL}/charity/group`;
        const response = await axios.post(url, formData);
        const result = response.data.result;
        this.publishGroup(result.id);
    }

    static publishGroup(id: string) {
        const url = `${baseURL}/charity/group/${id}/publish`;
        return axios.patch(url);
    }

    static getGroup(id: string) {
        const url = `${baseURL}/charity/group/${id}`;
        return axios.get(url);
    }

    static getGroupItems(id: string) {
        const url = `${baseURL}/charity/group/${id}/items`;
        return axios.get(url);
    }

    static getGroupStatuses() {
        const url = `${baseURL}/charity/group/context`;
        return axios.get(url);
    }

    static editGroup(id: string, data: any) {
        const url = `${baseURL}/charity/group/${id}/`;
        return axios.patch(url, data);
    }

    static orderGroupItems(id: string, data: any) {
        const url = `${baseURL}/charity/group/${id}/ordering`;
        return axios.post(url, data);
    }

    static createGroupOrder(id: string, formData: any) {
        const url = `${baseURL}/charity/group/${id}/ordering`;
        return axios.post(url, formData);
    }

    static getAuditorsList({search_id, search_case_id, case_status, page, page_size, export_file, order_by, sort, page_of_publish, phase_type}: any) {
        let url = `${baseURL}/charity/case/grid?page=${page}&page_size=${page_size}`;
        url += search_id && search_id !== '' ? `&search_id=${search_id}` : '';
        url += search_case_id && search_case_id !== '' ? `&search_case_id=${search_case_id}` : '';
        url += case_status && !case_status.includes("All") ? `&case_status=${case_status}` : '';
        url += order_by ? `&cass_grid_order_by=${order_by}`: '';
        url += sort ? `&sort=${sort}`: '';
        url += export_file ? `&export=${export_file}`: '';
        url += page_of_publish ? `&page_of_publish=${page_of_publish}`: '';
        url += phase_type ? `&phase_type=${phase_type}`: '';
        return axios.get(url);
    }

    static getAuditorsLogs(id: string) {
        const url = `${baseURL}/charity/case/${id}/auditors-log`;
        return axios.get(url);
    }

    static getCaseLogs(id: string, obj_type: string) {
        const url = `${baseURL}/charity/case/${id}/case-log?obj_type=${obj_type}`;
        return axios.get(url);
    }

    static getGroupLogs(id: string) {
        const url = `${baseURL}/charity/group/${id}/group-log`;
        return axios.get(url);
    }

    static cancelCase(id: string, type: string) {
        const url = `${baseURL}/charity/case/cancel`;
        return axios.put(url, { case: id, type });
    }

    static publishCase(id: string, type: string) {
        const url = `${baseURL}/charity/case/publish-on-charity`;
        return axios.put(url, { case: id, type });
    }

    static reactivateCase(id: string, type: string) {
        const url = `${baseURL}/charity/case/reactivate`;
        return axios.put(url, { case: id, type });
    }

    static async exportExcel(partialUrl: string) {
        try {
            const url = `${baseURL}${partialUrl}`;
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
        } catch (e) {}
    }

    static getCaseCardList({ page, page_size, type, group, specialty, completed }: any) {
        let url = `${baseURL}/charity/case/cards?page=${page}&page_size=${page_size}`;
        url += type && type !== "" ? `&${type}=1` : "";
        url += group ? `&group=${group}`: '';
        url += specialty ? `&specialty=${specialty}`: '';
        url += completed ? `&completed=${completed}`: '';

        return axios.get(url);
    }

    static getFeaturedCases() {
        let url = `${baseURL}/charity/case/featured/list`;

        return axios.get(url);
    }

    static pinUnpinCase(caseId:number, order = 0) {
        let url = `${baseURL}/charity/case/featured/${caseId}`;

        return axios.patch(url, { "order_number": order });
    }
}

export default CaseService;
