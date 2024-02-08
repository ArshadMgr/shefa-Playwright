<template>
  <div class="p-5 m-lg-5 bg-white">
    <div class="title fs-4 fw-bold mb-4">
      إنشاء حملة
    </div>
    <form>
      <div class="row mb-lg-4">
        <div class="col-md-6">
          <div class="form-label-group mb-3">
            <div class="mt-4" data-cy='companign-type'>
              <Dropdown
                optionLabel="name"
                optionValue="id"
                v-model="campaignToAdd.typ"
                class="w-100"
                :options="campaignTypes"
                placeholder="نوع الحملة"
                @change="campaignToAdd.specialty = 1"
              />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-label-group mb-3">
            <div class="mt-4" data-cy='compaign-name'>
              <Dropdown
                optionLabel="name"
                optionValue="id"
                v-model="campaignToAdd.title_typ"
                class="w-100"
                :options="campaignNames"
                placeholder="اسم الحملة"
                @change="onNameChange"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-lg-4">
        <div class="col-md-6">
          <div class="form-label-group mb-3">
            <div class="mt-4">
                <span class="p-float-label" data-cy='benefactor-name'>
                  <InputText
                    id="benefactorName"
                    v-model="campaignToAdd.on_behalf_of"
                    class="w-100"
                    @blur="onNameChange"
                  />
                  <label for="benefactorName">اسم المتبرع عنه</label>
                </span>
              <span>{{ fullName }}</span>
            </div>
          </div>
        </div>
        <div class="col-md-6 position-relative">
          <div class="form-label-group mb-3">
            <div class="mt-4">
                <span class="p-float-label">
                  <InputNumber
                    id="target"
                    v-model="campaignToAdd.target"
                    class="w-100"
                    :min="1000"
                    :max="100000"
                  />
                  <label for="target">المبلغ المستهدف</label>
                </span>
            </div>
            <span class="disclaimer position-absolute mt-1">القيمة الأدني للحملة هي 1000 ريال .المبلغ الأقصى للحملة 100,000 ريال</span>
          </div>
        </div>
      </div>
      <div class="row mb-lg-4 mt-3 mt-md-0">
        <div class="col-md-6">
          <div class="form-label-group mb-3">
            <div class="mt-4">
                <span class="p-float-label">
                  <InputNumber
                    id="interval"
                    v-model="campaignToAdd.interval"
                    class="w-100"
                    :min="0"
                    :max="30"
                  />
                  <label for="interval">مدة الحملة</label>
                </span>
            </div>
            <span class="disclaimer">الحد الاقصى 30 يوم</span>
          </div>
        </div>
        <div class="col-md-6" v-if="campaignToAdd.typ === 'Most_Urgent'">
          <div class="form-label-group mb-3">
            <div class="mt-4">
              <Dropdown
                optionLabel="name"
                optionValue="id"
                v-model="campaignToAdd.specialty"
                class="w-100"
                :options="diseases"
                placeholder="التخصص"
                :filter="true"
              />
              <span v-if="campaignToAdd.specialty === 1">تذهب جميع التبرعات للحالات المرضية الأكثر حاجة</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-4 terms-conditions">بالضغط على تأكيد فأنت توافق على
        <router-link to="/privacy-policy" target="_blank" class="text-decoration-underline">
          <span class="color-primary text-decoration-underline">الشروط والأحكام</span>
        </router-link>
      </div>
      <div>
        <Button
          label="إغلاق"
          class="p-button-secondary p-button-rounded mx-2 col-5 col-md-3 col-xl-2"
          @click="close"
        />
        <Button
          label="تأكيد"
          class="p-button-primary p-button-rounded mx-2 col-5 col-md-3 col-xl-2"
          @click.stop="create"
          :disabled="!(campaignToAdd.typ &&
          campaignToAdd.title_typ &&
          campaignToAdd.on_behalf_of &&
          campaignToAdd.target &&
          campaignToAdd.interval)"
        />
      </div>
    </form>
  </div>
  <Dialog
    :visible="shouldSuccessPopup"
    :breakpoints="{ '1360px': '50vw', '960px': '60vw', '640px': '90vw' }"
    :style="{ width: '35vw' }"
    :modal="true"
    :closable="false"
    class="accept-modal p-dialog-share"
    :showHeader="false"
  >
    <div class="body">
      <div class="text-end">
        <i class="pi pi-times" @click="close"></i>
      </div>
      <div class="share-icon m-auto"></div>
      <span class="d-block my-2 text-center">يمكنك تتبع مبلغ التبرعات من خلال مشاركة هذا الرابط</span>
      <span class="input-wrapper mt-4">
      <div>
        <InputText type="text" v-model="sharableLink" disabled ref="shareInput" />
        <Button class="p-input-text__icon-wrapper" @click="copyLink">
          <i class="pi pi-copy" />
        </Button>
      </div>
    </span>
      <div class="social-media-buttons d-flex justify-content-center mt-4">
        <a :href="whatsappLink" target="_blank">
          <Button icon="pi pi-whatsapp" class="p-button-rounded button-info social-media-buttons__button mx-2 social-media-buttons--whatsapp" />
        </a>
        <a :href="twitterLink" target="_blank">
          <Button icon="pi pi-twitter" class="p-button-rounded button-info social-media-buttons__button mx-2  social-media-buttons--twitter" />
        </a>
        <a :href="facebookLink" target="_blank">
          <Button icon="pi pi-facebook" class="p-button-rounded button-info social-media-buttons__button mx-2 social-media-buttons--facebook" />
        </a>
      </div>
    </div>
  </Dialog>
