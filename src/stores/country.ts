import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { CountryService } from "@/services/country";
import type { Country, CountryState } from "@/types/country";
import type { ServiceResult } from "@/types/common";

export const useCountryStore = defineStore("country", {
  state: (): CountryState => ({
    countries: undefined,
    loading: false,
    error: undefined,
  }),

  getters: {
    getCountries: (state): Country[] | undefined => state.countries,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async getAll() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Country[]> = await CountryService.list();

        if (!res.success) {
          throw new Error(res.message || "Fetch prison failed");
        }

        this.countries = res.data;
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
});
