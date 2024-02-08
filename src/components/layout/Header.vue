<template>
  <div class="header">
    <div class="navbar-area" v-if="!isUnderMaintenance">
      <div class="row shfaaMenu">
        <div class="col-lg-12 p-0 d-flex align-items-center">
          <nav class="navbar navbar-expand-xl px-xxl-5 w-100">

            <nav class="navbar">
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                      data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
                      aria-expanded="false" aria-label="Toggle navigation" ref="hamburger">
                <span class="navbar-toggler-icon"></span>
              </button>
            </nav>

            <UserInfo :authenticated="$store.getters.isAuthenticated"
                      :is-donor="isDonor"
                      :menuItems="items"
                      :userName="username"
                      @click="closeNavigation"
                      mobile/>

            <div class="navbar-brand" @click="closeNavigation">
              <router-link to="/home" class="navbar-brand__container">
                <img class="navbar-brand__logo" src="@/assets/icons/shefaa.svg" alt="logo">
                <svg class="navbar-brand__hex" version="1.1" xmlns="http://www.w3.org/2000/svg" width="99" height="114" viewbox="0 0 98.726896031426 114" style="filter: drop-shadow(rgba(0, 0, 0, 0.1) -4px 6px 16px);"><path fill="#fff" d="M42.43524478543749 3.9999999999999996Q49.363448015713 0 56.291651245988504 4L91.79869280115048 24.5Q98.726896031426 28.5 98.726896031426 36.5L98.726896031426 77.5Q98.726896031426 85.5 91.79869280115048 89.5L56.291651245988504 110Q49.363448015713 114 42.43524478543749 110L6.928203230275509 89.5Q0 85.5 0 77.5L0 36.5Q0 28.5 6.92820323027551 24.5Z"></path></svg>
              </router-link>
            </div>

            <div class="collapse navbar-collapse sub-menu-bar">
              <ul class="navbar-nav ml-auto align-items-center">
                <li class="nav-item">
                  <router-link :to="'/home'">
                    <span>الرئيسية</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/cases-list" >
                    <span>الحالات</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <a class="page-scroll" aria-controls="menu" data-cy="donation-options"
                     @click="toggleProgramsMenu">
                    مسارات التبرع
                    <i class="pi pi-angle-down"></i>
                  </a>
                  <Menu id="menu" ref="menu_items" :model="programItems" :popup="true"  />
                </li>
                <li class="nav-item">
                  <router-link :to="'/about-us'" >
                    <span>عن شفاء</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link :to="'/completed-cases'" >
                    <span>الفرص المكتملة</span>
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="d-none d-xl-flex align-items-center flex-row-reverse">
              <div v-if="!$store.getters.isAuthenticated">

                <router-link :to="'/sign-in?tab=0'">
                  <Button class="p-button p-button-rounded p-button-primary m-auto px-4" label="كن صديقاً لشفاء" />
                </router-link>

              </div>
              <UserInfo :authenticated="$store.getters.isAuthenticated"
                        :is-donor="isDonor"
                        :menuItems="items"
                        :userName="username"/>
            </div>
          </nav>
        </div>
      </div>
      <div class="collapse mobile-menu d-xl-none position-absolute" ref="navigation" id="navbarToggleExternalContent">
        <div class="bg-white pt-4 menu-cont">
          <ul class="navbar-nav ml-auto mb-5">
            <li class="nav-item mb-3">
              <router-link :to="'/home'">
                <span data-bs-toggle="collapse"
                      data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent">الرئيسية</span>
              </router-link>
            </li>
            <li class="nav-item mb-3">
              <router-link to="/cases-list">
                <span data-bs-toggle="collapse"
                      data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent">الحالات</span>
              </router-link>
            </li>
            <li class="nav-item mb-3">
              <a class="page-scroll" aria-controls="menu" data-cy="donation-options"
                 @click="toggleProgramsMenu">
                مسارات التبرع
                <i class="pi pi-angle-down"></i>
              </a>
              <Menu id="menu_" ref="menu_items" :model="programItems" :popup="true" data-bs-toggle="collapse"
                    data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" />
            </li>
            <li class="nav-item mb-3">
              <router-link :to="'/about-us'">
                <span data-bs-toggle="collapse"
                      data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent">عن شفاء</span>
              </router-link>
            </li>
            <li class="nav-item mb-3">
              <router-link :to="'/completed-cases'">
                <span data-bs-toggle="collapse"
                      data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent">الفرص المكتملة</span>
              </router-link>
            </li>
            <li class="nav-item mb-3" v-if="isDonor">
              <router-link :to="'/admin-panel'">
                <span data-bs-toggle="collapse"
                      data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent">حسابي</span>
              </router-link>
            </li>
          </ul>
          <div class="user-info p-3">

            <div v-if="!$store.getters.isAuthenticated">

              <router-link :to="'/sign-in?tab=0'">
                <Button class="p-button p-button-rounded p-button-primary button-gradient m-auto d-flex justify-content-center"
                        data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
                        label="كن صديقاً لشفاء"/>
              </router-link>

            </div>
            <div v-else>
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div class="name-abbr ms-2 d-flex justify-content-center align-items-center">
                    <span>{{ adminNameInitials }}</span>
                  </div>
                  <div>
                    <div class="name">{{ username }}</div>
                  </div>
                </div>
                <i class="pi pi-sign-out logout-icon" @click="logout"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="navbar-area d-flex justify-content-center" v-if="isUnderMaintenance">
      <div class="navbar">
        <div class="navbar-brand position-relative top-0 m-0">
          <div class="navbar-brand__container">
            <img class="navbar-brand__logo" src="@/assets/icons/shefaa.svg" alt="logo">
            <svg class="navbar-brand__hex" version="1.1" xmlns="http://www.w3.org/2000/svg" width="99" height="114" viewbox="0 0 98.726896031426 114" style="filter: drop-shadow(rgba(0, 0, 0, 0.1) -4px 6px 16px);"><path fill="#fff" d="M42.43524478543749 3.9999999999999996Q49.363448015713 0 56.291651245988504 4L91.79869280115048 24.5Q98.726896031426 28.5 98.726896031426 36.5L98.726896031426 77.5Q98.726896031426 85.5 91.79869280115048 89.5L56.291651245988504 110Q49.363448015713 114 42.43524478543749 110L6.928203230275509 89.5Q0 85.5 0 77.5L0 36.5Q0 28.5 6.92820323027551 24.5Z"></path></svg>
          </div>
        </div>
      </div>
    </div>
    <div class="backdrop" ref="backdrop" data-bs-toggle="collapse"
         data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
         aria-expanded="false" aria-label="Toggle navigation"></div>
  </div>
