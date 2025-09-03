import { defineStore } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { WardService } from "@/services/ward";
import type { WardState, Ward } from "@/types/ward";
import type { ServiceResult } from "@/types/common";

export const useWardStore = defineStore("ward", {
  state: (): WardState => ({
    wards: undefined,
    loading: false,
    error: undefined,
  }),

  getters: {
    getWards: (state): Ward[] | undefined => state.wards,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async getByProvinceCode(provinceCode: string) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Ward[]> = await WardService.getByProvinceCode(
          provinceCode
        );

        if (!res.success) {
          throw new Error(res.message || "Fetch prison failed");
        }

        this.wards = res.data;
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
      this.wards = undefined;
      this.error = undefined;
      this.loading = false;
    },
  },
});
