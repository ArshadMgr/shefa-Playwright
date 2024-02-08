<template>
  <div v-if="loading">تفاصيل طلب التحميل ، يرجى الانتظار</div>
  <div
    :class="[
      'request-details',
      { disabled: requestDetails?.requestInfo?.step === 'rejected' },
    ]"
    v-else>
    <div class="request-header d-flex justify-content-between mb-4">
      <div class="text">مراجعة طلب الجمعية</div>
      <div class="close-request d-flex align-items-center">
        <router-link to="/admin-panel/request">
          <i class="pi pi-times ms-2"> </i>
          <span>إغلاق الطلب</span>
        </router-link>
      </div>
    </div>
    <div class="mb-4">
      <infoTable>
        <template v-slot:header>
          <tr>
            <td>اسم الجمعية</td>
            <td>رقم الترخيص</td>
            <td>رقم الطلب</td>
            <td>تاريخ الطلب</td>
            <td>حالة الطلب</td>
          </tr>
        </template>
        <template v-slot:body>
          <tr>
            <td>{{ requestDetails?.requestInfo?.charity_name }}</td>
            <td>{{ requestDetails?.requestInfo?.charity_license_number }}</td>
            <td>{{ id }}</td>
            <td>{{ requestDetails?.requestInfo?.created_on }}</td>
            <td>
              <StatusBadge
                :status="requestDetails?.requestInfo?.step"
                :statusKey="requestDetails?.requestInfo?.step"
              ></StatusBadge>
            </td>
          </tr>
        </template>
      </infoTable>
    </div>
    <div class="info-section mb-5">
      <Accordion :multiple="true">
        <AccordionTab header="بيانات عامة عن الجمعية">
          <AccordionContent1
            :requestDetails="requestDetails"
            @fileChange="fileChange"
            v-if="requestDetails.requestInfo"
          />
        </AccordionTab>
        <AccordionTab header="بيانات مدير الجمعية">
          <AccordionContent2 :requestDetails="requestDetails" />
        </AccordionTab>
        <AccordionTab header="بيانات ترخيص الجمعية">
          <AccordionContent3
            :requestDetails="requestDetails"
            @fileChange="fileChange"
            v-if="requestDetails.requestInfo"
            :dateHijriObj="dateHijriObj"
          />
        </AccordionTab>
        <AccordionTab header="البيانات البنكية">
          <AccordionContent4
            :requestDetails="requestDetails"
            @fileChange="fileChange"
          />
        </AccordionTab>
        <AccordionTab header="اتفاقيات مزود الخدمة">
          <AccordionContent5 :requestDetails="requestDetails" />
        </AccordionTab>
        <AccordionTab
          header="اتفاقيات الشراكة"
          v-if="
            requestDetails?.requestInfo?.step === 'pending_agreement' ||
            requestDetails?.requestInfo?.step === 'approved' ||
            requestDetails?.requestInfo?.step === 'initial_approval'
          "
        >
          <AccordionContent6
            :requestAgreements="requestAgreementsByVersion"
            :adminCanGenerateNewAgreement="adminCanGenerateNewAgreement"
            @generateAdminRequestAgreement="generateAdminRequestAgreement"
          />
        </AccordionTab>
      </Accordion>
    </div>
    <div
      class="request-history mb-5"
      v-if="requestDetails?.requestHistory?.length">
      <div class="header">إجراءات الطلب</div>
      <infoTable>
        <template v-slot:header>
          <tr>
            <td>#</td>
            <td>المستخدم</td>
            <td>الإجراء</td>
            <td>التعليق</td>
            <td>التاريخ</td>
          </tr>
        </template>
        <template v-slot:body>
          <tr
            v-for="(item, index) in requestDetails.requestHistory"
            :key="index">
            <td class="w-5">
              {{ requestDetails.requestHistory.length - index }}
            </td>
            <td class="w-10">{{ item.done_by || "-" }}</td>
            <td class="w-20">
              <statusBadge
                :status="item.status"
                :status-key="item.status"
              ></statusBadge>
            </td>
            <td class="w-45" @click="showActionComments(item)">{{ item.comments || "-" }}</td>
            <td class="w-20">{{ item.done_at }}</td>
          </tr>
        </template>
      </infoTable>
    </div>
    <div
      class="admin-input-section"
      v-if="
        requestDetails.requestInfo &&
        requestDetails?.requestInfo?.step !== 'rejected'">
      <div class="d-flex justify-content-between mb-5">
        <div class="flex-grow-1">
          <div class="mb-1">النسبة التشغيلية للجمعية</div>
          <InputNumber
            inputId="percent"
            :min="0"
            :max="10"
            id="operation-percent"
            step="0.1"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="3"
            v-model="requestDetails.requestInfo.charity_operation_ratio"
            suffix="%"
            @blur="onOperationChanged"
          />
        </div>
        <div class="flex-grow-1">
          <div class="mb-1">نسبة الاستدامة لشفاء</div>
          <InputNumber
            inputId="percent"
            :min="0"
            :max="10"
            step="0.1"
            mode="decimal"
            id="sus-percentage"
            :minFractionDigits="1"
            :maxFractionDigits="3"
            v-model="requestDetails.requestInfo.charity_sustainability_ratio"
            suffix="%"
            @blur="onSustainabilityChanged"
          />
        </div>
        <div class="flex-grow-1">
          <div class="mb-1">عدد الطلبات النشطة المسموحة</div>
          <InputNumber
            inputId="percent"
            id="percent"
            v-model="requestDetails.requestInfo.number_of_active_requests_allowed"
          />
        </div>
        <div class="flex-grow-1">
          <div class="mb-1">عدد الطلبات المسموحة للنشر على صفحة الجمعية</div>
          <InputNumber
            inputId="number_of_requests_allowed_to_publish"
            id="number_of_requests_allowed_to_publish"
            v-model="requestDetails.requestInfo.number_of_requests_allowed_to_publish"
          />
        </div>
      </div>
      <div>
        <Button
          label="حفظ التعديلات"
          class="p-button-outlined p-button-rounded mx-2 width-180"
          @click="saveChanges"
          :disabled="!requestDetails?.requestInfo?.account_holder_name"
        />
        <Button
          label="قبول مبدئي"
          class="p-button-primary p-button-rounded mx-2 width-180"
          :disabled="
            requestDetails?.requestInfo?.charity_operation_ratio === null ||
            requestDetails?.requestInfo?.charity_sustainability_ratio === null ||
            !requestDetails?.requestInfo?.account_holder_name"
          v-if="requestDetails?.requestInfo?.step === 'pending_approval'"
          @click="accept"
        />
        <Button
          label="تفعيل الحساب"
          class="p-button-primary p-button-rounded mx-2 width-180"
          v-if="requestDetails?.requestInfo?.step === 'pending_agreement'"
          @click="activate"
        />
        <Button
          label="رفض"
          class="p-button-danger p-button-rounded mx-2 width-180"
          @click="reject"
          v-if="
            requestDetails?.requestInfo?.step === 'pending_approval' ||
            requestDetails?.requestInfo?.step === 'pending_agreement'
          "
        />
      </div>
    </div>
  </div>
  <Dialog
    :visible="displayAcceptModal"
    :breakpoints="{ '960px': '30vw', '640px': '25vw' }"
    :style="{ width: '35vw' }"
    :modal="true"
    :closable="false"
    class="accept-modal"
  >
    <div class="body">
      <div v-if="!isRequestAccepted">
        <div class="text-center mb-5">هل أنت متأكد من قبول الطلب</div>
        <div class="text-center">
          <Button
            label="تأكيد قبول الطلب"
            autofocus
            @click="confirmAcceptModal()"
            style="width: 150px"
            class="p-button-primary p-button-rounded mx-2"
          />
          <Button
            label="إغلاق"
            @click="closeAcceptModal()"
            style="width: 150px"
            class="button-grey p-button-rounded mx-2"
          />
        </div>
      </div>
      <div
        class="confirmation-msg d-flex flex-column justify-content-center align-items-center"
        v-if="isRequestAccepted"
      >
        <div class="check-circle mb-2">
          <i class="pi pi-check"> </i>
        </div>
        <div class="txt mb-5">
          <span>{{ initialApprovalSuccessMessage }}</span>
        </div>
        <router-link to="/admin-panel/request">
          <Button
            label="العودة إلى طلبات تسجيل الجمعيات"
            class="button-grey p-button-rounded mx-2"
          />
        </router-link>
      </div>
    </div>
  </Dialog>
  <Dialog
    :visible="displayActivateModal"
    :breakpoints="{ '960px': '30vw', '640px': '25vw' }"
    :style="{ width: '35vw' }"
    :modal="true"
    :closable="false"
    class="accept-modal"
  >
    <div class="body">
      <div v-if="!isAccountActivated">
        <div class="text-center mb-5">هل أنت متأكد من تفعيل الحساب</div>
        <div class="text-center">
          <Button
            label="تأكيد"
            autofocus
            @click="confirmActivateModal"
            style="width: 150px"
            class="p-button-primary p-button-rounded mx-2 px-5"
          />
          <Button
            label="إغلاق"
            @click="closeActivateModal"
            style="width: 150px"
            class="button-grey p-button-rounded mx-2"
          />
        </div>
      </div>
      <div
        class="confirmation-msg d-flex flex-column justify-content-center align-items-center"
        v-if="isAccountActivated"
      >
        <div class="check-circle mb-2">
          <i class="pi pi-check"> </i>
        </div>
        <div class="txt mb-5">
          <span>تم تفعيل الحساب بنجاح</span>
        </div>
        <router-link to="/admin-panel/request">
          <Button
            label="العودة إلى طلبات تسجيل الجمعيات"
            class="button-grey p-button-rounded mx-2"
          />
        </router-link>
      </div>
    </div>
  </Dialog>
  <Dialog
    :visible="displayRejectModal"
    :breakpoints="{ '960px': '30vw', '640px': '25vw' }"
    :style="{ width: '40vw' }"
    :modal="true"
    :closable="false"
    class="reject-modal"
  >
    <div class="body text-center">
      <div v-if="!isRequestRejected && shouldShowRejectionComments">
        <div class="title mb-2">مبررات رفض الطلب</div>
        <div class="sub-title mb-3">يرجى كتابة مبررات الرفض</div>
        <div class="mb-5">
          <textarea
            v-model="reject_reasons"
            :autoResize="true"
            rows="8"
            class="w-100"
          />
        </div>
        <div class="text-center">
          <Button
            label="تأكيد رفض الطلب"
            autofocus
            @click="confirmRejectModal"
            class="p-button-primary p-button-rounded mx-2"
            :disabled="!reject_reasons"
          />
          <Button
            label="إغلاق"
            @click="closeRejectModal"
            class="button-grey p-button-rounded mx-2"
          />
        </div>
      </div>
      <div v-if="!isRequestRejected && !shouldShowRejectionComments">
        <div class="text-center mb-5 title">هل أنت متأكد من رفض الطلب</div>
        <div class="text-center">
          <Button
            label="تأكيد"
            autofocus
            @click="confirmRejectModal"
            class="p-button-primary p-button-rounded mx-2 px-5"
          />
          <Button
            label="إغلاق"
            @click="closeRejectModal"
            class="button-grey p-button-rounded mx-2"
          />
        </div>
      </div>
      <div
        class="confirmation-msg d-flex flex-column justify-content-center align-items-center"
        v-if="isRequestRejected"
      >
        <div class="check-circle mb-2">
          <i class="pi pi-check"> </i>
        </div>
        <div class="txt mb-5">
          <span>تم رفض الطلب بنجاح</span>
        </div>
        <router-link to="/admin-panel/request">
          <Button
            label="العودة إلى طلبات تسجيل الجمعيات"
            class="button-grey p-button-rounded mx-2"
          />
        </router-link>
      </div>
    </div>
  </Dialog>

  <Dialog
    :visible="shouldShowActionComments"
    :breakpoints="{ '960px': '30vw', '640px': '25vw' }"
    :style="{ width: '35vw' }"
    :modal="true"
    :closable="true"
    class="accept-modal"
  >
    <template #header>
      <i class="pi pi-times" @click="shouldShowActionComments = false"></i>
    </template>
    <div class="body">
      <div class="space-pre dir-rtl">
        {{ selectedAction.comments }}
      </div>
    </div>
  </Dialog>
