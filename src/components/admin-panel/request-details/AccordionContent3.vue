<template>
  <form class="form w-100" v-if="requestDetails && requestDetails.requestInfo">
    <div class="row">
      <div class="col-lg-6">
        <div class="row align-items-center mb-4">
          <div class="col-lg-6">
            <div class="form-label-group">
              <div class="mt-4">
                <span class="p-float-label">
                  <InputText
                    id="charity_phone"
                    type="number"
                    v-model="requestDetails.requestInfo.charity_license_number"
                    :class="[
                      'w-100',
                      {
                        'p-invalid':
                          !!(submitted && !requestDetails.requestInfo.charity_license_number),
                      },
                    ]"
                    :disabled="loading"
                  />
                  <label for="charity_phone">رقم ترخيص الجمعية</label>
                </span>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mt-4 inquiry-link"
               @click="onLicenseInquiryClick">
            استعلام عن الترخيص
          </div>
        </div>
        <div class="row">
          <div class="form-label-gr col-lg-6">
            <div class="mt-4">
              <span class="p-float-label">
                <Calendar
                  id="license_expiry_gregorian_date"
                  :minDate="minDate"
                  v-model="requestDetails.requestInfo.license_expiry_gregorian_date"
                  :class="[
                    'w-100',
                    {
                      'p-invalid':
                        !!(submitted &&
                        !requestDetails.requestInfo
                          .license_expiry_gregorian_date),
                    },
                  ]"
                  dateFormat="yy-mm-dd"
                  :disabled="loading"
                  @date-select="onDateChange(true)"
                />
                <label for="license_expiry_gregorian_date">
                  تاريخ انتهاء الترخيص (ميلادي)
                </label>
              </span>
            </div>
          </div>
          <div class="form-label-gr col-lg-6">
            <div class="mt-4">
              <span class="p-float-label">
                <HijriCalendar
                  id="license_expiry_hijri_date"
                  v-model="requestDetails.requestInfo.license_expiry_hijri_date"
                  :minDate="minHijriDate"
                  :class="[
                    'w-100',
                    {
                      'p-invalid':
                        !!(submitted &&
                        !requestDetails.requestInfo.license_expiry_hijri_date),
                    },
                  ]"
                  dateFormat="yy-mm-dd"
                  :disabled="loading"
                  @date-select="onDateChange(false)"
                  :monthNames="$store.state.hijriMonthNames"
                  :monthNamesShort="$store.state.hijriMonthNamesShort"
                />
                <label for="license_expiry_hijri_date"
                >تاريخ انتهاء الترخيص (هجري)</label
                >
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <label>ملف الترخيص</label>
          <div
            class="association-logo"
          >
            <div class="d-flex align-items-center justify-content-between">
              <div class="logo"></div>
              <div class="logo-name" :title="requestDetails.requestInfo.license_attachment?.name || requestDetails.requestInfo.license_attachment">
                {{ requestDetails.requestInfo.license_attachment?.name || requestDetails.requestInfo.license_attachment }}
              </div>
              <div class="d-flex align-items-center">
                <button
                  class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center"
                  style="margin-left: 0.5rem"
                  type="button"
                  @click.stop="downloadDocument(requestDetails.requestInfo.license_attachment)">
                  <div class="download-icon"></div>
                  تحميل
                </button>
                <button
                  class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                  @click.stop="$refs.license_attachment.$el.click()"
                  type="button">
                  <div class="upload-icon"></div>
                  تعديل
                </button>
                <InputText
                  ref="license_attachment"
                  class="d-none"
                  type="file"
                  accept="application/pdf"
                  @change.stop="(event) => $emit('fileChange', event, 'license_attachment')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import Calendar from "@/components/layout/calendar";
import { toGregorian, toHijri } from "hijri-converter";
import MediaService from "@/services/media.service";

export default {
  name: "accordian-content-3",
  props: ["requestDetails", "dateHijriObj"],
  emits: ["fileChange"],
  components: { Calendar },
  data() {
    return {
      minDate: new Date(),
      minHijriDate: new Date(),
      dateHijriObj: this.$props.dateHijriObj,
      dateGregorianObj: {}
    };
  },
  mounted() {
    this.setInitialDateValues();
  },
  methods: {
    onLicenseInquiryClick() {
      window.open("https://hrsd.gov.sa/ar/ngo-enquiry", "_blank");
    },
    onDateChange(isGregorian) {
      if (isGregorian) {
        this.dateHijriObj = toHijri(this.requestDetails.requestInfo.license_expiry_gregorian_date.getFullYear(),
          this.requestDetails.requestInfo.license_expiry_gregorian_date.getMonth() + 1,
          this.requestDetails.requestInfo.license_expiry_gregorian_date.getDate());
        this.requestDetails.requestInfo.license_expiry_hijri_date = new Date(this.dateHijriObj.hy, this.dateHijriObj.hm - 1, this.dateHijriObj.hd);
      } else {
        this.dateGregorianObj = toGregorian(this.requestDetails.requestInfo.license_expiry_hijri_date.getFullYear(),
          this.requestDetails.requestInfo.license_expiry_hijri_date.getMonth() + 1,
          this.requestDetails.requestInfo.license_expiry_hijri_date.getDate());
        this.requestDetails.requestInfo.license_expiry_gregorian_date = new Date(this.dateGregorianObj.gy, this.dateGregorianObj.gm - 1, this.dateGregorianObj.gd);
      }
      this.isSaveButtonEnabled = true;
    },
    setInitialDateValues() {
      const hijriMaxDateObj = toHijri(this.minDate.getFullYear(), this.minDate.getMonth() + 1, this.minDate.getDate());
      this.minHijriDate = new Date(hijriMaxDateObj.hy, hijriMaxDateObj.hm - 1, hijriMaxDateObj.hd);
    },
    downloadDocument(url) {
      MediaService.downloadFile(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  height: 50px;
  flex: 0 0 70px;
  background-color: #d9d9d9;
  margin-left: 1rem;
}

.logo-name {
  color: #8c8c8c;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap !important;
}

.download-btn,
.modify-btn {
  border-radius: 25px;
  font-size: 14px;
  background-color: #d9d9d9;
  color: #3f3f3f;
  border: none;
}

.download-btn:hover,
.modify-btn:hover {
  background-color: #b2b2b2;
  color: #3f3f3f;
}

.inquiry-link {
  font-size: 15px;
  color: #12b2aa;
  font-weight: 500;
  cursor: pointer;
}

.association-logo {
  height: 80px;
  border-radius: 5px;
  border: 1px dashed #d9d9d9;
  padding: 10px 20px;
}

:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  color: #6c757d;;
  font-size: 12px;
}

.download-icon,
.upload-icon {
  background: url("../../../assets/icons/download-gray.svg");
  width: 14.5px;
  height: 14.5px;
  margin: 0 0.3rem;
}

.download-icon {
  transform: rotate(180deg);
}

label {
  color: #6c757d;;
  font-size: 12px;
}

</style>
