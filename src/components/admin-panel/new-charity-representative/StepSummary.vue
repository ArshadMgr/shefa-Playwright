<template>
  <section>
    <div class="welcome-container row">
      <div class="col-12 title">
        يرجى التأكد من بيانات ممثل الجمعية قبل المتابعة:
      </div>
      <div class="mt-3">
        <div class="d-flex mt-1">
          <span>الاسم الاول: </span><span>{{ payload.first_name }}</span>
        </div>
        <div class="d-flex mt-1"><span>اسم الاب:</span><span>{{ payload.father_name }}</span></div>
        <div class="d-flex mt-1">
          <span>اسم العائلة: </span><span>{{ payload.last_name }}</span>
        </div>
        <div class="d-flex mt-1">
          <span>تاريخ انتهاء الهوية: </span><span>{{ payload.identity_expiry_date }}</span>
        </div>
        <div class="d-flex mt-1"><span>جنس: </span><span>{{ payload.gender }}</span></div>
      </div>
      <div class="row border-top-spacer">
        <div class="col-lg-6">
          <Button
            id="close-btn"
            label="إغلاق"
            class="p-button p-button-rounded p-button-secondary px-5 mx-2 w-100"
            type="button"
            @click.stop="goBack"
          />
        </div>
        <div class="col-lg-6">
          <Button
            id="tracking-btn"
            label="متابعة"
            class="p-button p-button-rounded p-button-primary px-5 mx-2 w-100"
            @click="submit"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { defineProps, reactive } from "vue";

const props = defineProps({
  payload: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(["submit", "previous"]);

const state = reactive({
  form: Object.assign({}, props.payload),
  error: "",
  submitted: false,
});

const goBack = () => {
  emit("previous");
};

const submit = () => {
  state.submitted = true;
  emit("submit", state.form);
};
</script>
<style lang="scss" scoped>
.welcome-container {
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  .sub-title {
    font-size: 18px;
  }
}
.border-top-spacer {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
}
</style>
