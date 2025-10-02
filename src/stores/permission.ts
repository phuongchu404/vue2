import { defineStore } from "pinia";
import { ElMessage, ElNotification } from "element-plus";
import { PermissionService } from "@/services/permission";
import type { ServiceResult } from "@/types/common";

import { t } from "@/i18n";

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    permissions: [] as string[],
  }),

  getters: {
    getPermissions: (state): any | undefined => state.permissions,
  },

  actions: {
    async synchronize(payload: any) {
      try {
        const res: ServiceResult<boolean> = await PermissionService.synchronize(
          payload
        );

        if (!res.success) {
          throw new Error(res.message || t("error.permission.synchronize"));
        }

        ElMessage.success(t("permission.synchronizeSuccess"));
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.permission.synchronize");
        ElMessage.error(msg);
        // ElNotification.error(msg);
        throw e;
      } finally {
      }
    },
    async getAllMenus() {
      try {
        const res: ServiceResult<string[]> =
          await PermissionService.getAllMenus();

        if (!res.success) {
          throw new Error(res.message || t("error.permission.getAllMenus"));
        }

        this.permissions = res.data as string[];
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.permission.getAllMenus");
        ElMessage.error(msg);
        // ElNotification.error(msg);
        throw e;
      } finally {
      }
    },
  },
});
