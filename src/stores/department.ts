import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { DepartmentService } from "@/services/department";
import type { DepartmentState, Department } from "@/types/department";
import type { ServiceResult } from "@/types/common";

export const useDepartmentStore = defineStore("department", {
  state: (): DepartmentState => ({
    departments: undefined,
    loading: false,
    error: undefined,
  }),

  getters: {
    getDepartments: (state): Department[] | undefined => state.departments,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async getByDetentionCenterId(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Department[]> =
          await DepartmentService.getByDetentionCenterId(id);

        if (!res.success) {
          throw new Error(res.message || "Fetch prison failed");
        }

        this.departments = res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Fetch prison failed";
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },
    clear() {
      this.departments = undefined;
      this.error = undefined;
      this.loading = false;
    },
  },
});
