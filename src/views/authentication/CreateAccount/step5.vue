<template>
  <div style="font-size: 14px">
    <div class="mb-5 title">
      يرجى مراجعة المعلومات والموافقة على الشروط والأحكام قبل إرسال الطلب
    </div>
    <div style="text-direction: rtl">
      <div class="mb-4" style="color: #3f3f3f">
        <div class="block-title">بيانات مدير الجمعية</div>
        <div>رقم الهوية : {{ payload.national_id }}</div>
        <div>البريد الإلكتروني : {{ payload.email }}</div>
        <div>رقم الجوال : {{ payload.mobile_number }}</div>
        <div>
          تاريخ الميلاد (ميلادي) :
          {{ formattedDate(payload.gregorian_birthdate) }}
        </div>
        <div>
          تاريخ الميلاد (هجري) : {{ formattedDate(payload.hijri_birthdate) }}
        </div>
      </div>
      <div class="mb-4" style="color: #8c8c8c">
        <div class="block-title">بيانات الجمعية</div>
        <div>اسم الجمعية : {{ payload.charity_name }}</div>
        <div v-if="payload.charity_type && type_options.length">
          نوع الجمعية :
          {{ type_options.find((rec) => rec.id === payload.charity_type).name }}
        </div>
        <div
          v-if="payload.charity_specialization && specialization_options.length"
        >
          التخصص الخيري :
          {{
            specialization_options.find(
              (rec) => rec.id === payload.charity_specialization
            ).name
          }}
        </div>
        <div v-if="payload.region && region_options.length">
          المنطقة :
          {{ region_options.find((rec) => rec.id === payload.region).name }}
        </div>
        <div v-if="payload.city && city_options.length">
          المدينة :
          {{ city_options.find((rec) => rec.id === payload.city).name }}
        </div>
        <div v-if="payload.charity_logo">
          شعار الجمعية : {{ payload.charity_logo.name }}
        </div>
        <div>رقم هاتف الجمعية : {{ payload.charity_phone }}</div>
        <div>بريد الجمعية الإلكتروني : {{ payload.charity_email }}</div>
        <div>موقع الجمعية الإلكتروني : {{ payload.charity_website }}</div>
        <div>
          رابط موقع الجمعية في خرائط قوقل : {{ payload.charity_location }}
        </div>
        <div>اسم مدير الجمعية : {{ fullName }}</div>
        <div>اسم رئيس مجلس الإدارة : {{ payload.chairman_name }}</div>
        <div>رقم جوال رئيس مجلس الإدارة : {{ payload.chairman_mobile }}</div>
        <div>رقم الترخيص : {{ payload.charity_license_number }}</div>
        <div>
          تاريخ انتهاء الترخيص (هجري) :
          {{ formattedDate(payload.license_expiry_hijri_date) }}
        </div>
        <div>
          تاريخ انتهاء الترخيص (ميلادي) :
          {{ formattedDate(payload.license_expiry_gregorian_date) }}
        </div>
        <div v-if="payload.license_attachment">
          مرفق ملف الترخيص : {{ payload.license_attachment.name }}
        </div>
        <div>رقم الآيبان : {{ payload.iban }}</div>
        <div>اسم صاحب الحساب : {{ payload.account_holder_name }}</div>
        <div v-if="payload.bank_account_attachment">
          مرفق تعريف الحساب البنكي : {{ payload.bank_account_attachment.name }}
        </div>
      </div>
      <div
        v-if="
          payload.flag === 'yes' &&
          payload.service_provider &&
          payload.service_provider.length
        "
        class="mb-4"
        style="color: #8c8c8c"
      >
        <div class="block-title">بيانات مزودي الخدمة</div>
        <div
          class="d-flex align-items-center"
          v-for="(each, index) in payload.service_provider"
          :key="index"
        >
          <div
            style="margin-left: 2rem"
            v-if="each.hospital_id && hospital_options.length"
          >
            اسم المستشفى :
            {{
              hospital_options.find((rec) => rec.id === each.hospital_id).name
            }}
          </div>
          <div>نسبة الخصم : {{ each.discount }}</div>
        </div>
      </div>
    </div>
    <div class="border-container"></div>
    <div class="accept-checkbox">
      <Checkbox
        v-model="payload.is_accepted_terms"
        :binary="true"
        inputId="chkbox1"
      />
      <label>
        <span>أوافق على </span>
        <span class="link" @click="goToPrivacy">الشروط والأحكام</span>
      </label>
    </div>
    <div class="border-container"></div>
    <div class="row">
      <div class="col-lg-6">
        <button
          id="close-btn"
          class="btn btn-lg btn-secondary btn-block close-btn"
          type="button"
          :disabled="loading"
          @click.stop="$emit('close')"
        >
          السابق
        </button>
      </div>
      <div class="col-lg-6">
        <button
          id="tracking-btn"
          class="btn btn-lg btn-primary btn-block tracking-btn"
          type="button"
          :disabled="loading || !payload.is_accepted_terms"
          @click.stop="submit"
        >
          متابعة
        </button>
      </div>
    </div>
    <AfterSubmitModal
      :display="open_modal"
      :is_success="is_success"
      @close="closeModal"
    />
  </div>
