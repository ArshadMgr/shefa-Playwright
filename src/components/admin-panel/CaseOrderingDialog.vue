<template>
  <Dialog class="p-dialog-share p-4" :visible="visible" :dismissableMask="false"
          :modal="true" :draggable="false" :showHeader="false"
          :breakpoints="{'600px': '75vw', '640px': '90vw'}" :style="{width: '600px'}">
    <div>
      <div v-if="selectedCase.order_number === 0">
        <div class="text-center text-black mt-4">اعادة ترتيب الحالات</div>
        <div class="my-4 w-75 m-auto mb-4 pb-4 border-bottom">
          <div class="case-order-list rounded-3 border p-3 h6 mb-3">
            <div class="d-flex justify-content-between flex-row-reverse mb-2"
                 v-for="item in orders">
              <div>ترتيب النشر ({{item.order_number}})</div>
              <div class="color-primary">الحالة رقم {{item.id}}</div>
            </div>
          </div>
          <div>
            <Dropdown
              optionLabel="label"
              optionValue="key"
              id="roleDDL"
              v-model="selectedOrder"
              class="w-100 dir-rtl"
              :options="allOrders"
              placeholder="اختر ترتيب الحالة الجديدة"
              option-disabled="disabled"
            />
          </div>
        </div>
      </div>
      <div v-else class="my-4 w-75 m-auto mb-4 pb-4 border-bottom text-black text-center">
        هل أنت متأكد من عدم تثبيت الحالة
      </div>
      <div class="d-flex justify-content-center mt-3">
        <Button class="p-button-rounded p-button-primary px-5 mx-2" label="تأكيد"
                @click="submit"
                :disabled="selectedCase.order_number === 0 && !selectedOrder"/>
        <Button class="button-grey p-button-rounded px-5 mx-2" label="إلغاء"
                @click="close"/>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";

export default {
  components: { Dialog },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    orders: {
      type: Array,
      required: true,
      default: []
    },
    selectedCase: {
      type: Object,
      required: true,
      default: {}
    },
  },
  emits: ["close", "submit"],
  data() {
    return {
      selectedOrder: null,
      allOrders: []
    };
  },
  mounted() {

    for (let i = 1; i < 10; i++) {
      this.allOrders.push({
        key: i,
        label: `ترتيب النشر ${i}`,
        disabled: !!this.orders.find(order => order.order_number === i)
      });
    }
  },
  methods: {
    submit() {
      this.$emit("submit", this.selectedOrder || 0);
      this.selectedOrder = null;
    },
    close() {
      this.selectedOrder = null;
      this.$emit('close');
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/variables";

.color-primary {
  color: $color-primary;
}

::v-deep(.p-button.button-grey) {
  background: #d9d9d9 !important;
  border-color: #d9d9d9 !important;
  color: black !important;
}

</style>
