<template>
  <Dialog
    :visible="showModal"
    :modal="true"
    :closable="false"
    class="payment-success-modal p-dialog-share"
    :showHeader="false"
    :breakpoints="{'1360px': '50vw', '1024px': '60vw', '960px': '90vw', '640px': '91vw'}" :style="{width: '30vw'}"
  >
    <div class="body">
      <div class="text-center my-4">
        <i class="pi pi-times-circle m-auto color-danger fs-large"></i>
      </div>
      <div class="color-danger text-center mb-3 fw-bold">
        لم تتم عملية التبرع بنجاح
      </div>
      <div class="text-center mb-4 pb-4 fw-bold border-bottom w-75 m-auto">
        {{ message }}
      </div>
      <div class="w-75 m-auto">
        <div class="text-center">
          <button
            id="submit-btn"
            class="btn btn-danger btn-lg submit-btn rounded-5 px-5"
            type="button"
            @click.prevent="close">
            الصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>

export default {
  name: "DonationFailureDialog",
  props: ["showModal", "message"],
  emits: ["close"],
  data() {
    return {};
  },
  methods: {
    close() {
      this.$router.push("/");
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>

.submit-btn {
  background-color: #EA5F6D;
}

.color-danger {
  color: #EA5F6D;
}

.fs-large {
  font-size: 70px;
}
</style>
