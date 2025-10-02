import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { IdentityService } from "@/services/identity";
import type {
  IdentityState,
  Identity,
  PageQuery,
  IdentityRecordCreateRequest,
  IdentityRecordUpdateRequest,
} from "@/types/identity";
import type { ServiceResult, PagingResult } from "@/types/common";

import { t } from "@/i18n";

export const useIdentityStore = defineStore("identity", {
  state: (): IdentityState => ({
    identities: undefined,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false,
    error: undefined,
    lastQuery: undefined,
  }),

  getters: {
    getIdentities: (state): Identity[] | undefined => state.identities,
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
        const res: ServiceResult<PagingResult<Identity>> =
          await IdentityService.list(params);

        // Kiểm tra success
        if (!res.success) {
          throw new Error(res.message || t("error.identity.fetchList"));
        }

        if (!res.data) {
          throw new Error(t("error.identity.noData"));
        }

        const {
          content,
          totalElements,
          number: pageNo,
          size: pageSize,
        } = res.data;

        this.identities = content;
        this.total = totalElements;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.lastQuery = { ...params };
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.identity.fetchList");
        this.error = msg;
        ElMessage.error(msg);
      } finally {
        this.loading = false;
      }
    },

    async fetchDetail(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Identity> = await IdentityService.getById(id);

        if (!res.success) {
          throw new Error(res.message || t("error.identity.fetchDetail"));
        }

        const detail = res.data;
        return detail;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.identity.fetchDetail");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async createIdentity(payload: FormData) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Identity> = await IdentityService.create(
          payload
        );

        if (!res.success) {
          throw new Error(res.message || t("error.identity.create"));
        }

        const created = res.data;
        ElMessage.success(t("common.insertSuccess"));
        return created;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.identity.create");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateIdentity(id: number, payload: FormData) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Identity> = await IdentityService.update(
          id,
          payload
        );

        if (!res.success) {
          throw new Error(res.message || t("error.identity.update"));
        }

        const updated = res.data;
        ElMessage.success(t("common.updateSuccess"));
        return updated;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.identity.update");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deleteIdentity(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await IdentityService.delete(id);

        if (!res.success) {
          throw new Error(res.message || t("error.identity.delete"));
        }
        ElMessage.success(t("common.deleteSuccess"));
        if (this.lastQuery) {
          await this.listPage(this.lastQuery);
        }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.identity.delete");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async count() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<number> = await IdentityService.count();
        if (!res.success) {
          throw new Error(res.message || t("error.identity.count"));
        }
        this.total = res.data || 0;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.identity.count");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    resetAndBackToList() {
      this.identities = undefined;
      this.total = 0;
      this.pageNo = 1;
      this.pageSize = 10;
      this.error = undefined;
      // router.replace("/prisons");
    },
  },

  // persist: true,
});

// export const usePrisonStoreWithOut = () => usePrisonStore(store)
