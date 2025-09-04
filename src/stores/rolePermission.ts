import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { RolePermissionService } from "@/services/rolePermission";
import type {
  UpdatePermissionByRoleIdRequest,
  PermissionVO,
  RolePermissionState,
} from "@/types/rolePermission";
import type { ServiceResult, PagingResult } from "@/types/common";
import { t } from "@/i18n";

export const useRolePermissionStore = defineStore("rolePermission", {
  state: (): RolePermissionState => ({
    permissions: undefined,
    loading: false,
    error: undefined,
    success: false,
  }),

  getters: {
    getPermissions: (state): PermissionVO[] | undefined => state.permissions,
    getLoading: (state): boolean => state.loading ?? false,
    getError: (state): string | undefined => state.error,
    getSuccess: (state): boolean => state.success ?? false,
  },

  actions: {
    async getPermissionByRoleId(roleId: number) {
      try {
        const res: ServiceResult<PermissionVO[]> =
          await RolePermissionService.getPermissionByRoleId(roleId);
        this.success = res.success;
        if (!res.success) {
          throw new Error(res.message || "Fetch prison failed");
        }

        this.permissions = res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("common.loadFail");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updatePermissionByRoleId(
      id: number,
      payload: UpdatePermissionByRoleIdRequest
    ) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> =
          await RolePermissionService.updatePermissionByRoleId(id, payload);
        this.success = res.success;
        if (!res.success) {
          throw new Error(res.message || "Update prison failed");
        }

        ElMessage.success("Updated successfully");
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Update prison failed";
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    resetAndBackToList() {
      this.permissions = undefined;
      this.loading = false;
      this.error = undefined;
    },
  },
});
