import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { UserRoleService } from "@/services/userRole";
import type { UpdateRoleByUserIdRequest } from "@/types/userRole";
import type { ServiceResult } from "@/types/common";
import { t } from "@/i18n";

export const useUserRoleStore = defineStore("userRole", {
  state: () => ({
    success: false,
    loading: false,
    error: undefined,
  }),

  getters: {
    getLoading: (state): boolean => state.loading ?? false,
    getError: (state): string | undefined => state.error,
    getSuccess: (state): boolean => state.success,
  },

  actions: {
    async updateRoleByUserId(id: number, payload: UpdateRoleByUserIdRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> =
          await UserRoleService.updateRoleByUserId(id, payload);
        this.success = res.success;
        if (!res.success) {
          throw new Error(
            res.message || t("error.userRole.updateRoleByUserId")
          );
        }

        ElMessage.success(t("common.updateSuccess"));
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.userRole.updateRoleByUserId");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    resetAndBackToList() {
      this.loading = false;
      this.error = undefined;
    },
  },
});
