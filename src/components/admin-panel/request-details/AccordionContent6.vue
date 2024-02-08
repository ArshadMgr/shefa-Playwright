<template>
  <form class="form w-100">
    <div class="row">
      <div class="col-lg-6">
        <div
          v-for="(requestAgreementGroup, i) in requestAgreements"
          :key="i"
          :style="i < requestAgreements.length - 1
              ? 'border-bottom: 1px solid #dadada'
              : ''"
          :class="[{ 'mt-4': !!i }]">
          <div
            class="remove-link mb-2"
            v-if="requestAgreements.length > 1 && false">
            - إلغاء
          </div>
          <label class="mb-2 main-label">اتفاقية الشراكة v{{ requestAgreementGroup[0]?.version }}</label>
          <div v-for="(requestAgreement, i) in requestAgreementGroup" :key="i">
            <div class="mt-4" v-if="requestAgreement.type === 'singed_agreement'">
              <label style="color: #8c8c8c">اتفاقية الشراكة الموقعة</label>
              <div class="association-logo">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="logo"></div>
                  <div class="logo-name" :title="requestAgreement.file">{{ requestAgreement.file }}</div>
                  <div class="d-flex align-items-center">
                    <button
                      class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                      @click.prevent="downloadAgreement(requestAgreement.file)">
                      <div class="download-icon"></div>
                      تحميل الاتفاقية
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="requestAgreement.type === 'agreement'">
              <label style="color: #8c8c8c">اتفاقية الشراكة</label>
              <div class="association-logo">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="logo"></div>
                  <div class="logo-name" :title="requestAgreement.file">{{ requestAgreement.file }}</div>
                  <div class="file-action-btn">
                    <button
                      class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                      @click.prevent="downloadAgreement(requestAgreement.file)">
                      <div class="download-icon"></div>
                      تحميل الاتفاقية
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="add-link d-flex align-items-center justify-content-center mt-4"
          @click.stop="add">
          <div>
            <img src="../../../assets/images/plus.png" alt="plus" />
          </div>
          <div class="label">إصدار نسخة جديدة من الاتفاقية</div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import MediaService from "@/services/media.service";

export default {
  name: "accordian-content-6",
  props: ["requestAgreements", "adminCanGenerateNewAgreement"],
  emits: ["generateAdminRequestAgreement", "fileChange"],
  methods: {
    add() {
      this.$emit("generateAdminRequestAgreement");
    },
    downloadAgreement(url) {
      MediaService.downloadFile(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.main-label {
  color: #191919;
  font-size: 14px;
}

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

.modify-btn {
  border-radius: 25px;
  font-size: 14px;
  background-color: #d9d9d9;
  color: #3f3f3f;
  border: none;
  min-width: 140px;
}

.modify-btn:hover {
  background-color: #b2b2b2;
  color: #3f3f3f;
}

.association-logo {
  height: 80px;
  border-radius: 5px;
  border: 1px dashed #d9d9d9;
  padding: 10px 20px;

  .file-action-btn {
    flex: 0 0 140px;
  }
}

:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 16px;
}

.add-link {
  cursor: pointer;

  .label {
    color: #12b2aa;
    margin-right: 0.5rem;
  }

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.remove-link {
  cursor: pointer;
  text-align: right;
  font-size: 18px;
  color: #12b2aa;
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
</style>
