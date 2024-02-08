<template>
  <div class="inner-page-body">
    <header-section ref="header" :style="{ height: headerHeight + 'px', '--header-height': headerHeight + 'px' }"></header-section>
    <div class="inner-header" :style="{ marginTop: `var(--header-height)` }"></div>
    <div :class="[{ 'pt-4 pt-lg-5': !this.$route.path.includes('home')}]">
      <router-view />
    </div>
    <footer-section></footer-section>
  </div>
  <Toast :breakpoints="{'920px': {width: '95%', right: '50%', transform: 'translate(50%, 0)'}}"/>
</template>

<script>
import FooterSection from "@/components/layout/Footer";
import HeaderSection from "@/components/layout/Header";
import Toast from "primevue/toast";
import { useHead } from '@vueuse/head'

export default {
  name: "App",
  components: { HeaderSection, FooterSection, Toast },
  data() {
    return {
      headerLoaded: false,
    }
  },
  computed: {
    headerHeight() {
      if(!this.headerLoaded) {
        return 0;
      }
      return this.$refs.header.$el.childNodes[0].offsetHeight;
    }
  },
  watch: {
    headerHeight(value) {
      document.documentElement.style.setProperty('--header-height', `${value}px`);
    },
  },
  mounted() {
    this.headerLoaded = true;
  },
};
</script>

<style lang="scss">
@import "styles/typography";
@import "styles/abstracts/mixins";
@import "@/styles/components/dialog";
@import "@/styles/components/datatable";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  direction: rtl;
  color: #2c3e50;
}
:root {
  --header-height: 100px;
}
html {
  overflow-x: hidden;
}

body {
  font-weight: normal;
  font-style: normal;
  color: #121212;
  overflow-x: hidden;
}

* {
  margin: 0;
  font-family: DINNextLTW23-Regular, serif !important;
  padding: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.pi {
  font-family: "primeicons" !important;
}

ul,
ol {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.inner-page {
  border-radius: 55px;
  margin-top: -35px;
  margin-bottom: 65px;
  background: #ffffff url(assets/images/polygon-grey.png) no-repeat -185px;
  background-size: contain;
  padding-top: 100px;
}

.inner-page-body {
  background: #f8f8f8;
}

.inner-header {
  background: #f8f8f8;
}

.direction-rtl {
  direction: rtl;
}

.p-calendar-w-btn {
  .p-datepicker-trigger {
    border-radius: 6px 0 0 6px !important;
  }

  .p-inputtext {
    border-radius: 0 6px 6px 0 !important;
  }

  .pi-chevron-right,
  .pi-chevron-left {
    transform: rotate(180deg) !important;
  }
}

.p-dropdown-items,
.p-multiselect-item,
.p-multiselect-panel {
  direction: rtl;
}

.p-multiselect-panel .p-multiselect-items .p-multiselect-item .p-checkbox,
.p-multiselect-panel .p-multiselect-header .p-checkbox {
  margin-right: 0rem;
  margin-left: 0.5rem;
}

.p-multiselect-panel .p-multiselect-header .p-multiselect-close {
  margin-right: 0.5rem;
  margin-left: 0rem;
}

.p-multiselect-panel
  .p-multiselect-header
  .p-multiselect-filter-container
  .p-inputtext {
  padding-right: 2rem;
  padding-left: 2rem;
}

.verified-icon {
  position: absolute;
  top: 13px;
  left: 13px;
}

.verification {
  position: absolute;
  top: 13px;
  left: 13px;

  .verify-btn {
    border-radius: 25px;
    padding: 0 10px;
    background-color: #38c5be !important;
    border: none;
    font-size: 14px;

    &:hover {
      background-color: #0e8e88 !important;
      border: none;
    }
  }
}

.error-message {
  color: red;
  font-size: 12px;
}

.p-tieredmenu .p-menuitem-icon {
  margin-right: 0 !important;
  margin-left: 0.5rem !important;
}
.p-confirm-dialog {
  text-align: center;
  .p-confirm-dialog-message {
    margin-left: 0 !important;
  }
  .p-dialog-footer {
    display: flex;
    justify-content: center;
  }
  @include respond(md) {
    font-size: 12px;
    .p-dialog-title {
      font-size: 18px !important;
    }
    .p-confirm-dialog-message {
      font-size: 16px !important;
    }
    .p-button {
      font-size: 12px;
    }
  }
}

.button-smaller {
  font-size: 14px !important;
  padding: 0.5rem 1rem !important;
}

.p-menu {
  .p-menuitem-link {
    direction: rtl;
  }

  .p-menuitem-icon {
    margin-right: 0;
    margin-left: 0.5rem;
  }
}

.p-datepicker table td.p-datepicker-today > span,
.p-datepicker:not(.p-disabled)
  table
  td
  span:not(.p-highlight):not(.p-disabled):hover {
  background: transparent !important;
}

.p-datepicker table td.p-datepicker-today > span.p-highlight {
  background: #f0fdfa !important;
}

.excel-icon {
  background: url("assets/icons/file-export.svg");
  width: 20px;
  height: 20px;
}

.p-toast {
  .p-toast-message {
    direction: rtl;

    .p-toast-message-text {
      margin: 0 1rem !important;
    }
  }
}

.speciality-icon {
  margin-top: 5px;
  display: inline-block;
  width: 18px;
  height: 18px;
}

.p-menu.p-menu-overlay {
  z-index: 10000;
}
.p-menuitem-content:hover {
  background-color: $color-primary-background !important;
}
.p-menuitem-text {
  color: $color-primary !important;
}

.p-dropdown-panel {
  z-index: 2102 !important;
}

.wpwl-apple-pay-button {
  -webkit-appearance: -apple-pay-button !important;
  width: 100%;
  border-radius: 8px;
  height: 45px;
  margin-top: 10px;
}
.tooltip-custom.p-tooltip-top .p-tooltip-text {
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 20px !important;
  background-color: $color-primary;
  direction: rtl;
}
.tooltip-custom.p-tooltip-top .p-tooltip-arrow {
  border: none;
}
</style>
