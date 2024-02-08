<template>
  <Dialog class="p-dialog-share" v-model:visible="show" :header="header" :dismissableMask="true" :modal="true" :draggable="false" :breakpoints="{'600px': '75vw', '640px': '90vw'}" :style="{width: '600px'}">
    <div>
      <div v-if="authenticated && showSigninInfo">
        <span class="d-block mt-3 mt-sm-5 text-center">تسجيل الدخول سيمكنك من تتبع أثرك</span>
        <div class="d-flex justify-content-center mt-3">
          <router-link :to="'/sign-in?tab=0'">
            <Button class="p-button p-button-rounded p-button-primary px-5 mx-auto" label="تسجيل الدخول" data-cy="sign-in-btn" />
          </router-link>
        </div>
      </div>
      <span v-else-if="!authenticated && showSigninInfo"
            class="d-block mt-3 mt-sm-5 text-center">
        يمكنك تتبع مبلغ التبرعات من خلال مشاركة هذا الرابط
      </span>
      <span class="input-wrapper mt-4">
      <div>
        <InputText type="text" :value="sharableLink" disabled ref="shareInput" data-cy="copy-link-input"/>
        <Button class="p-input-text__icon-wrapper" @click="copyLink" data-cy="copy-link-btn">
          <i class="pi pi-copy" />
        </Button>
      </div>
    </span>
      <div class="social-media-buttons d-flex justify-content-center mt-4">
        <a :href="whatsappLink" target="_blank">
          <Button icon="pi pi-whatsapp" data-cy="whatsapp-share-btn" class="p-button-rounded button-info social-media-buttons__button mx-2 social-media-buttons--whatsapp" />
        </a>
        <a :href="twitterLink" target="_blank">
          <Button icon="pi pi-twitter" data-cy="twitter-share-btn" class="p-button-rounded button-info social-media-buttons__button mx-2  social-media-buttons--twitter" />
        </a>
        <a :href="facebookLink" target="_blank">
          <Button icon="pi pi-facebook" data-cy="facebook-share-btn" class="p-button-rounded button-info social-media-buttons__button mx-2 social-media-buttons--facebook" />
        </a>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    header: {
      type: String,
      required: false,
    },
    authenticated: {
      type: Boolean,
      required: true,
      default: false
    },
    showSigninInfo: {
      type: Boolean,
      required: true,
      default: true
    },
    sharableLink: {
      type: String,
      required: true
    },
    facebookLink: {
      type: String,
      required: true,
    },
    twitterLink: {
      type: String,
      required: true,
    },
    whatsappLink: {
      type: String,
      required: true,
    },
  },
  components: { Dialog },
  emits: ["close", "copy"],
  methods: {
    copyLink() {
      this.$emit("copy");
    },
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set() {
        this.$emit('close')
      }
    }
  },
}
</script>

<style lang="scss">
@import "@/styles/variables";

.social-media-buttons {
  &__button {
    width: 66px !important;
    height: 66px !important;
  }
  &--whatsapp {
    background-color: $color-whatsapp-green !important;
    border-color: $color-whatsapp-green !important;
    &:hover {
      border-color: $color-whatsapp-green-hover !important;
      background-color: $color-whatsapp-green-hover !important;
    }
  }
  &--twitter {
    background-color: $color-twitter-blue !important;
    border-color: $color-twitter-blue !important;
    &:hover {
      border-color: $color-twitter-blue-hover !important;
      background-color: $color-twitter-blue-hover !important;
    }
  }
  &--facebook {
    background-color: $color-facebook-blue !important;
    border-color: $color-facebook-blue !important;
    &:hover {
      border-color: $color-facebook-blue-hover !important;
      background-color: $color-facebook-blue-hover !important;
    }
  }
  .p-button-icon {
    font-size: 30px !important;
  }
}

a {
  text-decoration: none !important;
}
</style>