</template>

<script>

import WalletService from "@/services/wallet.service";
import { ToastSeverity } from "primevue/api";
import CampaignsService from "@/services/campaigns.service";

export default {
  name: "Create",
  data() {
    return {
      diseases: [],
      campaignTypes: [
        {
          id: "Most_Urgent",
          name: "المرضى الأشد حاجة"
        },
        {
          id: "Waqf_sehi",
          name: "وقف صحي"
        }
      ],
      campaignNames: [
        {
          id: "Passed_Male",
          name: "صدقة عن .... رحمه الله"
        },
        {
          id: "Passed_Female",
          name: "صدقة عن .... رحمها الله"
        },
        {
          id: "Sickness",
          name: "صدقة بنية شفاء ...."
        },
        {
          id: "Generic",
          name: "صدقة عن ...."
        }
      ],
      campaignToAdd: {
        interval: 30
      },
      fullName: "",
      shouldSuccessPopup: false,
      sharableLink: process.env.VUE_APP_FE_URL + '/donate-campaign/',
      facebookLink: '',
      whatsappLink: '',
      twitterLink: ''
    };
  },
  mounted() {
    this.getDiseases();
    this.facebookLink = `https://www.facebook.com/sharer.php?u=${this.sharableLink}`;
    this.whatsappLink = `https://wa.me/?text=${this.sharableLink}`;
    this.twitterLink = `https://twitter.com/share?url=${this.sharableLink}`;
  },
  methods: {

    create() {

      this.campaignToAdd.specialty = this.campaignToAdd.specialty === 0 ? null : this.campaignToAdd.specialty;

      CampaignsService.createCampaign(this.campaignToAdd)
        .then(({ data: { result: { id } } }) => {
          this.sharableLink += id;
          this.shouldSuccessPopup = true;
        });
    },
    close() {
      this.shouldSuccessPopup = false;
      this.$router.push("/admin-panel/campaigns");
    },
    getDiseases() {
      WalletService.getDiseases()
        .then(({ data: { result: { case_specialty } } }) => {
          this.diseases = case_specialty;
          this.campaignToAdd.specialty = this.diseases[0].id;
        });
    },
    onNameChange() {
      if (!this.campaignToAdd.on_behalf_of || !this.campaignToAdd.title_typ) {
        this.fullName = "";
      } else {
        const selectedCampaignName = this.campaignNames.find(name => name.id === this.campaignToAdd.title_typ)?.name;
        this.fullName = selectedCampaignName.replace("....", this.campaignToAdd.on_behalf_of);
      }
    },
    copyLink() {
      navigator.clipboard.writeText(this.sharableLink);
      if (this.sharableLink) {
        this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم النسخ بنجاح", life: 3000 });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

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

  &:hover {
    background-color: #b2b2b2;
    color: #3f3f3f;
  }
}

.association-logo {
  height: 80px;
  border-radius: 5px;
  border: 1px dashed #d9d9d9;
  padding: 10px 20px;
}

::v-deep(.p-card) {
  max-width: 500px;
  box-shadow: $box-shadow-card;
  border-radius: $border-radius-default;
  margin-bottom: 8rem;

  .p-card-body {
    box-shadow: none;
  }
}

:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 16px;
}

.color-primary {
  color: $color-primary;
}

.color-secondary {
  color: $color-font-lighter;
}

.disclaimer {
  font-size: 13px;
  color: #6c757d;
}

.terms-conditions {
  font-size: min(4vw, 1.25rem);
}

.share-icon {
  width: 160px;
  height: 130px;
  background: url("../../../assets/icons/share-icon.svg") no-repeat;
}
</style>

