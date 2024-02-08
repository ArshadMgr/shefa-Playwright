<template>
  <ShareDialog :visible="displayShareDialog"
               header="ساهم في العلاج عن طريق مشاركتك الحالة للآخرين"
               :authenticated="!$store.getters.isAuthenticated"
               :sharableLink="sharableLink"
               :facebookLink="facebookLink"
               :twitterLink="twitterLink"
               :whatsappLink="whatsappLink"
               :showSigninInfo="false"
               @close="closeShareDialog"
               @copy="copyLink" />
  <Card class="card-board__item case-card-item">

    <template #header>
      <div class="position-relative">
        <img class="condition-img"
             :src="(case_.urls?.case_image && case_.urls?.case_image[0]) || case_.urls?.id_photo"
             alt="صورة الحالة">
        <div class="overlay"></div>
        <img class="charity-image position-absolute" :src="case_.urls?.charity_image" alt="صورة الجمعية">
      </div>
      <div class="remaining_amount_card">
        <div class="d-flex justify-content-center align-items-center p-3 color-primary">
          <div class="completed-icon"></div>
          <div>بعطائكم اكتملت فرصة التبرع</div>
        </div>
        <div class="remaining_amount_card__details">
          <div>
            <span>{{ case_.id }}</span>
            <span class="color-complementary">#</span>
          </div>
          <span class="color-complementary">تفاصيل الحالة</span>
        </div>
      </div>
    </template>
    <template #content>
      <div>
        <div class="row">
          <div class="mt-2 fw-bold title" :title="case_.story_title">
            {{ case_.story_title }}
          </div>
        </div>
        <div class="row">
          <div class="condition-description mt-2" :title="case_.story">
            {{ case_.story }}
          </div>
        </div>
        <div class="row">
          <div class="d-flex align-items-center justify-content-around h-50p">
            <div class="col-6 text-center d-flex justify-content-center align-items-center">
              <div>
                <i class="pi pi-map-marker color-primary mx-2"></i>
              </div>
              <div>
                <span class="fw-semibold">{{ case_.area_name }}</span>
              </div>
            </div>
            <div class="col-6 text-center d-flex justify-content-center align-items-center">
              <div>
                <img class="speciality-icon mx-2" alt="speciality icon"
                     :src="case_.specialty_image"
                     v-if="case_.specialty_image">
                <img class="speciality-icon mx-2" alt="speciality icon"
                     src="../../assets/icons/generic-case-icon.svg"
                     v-else>
              </div>
              <div>
                <span class="fw-semibold">{{ case_.specialty_name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="d-flex justify-content-center align-items-center">
        <div class="text-center color-gray flex-1">
          مكتملة
        </div>
        <div class="share-tag" @click.stop="openShareDialog">
          <i class="pi pi-share-alt mx-2 share-icon"></i>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import ShareDialog from "@/components/layout/ShareDialog.vue";
import BaseSpinner from "@/components/layout/BaseSpinner.vue";

import JwtUtilService from "@/services/jwt.util.service";
import AmbassadorService from "@/services/ambassador.service";

import ToastService from "primevue/toastservice";
import { ToastSeverity } from "primevue/api";

export default {
  name: "completed-case-card",
  components: { BaseSpinner, ShareDialog },
  data() {
    return {
      canDonate: JwtUtilService.getClientID()?.includes("doner") || !this.$store.getters.isAuthenticated,
      canShareTrackableLink: JwtUtilService.getClientID()?.includes("doner") && this.$store.getters.isAuthenticated,
      displayShareDialog: false,
      sharableLink: `${process.env.VUE_APP_FE_URL}/donate-case/${this.case_?.id}`,
      FEURL: process.env.VUE_APP_FE_URL,
      loading: false
    };
  },
  props: {
    case_: {},
    close: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    isBrowserMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
      } else {
        return false;
      }
    },
    openShareDialog() {
      if (this.canShareTrackableLink) {
        this.createLink();
      }
      this.displayShareDialog = true;
    },
    closeShareDialog() {
      this.displayShareDialog = false;
    },
    async createLink() {
      this.loading = true;
      await AmbassadorService.postCaseNumber({ case: this.case_?.id }).then((response) => {
        const result = response.data.result;
        this.sharableLink = `${this.FEURL}/ambassador-link/${result.id}`;
        this.loading = false;
      });
    },
    copyLink() {
      navigator.clipboard.writeText(this.sharableLink);
      if (this.sharableLink) {
        this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم نسخه بنجاح", life: 3000 });
      }
    }
  },
  computed: {
    //@TODO: for future reference: check if browser is mobile (this.isBrowserMobile()) and open in app if true
    facebookLink() {
      return `https://www.facebook.com/sharer.php?u=${this.sharableLink}`;
    },
    twitterLink() {
      return `https://twitter.com/share?url=${this.sharableLink}`;
    },
    whatsappLink() {
      return `https://wa.me/?text=${this.sharableLink}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";

.case-card-item {
  width: 100%;
  max-width: 450px;
  margin: auto auto 30px;
  padding: 10px 10px 0 8px;
  background-color: white;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  min-height: 500px;
  -webkit-box-shadow: 0 3px 10px 1px rgba(153, 153, 153, 0.27);
  -moz-box-shadow: 0 3px 10px 1px rgba(153, 153, 153, 0.27);
  box-shadow: 0 3px 10px 1px rgba(153, 153, 153, 0.27);
  font-size: 14px;

  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .remaining_amount_card {
    width: 90%;
    margin: auto;
    background-color: white;
    border-radius: 0 0 9px 9px;
    box-shadow: $box-shadow-tile;
    z-index: 10;
    top: 140px;
    right: 23px;
    overflow: hidden;

    &__details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 600;
      background-color: $color-gray-lighter;
      border-radius: 0 0 8px 8px;
    }
  }

  .condition-img {
    height: 200px;
    border-radius: 10px;
    object-fit: cover;
    vertical-align: middle;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: black;
    opacity: 1;
    mix-blend-mode: color;
  }

  .charity-image {
    width: 50px;
    height: 50px;
    top: 5px;
    left: 5px;
    clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  }

  .share-tag {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 50px;
    padding: 0.8rem 1.5rem;
    background-color: #E9E9E9;
    color: #4776B9;
    border-radius: 8px;
    cursor: pointer;
    top: 15px;
    right: -10px;
    transition: all .2s ease-in-out;

    &:hover {
      background-color: $color-primary-hover;
    }

    .whatsapp-icon,
    .facebook-icon,
    .twitter-icon {
      display: none;
    }
  }

  .completed-tag {
    position: relative;
    width: 180px;
    margin: auto;
    background-color: white;
    border-radius: 9px;
    -webkit-box-shadow: 0 3px 10px 1px rgba(153, 153, 153, 0.27);
    -moz-box-shadow: 0 3px 10px 1px rgba(153, 153, 153, 0.27);
    box-shadow: 0 3px 10px 1px rgba(153, 153, 153, 0.27);
    z-index: 10;
    bottom: 62px;
  }

  .condition-description {
    color: #585858;
    font-size: 15px;
    height: 72px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .completed-icon {
    width: 41px;
    height: 45px;
    background-image: url("../../assets/icons/completedicon.svg");
  }

  a {
    color: white;
    text-decoration: none;
  }
}

::v-deep(.p-card-content) {
  padding: 0 !important;
  border-bottom: 1px solid #e5e5e5;
}

.dir-rtl {
  direction: rtl;
}

.color-primary {
  color: $color-primary;
}

.color-gray {
  color: $color-font-lighter;
}

.h-50p {
  height: 50px;
}

.color-complementary {
  color: $color-complementary;
}

.flex-1 {
  flex: 1;
}
</style>
