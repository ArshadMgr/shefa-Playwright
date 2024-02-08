<template>
  <div>
    <form class="form-procedures w-100">
      <div class="form-procedures__select-group">
        <div class="row">
          <div class="form-label-group mb-3 col-6">
            <div class="mt-4">
              <Dropdown
                optionLabel="name"
                optionValue="value"
                v-model="payload.action"
                class="w-100"
                :options="actionOptions"
                placeholder="الإجراء"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="row" v-if="payload.action === 'Feedback_Charity' || isCharityManager">
            <div class="form-label-group mb-3 col-6">
              <div class="mt-4 text-area-wrapper">
                <Textarea
                  v-model="payload.charityFeedbackLogComment"
                  placeholder="توصية/تعليق للجمعية"
                  :autoResize="true"
                  rows="5"
                  class="w-100"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="!isCharityManager">
          <div class="form-label-group mb-3 col-6">
            <div class="mt-4 text-area-wrapper">
              <Textarea
                v-model="payload.AuditorLogComment"
                placeholder="ملاحظات داخلية (اختياري)"
                :autoResize="true"
                rows="5"
                class="w-100"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import MultiSelect from "primevue/multiselect";
import FileUpload from "primevue/fileupload";

export default {
  props: [
    "payload",
    "actionOptions",
    "paymentRequestDetails",
    "isCharityManager",
  ],
  components: {MultiSelect, FileUpload},
  methods: {},
};
</script>
