import axios from "axios";

const baseURL = process.env.VUE_APP_API_URL;

class OTPService {
  static resendOTP(model: any) {
    const url = `${baseURL}/account/send-otp`;

    return axios.post(url, { ...model });
  }

  static paymentSendOtp(id: any) {
    const url = `${baseURL}/invoicing/payment-request/otp`;

    return axios.post(url, {
      payment_request_ids: [...id]
    });
  }

  static verifyOTP(model: any) {
    const url = `${baseURL}/account/otp-verify`;

    return axios.post(url, { ...model });
  }
}

export default OTPService;

export enum OTP_TYPE {
  DONOR_REGISTRATION = 1,
  DONOR_LOGIN,
  CHANGE_MOBILE,
  VERIFY_MOBILE,
  VERIFY_EMAIL,
  CHAIRMAN_MOBILE,
  CHARITY_EMAIL,
  UPDATE_CHARITY_MANAGER_VERIFY_MOBILE,
  UPDATE_CHARITY_MANAGER_VERIFY_EMAIL,
  REASSIGN_CHARITY_MANAGER_VERIFY_MOBILE,
  REASSIGN_CHARITY_MANAGER_VERIFY_EMAIL,
  TYPE_REPRESENTATIVE_VERIFY_MOBILE,
TYPE_REPRESENTATIVE_VERIFY_EMAIL
}
