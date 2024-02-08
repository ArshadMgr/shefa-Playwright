import {ToastSeverity} from "primevue/api";

export default {
    methods: {
        validateOnBehalfDonation(payload) {
            if (!payload.gifted_mobile_number ||
                !this.isValidMobileNumber(payload.gifted_mobile_number) ||
                !payload.on_behalf_donor_name
            )
            {
                this.$toast.add({ severity: ToastSeverity.ERROR, summary: "خطأ", detail: "الرجاء إدخال جميع الحقول المطلوبة", life: 3000 });
                return false;
            } else {
                return true;
            }
        },
    },
};