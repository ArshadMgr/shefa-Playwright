class JwtUtilService {
  static get access_token_key() {
    return "access_token";
  }

  static get refresh_token_key() {
    return "refresh_token";
  }

  static get id_token_key() {
    return "id_token";
  }

  static get code_verifier_key() {
    return "code_verifier";
  }

  static get code_challenge_key() {
    return "code_challenge";
  }

  static getToken(name: string) {
    let ca: Array<string> = document.cookie.split(";");
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, "");
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return "";
  }

  static setToken(name: string, token: any) {
    document.cookie = `${name}=${token};secure`;
  }

  static removeToken(name: string) {
    // Set the cookie's expiration date to a past date
    let date = new Date();
    date.setTime(date.getTime()-1);
    let expires = "; expires="+date.toUTCString();
    document.cookie = name+"="+expires+"; path=/";
  }

  static getRefreshToken() {
    return sessionStorage.getItem(this.refresh_token_key);
  }

  static setRefreshToken(token: any) {
    sessionStorage.setItem(this.refresh_token_key, token);
  }

  static removeRefreshToken() {
    sessionStorage.removeItem(this.refresh_token_key);
  }

  static getIdToken() {
    return sessionStorage.getItem(this.id_token_key);
  }

  static setIdToken(token: any) {
    sessionStorage.setItem(this.id_token_key, token);
  }

  static removeIdToken() {
    sessionStorage.removeItem(this.id_token_key);
  }

  static getCodeVerifier() {
    return window.parent.localStorage.getItem(this.code_verifier_key);
  }

  static setCodeVerifier(token: any) {
    window.parent.localStorage.setItem(this.code_verifier_key, token);
  }

  static removeCodeVerifier() {
    window.parent.localStorage.removeItem(this.code_verifier_key);
  }

  static getCodeChallenge() {
    return window.parent.localStorage.getItem(this.code_challenge_key);
  }

  static setCodeChallenge(token: any) {
    window.parent.localStorage.setItem(this.code_challenge_key, token);
  }

  static removeCodeChallenge() {
    window.parent.localStorage.removeItem(this.code_challenge_key);
  }

  static setClientID(clientID: string) {
    localStorage.setItem("client-id", clientID);
  }

  static getClientID() {
    return localStorage.getItem("client-id");
  }

  static removeClientID() {
    localStorage.removeItem("client-id");
  }

  static deleteAllCookies() {
    // Get all cookies in the browser
    let cookies = document.cookie.split(";");

    // Loop through all cookies
    for (let i = 0; i < cookies.length; i++) {
      // Get the name of the current cookie
      let cookieName = cookies[i].split("=")[0];
      // Set the cookie's expiration date to a past date
      document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }
}

export default JwtUtilService;