</template>

<script>
import CharityRegisterService from "../../../services/charity-register.service";
import EnumService from "../../../services/enum.service";
import Checkbox from "primevue/checkbox";
import moment from "moment";
import AfterSubmitModal from "./after-submit-modal";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default {
  name: "create-account-step5",
  props: ["payload", "verified_info"],
  emits: ["close"],
  components: { Checkbox, AfterSubmitModal },
  data() {
    return {
      loading: false,
      error: null,
      open_modal: false,
      is_success: null,
      hospital_options: [],
      type_options: [],
      specialization_options: [],
      region_options: [],
      city_options: [],
      fullName: `${this.verified_info.first_name} ${this.verified_info.father_name} ${this.verified_info.last_name}`,
    };
  },
  methods: {
    formattedDate(val) {
      return moment(val).format("YYYY-MM-DD");
    },
    async submit() {
      this.loading = true;
      this.error = null;

      const payload = {
        charity_license_number: this.payload.charity_license_number,
        charity_name: this.payload.charity_name,
        charity_type: this.payload.charity_type,
        charity_specialization: this.payload.charity_specialization,
        charity_logo: await toBase64(this.payload.charity_logo),
        license_expiry_hijri_date: moment(
          this.payload.license_expiry_hijri_date
        ).format("YYYY-MM-DD"),
        license_expiry_gregorian_date: moment(
          this.payload.license_expiry_gregorian_date
        ).format("YYYY-MM-DD"),
        license_attachment: await toBase64(this.payload.license_attachment),
        bank_account_attachment: await toBase64(
          this.payload.bank_account_attachment
        ),
        charity_phone: this.payload.charity_phone,
        charity_email: this.payload.charity_email,
        charity_website: this.payload.charity_website,
        region: this.payload.region,
        city: this.payload.city,
        charity_location: this.payload.charity_location,
        number_of_service_provider_agreements:
          this.payload.flag === "yes" &&
          this.payload.service_provider &&
          this.payload.service_provider.length
            ? this.payload.service_provider.length
            : 0,
        service_provider:
          this.payload.flag === "yes" &&
          this.payload.service_provider &&
          this.payload.service_provider.length
            ? this.payload.service_provider
            : [],
        chairman_name: this.payload.chairman_name,
        chairman_mobile: this.payload.chairman_mobile,
        account_holder_name: this.payload.account_holder_name
      };

      CharityRegisterService.step4(this.payload.id, payload)
        .then(() => {
          this.is_success = true;
        })
        .catch((error) => {
          this.error = error;
          this.is_success = false;
        })
        .finally(() => {
          this.loading = false;
          this.open_modal = true;
        });
    },
    closeModal() {
      this.open_modal = false;
      if (this.is_success) this.$router.push("/");
    },
    enum_hospitals() {
      this.loading = true;
      this.error = null;

      EnumService.hospitals()
        .then(({ data }) => {
          if (data.result.length) this.hospital_options = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    enum_types() {
      this.loading = true;
      this.error = null;

      EnumService.types()
        .then(({ data }) => {
          if (data.result.length) this.type_options = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    enum_specializations() {
      this.loading = true;
      this.error = null;

      EnumService.specializations()
        .then(({ data }) => {
          if (data.result.length) this.specialization_options = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    enum_regions() {
      this.loading = true;
      this.error = null;

      EnumService.regions()
        .then(({ data }) => {
          if (data.result.length) this.region_options = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    enum_cities(region_id) {
      this.loading = true;
      this.error = null;

      EnumService.cities(region_id)
        .then(({ data }) => {
          if (data.result.length) this.city_options = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    goToPrivacy() {
      window.open(process.env.VUE_APP_FE_URL + "/privacy-policy", "_blank");
    }
  },
  mounted() {
    this.enum_hospitals();
    this.enum_types();
    this.enum_specializations();
    this.enum_regions();
    if (this.payload.region) this.enum_cities(this.payload.region);
  }
};
</script>

<style lang="scss" scoped>
.title {
  color: #3f3f3f;
  font-size: 18px;
}

.block-title {
  color: #8c8c8c;
  font-size: 14px;
  font-weight: bold;
}

.border-container {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
}

.tracking-btn {
  display: block;
  margin: 0 auto;
  width: 80%;
  border-radius: 25px;
  padding: 10px;
  background: #12b2aa;
  color: #ffffff;
  border: none;
  font-size: 18px;
}

.tracking-btn:hover {
  background-color: #0e8e88 !important;
  border: none;
}

.close-btn {
  display: block;
  margin: 0 auto;
  width: 80%;
  border-radius: 25px;
  padding: 10px;
  background: #d9d9d9;
  color: #3f3f3f;
  border: none;
  font-size: 18px;
}

.accept-checkbox {
  label {
    font-size: 14px;
    color: #3f3f3f;
    margin-right: 5px;
  }

  .link {
    cursor: pointer;
    color: #12b2aa;
    margin-right: 5px;
    text-decoration: underline;
  }
}
</style>
