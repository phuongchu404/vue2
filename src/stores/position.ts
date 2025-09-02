import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { PositionService } from "@/services/position";
import type {
  Position, PositionState
} from "@/types/position";
import type { ServiceResult } from "@/types/common";

export const usePositionStore = defineStore("position", {
  state: (): PositionState => ({
    positions: undefined,
    loading: false,
    error: undefined,
  }),

  getters: {
    getPositions: (state): Position[] | undefined => state.positions,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async getAll() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Position[]> = await PositionService.list();

        if (!res.success) {
          throw new Error(res.message || "Fetch prison failed");
        }

        this.positions = res.data;
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

    
  },

  // persist: true,
});
