import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";
import JWTService from "@/services/jwt.util.service";
import JwtUtilService from "@/services/jwt.util.service";

import "primevue/resources/themes/lara-light-teal/theme.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "./styles/media-queries.scss";

import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import Card from "primevue/card";
import Chip from "primevue/chip";
import MultiSelect from 'primevue/multiselect';
import Badge from "primevue/badge";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";
import Calendar from "@/components/layout/calendar";
import HijriCalendar from "@/components/layout/hijri-calendar/HijriCalendar.vue";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Paginator from "primevue/paginator";
import Carousel from "primevue/carousel";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Tooltip from "primevue/tooltip";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import Dialog from "primevue/dialog";
import Menu from "primevue/menu";
import Divider from "primevue/divider";
import Toast from "primevue/toast";

import ToastService from "primevue/toastservice";
import { ToastSeverity } from "primevue/api";

import VueAxios from "vue-axios";
import axios from "axios";

const app = createApp(App);
app.use(PrimeVue, {
  locale: store.state.localOptions
});
import { createHead } from '@vueuse/head'
const head = createHead()
app.use(head)
app.use(VueAxios, axios);
app.use(ToastService);
app.use(ConfirmationService);

app.directive("tooltip", Tooltip);

app.component("Button", Button);
app.component("SplitButton", SplitButton);
app.component("Card", Card);
app.component("MultiSelect", MultiSelect);
app.component("Chip", Chip);
app.component("Badge", Badge);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);
app.component("InputText", InputText);
app.component("Textarea", Textarea);
app.component("InputNumber", InputNumber);
app.component("Checkbox", Checkbox);
app.component("RadioButton", RadioButton);
app.component("Calendar", Calendar);
app.component("HijriCalendar", HijriCalendar);
app.component("Dropdown", Dropdown);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);
app.component("Paginator", Paginator);
app.component("Carousel", Carousel);
app.component("Accordion", Accordion);
app.component("AccordionTab", AccordionTab);
app.component("ConfirmDialog", ConfirmDialog);
app.component("Dialog", Dialog);
app.component("Menu", Menu);
app.component("Toast", Toast);
app.component("Divider", Divider);

axios.interceptors.request.use((config) => {

  setAuthHeader(config);
  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  return response;
}, async (error) => {

  const originalRequest = error.config;

  if (error?.response?.status === 500) {
    app.config.globalProperties.$toast.add({ severity: "error", detail: "حدث خطأ في النظام", life: 3000 });
  } else if (error?.response?.status === 403) {
    let code = error?.response?.data?.result?.code;
    let url = "";
    if (code === "RESET_PASSWORD") {
      url = "/reset-password";
    } else if (code === "UPLOAD_AGREEMENT") {
      url = "/upload-signed-agreement";
    } else if (code === "SIGN_AGREEMENT") {
      url = "/agreement-approval";
    }

    window.location.href = process.env.VUE_APP_FE_URL + url;

  } else if (error?.response?.status === 401 && !originalRequest._retry) {

    originalRequest._retry = true;

    try {

      const realm = JwtUtilService.getClientID()?.split("-").slice(0, 2).join("-");
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", JwtUtilService.getToken(JwtUtilService.refresh_token_key) || "");
      params.append("client_id", JwtUtilService.getClientID() || "");

      const url = process.env.VUE_APP_KEYCLOAK_URL + `/realms/${realm}/protocol/openid-connect/token`;

      const { data } = await axios.post(
        url,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });

      JwtUtilService.setToken(JwtUtilService.access_token_key, data.access_token);
      JwtUtilService.setToken(JwtUtilService.refresh_token_key, data.refresh_token);
      JwtUtilService.setToken(JwtUtilService.id_token_key, data.id_token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

      return axios(originalRequest);
    } catch {
      router.push("/sign-in");
      return Promise.reject(error);
    }
  } else if (error?.response?.status >= 400 && error?.response?.status !== 406) {
    error?.response?.data?.errors?.forEach((error: string) => {
      app.config.globalProperties.$toast.add({ severity: "error", detail: error, life: 5000 });
    });
  }
  return Promise.reject(error);
});

let setAuthHeader = (config: any) => {

  let token = JWTService.getToken(JwtUtilService.access_token_key);

  if (token && config.url.includes(process.env.VUE_APP_API_URL)) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
};

app.use(store).use(router).mount("#app");
