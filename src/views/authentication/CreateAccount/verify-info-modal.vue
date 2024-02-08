<template>
  <Dialog
    :visible="display"
    :closable="false"
    :showHeader="false"
    :modal="true"
    contentStyle="padding:1.5rem 3rem"
  >
    <div dir="rtl">
      <div style="font-size: 18px; color: #3f3f3f" class="mb-3">
        يرجى التأكد من بيانات مدير الجمعية قبل المتابعة:
      </div>
      <div
        style="
          font-size: 14px;
          color: #3f3f3f;
          padding: 1rem 0rem;
          border-bottom: 1px solid #ececec;
        "
      >
        <div>الاسم الاول : {{ verified_info.first_name }}</div>
        <div>اللقب : {{ verified_info.last_name }}</div>
        <div>اسم الاب : {{ verified_info.father_name }}</div>
        <div>
          تاريخ انتهاء الصلاحية : {{ verified_info.identity_card_expiry }}
        </div>
        <div>جنس : {{ verified_info.gender }}</div>
      </div>
      <div
        class="action-container d-flex align-items-center justify-content-center"
      >
        <button
          class="btn btn-lg btn-secondary btn-block close-btn mt-4"
          @click.stop="close"
        >
          إغلاق
        </button>
        <button
          class="btn btn-lg btn-primary btn-block tracking-btn mt-4"
          @click.stop="submit"
        >
          متابعة
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";

export default {
  name: "verification-modal",
  components: { Dialog },
  props: ["display", "verified_info"],
  emits: ["submit"],
  methods: {
    submit() {
      this.$emit('submit');
      this.$router.push("/create-account/2");
    },
    close() {
      this.$emit('submit');
      this.$router.push("/sign-in?tab=1");
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  color: #3f3f3f;
  font-size: 20px;
}
.digit {
  border-radius: 5px;
  border-color: #d9d9d9;
  height: 50px;
  width: 50px;
  margin: 0.5rem;
}
.send-again-link {
  cursor: pointer;
  text-align: center;
  color: #12b2aa;
  font-size: 12px;
  text-decoration: underline;
  border-bottom: 1px solid #ececec;
}
.verification-btn {
  margin: 0rem 0.5rem;
  padding: 0.5rem 3rem;
  background-color: #d9d9d9;
  border-color: #d9d9d9;
  border-radius: 25px;
  color: #3f3f3f;
  font-size: 18px;
}
.verification-btn:disabled {
  background-color: #ececec;
  border-color: #ececec;
}
.verification-btn:hover {
  background-color: #b2b2b2;
  border-color: #b2b2b2;
  color: #3f3f3f;
}
.tracking-btn {
  display: block;
  margin: 0 auto;
  padding: 0.5rem 3rem;
  border-radius: 25px;
  background: #12b2aa;
  color: #ffffff;
  border: none;
  font-size: 18px;
}

.tracking-btn:hover {
  background: #0e8e88;
  border: none;
}

.close-btn {
  display: block;
  margin: 0 auto;
  padding: 0.5rem 3rem;
  border-radius: 25px;
  background: #d9d9d9;
  color: #3f3f3f;
  border: none;
  font-size: 18px;
}

.close-btn:hover {
  background: #b2b2b2;
  color: #3f3f3f;
  border: none;
}
</style>
