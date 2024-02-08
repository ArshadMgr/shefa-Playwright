<template>
  <form class="form">
    <div class="container">
      <div class="title mb-5">
        <span>يرجى التأكد من بيانات مدير الجمعية قبل المتابعة:</span>
      </div>
      <div class="row mb-2">
        <span>الاسم الأول: {{ yaqeenModel.first_name }}</span>
      </div>
      <div class="row mb-2">
        <span>اسم الأب: {{ yaqeenModel.father_name }}</span>
      </div>
      <div class="row mb-2">
        <span>اسم العائلة: {{ yaqeenModel.last_name }}</span>
      </div>
      <div class="row mb-2">
        <span>تاريخ انتهاء الهوية: {{ yaqeenModel.identity_expiry_date }}</span>
      </div>
      <div class="row mb-5">
        <span>الجنس: {{ yaqeenModel.gender }}</span>
      </div>
      <div class="row text-start">
        <div class="col-12 d-flex justify-content-around">
          <Button label="السابق" class="p-button-rounded p-button-secondary prev-btn mx-3 flex-grow-1"
                  @click="this.$parent.prev" />
          <Button label="متابعة" class="p-button-rounded mx-3 flex-grow-1" @click="submit" :disabled="!userDataRetrieved"/>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import ChangeCharityManagerService from "@/services/change-charity-manager.service";
import { STORE_ENUM } from "@/store/store.enums";
import { ToastSeverity } from "primevue/api";
import YaqeenService from "@/services/yaqeen-service";
import dayjs from "dayjs";

export default {
  name: "Step3",
  props: ["pageModel"],
  data() {
    return {
      yaqeenModel: {},
      userDataRetrieved: false,
    };
  },
  mounted() {
    YaqeenService.getUserProfile(
        {
          identity_type: "national_id",
          identifier: this.pageModel.national_id,
          date_of_birth: dayjs(this.pageModel.gregorian_birthdate).format('DD-MM-YYYY'),
        }
    ).then(({data: {result}}) => {
      this.yaqeenModel = result;
      this.userDataRetrieved = true
    });
  },
  methods: {
    submit() {

      const hijriMonth = this.pageModel.dateHijri.getMonth() + 1;
      const gregorianMonth = this.pageModel.dateGregorian.getMonth() + 1;
      this.pageModel.hijri_birthdate = this.pageModel.dateHijri.getFullYear() + "-" + hijriMonth + "-" + this.pageModel.dateHijri.getDate();
      this.pageModel.gregorian_birthdate = this.pageModel.dateGregorian.getFullYear() + "-" + gregorianMonth + "-" + this.pageModel.dateGregorian.getDate();

      this.pageModel.is_submit = true;

      ChangeCharityManagerService.assignCharityManager(this.pageModel)
        .then(({ data: { result } }) => {

          this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم تغيير مدير الجمعية بنجاح ", life: 3000 });
          this.$store
            .dispatch(STORE_ENUM.SIGN_OUT)
            .then(() => {
              this.$router.push("/sign-in?tab=1");
            })
            .catch(() => {
              this.$toast.add({ severity: ToastSeverity.ERROR, detail: "حدث خطأ في النظام", life: 3000 });
            });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
:deep(.prev-btn) {
  background: #D9D9D9;
  border-color: #D9D9D9;
  color: black;

  &:hover {
    background: #A9A9A9 !important;
    color: black !important;
    border-color: #D9D9D9 !important;
  }
}
</style>
