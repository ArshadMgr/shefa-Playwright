<template>
  <Dialog
    :visible="display"
    :closable="false"
    :showHeader="false"
    :modal="true"
    contentStyle="padding:1.5rem 3rem"
  >
    <div dir="rtl">
      <div class="mb-4 d-flex align-items-center justify-content-center">
        <div
          class="logo d-flex align-items-center justify-content-center"
          :style="`background-color:${is_success ? '#E4F8F0' : '#FFE7E6'}`"
        >
          <img
            :src="is_success ? '/success_logo.png' : '/error_logo.png'"
            alt="logo"
          />
        </div>
      </div>
      <div
        class="title pb-4"
        :style="`color:${is_success ? '#1EA97C' : '#FF5757'}`"
      >
        <span v-if="is_success"> تم إرسال طلبك بنجاح، جار مراجعة الطلب </span>
        <span v-else>
          بيانات مدير الجمعية غير صحيحة. يرجى المحاولة مرة أخرى
        </span>
      </div>
      <div class="mt-4 d-flex align-items-center justify-content-center">
        <button
          class="btn btn-lg btn-secondary btn-block"
          type="button"
          @click.stop="submit"
        >
          <span v-if="is_success"> العودة إلى الصفحة الرئيسية </span>
          <span v-else>العودة إلى الصفحة الرئيسية</span>
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";

export default {
  name: "after-submit-modal",
  components: { Dialog },
  props: ["display", "is_success"],
  emits: ["close"],
  methods: {
    submit() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.logo {
  height: 75px;
  width: 75px;
  border-radius: 50%;
}
.title {
  font-size: 22px;
  font-weight: 500;
  text-align: center;
  border-bottom: 1px solid #ececec;
}

.btn-secondary {
  border-radius: 25px;
  background-color: #d9d9d9;
  color: #3f3f3f;
  border: none;
  font-size: 18px;
  font-weight: 500;
}
.btn-secondary:hover {
  background-color: #b2b2b2;
  color: #3f3f3f;
}
</style>

<style>
.p-dialog-content {
  border-radius: 6px !important;
}
</style>