</template>

<script>
import StatusBadge from "@/components/admin-panel/StatusBadge";
import InfoTable from "@/components/admin-panel/InfoTable";
import Dialog from "primevue/dialog";
import { useRoute } from "vue-router";
import moment from "moment";
import AccordionContent1 from "@/components/admin-panel/request-details/AccordionContent1.vue";
import AccordionContent2 from "@/components/admin-panel/request-details/AccordionContent2.vue";
import AccordionContent3 from "@/components/admin-panel/request-details/AccordionContent3.vue";
import AccordionContent4 from "@/components/admin-panel/request-details/AccordionContent4.vue";
import AccordionContent5 from "@/components/admin-panel/request-details/AccordionContent5.vue";
import AccordionContent6 from "@/components/admin-panel/request-details/AccordionContent6.vue";
import AdminPanelService from "@/services/admin-panel.service";
import { ToastSeverity } from "primevue/api";
import { toHijri } from "hijri-converter";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default {
  name: "RequestDetails",
  components: {
    InfoTable,
    StatusBadge,
    Dialog,
    AccordionContent1,
    AccordionContent2,
    AccordionContent3,
    AccordionContent4,
    AccordionContent5,
    AccordionContent6
  },
  data() {
    return {
      id: null,
      requestDetails: {
        requestInfo: null,
        requestHistory: [],
        requestAgreements: [],
        charity_operation_ratio: 0,
        charity_sustainability_ratio: 0,
        number_of_active_requests_allowed: 0,
        number_of_requests_allowed_to_publish: 0,
        availableOperationPercentage: 0
      },
      displayAcceptModal: false,
      displayActivateModal: false,
      displayRejectModal: false,
      reject_reasons: "",
      isRequestAccepted: false,
      isAccountActivated: false,
      isRequestRejected: false,
      shouldShowRejectionComments: true,
      shouldShowActionComments: false,
      firstLoad: true,
      enableSave: false,
      loading: false,
      initialApprovalSuccessMessage: "",
      dateHijriObj: {},
      adminCanGenerateNewAgreement: false,
      charity_operation_ratio: 0,
      charity_sustainability_ratio: 0,
      number_of_active_requests_allowed: 0,
      number_of_requests_allowed_to_publish: 0,
      requestAgreementsByVersion: [],
      selectedAction: null,
      firstLoadData: null
    };
  },
  beforeMount() {
    const route = useRoute();
    this.id = route.params.id;
    this.query(route.params.id);
  },
  methods: {
    async saveChanges() {
      const selectedHospitalsID = [];
      this.requestDetails?.requestInfo.service_provider.forEach(hospital => {
        selectedHospitalsID.push(hospital.hospital_id);
      });
      const selectedHospitalsIDSet = new Set(selectedHospitalsID);
      if (selectedHospitalsIDSet.size !== selectedHospitalsID.length) {
        this.$toast.add({
          severity: ToastSeverity.ERROR,
          detail: "لا يمكنك اختيار نفس مزود الخدمة أكثر من مرة",
          life: 3000
        });
        return;
      }
      const payload = {
        charity_logo: this.firstLoadData.charity_logo !== this.requestDetails?.requestInfo?.charity_logo ? await toBase64(
          this.requestDetails?.requestInfo?.charity_logo
        ) : this.requestDetails?.requestInfo?.charity_logo,
        license_attachment: this.firstLoadData.license_attachment !== this.requestDetails?.requestInfo?.license_attachment ? await toBase64(
          this.requestDetails?.requestInfo?.license_attachment
        ) : this.requestDetails?.requestInfo?.license_attachment,
        bank_account_attachment: this.firstLoadData.bank_account_attachment !== this.requestDetails?.requestInfo.bank_account_attachment ? await toBase64(
          this.requestDetails?.requestInfo.bank_account_attachment
        ) : this.requestDetails?.requestInfo.bank_account_attachment,
        account_holder_name: this.requestDetails?.requestInfo?.account_holder_name,
        national_id: this.requestDetails?.requestInfo.national_id,
        first_name: this.requestDetails?.requestInfo.first_name,
        father_name: this.requestDetails?.requestInfo.father_name,
        last_name: this.requestDetails?.requestInfo.last_name,
        hijri_birthdate: moment(
          this.requestDetails?.requestInfo.hijri_birthdate
        ).format("YYYY-MM-DD"),
        gregorian_birthdate: moment(
          this.requestDetails?.requestInfo.gregorian_birthdate
        ).format("YYYY-MM-DD"),
        email: this.requestDetails?.requestInfo.email,
        is_charity_manager_info_verified: true,
        charity_name: this.requestDetails?.requestInfo.charity_name,
        charity_phone: this.requestDetails?.requestInfo.charity_phone,
        charity_website: this.requestDetails?.requestInfo.charity_website,
        charity_location: this.requestDetails?.requestInfo.charity_location,
        service_provider:
          this.requestDetails?.requestInfo?.isServiceProvider === "1"
            ? this.requestDetails?.requestInfo.service_provider
            : [],
        chairman_name: this.requestDetails?.requestInfo.chairman_name,
        number_of_active_requests_allowed:
        this.requestDetails.requestInfo?.number_of_active_requests_allowed,
        number_of_requests_allowed_to_publish:
        this.requestDetails.requestInfo?.number_of_requests_allowed_to_publish,
        charity_operation_ratio: this.requestDetails.requestInfo?.charity_operation_ratio,
        charity_sustainability_ratio:
        this.requestDetails.requestInfo?.charity_sustainability_ratio,
        region: this.requestDetails?.requestInfo.region,
        city: this.requestDetails?.requestInfo.city,
        number_of_service_provider_agreements:
          this.requestDetails.requestInfo.isServiceProvider === "1"
            ? this.requestDetails?.requestInfo?.service_provider?.length
            : 0,
        charity_type: this.requestDetails.requestInfo.charity_type,
        charity_specialization: this.requestDetails.requestInfo.charity_type === 2
          ? this.requestDetails.requestInfo.charity_specialization
          : null
      };
      AdminPanelService.patchAdminRequestDetail(this.id, payload).then(
        ({ data: { result } }) => {
          this.$toast.add({
            severity: ToastSeverity.SUCCESS,
            detail: result,
            life: 3000
          });
          this.initialApprovalAdminRequestDetail();
        }
      );
    },
    accept() {
      this.displayAcceptModal = true;
    },
    activate() {
      this.displayActivateModal = true;
    },
    reject() {
      this.displayRejectModal = true;
    },
    async confirmAcceptModal() {
      if (this.enableSave) {
        await this.saveChanges();
      } else {
        this.initialApprovalAdminRequestDetail();
      }
    },
    initialApprovalAdminRequestDetail() {
      AdminPanelService.initialApprovalAdminRequestDetail(this.id, {
        charity_operation_ratio:
          this.requestDetails.requestInfo?.charity_operation_ratio || 0,
        charity_sustainability_ratio:
          this.requestDetails.requestInfo?.charity_sustainability_ratio || 0,
        number_of_active_requests_allowed:
          this.requestDetails.requestInfo?.number_of_active_requests_allowed || 0,
        number_of_requests_allowed_to_publish:
          this.requestDetails.requestInfo
            ?.number_of_requests_allowed_to_publish || 0,
        admin_user: 1
      }).then(({ data: { result } }) => {
        this.initialApprovalSuccessMessage = result;
        this.isRequestAccepted = true;
        this.generateAdminRequestAgreement();
      });
    },
    closeAcceptModal() {
      this.displayAcceptModal = false;
    },
    confirmRejectModal() {
      if (this.enableSave) this.saveChanges();

      AdminPanelService.rejectAdminRequestDetail(this.id, {
        admin_user: 1,
        ...(this.shouldShowRejectionComments && {
          reject_reasons: this.reject_reasons
        })
      }).then(({ data: { result } }) => {
        this.isRequestRejected = true;
      });
    },
    closeRejectModal() {
      this.displayRejectModal = false;
    },
    confirmActivateModal() {
      if (this.enableSave) this.saveChanges();

      AdminPanelService.approveAdminRequestDetail(this.id, {
        admin_user: 1
      }).then(({ data: { result } }) => {
        this.isAccountActivated = true;
      });
    },
    closeActivateModal() {
      this.displayActivateModal = false;
    },
    generateAdminRequestAgreement() {
      this.adminCanGenerateNewAgreement = false;
      AdminPanelService.generateAdminRequestAgreement(this.id, {
        admin_user: 1,
        charity_id: this.id
      }).then(({ data: { result } }) => {
        this.$toast.add({
          severity: ToastSeverity.SUCCESS,
          detail: result,
          life: 3000
        });
      });
    },
    query(id) {
      this.loading = true;
      AdminPanelService.getAdminRequestDetail(id).then(
        ({ data: { result } }) => {
          if (result && result.id) {
            this.shouldShowRejectionComments =
              result?.step === "pending_approval";
            result.isServiceProvider =
              result.number_of_service_provider_agreements ? "1" : "0";

            result.license_expiry_gregorian_date = new Date(
              result.license_expiry_gregorian_date
            );
            const gregorianDate = new Date(
              result.license_expiry_gregorian_date
            );
            this.dateHijriObj = toHijri(
              gregorianDate.getFullYear(),
              gregorianDate.getMonth() + 1,
              gregorianDate.getDate()
            );
            result.license_expiry_hijri_date = new Date(
              this.dateHijriObj.hy,
              this.dateHijriObj.hm - 1,
              this.dateHijriObj.hd
            );

            this.charity_operation_ratio = result.charity_operation_ratio;
            this.charity_sustainability_ratio =
              result.charity_sustainability_ratio;
            this.number_of_active_requests_allowed =
              result.number_of_active_requests_allowed;
            this.number_of_requests_allowed_to_publish =
              result.number_of_requests_allowed_to_publish;

            this.firstLoadData = { ...result };
            this.requestDetails.requestInfo = result;
            if (this.requestDetails?.requestInfo?.step === "pending_approval") {
              return;
            }
            AdminPanelService.getAdminRequestHistory(id).then(
              ({ data: { result } }) => {
                if (result) {
                  this.requestDetails.requestHistory = result;
                }
                this.loading = false;
              }
            );
          }
          this.loading = false;
        }
      );
      AdminPanelService.getAdminRequestAgreements(id).then(
        ({ data: { result } }) => {
          if (result) {
            let AgreementsByVersion = result.reduce((r, a, i) => {
              r[a.version] = r[a.version] || [];
              r[a.version].push(a);
              return r;
            }, Object.create(null));
            let index = 0;
            for (let item in AgreementsByVersion) {
              this.requestAgreementsByVersion.push(
                AgreementsByVersion[
                Object.entries(AgreementsByVersion).length - index
                  ]
              );
              index++;
            }
            this.requestDetails.requestAgreements =
              this.requestAgreementsByVersion;
          }
          this.loading = false;
        }
      );
    },
    fileChange(event, key) {
      if (
        event &&
        event.target &&
        event.target.files &&
        event.target.files.length
      ) {
        this.requestDetails.requestInfo[key] = event.target.files[0];
      }
    },
    showActionComments(item) {
      if (item.comments) {
        this.selectedAction = item;
        this.shouldShowActionComments = true;
      }
    },
    onOperationChanged() {
      setTimeout(() => {
        this.requestDetails.requestInfo.charity_sustainability_ratio = 10 -
          this.requestDetails.requestInfo.charity_operation_ratio;
      });
    },
    onSustainabilityChanged() {
      setTimeout(() => {
        this.requestDetails.requestInfo.charity_operation_ratio = 10 -
          this.requestDetails.requestInfo.charity_sustainability_ratio;
      });
    },
    checkIfAllRequiredFieldsAreFilled(obj) {
      let emptyFields = [];
      Object.keys(obj).forEach(key => {
        if (key !== "reject_reasons") {

          if (key === "charity_specialization") {
            if (obj["charity_type"] === 2 &&
              !obj["charity_specialization"])
              emptyFields.push(key);
          }
          else if (key === "isServiceProvider") {
            if (!obj["service_provider"]?.length) {
              emptyFields.push("service_provider");
            }
            else {
              obj["service_provider"].forEach((serviceProvider) => {
                if (!serviceProvider.discount || !serviceProvider.hospital_id) {
                  emptyFields.push("service_provider");
                }
              })
            }
          } else if (obj[key] === "" || obj[key] === null) {
            emptyFields.push(key);
          }
        }
      });
      return !emptyFields.length;
    }
  },
  computed: {
    adminActions() {
      return `${this.requestDetails.requestInfo?.charity_operation_ratio}|${this.requestDetails.requestInfo?.charity_sustainability_ratio}|${this.requestDetails.requestInfo?.number_of_active_requests_allowed}|${this.requestDetails.requestInfo?.number_of_requests_allowed_to_publish}`;
    }
  },
  watch: {
    "requestDetails.requestInfo": {
      handler(newVal) {
        if (newVal) {
          if (!this.firstLoad) {
            this.enableSave = this.checkIfAllRequiredFieldsAreFilled(newVal);
          }
          this.firstLoad = false;
        }
      },
      deep: true
    },
    adminActions(newVal) {
      let [
        charity_operation_ratio,
        charity_sustainability_ratio,
        number_of_active_requests_allowed,
        number_of_requests_allowed_to_publish
      ] = newVal.split("|");

      this.adminCanGenerateNewAgreement =
        Number(charity_operation_ratio) !==
        Number(this.charity_operation_ratio) ||
        Number(charity_sustainability_ratio) !==
        Number(this.charity_sustainability_ratio) ||
        Number(number_of_active_requests_allowed) !==
        Number(this.number_of_active_requests_allowed) ||
        Number(number_of_requests_allowed_to_publish) !==
        Number(this.number_of_requests_allowed_to_publish);
    }
  }
};
</script>

