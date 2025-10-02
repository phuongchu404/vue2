import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { EthnicityService } from "@/services/ethnicity";
import type { Ethnicity, EthnicityState } from "@/types/ethnicity";
import type { ServiceResult } from "@/types/common";

import { t } from "@/i18n";

export const useEthnicityStore = defineStore("ethnicity", {
  state: (): EthnicityState => ({
    ethnicities: undefined,
    loading: false,
    error: undefined,
  }),

  getters: {
    getEthnicities: (state): Ethnicity[] | undefined => state.ethnicities,
    getLoading: (state): boolean => state.loading!,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async getAll() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Ethnicity[]> = await EthnicityService.list();

        if (!res.success) {
          throw new Error(res.message || t("error.ethnicity.getAll"));
        }

        this.ethnicities = res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.ethnicity.getAll");
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
