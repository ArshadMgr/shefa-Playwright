<template>
  <Dialog
    :visible="display"
    :closable="false"
    :showHeader="false"
    :modal="true"
    contentStyle="padding: 1.5rem 1rem !important;width: 70vw;"
  >
    <div dir="rtl">
      <div class="title">هناك طلبات على نفس رقم الهوية</div>
      <div v-if="!caseCreation" class="case-list">
        <Card
          v-for="(caseDetails, index) in cases"
          :key="index"
          :class="[
            { 'mb-4': index < cases.length - 1 ? true : false },
            { 'mb-1': index < cases.length - 1 ? false : true },
          ]"
        >
          <template #header>
            <div class="row">
              <div class="col-1">رقم الحالة</div>
              <div class="col-2">تاريخ الانشاء</div>
              <div class="col-2">التخصص</div>
              <div class="col-2">الحالة</div>
              <div class="col-5"></div>
            </div>
          </template>
          <template #content>
            <div class="row mb-2">
              <div class="col-1">{{ caseDetails.id }}</div>
              <div class="col-2">{{ caseDetails.createdOn }}</div>
              <div class="col-2">{{ caseDetails.specialty }}</div>
              <div class="col-2">{{ caseDetails.status.name }}</div>
              <div class="col-5">
                <div class="d-flex align-items-center">
                  <div style="margin-left: 1rem">
                    <button
                      class="btn icon-btn"
                      @click.prevent="
                        () => {
                          submit();
                          $router.push(
                            `/admin-panel/auditor-case-detail/view/${caseDetails.id}?obj_type=case`
                          );
                        }
                      "
                    >
                      <div class="eye-icon"></div>
                      عرض الحالة
                    </button>
                  </div>
                  <div>
                    <button
                      class="btn icon-btn"
                      @click.prevent="
                        downloadAgreement(caseDetails.medicalReport)
                      "
                    >
                      <div class="download-icon"></div>
                      تحميل التقرير الطبي
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="row"
              v-for="(phase, phase_index) in caseDetails.phases"
              :key="phase_index"
              style="background-color: #f9f9f9; padding: 0.5rem 0rem"
            >
              <div class="col-1">{{ phase.id }}</div>
              <div class="col-2">{{ caseDetails.createdOn }}</div>
              <div class="col-2">{{ caseDetails.specialty }}</div>
              <div class="col-2">{{ phase.status.name }}</div>
              <div class="col-5">
                <button
                  class="btn icon-btn"
                  @click.prevent="
                    () => {
                      submit();
                      $router.push(
                        `/admin-panel/auditor-case-detail/view/${phase.id}?obj_type=phase`
                      );
                    }
                  "
                >
                  <div class="eye-icon"></div>
                  عرض الحالة
                </button>
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div v-else class="case-list">
        <Card
            v-for="(caseDetails, index) in cases"
            :key="index"
            :class="[
            { 'mb-4': index < cases.length - 1 },
            { 'mb-1': index>=cases.length - 1 },
          ]"
        >
          <template #header>
            <div class="row">
              <div class="col-1">رقم الحالة</div>
              <div class="col-2">تاريخ الانشاء</div>
              <div class="col-2">الجمعية</div>
              <div class="col-2">التخصص</div>
              <div class="col-2">الحالة</div>
              <div class="col-auto mx-auto"></div>
            </div>
          </template>
          <template #content>
            <div class="row mb-2">
              <div class="col-1">{{ caseDetails.id }}</div>
              <div class="col-2">{{ formatCreationDate(caseDetails.created_on) }}</div>
              <div class="col-2">{{ caseDetails.charity_name ? caseDetails.charity_name : '-' }}</div>
              <div class="col-2">{{ caseDetails.specialty_name ? caseDetails.specialty_name : '-' }}</div>
              <div class="col-2 color-font-lighter">{{ caseDetails.status ? caseDetails.status : '-' }}</div>
              <div class="col-auto mx-auto">
                <div class="d-flex align-items-center">
                  <div>
                    <button
                        v-if="caseDetails.medical_report_url"
                        class="btn icon-btn"
                        @click.prevent="downloadAgreement(caseDetails.medical_report_url)">
                      <div class="download-icon"></div>
                      تحميل التقرير الطبي
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-3">
          <button
            id="close-btn"
            class="btn btn-lg btn-secondary btn-block close-btn"
            type="button"
            @click.prevent="close">
            اغلاق الطلب
          </button>
        </div>
        <div class="col-3">
          <button
            id="tracking-btn"
            class="btn btn-lg btn-primary btn-block tracking-btn"
            data-cy="tracking-btn"
            type="button"
            @click.prevent="submit"
          >
            متابعة
          </button>
        </div>
        <div class="col-3"></div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import MediaService from "@/services/media.service";
import formatDateMixin from "@/mixins/formatDateMixin";

export default {
  name: "other-cases-exist",
  components: { Dialog },
  mixins: [formatDateMixin],
  props: ["display", "cases", "caseCreation"],
  emits: ["toggleModal", "submit", "close"],
  methods: {
    submit() {
      this.$emit("submit");
      this.$emit("toggleModal");
    },
    close() {
      this.$emit("close");
      this.$emit("toggleModal");
    },
    downloadAgreement(medicalReport) {
      MediaService.downloadFile(medicalReport);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/helpers";
.title {
  color: #3f3f3f;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 2rem;
}

::v-deep(.p-card) {
  width: 100%;
  box-shadow: 0px 0px 4px #3f3f3f1a;
  border-radius: 10px;
  overflow: hidden;
  .p-card-header {
    padding: 1rem 1.2rem;
    background-color: #d4d4d4;
  }
  .p-card-body {
    padding-top: 0;
    padding-bottom: 0;
    box-shadow: none;
  }
}

.case-list {
  max-height: 350px;
  padding: 0rem 0.5rem;
  overflow: auto;
}

/* width */
.case-list::-webkit-scrollbar {
  width: 10px;
}

/* Track */
.case-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
.case-list::-webkit-scrollbar-thumb {
  background: #d4d4d4;
}

/* Handle on hover */
.case-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.eye-icon {
  background: url("../../../assets/icons/view.png");
  width: 16px;
  height: 16px;
  margin: 0 0.3rem;
}
.download-icon {
  background: url("../../../assets/icons/download-gray.svg");
  width: 15px;
  height: 15px;
  margin: 0 0.3rem;
  transform: rotate(180deg);
}
.icon-btn {
  font-size: 14px;
  border-radius: 25px;
  background: #d9d9d9;
  color: #3f3f3f;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-btn:hover {
  background: #b2b2b2;
  color: #3f3f3f;
}
.tracking-btn {
  display: block;
  margin: 0 auto;
  width: 100%;
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
  width: 100%;
  border-radius: 25px;
  padding: 10px;
  background: #d9d9d9;
  color: #3f3f3f;
  border: none;
  font-size: 18px;
}
</style>