<style lang="scss" scoped>
.request-details {
  .request-header {
    .text {
      font-size: 24px;
      font-weight: bold;
    }

    .close-request {
      padding: 5px 15px;
      background: #d9d9d9;
      border-radius: 25px;

      a {
        color: black;
        text-decoration: none;
      }
    }
  }

  .info-section {
    ::v-deep(.p-accordion .p-accordion-content) {
      border: none;
    }

    ::v-deep(.p-accordion-tab) {
      margin-bottom: 1rem;
      box-shadow: 0 0 4px #3f3f3f1a;
    }

    ::v-deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;
      padding: 25px;
      background: white;
      color: black;
      border: none;

      &:focus {
        box-shadow: none;
      }

      .p-accordion-toggle-icon {
        &.pi-chevron-right {
          transform: rotate(180deg);
        }
      }
    }
  }

  .request-history {
    background: white;
    border-radius: 10px;

    .header {
      padding: 20px 25px;
      font-size: 23px;
      font-weight: bold;
    }

    :deep(.info-table tbody tr td) {
      max-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap !important;
    }
  }

  .admin-input-section {
    background: white;
    padding: 30px 20px;
    box-shadow: 1px 1px 14px #0000001a;
    border-radius: 10px;
  }

  ::v-deep(.p-inputnumber) {
    display: block;

    .p-inputnumber-input {
      width: 75%;
    }
  }

  .p-button {
    padding: 0.75rem 2rem;

    &.p-button-danger {
      background: #ffe7e6;
      border-color: #ffe7e6;
      color: #ff5757;
    }
  }
}

