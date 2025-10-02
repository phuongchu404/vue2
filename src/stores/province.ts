import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { ProvinceService } from "@/services/province";
import type { ProvinceState, Province } from "@/types/province";
import type { ServiceResult } from "@/types/common";
import { t } from "@/i18n";
export const useProvinceStore = defineStore("province", {
  state: (): ProvinceState => ({
    provinces: undefined,
    loading: false,
    error: undefined,
  }),

  getters: {
    getProvinces: (state): Province[] | undefined => state.provinces,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async getAll() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Province[]> = await ProvinceService.list();

        if (!res.success) {
          throw new Error(res.message || t("error.province.getAll"));
        }

        this.provinces = res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.province.getAll");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },

  // persist: true,
});
