<template>
  <Card>
    <template #header>
      <div class="row">
        <div class="col-sm">رقم المجموعة</div>
        <div class="col-sm">اسم المنشئ</div>
        <div class="col-sm">تاريخ الانشاء</div>
        <div class="col-sm">المبلغ المطلوب / تم جمعه</div>
        <div class="col-sm">الحالة</div>
      </div>
    </template>
    <template #content>
      <div class="row" v-if="payload.id">
        <div class="col-sm">
          {{ payload.id }}
        </div>
        <div class="col-sm">
          {{ payload.createdBy }}
        </div>
        <div class="col-sm">
          {{ payload.publishedAt }}
        </div>
        <div class="col-sm">
          <span class="color-primary">{{ payload.progress.current }}</span
          >/{{ payload.progress.goal }}
        </div>
        <div class="col-sm">
          <span class="color-primary">{{ payload.status.name }}</span>
        </div>
      </div>
      <div v-else class="text-center color-primary">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      </div>
    </template>
  </Card>
</template>

<script setup>
const props = defineProps({
  payload: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/helpers";
::v-deep(.p-card-body) {
  font-weight: bold;
}
</style>
