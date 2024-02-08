import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/home/HomeView.vue";
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "landing",
    component: HomeView,
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/sign-in",
    name: "sign-in",
    //meta: { authPage: true },
    component: () => import("../views/authentication/SignIn.vue"),
  },
  {
    path: "/create-account/:step",
    name: "create-account",
    meta: { authPage: true },
    component: () => import("../views/authentication/CreateAccount/index.vue"),
  },
  {
    path: "/forget-password",
    name: "forget-password",
    meta: { authPage: true },
    component: () => import("../views/authentication/ForgetPassword.vue"),
  },
  {
    path: "/reset-password",
    name: "reset-password",
    meta: { requiresAuth: true },
    component: () =>
      import("../views/authentication/ResetPassword.vue")
  },
  {
    path: "/login/admin",
    name: "admin-login",
    meta: { authPage: true },
    component: () => import("../views/authentication/AdminSignin.vue"),
  },
  {
    path: "/upload-signed-agreement",
    name: "upload-signed-agreement",
    meta: { requiresAuth: true },
    component: () =>
      import("../views/authentication/UploadSignedAgreement.vue"),
  },
  {
    path: "/agreement-approval",
    name: "agreement-approval",
    meta: { requiresAuth: true },
    component: () =>
      import("../views/authentication/AgreementApproval.vue")
  },
  {
    path: "/callback",
    name: "callback",
    component: () => import("../views/authentication/Callback.vue"),
  },
  {
    path: "/partners",
    name: "partners",
    component: () => import("../views/partners/partners.vue"),
  },
  {
    path: "/partnership-request",
    name: "partnership-request",
    component: () => import("../views/partnership-request/PartnershipRequest.vue"),
  },
  {
    path: "/about-us",
    name: "about-us",
    component: () => import("../views/about-us/about-us.vue"),
  },
  {
    path: "/mark-close",
    name: "mark-close",
    component: () => import("../views/mark-close/MarkClose.vue"),
  },
  {
    path: "/gift-card",
    name: "gift-card",
    component: () => import("../views/gift-card/GiftCard.vue"),
  },
  {
    path: "/ambassador-link/:id",
    name: "ambassador-link",
    component: () => import("../views/ambassador/AmbassadorLink.vue"),
  },
  {
    path: "/donate-case/:case_id",
    name: "donate-case",
    component: () => import("../views/donate/donateCase.vue"),
  },
  {
    path: "/donate-waqf/:waqf_id",
    name: "donate-waqf",
    component: () => import("../views/donate/donateWaqf.vue"),
  },
  {
    path: "/donate-campaign/:campaign_id",
    name: "donate-campaign",
    component: () => import("../views/donate/donateCampaign.vue"),
  },
  {
    path: "/zakat",
    name: "zakat",
    component: () => import("../views/zakat/ZakatOptions.vue"),
  },
  {
    path: "/zakat/donate",
    name: "zakat-donate",
    component: () => import("../views/zakat/ZakatDonate.vue"),
  },
  {
    path: "/zakat/calculate",
    name: "zakat-calculate",
    component: () => import("../views/zakat/ZakatCalculate.vue"),
  },
  {
    path: "/cases-list",
    name: "cases-list",
    component: () => import("../views/cases-list/CasesList.vue"),
  },
  {
    path: "/waqf-list",
    name: "waqf-list",
    component: () => import("../views/waqf-list/WaqfList.vue"),
  },
  {
    path: "/campaign-list",
    name: "campaign-list",
    component: () => import("../views/campaign-list/CampaignList.vue"),
  },
  {
    path: "/projects",
    name: "project-list",
    component: () => import("../views/project-list/ProjectList.vue"),
  },
  {
    path: "/health-initiatives",
    name: "health-initiatives",
    component: () => import("../views/health-initiatives/HealthInitiatives.vue"),
  },
  {
    path: "/privacy-policy",
    name: "privacy-policy",
    component: () => import("../views/privacy-policy/PrivacyPolicy.vue"),
  },
  {
    path: "/completed-cases",
    name: "completed-cases",
    component: () => import("../views/completed-cases/CompletedCases.vue"),
  },
  {
    path: "/ambassador/top",
    name: "ambassador-top",
    component: () => import("../views/ambassador/TopAmbassadors.vue"),
  },
  {
    path: "/major-donors",
    name: "major-donors",
    component: () => import("../views/major-donors/MajorDonors.vue"),
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("../views/faq/Faq.vue"),
  },
  {
    path: "/all-cases-donation",
    name: "all-cases-donation",
    component: () => import("../views/all-cases-donation/AllCasesDonation.vue"),
  },
  {
    path: "/periodic-donation",
    name: "periodic-donation",
    component: () => import("../views/periodic-donation/PeriodicDonation.vue"),
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("../views/checkout/Checkout.vue"),
  },
  {
    path: "/periodic-donation-checkout",
    name: "periodic-donation-checkout",
    component: () => import("../views/checkout/PeriodicDonationCheckout.vue"),
  },
  {
    path: "/zakat-checkout",
    name: "zakat-checkout",
    component: () => import("../views/checkout/ZakatCheckout.vue"),
  },
  {
    path: "/admin-panel",
    name: "admin-panel",
    meta: { requiresAuth: true },
    component: () => import("../views/admin-panel/AdminPanel.vue"),
    children: [
      {
        path: "/admin-panel/cases",
        name: "admin-cases",
        redirect: '/admin-panel/auditors-list'
      },
      {
        path: "/admin-panel/cases/group",
        name: "admin-group-cases",
        component: () =>
          import("../views/admin-panel/cases/group/List.vue")
      },
      {
        path: "/admin-panel/cases/edit/:id",
        name: "admin-cases-list",
        alias: "/admin-panel/cases/edit",
        component: () => import("../views/admin-panel/cases/Edit.vue"),
      },
      {
        path: "/admin-panel/cases/view/:id",
        alias: "/admin-panel/cases/view",
        name: "admin-cases-view",
        component: () => import("../views/admin-panel/cases/View.vue"),
      },
      {
        path: "/admin-panel/cases/create/:step",
        alias: "/admin-panel/cases/create",
        name: "admin-cases-create",
        component: () => import("../views/admin-panel/cases/Create.vue"),
      },
      {
        path: "/admin-panel/cases/group/create",
        name: "admin-cases-group-create",
        component: () => import("../views/admin-panel/cases/group/Create.vue")
      },
      {
        path: "/admin-panel/cases/group/edit/:id",
        name: "admin-cases-group-edit",
        component: () => import("../views/admin-panel/cases/group/Edit.vue")
      },
      {
        path: "/admin-panel/cases/group/view/:id",
        name: "admin-cases-group-view",
        component: () => import("../views/admin-panel/cases/group/View.vue")
      },
      {
        path: "/admin-panel/auditors-list",
        name: "auditors-list",
        component: () => import("../views/admin-panel/cases/AuditorsList.vue"),
      },
      {
        path: "/admin-panel/auditor-case-detail/view/:id",
        name: "auditor-case-detail-view",
        component: () =>
          import("../views/admin-panel/cases/AuditorCaseDetailView.vue"),
      },
      {
        path: "/admin-panel/auditor-case-detail/edit/:id",
        name: "auditor-case-detail-edit",
        component: () =>
          import("../views/admin-panel/cases/AuditorCaseDetailEdit.vue"),
      },
      {
        path: "/admin-panel/charity-representative",
        name: "charity-representative-list",
        component: () =>
          import("../views/admin-panel/charity-representative/List.vue"),
      },
      {
        path: "/admin-panel/charity-representative/:id",
        name: "charity-representative-user",
        component: () =>
          import("../views/admin-panel/charity-representative/User.vue"),
      },
      {
        path: "/admin-panel/charity-representative/create/:step",
        name: "charity-representative-create",
        alias: "/admin-panel/charity-representative/create",
        component: () =>
          import("../views/admin-panel/charity-representative/Create.vue"),
      },
      {
        path: "/admin-panel/request",
        name: "admin-requests",
        component: () => import("../views/admin-panel/requests/Requests.vue"),
      },
       {
        path: "/admin-panel/statistics",
        name: "admin-statistics",
        component: () => import("../views/admin-panel/statistics/Statistics.vue"),
      },
      {
        path: "/admin-panel/user-profile",
        name: "user-profile",
        component: () =>
          import("../views/admin-panel/user-profile/DonorProfile.vue")
      },
      {
        path: "/admin-panel/periodic-donation",
        name: "admin-panel-periodic-donation",
        component: () =>
            import("../views/admin-panel/periodic-donation/PeriodicDonation.vue")
      },
      {
        path: "/admin-panel/user-profile-charity",
        name: "user-profile-charity",
        component: () =>
          import("../views/admin-panel/user-profile/CharityManagerProfile.vue")
      },
      {
        path: "/admin-panel/request-details/:id",
        name: "request-details",
        component: () =>
          import("../views/admin-panel/request-details/RequestDetails.vue"),
      },
      {
        path: "/admin-panel/change-charity-manager",
        name: "change-charity-manager",
        component: () =>
          import("../views/admin-panel/change-charity-manager/ChangeCharityManager.vue")
      },
      {
        path: "/admin-panel/wallets",
        name: "wallets",
        component: () =>
          import("../views/admin-panel/wallets/List.vue")
      },
      {
        path: "/admin-panel/wallets/create",
        name: "wallet-create",
        component: () =>
          import("../views/admin-panel/wallets/Create.vue")
      },
      {
        path: "/admin-panel/wallets/transfer/:id",
        name: "wallet-transfer",
        component: () =>
          import("../views/admin-panel/wallets/Transfer.vue")
      },
      {
        path: "/admin-panel/wallets/edit/:id",
        name: "wallet-edit",
        component: () =>
          import("../views/admin-panel/wallets/Edit.vue")
      },
      {
        path: "/admin-panel/waqf",
        name: "waqf",
        component: () =>
          import("../views/admin-panel/waqf/List.vue")
      },
      {
        path: "/admin-panel/waqf/create",
        name: "waqf-create",
        component: () =>
          import("../views/admin-panel/waqf/Create.vue")
      },
      // Invoicing PaymentRequest routes
      {
        path: "/admin-panel/payment-request",
        name: "payment-requests-list",
        component: () =>
          import("../views/admin-panel/payment-requests/List.vue")
      },
      {
        path: "/admin-panel/payment-request/create/:id",
        name: "payment-request-create",
        component: () =>
          import("../views/admin-panel/payment-requests/Create.vue")
      },
      {
        path: "/admin-panel/payment-request/view/:id",
        name: "payment-request-view",
        component: () =>
          import("../views/admin-panel/payment-requests/View.vue")
      },
      {
        path: "/admin-panel/payment-request/edit/:id",
        name: "payment-request-edit",
        component: () =>
          import("../views/admin-panel/payment-requests/Edit.vue")
      },
      {
        path: "/admin-panel/campaigns",
        name: "campaigns",
        component: () => import("../views/admin-panel/campaigns/List.vue"),
      },
      {
        path: "/admin-panel/campaigns/create",
        name: "campaigns-create",
        component: () => import("../views/admin-panel/campaigns/Create.vue"),
      },
      {
        path: "/admin-panel/donations-log",
        name: "donations-log",
        component: () => import("../views/admin-panel/donations-log/DonationsLog.vue"),
      },
      {
        path: "/admin-panel/ambassador/list",
        name: "ambassador-list",
        component: () => import("../views/ambassador/List.vue"),
      }
    ]
  },
  {
    path: "/under-maintenance",
    name: "maintenance",
    component: () => import("../views/maintenance/maintenance-page.vue")
  },
  {
    path: "/:catchAll(.*)",
    name: "not-found",
    component: () => import("../views/404/404-page.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savePosition) {
    return {
      top: 0,
      behavior: 'smooth',
    }
  }
});

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    return { name: "sign-in" };
  } else if (to.meta.authPage && store.getters.isAuthenticated) {
    return { name: "home" };
  }
  return true;
});

export default router;
