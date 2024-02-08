<template>
  <div class="admin-panel">
    <div class="page-container mx-3 mx-lg-5">
      <div class="d-flex">
        <div class="mw-350 px-3 d-none d-lg-block" v-if="menuItems?.length">
          <div class="menu">
            <div>
              <div class="logo mb-3">
                <img src="../../assets/icons/shefaa.svg" alt="Logo">
              </div>
              <div class="items">
                <div v-for="(item, index) in menuItems" :key="index"
                     class="item d-block">
                  <div :class="['link-container', {'selected': selectedItem?.id === item.id}]"
                       @click="goTo(item)" v-if="!item.sub_items?.length">
                    <div class="link">
                      <div class="d-flex justify-content-between align-items-center w-100">
                        <div class="header d-flex">
                          <div class="menu-icon" :class="item.icon_"></div>
                          <span class="text">{{ item.name }}</span>
                        </div>
                        <div class="counter" v-if="item.counter">
                          <span>{{ item.counter }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="sub-item-container" v-else>
                    <Panel :toggleable="true" v-model:collapsed="item.isCollapsed">
                      <template #header>
                        <div class="header d-flex" @click="item.isCollapsed = !item.isCollapsed">
                          <i class="menu-icon ms-2" :class="item.icon_"></i>
                          <span class="text">{{ item.name }}</span>
                        </div>
                      </template>
                      <div v-for="(subItem, index) in item.sub_items" :key="index">
                        <div :class="['sub-link mb-2', {'selected': selectedSubItem.status === subItem.status}]"
                             @click="gotoSubLink(subItem)">
                          <div class="d-flex justify-content-between align-items-center w-100">
                            <div>
                              <span class="sub-header-text">{{ subItem.name }}</span>
                            </div>
                            <div class="counter" v-if="subItem.count">
                              <span>{{ subItem.count }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Panel>
                  </div>
                </div>
              </div>
              <div class="multi-role pt-3 mt-4" v-if="userHasMultipleRoles">
                <div class="name color-secondary mb-2" data-cy="active-role">{{ activeRole }}</div>
                <div class="link color-primary d-flex align-items-center"
                     @click="toggleMultiRoleModal">
                  <div data-cy="change-user-role-btn">تغيير نوع المستخدم</div>
                  <div class="mx-2 mt-2 icon">
                    <i class="pi pi-arrow-left"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-4 wid-80">
          <Dropdown
            class="w-100 mb-4 d-lg-none menu-ddl"
            optionValue="id"
            v-model="selectedItem"
            :options="menuItems"
            optionLabel="name"
            placeholder="القائمة"
            @change="onMenuChanged($event.value)"
          >
            <template #value="slotProps">
              <div class="d-flex" v-if="slotProps.value">
                <div class="menu-icon" :class="slotProps.value.icon_"></div>
                <span>{{ slotProps.value.name }}</span>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              <div class="d-flex">
                <div class="menu-icon" :class="slotProps.option.icon_"></div>
                <span>{{ slotProps.option.name }}</span>
              </div>
            </template>
          </Dropdown>
          <router-view />
        </div>
      </div>
    </div>
  </div>
  <MultiRoleDialog :visible="showMultiRoleModal"
                   :roles="roles"
                   @close="toggleMultiRoleModal"
                   v-if="userHasMultipleRoles"></MultiRoleDialog>
</template>


<script>
import Panel from "primevue/panel";
import { STORE_ENUM } from "@/store/store.enums";
import JwtUtilService from "@/services/jwt.util.service";
import MultiRoleDialog from "@/components/admin-panel/MultiRoleDialog";
import MultiRoleService from "@/services/multi-role.service";

export default {
  name: "AdminPanel",
  components: { MultiRoleDialog, Panel },
  data() {
    return {
      menuItems: [],
      selectedItem: {},
      selectedSubItem: {},
      isDonor: JwtUtilService.getClientID()?.includes("doner"),
      userHasMultipleRoles: false,
      activeRole: "",
      showMultiRoleModal: false,
      roles: []
    };
  },
  mounted() {
    this.handleFirstPageRouting();
    this.getRoles();
  },
  methods: {
    goTo(item) {
      if (item?.sub_items?.length) {
        return;
      }
      this.selectedItem = item;
      this.selectedSubItem = {};
      this.$router.push(`/admin-panel/${item?.url}`);
    },
    gotoSubLink(item) {
      this.selectedSubItem = item;
      this.selectedItem = {};
      this.$router.push(`/admin-panel/auditors-list?case_status=${item.status}`);
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    handleFirstPageRouting() {
      this.$store
        .dispatch(STORE_ENUM.MENU_ITEMS)
        .then(({ admin_name, active_role, user_has_multiple_roles }) => {
          this.menuItems = this.$store.state.adminPanelModule.adminMenuItems;
          this.menuItems.forEach(item => {
            item.isCollapsed = true;
            item.label = item.name;
            item.icon_ = item.icon;
            delete item.icon;
          });
          this.activeRole = active_role;
          this.userHasMultipleRoles = user_has_multiple_roles;

          if (this.isDonor) {

            this.selectedItem = this.menuItems.find(item => this.$route?.fullPath.includes(item.url));
            if (this.selectedItem) {

              if (this.$route?.fullPath.split("/")?.length >= 4) {
                return;
              }
            }
            else {
              this.selectedItem = this.menuItems[0]
              this.goTo(this.selectedItem);
              return;
            }
          }
          this.$store
            .dispatch(STORE_ENUM.CASE_STATUSES)
            .then(() => {
              if (this.$route.path.includes("/admin-panel/")) {
                if (Object.keys(this.$route.query)?.length) {

                  let queryParams = "";
                  let index = 0;
                  for (const property in this.$route.query) {
                    index === 0 ? queryParams += '?' : queryParams += '&'
                    queryParams += `${property}=${this.$route.query[property]}`;
                    index++;
                  }

                  this.$router.push(this.$route.path + `${queryParams}`);
                } else {
                  this.selectedItem = this.menuItems.find(item => this.$route?.fullPath.includes(item.url));
                  this.$router.push(this.$route.path);
                }
              } else {
                this.selectedItem = this.menuItems.find(item => this.$route?.fullPath.includes(item.url));

                if (this.menuItems?.length) {
                  if (!this.menuItems[0]?.sub_items?.length) {

                    this.selectedItem = this.menuItems[0];
                    this.goTo(this.selectedItem);
                  } else {
                    this.selectedSubItem = this.menuItems[0]?.sub_items[0];
                    this.gotoSubLink(this.selectedSubItem);
                  }
                }
              }
            });
        });
    },
    getRoles() {
      MultiRoleService.getRoles()
        .then(({ data: { result: { roles_list } } }) => {
          this.roles = roles_list;
        });
    },
    toggleMultiRoleModal() {
      this.showMultiRoleModal = !this.showMultiRoleModal;
      if (!this.showMultiRoleModal) {
        this.$router.replace({ path: "/admin-panel" });
        this.handleFirstPageRouting();
        this.getRoles();
      }
    },
    onMenuChanged(selectedItemID) {
      const selectedItem = this.menuItems.find(item => item.id === selectedItemID);
      if (selectedItem) {
        this.goTo(selectedItem);
      }
    },
    findSelectedItem(route = null) {
      let selectedItem = this.menuItems.find(obj => {
        return route.path.endsWith(obj.url) ? obj.url : null;
      })
      
      if(!selectedItem) {
        selectedItem = this.menuItems.find(obj => {
          return route.path.includes(obj.url) ? obj.url : null;
        })
      }

      return selectedItem
    }
  },
  updated() {
    this.selectedItem = this.findSelectedItem({
      path: window.location.href
    })
  },
  watch: {
    $route(newVal) {
      let selectedItem = this.$store.state.adminPanelModule.adminMenuItems.find(item => newVal?.href?.split("case_status=")[1] === item.url);
      if (selectedItem) {
        this.selectedItem = selectedItem;
      } else {
       this.selectedItem = this.findSelectedItem(newVal)
      }
    },
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.admin-panel {

  margin-bottom: 2rem;

  .menu {
    padding: 10px 15px;
    height: 100%;
    border-radius: 15px;
    background: white;
    box-shadow: 1px 1px 14px #0000001a;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .logo {
      img {
        width: 80px;
        height: 45px;
      }
    }

    .item {
      width: 100%;
      margin-bottom: 10px;
      background-color: #F7F7F7;
      text-align: right;
      border-radius: 8px;
      cursor: pointer;

      .counter {
        max-height: 28px;
        padding: 2px 9px;
        background: #FE5757;
        border-radius: 50px;
        color: white;
      }

      .link-container {
        padding: 20px 10px 20px 15px;

        &.selected, &:hover{
          background: darken(#E9F5F5, 10%);
          font-weight: bold;
          border-radius: 8px;
        }
        &:hover {
          background-color: #E9F5F5;
          font-weight: normal;
        }
      }

      .link {
        color: #00B6AD;

        .menu-icon {
          width: 25px;
          aspect-ratio: 1;
          margin: auto 0.7rem;
        }
      }

      .sub-item-container {

        .header {
          color: #00B6AD;
        }

        .sub-link {
          .menu-icon {
            margin: auto 0.7rem;
            font-size: 20px;
            background-repeat: no-repeat !important;
          }

          &:hover,
          &.selected {

            .sub-header-text {
              color: #00B6AD;
            }
          }
        }
      }

      .text {
        color: #3F3F3F !important;
      }

    }

  }

  .admin-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    border-top: 1px solid #ECECEC;

    .name-abbr {
      width: 40px;
      height: 40px;
      padding: 8px 10px;
      color: white;
      background: #BDBEF0;
      border-radius: 50%;
    }

    i {
      color: #B2B2B2;
    }
  }
}

::v-deep(.p-panel .p-panel-header),
::v-deep(.p-panel .p-panel-content) {
  border: none;
  background: #F9F9F9;
}

::v-deep(.p-panel .p-panel-content) {
  padding: 0.5rem 1.25rem 1rem;
}

::v-deep(.p-splitbutton .p-splitbutton-defaultbutton) {
  border-radius: 0 6px 6px 0;
}

::v-deep(.p-splitbutton-menubutton) {
  border-radius: 6px 0 0 6px;
}

.mw-350 {
  min-width: 350px;
}

.flex-1 {
  flex: 1;
}

.flex-4 {
  flex: 4;
}

.wid-80 {
  width: 80%;
}

.color-primary {
  color: $color-primary;
}

.color-primary {
  color: $color-primary;
}

.color-secondary {
  color: $color-font-lighter;
}

.multi-role {

  border-top: 1px solid $color-secondary;

  .link {
    cursor: pointer;

    .icon {
      transition: all .2s ease-in-out;
    }

    &:hover {
      color: #59C9C4;

      .icon {
        transform: translateX(-3px);
      }
    }
  }
}

.ambassador-icon {
  background: url("../../assets/icons/ambassador-icon.svg");
}

.icon-charity-applications {
  background: url("../../assets/icons/icon-charity-application.svg");
}

.icon-wallet {
  background: url("../../assets/icons/icon-wallet.svg");
}

.icon-campaigns {
  background: url("../../assets/icons/icon-campaigns.svg");
}

.icon-waqf {
  background: url("../../assets/icons/icon-waqf.svg");
}

.icon-donation-log {
  background: url("../../assets/icons/icon-my-donations.svg");
}

.icon-profile {
  background: url("../../assets/icons/icon-profile.svg");
}

.icon-charity-manager {
  background: url("../../assets/icons/icon-change-charity-manager.svg");
}

.icon-charity-member {
  background: url("../../assets/icons/icon-charity-member.svg");
}

.icon-cases {
  background: url("../../assets/icons/icon-group-cases.svg");
}

.icon-statistics {
  background: url("../../assets/icons/icon-statistics.svg");
}

.icon-periodic-donation {
  background: url("../../assets/icons/icon-periodic-donation.svg") center;
  background-size: cover;
  transform: rotate(45deg);
}

.icon-home {
  width: 25px;
  aspect-ratio: 1;
  display: block;
  background: url("../../assets/icons/icon-cases.svg");
}

.menu-ddl {
  &.p-dropdown {
    background: #E2F6F6;
    border: none;
    box-shadow: 5px 5px 14px 4px rgb(0 0 0 / 10%);

    ::v-deep .p-dropdown-label {
      color: black;
      font-weight: bold;
    }

    ::v-deep .p-dropdown-trigger-icon {
      color: #12B2AA;
    }
  }
}

.menu-icon {
  width: 25px;
  aspect-ratio: 1;
  margin: auto 0.7rem;
}
</style>
