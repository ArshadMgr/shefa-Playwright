<template>
  <Dialog
    :visible="display"
    :closable="false"
    :showHeader="false"
    :modal="true"
    contentStyle="padding: 1.5rem!important;width:600px;border-radius:10px;"
  >
    <div dir="rtl">
      <div class="title mb-2 pb-2">هل أنت متأكد من حفظ التغييرات؟</div>
      <div class="row mt-4" style="padding: 0rem 5rem">
        <div class="col-6">
          <button
            id="close-btn"
            class="btn btn-lg btn-secondary btn-block close-btn"
            type="button"
            @click.prevent="close"
          >
            إغلاق
          </button>
        </div>
        <div class="col-6">
          <button
            id="tracking-btn"
            class="btn btn-lg btn-primary btn-block tracking-btn"
            type="button"
            @click.prevent="submit"
            data-cy="confirm-btn"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";

export default {
  components: { Dialog },
  props: ["display"],
  emits: ["toggleModal", "putCase"],
  methods: {
    submit() {
      this.$emit("toggleModal");
      this.$emit("putCase");
    },
    close() {
      this.$emit("toggleModal");
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-weight: 500;
  color: #3f3f3f;
  border-bottom: 1px solid #dadada;
  text-align: center;
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
