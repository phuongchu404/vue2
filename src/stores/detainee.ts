import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { t } from "@/i18n";
import { DetaineeService } from "@/services/detainee";
import type {
  DetaineeState,
  Detainee,
  PageQuery,
  CreateDetaineeRequest,
  ExportExcelQuery,
  UpdateDetaineeRequest,
} from "@/types/detainee";
import type { ServiceResult, PagingResult } from "@/types/common";

export const useDetaineeStore = defineStore("detainee", {
  state: (): DetaineeState => ({
    detainees: undefined,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false,
    error: undefined,
    lastQuery: undefined,
  }),

  getters: {
    getDetainees: (state): Detainee[] | undefined => state.detainees,
    getTotal: (state): number => state.total,
    getPage: (state): number => state.pageNo,
    getSize: (state): number => state.pageSize,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async listPage(query: PageQuery, isCombineOld?: any) {
      this.loading = true;
      this.error = undefined;
      try {
        const params: PageQuery = {
          ...query,
          pageNo: query.pageNo ?? this.pageNo,
          pageSize: query.pageSize ?? this.pageSize,
        };

        // Call API
        const res: ServiceResult<PagingResult<Detainee>> =
          await DetaineeService.list(params);

        // Kiểm tra success
        if (!res.success) {
          throw new Error(res.message || t("error.detainee.fetchList"));
        }
        if (!res.data) {
          throw new Error(t("error.detainee.noData"));
        }

        const {
          content,
          totalElements,
          number: pageNo,
          size: pageSize,
        } = res.data;

        this.detainees = isCombineOld ? (this.detainees ?? []).concat(content) : content;
        this.total = totalElements;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.lastQuery = { ...params };
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.detainee.fetchList");
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
        const res: ServiceResult<Detainee> = await DetaineeService.getById(id);

        if (!res.success) {
          throw new Error(res.message || t("error.detainee.fetchDetail"));
        }

        const detail = res.data;
        return detail;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.detainee.fetchDetail");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async createDetainee(payload: CreateDetaineeRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Detainee> = await DetaineeService.create(
          payload
        );

        if (!res.success) {
          throw new Error(res.message || t("error.detainee.create"));
        }

        const created = res.data;
        ElMessage.success(t("common.insertSuccess"));
        return created;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.detainee.create");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateDetainee(id: number, payload: UpdateDetaineeRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Detainee> = await DetaineeService.update(
          id,
          payload
        );

        if (!res.success) {
          throw new Error(res.message || t("error.detainee.update"));
        }

        const updated = res.data;
        ElMessage.success(t("common.updateSuccess"));
        return updated;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.detainee.update");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deleteDetainee(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await DetaineeService.delete(id);

        if (!res.success) {
          throw new Error(res.message || t("error.detainee.delete"));
        }
        ElMessage.success(t("common.deleteSuccess"));
        // if (this.lastQuery) {
        //   await this.fetchList(this.lastQuery);
        // }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.detainee.delete");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async getAll() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Detainee[]> = await DetaineeService.getAll();

        if (!res.success) {
          throw new Error(res.message || t("error.detainee.fetchAll"));
        }

        this.detainees = res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.detainee.fetchAll");
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
        await DetaineeService.exportExcel(params);
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.detainee.exportExcel");
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
        const res: ServiceResult<Detainee[]> =
          await DetaineeService.getTop3Recent();
        if (!res.success) {
          throw new Error(res.message || t("error.detainee.top3Recent"));
        }
        this.detainees = res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.detainee.top3Recent");
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
        const res: ServiceResult<number> = await DetaineeService.count();
        if (!res.success) {
          throw new Error(res.message || t("error.detainee.count"));
        }
        this.total = res.data || 0;
        return res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.detainee.count");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    resetAndBackToList() {
      this.detainees = undefined;
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
