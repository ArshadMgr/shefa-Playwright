import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL + "/invoicing";
const hyperSplitURL = process.env.VUE_APP_API_URL + "/payment/hypersplit";

class PaymentRequestService {

  static getPaymentRequest(id: any) {
    const url = `${baseURL}/payment-request/${id}/`;
    return axios.get(url);
  }

  static getPaymentRequestList({search_id, search_case_id, search_invoice_no, case_status, page, page_size, export_file, order_by, sort}: any) {
    let url = `${baseURL}/payment-request/grid?page=${page}&page_size=${page_size}`;
    url += search_id && search_id !== '' ? `&search_id=${search_id}` : '';
    url += search_case_id && search_case_id !== '' ? `&search_case_id=${search_case_id}` : '';
    url += search_invoice_no && search_invoice_no !== '' ? `&search_invoice_no=${search_invoice_no}` : '';
    url += case_status && !case_status.includes("All") ? `&case_status=${case_status}` : '';
    url += order_by ? `&order_by=${order_by}` : '';
    url += sort ? `&sort=${sort}` : '';
    url += export_file ? `&export=${export_file}` : '';
    return axios.get(url);
  }

  static createPaymentRequest(requestBody: any = {}) {
    const url = `${baseURL}/payment_request_create_apiview`;
    return axios.post(url, requestBody);
  }

  static updatePaymentRequest(requestBody: any = {}, id: any) {
    const url = `${baseURL}/payment-request/${id}/update`;
    return axios.patch(url, requestBody);
  }

  static getPaymentRequestCharityLog(id: any) {
    const url = `${baseURL}/payment-request/${id}/charity-log`;
    return axios.get(url);
  }

  static getPaymentRequestAuditorsLog(id: any) {
    const url = `${baseURL}/payment-request/${id}/auditors-log`;
    return axios.get(url);
  }

  static createFinancialAttachment(requestBody: any = {}) {
    const url = `${baseURL}/financial-attachment`;
    return axios.post(url, requestBody);
  }

  static getExchangeOrder(paymentRequestID: any) {
    const url = `${baseURL}/exchange-order/${paymentRequestID}`;
    return axios.get(url);
  }

  static getFinancialRequest(paymentRequestID: any) {
    const url = `${baseURL}/financial-request/${paymentRequestID}`;
    return axios.get(url);
  }

  static getAttachmentDataInvoice() {
    const url = `${baseURL}/financial-attachment`;
    return axios.get(url);
  }

  static getCompletionSpeech(paymentRequestID: any) {
    const url = `${baseURL}/completion-speech/${paymentRequestID}`;
    return axios.get(url);
  }

  static triggerPaymentPayout(requestBody: any = {}) {
    const url = `${hyperSplitURL}/payout`;
    return axios.post(url, requestBody);
  }

  static transferAll(selectedIds: any = [], otpCode: any) {
    const url = `${baseURL}/payment-requests/bulk`;
    return axios.patch(url, { ids: selectedIds, otp_code: otpCode });
  }
}

export default PaymentRequestService;
