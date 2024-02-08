import axios from 'axios';

const baseURL = process.env.VUE_APP_API_URL;

class EnumService {
    static specializations() {
        const url = `${baseURL}/charity/specialization`;

        return axios.get(url);
    }

    static types() {
        const url = `${baseURL}/charity/type`;

        return axios.get(url);
    }

    static hospitals() {
        const url = `${baseURL}/hospital`;

        return axios.get(url);
    }


    static regions() {
        const url = `${baseURL}/region`;

        return axios.get(url);
    }


    static cities(region_id: any) {
        const url = `${baseURL}/region/${region_id}/city`;

        return axios.get(url);
    }
}

export default EnumService;

export enum USER_TYPE {
    Technical_Audit = "Technical_Audit",
    Medical_Audit = "Medical_Audit",
    Marketing_Audit = "Marketing_Audit",
    Admin = "Admin",
    Charity = "Charity",
    First_Audit = "First_Audit",

    Second_Audit = "Second_Audit",

    Financial_Reviewer = "Financial_Reviewer",

    Transfer_Manager = "Transfer_Manager",

}

export enum CASE_STATUS {
    Charity_All = "Charity_All",
    Admin_All = "Admin_All",
    Final_Audit = "Final_Audit",
    Ready_to_be_Published = "Ready_to_be_Published",
    Published = "Published",
    Rejected = "Rejected",
    Temp_Pause = "Temp_Pause",
    Technical_Audit_All = "Technical_Audit_All",
    Technical_Audit = "Technical_Audit",
    Technical_Feedback_Charity = "Technical_Feedback_Charity",
    Admin_Feedback_TA = "Admin_Feedback_TA",
    Marketing_Feedback_TA = "Marketing_Feedback_TA",
    Medical_Audit_All = "Medical_Audit_All",
    Medical_Audit = "Medical_Audit",
    Admin_Feedback_MEA = "Admin_Feedback_MEA",
    Medical_Feedback_Charity = "Medical_Feedback_Charity",
    Marketing_Audit_All = "Marketing_Audit_All",
    Marketing_Audit = "Marketing_Audit",
    Admin_Feedback_MA = "Admin_Feedback_MA",
    Donation_Completed = "Donation_Completed",
    Closed = "Closed",
    Waiting_Audit_1 = "Waiting_Audit_1",
    Waiting_Audit_2 = "Waiting_Audit_2",
    Waiting_review = "Waiting_review",
    Waiting_Transfer = "Waiting_Transfer",
    Feedback_Charity = "Feedback_Charity",
    Multiple_Phases = "Multiple_Phases",
    Cancellation_Confirmation = "Cancellation_Confirmation",
    Waiting_Transfer_Confirmation = "Waiting_Transfer_Confirmation",
    Rejected_Invoice = "Rejected_Invoice",
    Manager_Cancellation = "Manager_Cancellation",
    Financial_Manager_Feedback = "Financial_Manager_Feedback",
    Financial_Reviewer_Feedback = "Financial_Reviewer_Feedback",
    Waiting_Completion = "Waiting_Completion",
    Charity_Payment_Completed = "Charity_Payment_Completed",
    Cancelled = "Cancelled",

}

export enum PAYMENT_REQUEST_ENUM {
    Closed = "مغلقة",
    Waiting_Audit_1 = "بانتظار التدقيق المالي 1",
    Waiting_Audit_2 = "بانتظار التدقيق المالي 2",
    Waiting_review = "بانتظار المراجعة المالية",
    Waiting_Transfer = "بانتظار التحويل",
    Feedback_Charity = "معاد من المراجع المالي الى الجمعية",
    Cancellation_Confirmation = "بانتظار اعتماد الالغاء",
    Waiting_Transfer_Confirmation = "بانتظار اشعار التحويل",
    Rejected_Invoice = "ملغي من المالي",
    Manager_Cancellation = "فاتورة مرفوضة",
    Payment_Request_Manager_Cancellation = "ملغي من مدير التحويل",
    Financial_Manager_Feedback = "إعادة الحالة الى مدقق مالي ٢",
    Financial_Reviewer_Feedback = "إعادة الحالة الى المدقق المالي الثاني",
    Waiting_Completion = "بانتظار تاكيد السداد",
    Charity_Payment_Completed = "تم السداد للجمعية",
}

