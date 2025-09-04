import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { PermissionService } from "@/services/permission";
import type { ServiceResult } from "@/types/common";

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    permissions: undefined,
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
          throw new Error(res.message || "Create prison failed");
        }

        ElMessage.success("Created successfully");
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Create prison failed";
        ElMessage.error(msg);
        throw e;
      } finally {
      }
    },
  },
});