.accept-modal {
  .body {
    font-size: 20px;
    font-weight: bold;
  }

  .footer {
    text-align: center;
  }
}

.reject-modal {
  .body {
    .title {
      font-size: 20px;
    }

    .sub-title {
      font-size: 14px;
    }

    textarea {
      resize: none;
      direction: rtl;
    }
  }

  .footer {
    text-align: center;
  }
}

.confirmation-msg {
  .check-circle {
    background: #e4f8f0;
    padding: 1.5rem;
    border-radius: 50%;

    i {
      color: #1ea97c;
      font-size: 35px;
    }
  }

  .txt {
    text-align: center;
    color: #1ea97c;
    font-size: 25px;
  }

  a {
    text-decoration: none;
  }
}

::v-deep(.p-button.button-grey) {
  background: #d9d9d9;
  border-color: #d9d9d9;
  color: black;
  padding: 0.75rem 3rem;
}

.disabled {
  ::v-deep(input),
  ::v-deep(.p-dropdown) {
    background-color: #ececec !important;
    border-color: #d9d9d9 !important;
    color: #8c8c8c !important;
    opacity: 0.6;
    pointer-events: none;
  }

  ::v-deep(.btn),
  ::v-deep(.p-radiobutton),
  ::v-deep(.add-link) {
    opacity: 0.6;
    pointer-events: none;
  }
}

.w-5 {
  width: 5%;
}

.w-10 {
  width: 10%;
}

.w-15 {
  width: 15%;
}

.w-20 {
  width: 20%;
}

.w-45 {
  width: 45%;
}

.width-180 {
  width: 180px;
}

.dir-rtl {
  direction: rtl;
}

.space-pre {
  white-space: pre;
}
</style>