</template>

<script>
import { STORE_ENUM } from "@/store/store.enums";
import JwtUtilService from "@/services/jwt.util.service";
import AuthService from "@/services/auth.service";
import UserInfo from "@/components/layout/UserInfo";

export default {
  name: "HeaderSection",
  components: {UserInfo},
  data() {
    return {
      observer: null,
      username: "",
      isDonor: JwtUtilService.getClientID()?.includes("doner"),
      realm: JwtUtilService.getClientID()?.split("-").slice(0, 2).join("-"),
      adminNameInitials: "",
      items: [
        {
          label: "تسجيل الخروج",
          icon: "pi pi-sign-out",
          command: () => {
            this.logout();
          }
        }
      ],
      programItems: [],
      firstLoadProgramItems: [
        {
          label: "سفير شفاء",
          command: () => {
            this.$router.push(`/ambassador/top`);
            this.hideBackdrop()
          }
        },
        {
          label: "الحملات",
          command: () => {
            this.$router.push(`/campaign-list`);
            this.hideBackdrop()
          }
        },
        {
          label: "الأوقاف",
          command: () => {
            this.$router.push(`/waqf-list`);
            this.hideBackdrop()
          }
        },
        {
          label: "اهداء",
          command: () => {
            this.$router.push(`/gift-card`);
            this.hideBackdrop()
          }
        },
      ],
      isUnderMaintenance: false
    };
  },
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    toggleProgramsMenu(event) {
      this.$refs.menu_items.toggle(event);
    },
    closeNavigation() {
      this.$refs.navigation.classList.remove("show");
      this.hideBackdrop();
    },
    logout() {
      AuthService.logout().finally(() => {
        this.$store
          .dispatch(STORE_ENUM.SIGN_OUT)
          .then(() => {
            this.$router.push("/sign-in");
          });
      });
      this.closeNavigation();
    },
    toggleBackdrop() {
      this.$refs.backdrop.classList.add("backdrop--active");
    },
    hideBackdrop() {
      this.$refs.backdrop.classList.remove("backdrop--active");
    },
    observeHamburger () {
      this.observer = new MutationObserver(mutations => {
        for (const m of mutations) {
          const newValue = m.target.getAttribute(m.attributeName);
          this.$nextTick(() => {
            this.onHamburgerChange(newValue, m.oldValue);
          });
        }
      });

      this.observer.observe(this.$refs.hamburger, {
        attributes: true,
        attributeOldValue : true,
        attributeFilter: ['class'],
      });
    },
    onHamburgerChange(newValue, oldValue) {
      if (newValue.includes('collapsed')) {
        this.hideBackdrop();
      } else {
        this.toggleBackdrop();
      }
    },
    updateHeaderItems() {
      let isAuthenticated =  this.$store.getters.isAuthenticated;
      let isDonor = JwtUtilService.getClientID()?.includes("doner");
      let items = [...this.firstLoadProgramItems];
      if (isDonor || !isAuthenticated) {
        let itemsToAdd = [
          {
            label: "الزكاة",
            command: () => {
              this.$router.push(`/zakat`);
              this.hideBackdrop()
            }
          },
          {
            label: "التبرع الشامل",
            command: () => {
              this.$router.push(`/all-cases-donation`);
              this.hideBackdrop()
            }
          },
          {
            label: "التبرع الدوري",
            command: () => {
              this.$router.push(`/periodic-donation`);
              this.hideBackdrop()
            }
          },
        ]
        items.splice(3, 0, itemsToAdd[0]);
        items.splice(4, 0, itemsToAdd[1]);
        items.splice(5, 0, itemsToAdd[2]);

      }
      this.programItems = items;
    }
  },
  watch: {
    $route(newVal, oldVal) {
      this.isUnderMaintenance = newVal?.fullPath.includes('maintenance');
      this.updateHeaderItems();
    },
  },
  mounted() {
    this.$store.dispatch(STORE_ENUM.USERNAME, localStorage.getItem("username"));
    this.username = this.$store.state.authModule.username;
    if (!this.isDonor) {
      this.items.splice(0, 0, {
        label: "تغيير كلمة المرور",
        icon: "pi pi-key",
        command: () => {
          this.$router.push(`/reset-password`);
        }
      });
    }

    let fullName = this.username?.split(" ");
    let initials = fullName?.shift().charAt(0);
    initials += fullName?.length > 1 ? fullName?.pop()?.charAt(0) : "";
    this.adminNameInitials = initials.toUpperCase();

    this.items.unshift({
      label: this.isDonor ? "حسابي" : "لوحة التحكم",
      icon: "pi pi-chart-bar",
      command: () => {
        if (JwtUtilService.getClientID()?.includes("doner")) {
          this.$router.push(`/admin-panel/statistics`);
        } else {
          if (!this.$store.state.adminPanelModule.adminMenuItems[0]) {
            this.$router.push(`/admin-panel`);
            return;
          }
          let defaultUrl = this.$store.state.adminPanelModule.adminMenuItems[0]?.sub_items ?
            this.$store.state.adminPanelModule.adminMenuItems[0]?.sub_items[0]?.status :
            this.$store.state.adminPanelModule.adminMenuItems[0]?.url;
          if (defaultUrl.includes('payment-request')) {
            this.$router.push(`/admin-panel/${defaultUrl}`);
          } else {
            this.$router.push(`/admin-panel/auditors-list?case_status=${defaultUrl}`);
          }
        }
      }
    });

    this.updateHeaderItems();
    this.observeHamburger();
  },
  beforeDestroy() {
    this.observer.disconnect();
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";
@import "@/styles/components/button";

.header {

  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  background-color: $color-background-light;

  .navbar-area {
    padding: 1px 0;
    position: absolute;
    left: 0;
    width: 100%;
    z-index: 1000;
    -webkit-transition: all 0.3s ease-out 0s;
    -moz-transition: all 0.3s ease-out 0s;
    -ms-transition: all 0.3s ease-out 0s;
    -o-transition: all 0.3s ease-out 0s;
    transition: all 0.3s ease-out 0s;
    .shfaaMenu {
      min-height: 60px;
      box-shadow: 1px 1px 14px #0000001a;
    }
    .navbar-collapse {
      height: 50px;
      margin-right: 14vw;
    }
    .navbar-brand {
      position: absolute;
      top: -14px;
      margin-right: 50px;
      transition: $transition-basic;
      &__container {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &__logo {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        width: 77px;
      }
      &__user {
        display: none;
        width: 35px;
      }
      &__hex {}
      &:hover {
        transform: scale(.9);
      }
    }

    .navbar {
      position: relative;
      padding: 0;

      .navbar-toggler {
        .toggler-icon {
          width: 30px;
          height: 2px;
          background-color: #121212;
          margin: 5px 0;
          display: block;
          position: relative;
          -webkit-transition: all 0.3s ease-out 0s;
          -moz-transition: all 0.3s ease-out 0s;
          -ms-transition: all 0.3s ease-out 0s;
          -o-transition: all 0.3s ease-out 0s;
          transition: all 0.3s ease-out 0s;
        }

        &.active {
          .toggler-icon {
            &:nth-of-type(1) {
              -webkit-transform: rotate(45deg);
              -moz-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              -o-transform: rotate(45deg);
              transform: rotate(45deg);
              top: 7px;
            }

            &:nth-of-type(2) {
              opacity: 0;
            }

            &:nth-of-type(3) {
              -webkit-transform: rotate(135deg);
              -moz-transform: rotate(135deg);
              -ms-transform: rotate(135deg);
              -o-transform: rotate(135deg);
              transform: rotate(135deg);
              top: -7px;
            }
          }
        }
      }

      .navbar-btn {
        .menu-bar {
          font-size: 32px;
          position: relative;
          overflow: hidden;
          color: #006988;
          -webkit-transition: all 0.3s ease-out 0s;
          -moz-transition: all 0.3s ease-out 0s;
          -ms-transition: all 0.3s ease-out 0s;
          -o-transition: all 0.3s ease-out 0s;
          transition: all 0.3s ease-out 0s;
        }
      }

      .login-text {
        padding: 0 10px;
        color: #51b0aa;
        cursor: pointer;
      }
    }

    &.navbar-transparent {
      background: transparent;

      .navbar {
        .navbar-toggler {
          .toggler-icon {
            background-color: #fff;
          }
        }

        .navbar-nav {
          .nav-item {
            a {
              color: #fff;

              &::before {
                background-color: #38f9d7;
              }
            }

            &.active {
              a {
                color: #38f9d7;
              }
            }

            &:hover {
              a {
                color: #38f9d7;
              }
            }
          }
        }

        .navbar-btn {
          .menu-bar {
            color: #fff;

            &:hover {
              color: #38f9d7;
            }
          }
        }
      }

      &.sticky {
        background-color: #fff;

        .navbar {
          .navbar-toggler {
            .toggler-icon {
              background-color: #121212;
            }
          }

          .navbar-nav {
            .nav-item {
              a {
                color: #121212;
              }

              &.active {
                a {
                  color: #38f9d7;
                }
              }

              &:hover {
                a {
                  color: #38f9d7;
                }
              }
            }
          }

          .navbar-btn {
            .menu-bar {
              color: #121212;

              &:hover {
                color: #38f9d7;
              }
            }
          }
        }
      }
    }

    &.navbar-transparent-2 {
      background: transparent;

      .navbar {
        .navbar-toggler {
          .toggler-icon {
            background-color: #fff;
          }
        }

        .navbar-nav {
          .nav-item {
            a {
              color: #121212;

              &::before {
                background-color: #38f9d7;
              }
            }

            &.active {
              a {
                color: #38f9d7;
              }
            }

            &:hover {
              a {
                color: #38f9d7;
              }
            }
          }
        }

        .navbar-btn {
          .menu-bar {
            color: #fff;

            &:hover {
              color: #38f9d7;
            }
          }
        }
      }

      &.sticky {
        background-color: #fff;
      }
    }

    &.sticky {
      padding: 5px 0;
    }

    a {
      text-decoration: none;
    }

    .navbar-nav {
      margin-right: 24px;

      .nav-item {
        position: relative;
        cursor: pointer;

        a {
          font-size: 16px;
          line-height: 24px;
          font-weight: lighter;
          padding: 11px 24px;
          text-transform: uppercase;
          position: relative;
          border-radius: 5px;
          -webkit-transition: all 0.3s ease-out 0s;
          -moz-transition: all 0.3s ease-out 0s;
          -ms-transition: all 0.3s ease-out 0s;
          -o-transition: all 0.3s ease-out 0s;
          transition: all 0.3s ease-out 0s;
          margin: 14px 0;
          color: $color-secondary-hover;

          &:hover {
            color: $color-primary;
          }
          &.router-link-active {
            color: $color-primary;
            pointer-events: none;
          }
        }
        .sub-nav-toggler {
          display: none;
        }
      }
    }

    .mobile-menu {
      width: fit-content;
      box-shadow: -3px 5px 7px 2px rgb(0 0 0 / 27%);
      border-radius: 8px;
      .menu-cont {
        border-radius: 8px;
      }

      .navbar-nav {
        .nav-item {
          a {
            &::before {
              display: none;
            }

            &.router-link-active {
              &::before {
                display: none;
              }
            }
          }
        }
      }

      .user-info {
        border-top: 1px solid #EFEFEF;
      }

      .name-abbr {
        width: 40px;
        height: 40px;
        padding: 8px 10px;
        color: white;
        background: #00837D;
        border-radius: 50%;
      }

      .name {
        color: #00837D;
      }

      .logout-icon {
        color: #33b3ab;
        transform: rotate(180deg);
        cursor: pointer;
      }
    }
  }

  .shfaaMenu {
    background-color: $color-background-light;
    direction: rtl;
    text-align: revert;
    border-radius: 20px;
    padding: 20px 27px;

    .welcome-text {
      color: #33b3ab;
      cursor: pointer;
    }
  }

  .searchBox {
    position: absolute;
    top: 1%;
    left: 25%;
    /*transform:  translate(-50%,50%);*/
    transform: translate(-15%, 50%);
    background: #fff;
    height: 40px;
    border-radius: 40px;
    padding: 0;

    &:hover {
      border: 1px solid #33b3ab;

      > .searchInput {
        width: 150px;
        padding: 0 6px;
      }

      > .searchButton {
        background: white;
        color: #33b3ab;
      }
    }
  }

  .searchButton {
    color: #33b3ab;
    float: right;
    width: 40px;
    height: 38px;
    border-radius: 50%;
    background: #ffffff;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.4s;
    border: none;
  }

  .searchInput {
    border: none;
    background: none;
    outline: none;
    float: right;
    padding: 0;
    color: black;
    font-size: 16px;
    text-align: center;
    transition: 0.4s;
    line-height: 40px;
    width: 0;
  }
}

.p-button {
  a {
    color: white;
  }
}

.w-150 {
  width: 150px;
}

.navbar-toggler {
  border: none;

  &:focus {
    box-shadow: none;
  }
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(79, 201, 195, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
}
.backdrop {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  z-index: 900;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  &--active {
    display: block;
  }
}
@include respond('xl') {
  .header .navbar-area {
    .navbar-brand {
      top: 0;
      padding: 0;
      box-shadow: unset;
      right: 50%;
      transform: translateX(50%);
      margin: 0;
      &__logo {
        width: 70px;
        position: unset;
        transform: unset;
      }
      &__user {
        display: block;
        width: 35px;
      }
      &__hex {
        display: none;
      }
      &:hover {
        transform: scale(1) translateX(50%);
      }
    }
  }
}
</style>
