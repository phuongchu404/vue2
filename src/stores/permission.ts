import { defineStore } from "pinia";
import { ElMessage, ElNotification } from "element-plus";
import { PermissionService } from "@/services/permission";
import type { ServiceResult } from "@/types/common";

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
          throw new Error(res.message || "synchronize failed");
        }

        ElMessage.success("Created successfully");
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Create prison failed";
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
          throw new Error(res.message || "synchronize failed");
        }

        this.permissions = res.data as string[];
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Create prison failed";
        ElMessage.error(msg);
        // ElNotification.error(msg);
        throw e;
      } finally {
      }
    },
  },
});
