<template>
  <Dialog class="p-dialog-share" v-model:visible="displayShareDialog"
          header="ساهم في العلاج عن طريق مشاركتك الحالة للآخرين" :dismissableMask="true" :modal="true" appendTo="#app"
          :draggable="false" :breakpoints="{'600px': '75vw', '640px': '100vw'}" :style="{width: '600px'}">
    <div v-if="!$store.getters.isAuthenticated">
      <span class="d-block mt-5 text-center">تسجيل الدخول سيمكنك من تتبع أثرك</span>
      <div class="d-flex justify-content-center mt-3">
        <router-link :to="'/sign-in?tab=0'">
          <Button class="p-button p-button-rounded p-button-primary px-5 mx-auto" label="تسجيل الدخول" />
        </router-link>
      </div>
    </div>
    <span v-else class="d-block mt-5 text-center">يمكنك تتبع مبلغ التبرعات من خلال مشاركة هذا الرابط</span>
    <span class="input-wrapper mt-4">
      <div>
        <InputText type="text" v-model="sharableLink_" disabled ref="shareInput" />
        <Button class="p-input-text__icon-wrapper" @click="copyLink">
          <i class="pi pi-copy" />
        </Button>
      </div>
    </span>
    <div class="social-media-buttons d-flex justify-content-center mt-4">
      <Button icon="pi pi-whatsapp"
              class="p-button-rounded button-info social-media-buttons__button mx-2 social-media-buttons--whatsapp"
              @click="onShareClicked('whatsapp')" />
      <Button icon="pi pi-twitter"
              class="p-button-rounded button-info social-media-buttons__button mx-2  social-media-buttons--twitter"
              @click="onShareClicked('twitter')" />
      <Button icon="pi pi-facebook"
              class="p-button-rounded button-info social-media-buttons__button mx-2 social-media-buttons--facebook"
              @click="onShareClicked('facebook')" />
    </div>
  </Dialog>

  <div class="share-tag" @click.stop="openShareDialog">
    <i class="pi pi-share-alt mx-2 share-icon"></i>
  </div>

</template>

<script>
import { ToastSeverity } from "primevue/api";

export default {
  name: "share",
  props: ["sharableLink"],
  data() {
    return {
      displayShareDialog: false,
      sharableLink_: this.$props.sharableLink
    };
  },
  methods: {
    openShareDialog() {
      this.displayShareDialog = true;
    },
    copyLink() {
      navigator.clipboard.writeText(this.sharableLink);
      if (this.sharableLink) {
        this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم نسخه بنجاح", life: 3000 });
      }
    },
    onShareClicked(platform) {
      const urls = {
        facebook: `https://www.facebook.com/sharer.php?u=${this.sharableLink}`,
        whatsapp: `https://wa.me/?text=${this.sharableLink}`,
        twitter: `https://twitter.com/share?url=${this.sharableLink}`
      };

      window.open(urls[platform], "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>

@import "@/styles/variables";

.share-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  padding: 0.8rem 1.5rem;
  background-color: $color-primary;
  color: white;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
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
</style>
