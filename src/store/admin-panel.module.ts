import { STORE_ENUM } from "@/store/store.enums";
import AdminPanelService from "@/services/admin-panel.service";

export default {
  state: {
    adminMenuItems: [],
    caseStatuses: []
  },
  getters: {},
  actions: {
    [STORE_ENUM.MENU_ITEMS]({ commit }: any) {
      return new Promise((resolve, reject) => {
        AdminPanelService.getUserMenuItems()
          .then(({ data: { result, admin_name, active_role, user_has_multiple_roles } }) => {
            commit(STORE_ENUM.MENU_ITEMS, result);

            resolve({ admin_name, active_role, user_has_multiple_roles });
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    [STORE_ENUM.CASE_STATUSES]({ commit }: any) {
      return new Promise((resolve, reject) => {
        AdminPanelService.getAdminMenu()
          .then(({ data: { result } }) => {
            commit(STORE_ENUM.CASE_STATUSES, result);

            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  mutations: {
    [STORE_ENUM.MENU_ITEMS](state: any, result: any) {
      state.adminMenuItems = result;
    },
    [STORE_ENUM.CASE_STATUSES](state: any, result: any) {
      state.caseStatuses = result;
      // @ts-ignore
      state.adminMenuItems.find(item => item.id === 1)?.sub_items = state.caseStatuses;
    },
    CHANGE_COUNT(state: any, status: string) {
      const index = state.adminMenuItems[0]?.sub_items?.findIndex((e: any) => e.name === status)
      if (index && state.adminMenuItems[0]?.sub_items[index]?.count) {
        state.adminMenuItems[0].sub_items[index].count = state.adminMenuItems[0]?.sub_items[index].count - 1
      }
    }
  },
}
