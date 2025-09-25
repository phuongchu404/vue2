import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { FingerprintService } from "@/services/fingerprint";
import type {
  FingerprintState,
  FingerprintCardResponse,
  PageQuery,
} from "@/types/fingerprint";
import type { ServiceResult, PagingResult } from "@/types/common";

export const useFingerprintStore = defineStore("fingerprint", {
  state: (): FingerprintState => ({
    fingerprints: [],
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false,
    error: undefined,
    lastQuery: undefined,
  }),

  getters: {
    getFingerprints: (state): FingerprintCardResponse[] | undefined =>
      state.fingerprints,
    getTotal: (state): number => state.total,
    getPage: (state): number => state.pageNo,
    getSize: (state): number => state.pageSize,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async listPage(query: PageQuery) {
      this.loading = true;
      this.error = undefined;
      try {
        const params: PageQuery = {
          ...query,
          pageNo: query.pageNo ?? this.pageNo,
          pageSize: query.pageSize ?? this.pageSize,
        };

        // Call API
        const res: ServiceResult<PagingResult<FingerprintCardResponse>> =
          await FingerprintService.list(params);

        // Kiểm tra success
        if (!res.success) {
          throw new Error(res.message || "Get fingerprints failed");
        }

        if (!res.data) {
          throw new Error("No data returned from get fingerprints");
        }

        const {
          content,
          totalElements,
          number: pageNo,
          size: pageSize,
        } = res.data;

        this.fingerprints = content;
        this.total = totalElements;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.lastQuery = { ...params };
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Get fingerprints failed";
        this.error = msg;
        ElMessage.error(msg);
      } finally {
        this.loading = false;
      }
    },

    async createFingerprint(payload: FormData) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<FingerprintCardResponse> =
          await FingerprintService.create(payload);

        if (!res.success) {
          throw new Error(res.message || "Create fingerprint failed");
        }

        const created = res.data;
        ElMessage.success("Created successfully");
        return created;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Create fingerprint failed";
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateFingerprint(id: number, payload: FormData) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<FingerprintCardResponse> =
          await FingerprintService.update(id, payload);

        if (!res.success) {
          throw new Error(res.message || "Update Fingerprint failed");
        }

        const updated = res.data;
        ElMessage.success("Updated successfully");
        return updated;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Update Fingerprint failed";
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deleteFingerprint(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await FingerprintService.delete(id);

        if (!res.success) {
          throw new Error(res.message || "Delete Fingerprint failed");
        }
        ElMessage.success("Deleted successfully");
        if (this.lastQuery) {
          await this.listPage(this.lastQuery);
        }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Delete Fingerprint failed";
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async getById(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<FingerprintCardResponse> =
          await FingerprintService.getById(id);
        if (!res.success) {
          throw new Error(res.message || "Get Fingerprint failed");
        }
        return res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Get Fingerprint failed";
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
});
