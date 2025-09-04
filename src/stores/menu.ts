import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { PermissionService } from "@/services/permission";

import type { ServiceResult } from "@/types/common";

export const useMenuStore = defineStore("menu", {
  state: () => ({
    allMenus: [] as any[],
  }),

  getters: {
    getAllMenus: (state) => state.allMenus,
    getMenuById: (state) => (id: any) => {
      return state.allMenus.find((menu) => menu?.id === id);
    },
  },

  actions: {
    async loadAllMenus() {
      try {
        // Call API
        const res: ServiceResult<any> = await PermissionService.getAllMenus();
        // Kiểm tra success
        if (!res.success) {
          throw new Error(res.message || "Get all menu failed");
        }

        if (!res.data) {
          throw new Error("No data returned from fetch prisons");
        }
        const processedMenus = res.data;
        for (let i = 0; i < processedMenus.length; i++) {
          let menuGroup = processedMenus[i];
          for (let j = 0; j < menuGroup.children.length; j++) {
            let menu = menuGroup.children[j];
            menu.buttons = menu.children;
            menu.children = undefined;
          }
        }

        this.allMenus = processedMenus;
        return { success: true, data: processedMenus };
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Fetch prisons failed";
        ElMessage.error(msg);
      } finally {
      }
    },
  },
});
