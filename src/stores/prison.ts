import { defineStore } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import { t } from "@/i18n";
import { PrisonService } from "@/services/prison";
import type {
  PrisonState,
  Prison,
  PageQuery,
  CreatePrisonRequest,
  UpdatePrisonRequest,
  ExportExcelQuery,
} from "@/types/prison";
import type { ServiceResult, PagingResult } from "@/types/common";

export const usePrisonStore = defineStore("prison", {
  state: (): PrisonState => ({
    prisons: undefined,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false,
    error: undefined,
    lastQuery: undefined,
  }),

  getters: {
    getPrisons: (state): Prison[] | undefined => state.prisons,
    getTotal: (state): number => state.total,
    getPage: (state): number => state.pageNo,
    getSize: (state): number => state.pageSize,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async fetchList(query: PageQuery, isCombineOld?: boolean): Promise<void> {
      this.loading = true;
      this.error = undefined;
      try {
        const params: PageQuery = {
          ...query,
          pageNo: query.pageNo ?? this.pageNo,
          pageSize: query.pageSize ?? this.pageSize,
        };

        // Call API
        const res: ServiceResult<PagingResult<Prison>> =
          await PrisonService.list(params);
        // Kiểm tra success
        if (!res.success) {
          throw new Error(res.message || t("error.prison.fetchList"));
        }

        if (!res.data) {
          throw new Error(t("error.prison.noData"));
        }
        const {
          content,
          totalElements,
          number: pageNo,
          size: pageSize,
        } = res.data;

        this.prisons = isCombineOld ? (this.prisons ?? []).concat(content) : content;
        this.total = totalElements;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.lastQuery = { ...params };
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.prison.fetchList");
        this.error = msg;
        ElMessage.error(msg);
      } finally {
        this.loading = false;
      }
    },
    async getAll() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Prison[]> = await PrisonService.getAll();

        if (!res.success) {
          throw new Error(res.message || t("error.prison.fetchAll"));
        }

        this.prisons = res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.prison.fetchAll");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchDetail(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Prison> = await PrisonService.getById(id);

        if (!res.success) {
          throw new Error(res.message || t("error.prison.fetchDetail"));
        }

        const detail = res.data;
        return detail;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.prison.fetchDetail");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async createPrison(payload: CreatePrisonRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Prison> = await PrisonService.create(payload);

        if (!res.success) {
          throw new Error(res.message || t("error.prison.create"));
        }

        const created = res.data;
        ElMessage.success(t("common.insertSuccess"));
        return created;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.prison.create");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updatePrison(id: number, payload: UpdatePrisonRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Prison> = await PrisonService.update(
          id,
          payload
        );

        if (!res.success) {
          throw new Error(res.message || t("error.prison.update"));
        }

        const updated = res.data;
        // const idx = this.items?.findIndex((x) => x.id === id) ?? -1;
        // if (idx >= 0 && this.items) {
        //   this.items[idx] = { ...this.items[idx], ...updated };
        // }
        ElMessage.success(t("common.updateSuccess"));
        return updated;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.prison.update");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deletePrison(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<number> = await PrisonService.delete(id);
        if (!res.success) {
          throw new Error(res.message || t("error.prison.delete"));
        }

        // this.items = (this.items ?? []).filter((x) => x.id !== id);
        // this.total = Math.max(0, this.total - 1);
        ElMessage.success(t("common.deleteSuccess"));
        if (this.lastQuery) {
          await this.fetchList(this.lastQuery);
        }
        // fetchList({ pageNo: 1, pageSize: 10 });
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.prison.delete");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async exportExcel(query: ExportExcelQuery) {
      this.loading = true;
      this.error = undefined;
      try {
        const params: ExportExcelQuery = {
          ...query,
        };

        // Call API
        await PrisonService.exportExcel(params);
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.prison.exportExcel");
        this.error = msg;
        ElMessage.error(msg);
      } finally {
        this.loading = false;
      }
    },

    async getTop3Recent() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Prison[]> =
          await PrisonService.getTop3Recent();
        if (!res.success) {
          throw new Error(res.message || t("error.prison.top3Recent"));
        }
        this.prisons = res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.prison.top3Recent");
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
        const res: ServiceResult<number> = await PrisonService.count();
        if (!res.success) {
          throw new Error(res.message || t("error.prison.count"));
        }
        this.total = res.data || 0;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.prison.count");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async loadForSelect(query: PageQuery, id?: number, name?: string) {
      await this.fetchList(query);
      let item = this.prisons?.find((s) => s.id === id);
      if (!item) {
        this.prisons = (this.prisons ?? []).concat({
          id: id,
          name: name,
          code: name
        })
      }
    },

    resetAndBackToList() {
      this.prisons = undefined;
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
