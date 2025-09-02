import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { ReligionService } from "@/services/religion";
import type {
  Religion, ReligionState
} from "@/types/religion";
import type { ServiceResult } from "@/types/common";

export const useReligionStore = defineStore("religion", {
  state: (): ReligionState => ({
    religions: undefined,
    loading: false,
    error: undefined,
  }),

  getters: {
    getReligions: (state): Religion[] | undefined => state.religions,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async getAll() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Religion[]> = await ReligionService.list();

        if (!res.success) {
          throw new Error(res.message || "Fetch prison failed");
        }

        this.religions = res.data;
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