export enum ARABIC_CASES_STATUS {
    DRAFT = "مسودة",
    TECHNICAL_AUDIT = "بانتظار التدقيق الفني",
    TECHNICAL_FEEDBACK_CHARITY = "معاد من الفني إلى الجمعية",
    MEDICAL_AUDIT = "بانتظار التدقيق الطبي",
    MEDICAL_FEEDBACK_CHARITY = "معاد من الطبي إلى الجمعية",
    MARKETING_AUDIT = "بانتظار الإعداد التسويقي",
    MARKETING_FEEDBACK_TA = "معاد من التسويقي إلى الفني",
    FINAL_AUDIT = "بانتظار القبول النهائي",
    READY_TO_BE_PUBLISHED = "جاهز للنشر",
    ADMIN_FEEDBACK_TA = "معاد من مدير النظام  إلى الفني",
    ADMIN_FEEDBACK_MEA = "معاد من مدير النظام  إلى الطبي",
    ADMIN_FEEDBACK_MA = "معاد من مدير النظام  إلى التسويقي",
    ADMIN_FEEDBACK_CHARITY = "معاد من مدير النظام  إلى الجمعية",
    PUBLISHED = "منشور",
    REJECTED = "ملغي",
    SYSTEM_CANCELLATION = "ملغي من النظام",
    CHARITY_CANCELLATION = "ملغي من الجمعية",
    ADMIN_CANCELLATION = "ملغي من مدير النظام",
    TEMP_PAUSE = "موقوف",
    DONATION_COMPLETED = "بانتظار الفاتورة",
    MULTIPLE_PHASES = "مراحل متعددة",
    CLOSED = "مغلقة",
    WAITING_AUDIT_1 = "بانتظار التدقيق المالي 1",
    WAITING_AUDIT_2 = "بانتظار التدقيق المالي 2",
    WAITING_REVIEW = "بانتظار المراجعة المالية",
    WAITING_TRANSFER = "بانتظار التحويل",
    FEEDBACK_CHARITY = "معاد من المراجع المالي",
    CANCELLATION_CONFIRMATION = "بانتظار اعتماد الرفض",
    WAITING_TRANSFER_CONFIRMATION = "بانتظار اشعار التحويل",
    REJECTED_INVOICE = "ملغي من المراجع المالي",
    MANAGER_CANCELLATION = "فاتورة مرفوضة",
    FINANCIAL_MANAGER_FEEDBACK = "إعادة الحالة الى مدقق مالي ٢",
    FINANCIAL_REVIEWER_FEEDBACK = "إعادة الحالة الى المدقق المالي الثاني",
    CHARITY_PAYMENT_COMPLETED = "تم السداد للجمعية",
}


export enum USER_TYPE_AR {
    First_Audit = "مدقق مالي أول",

    Second_Audit = "مدقق مالي ثاني",

    Financial_Reviewer = "المراجع المالي",

    Transfer_Manager = "مدير التحويل",
}

export enum PROCEDURES_MAPPING_AR {
    Waiting_Transfer_Confirmation = "تحويل المبلغ للجمعية",
    Waiting_Transfer = "اعتماد أمر الصرف",
    Feedback_Charity = "اعادة للجمعية من المدقق المالي",
    Waiting_review = "اصدار أمر الصرف",
    Cancellation_Confirmation = "رفض الطلب",
    Waiting_Audit_2 = " قبول و ارسال للمدقق المالي الثاني",
    Closed = "مغلقة",
    Waiting_Audit_1 = "بانتظار التدقيق المالي 1",
    Rejected_Invoice = "ملغي من المالي",
    Manager_Cancellation = "فاتورة مرفوضة",
    Financial_Manager_Feedback = "إعادة الحالة الى مدقق مالي ٢",
    Financial_Reviewer_Feedback = "إعادة الحالة الى المدقق المالي الثاني",
    Waiting_Completion = "بانتظار تاكيد السداد",
    Charity_Payment_Completed = "تم السداد للجمعية",
}

export enum PAYMENT_REQUEST_ACTION {
    edit_payment_request = "edit_payment_request",
    view_payment_request = "view_payment_request"
}

export enum USER_PERMISSION {
    charity_manager = "مدير جمعية"
}

export enum DONATION_TYPE {
    CASE = "CASE",
    WAQF = "WAQF",
    ALL_CASES_DONATION = "ALL_CASES_DONATION",
    CAMPAIGN = "CAMPAIGN",
    ZAKAT = "ZAKAT",
    ALL_PATIENTS = "ALL_PATIENTS",
}
