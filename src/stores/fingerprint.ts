import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { FingerprintService } from "@/services/fingerprint";
import type {
  FingerprintState,
  FingerprintCard,
  PageQuery,
} from "@/types/fingerprint";
import type { ServiceResult, PagingResult } from "@/types/common";
import { t } from "@/i18n";

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
    getFingerprints: (state): FingerprintCard[] | undefined =>
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
        const res: ServiceResult<PagingResult<FingerprintCard>> =
          await FingerprintService.list(params);

        // Kiểm tra success
        if (!res.success) {
          throw new Error(res.message || t("error.fingerprint.fetchList"));
        }

        if (!res.data) {
          throw new Error(t("error.fingerprint.noData"));
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
          e?.response?.data?.message ||
          e?.message ||
          t("error.fingerprint.fetchList");
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
        const res: ServiceResult<FingerprintCard> =
          await FingerprintService.create(payload);

        if (!res.success) {
          throw new Error(res.message || t("error.fingerprint.create"));
        }

        const created = res.data;
        ElMessage.success(t("common.insertSuccess"));
        return created;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.fingerprint.create");
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
        const res: ServiceResult<FingerprintCard> =
          await FingerprintService.update(id, payload);

        if (!res.success) {
          throw new Error(res.message || t("error.fingerprint.update"));
        }

        const updated = res.data;
        ElMessage.success(t("common.updateSuccess"));
        return updated;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.fingerprint.update");
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
          throw new Error(res.message || t("error.fingerprint.delete"));
        }
        ElMessage.success(t("common.deleteSuccess"));
        if (this.lastQuery) {
          await this.listPage(this.lastQuery);
        }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.fingerprint.delete");
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
        const res: ServiceResult<FingerprintCard> =
          await FingerprintService.getById(id);
        if (!res.success) {
          throw new Error(res.message || t("error.fingerprint.fetchDetail"));
        }
        return res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.fingerprint.fetchDetail");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
});
