import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { EducationLevelService } from "@/services/educationLevel";
import type {
  EducationLevel, EducationLevelState
} from "@/types/educationLevel";
import type { ServiceResult } from "@/types/common";

export const useEducationLevelStore = defineStore("educationLevel", {
  state: (): EducationLevelState => ({
    educationLevels: undefined,
    loading: false,
    error: undefined,
  }),

  getters: {
    getReligions: (state): EducationLevel[] | undefined => state.educationLevels,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async getAll() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<EducationLevel[]> = await EducationLevelService.list();

        if (!res.success) {
          throw new Error(res.message || "Fetch prison failed");
        }

        this.educationLevels = res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Fetch prison failed";
        this.error = msg;
        ElMessage.error(msg);
      } finally {
        this.loading = false;
      }
    },

    
  },

  // persist: true,
});
