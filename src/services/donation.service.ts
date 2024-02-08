import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class DonationService {
  static getCaseDetails(caseId: number) {
    const url = `${baseURL}/charity/case/${caseId}/get-donation-info/`;

    return axios.get(url);
  }

  static getPaymentId(requestBody: any = {}, reference_id: string) {
    let url = `${baseURL}/payment/hyperpay/checkout/`;
    url += reference_id ? `?reference_id=${reference_id}` : ''

    return axios.post(url, requestBody);
  }
  static getSubscriptionPaymentId(requestBody: any = {}) {
    const url = `${baseURL}/payment/hyperpay/subscription/checkout/`;

    return axios.post(url, requestBody);
  }
  static getSubscriptions() {
    const url = `${baseURL}/payment/hyperpay/subscriptions/`;

    return axios.get(url);
  }
  static deleteSubscription(id: string) {
    const url = `${baseURL}/payment/hyperpay/subscriptions/${id}`;

    return axios.delete(url);
  }
  static pauseSubscription(id: string) {
    const url = `${baseURL}/payment/hyperpay/subscriptions/${id}/pause/`;

    return axios.patch(url);
  }
  static activateSubscription(id: string) {
    const url = `${baseURL}/payment/hyperpay/subscriptions/${id}/activate/`;

    return axios.patch(url);
  }
  static getAmbassadorPaymentId(requestBody: any = {}, id: string) {
    const url = `${baseURL}/payment/hyperpay/checkout/?reference_id=${id}`;

    return axios.post(url, requestBody);
  }

  static getPaymentStatus(checkoutID: number, resourcePath: string) {
    const url = `${baseURL}/payment/hyperpay/result?checkout_id=${checkoutID}&resourcePath=${resourcePath}`;

    return axios.get(url);
  }

  static donate(requestBody: any = {}, isQuickDonation = false) {
    let url = `${baseURL}/wallet/donation/`;
    url += isQuickDonation ? '?quick-donation=true' : '';

    return axios.post(url, requestBody);
  }

  static payZakat(payload: any = {}) {
    let url = `${baseURL}/wallet/pay-zakat/`;
    return axios.post(url, payload);
  }

  static checkCardType(cardNumber: any) {

    let cardType = '';

    let visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    let mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
    let madaRegEx = /(4(0(0861|1757|7(197|395)|9201)|1(0685|7633|9593)|2(281(7|8|9)|8(331|67(1|2|3)))|3(1361|2328|4107|9954)|4(0(533|647|795)|5564|6(393|404|672))|5(5(036|708)|7865|8456)|6(2220|854(0|1|2|3))|8(301(0|1|2)|4783|609(4|5|6)|931(7|8|9))|93428)|5(0(4300|8160)|13213|2(1076|4(130|514)|9(415|741))|3(0906|1095|2013|5(825|989)|6023|7767|9931)|4(3(085|357)|9760)|5(4180|7606|8848)|8(5265|8(8(4(5|6|7|8|9)|5(0|1))|98(2|3))|9(005|206)))|6(0(4906|5141)|36120)|9682(0(1|2|3|4|5|6|7|8|9)|1(0|1)))\d{10}$/;
    if (visaRegEx.test(cardNumber)) {
      cardType = 'visa'
    }
    else if (mastercardRegEx.test(cardNumber)) {
      cardType = 'master'
    }
    else if (madaRegEx.test(cardNumber)) {
      cardType = 'mada'
    }
    else {
      cardType = 'applepay'
    }

    return cardType;
  }
}

export default DonationService;
