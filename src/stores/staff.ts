import { defineStore } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import { t } from "@/i18n";
import { StaffService } from "@/services/staff";
import type {
  StaffState,
  Staff,
  PageQuery,
  CreateStaffRequest,
  UpdateStaffRequest,
  ExportStaffQuery,
} from "@/types/staff";
import type { ServiceResult, PagingResult } from "@/types/common";

export const useStaffStore = defineStore("staff", {
  state: (): StaffState => ({
    staffs: undefined,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false,
    error: undefined,
    lastQuery: undefined,
  }),

  getters: {
    getStaffs: (state): Staff[] | undefined => state.staffs,
    getTotal: (state): number => state.total,
    getPage: (state): number => state.pageNo,
    getSize: (state): number => state.pageSize,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
  },

  actions: {
    async fetchList(query: PageQuery) {
      this.loading = true;
      this.error = undefined;
      try {
        const params: PageQuery = {
          ...query,
          pageNo: query.pageNo ?? this.pageNo,
          pageSize: query.pageSize ?? this.pageSize,
        };

        // Call API
        const res: ServiceResult<PagingResult<Staff>> = await StaffService.list(
          params
        );

        // Kiểm tra success
        if (!res.success) {
          throw new Error(res.message || t("error.staff.fetchList"));
        }

        if (!res.data) {
          throw new Error(t("error.staff.noData"));
        }

        const {
          content,
          totalElements,
          number: pageNo,
          size: pageSize,
        } = res.data;

        this.staffs = content;
        this.total = totalElements;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.lastQuery = { ...params };
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.staff.fetchList");
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
        const res: ServiceResult<Staff> = await StaffService.getById(id);

        if (!res.success) {
          throw new Error(res.message || t("error.staff.fetchDetail"));
        }

        const detail = res.data;
        return detail;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.staff.fetchDetail");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async createStaff(payload: CreateStaffRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Staff> = await StaffService.create(payload);

        if (!res.success) {
          throw new Error(res.message || t("error.staff.create"));
        }

        const created = res.data;
        ElMessage.success(t("common.insertSuccess"));
        return created;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.staff.create");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateStaff(id: number, payload: UpdateStaffRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Staff> = await StaffService.update(
          id,
          payload
        );

        if (!res.success) {
          throw new Error(res.message || t("error.staff.update"));
        }

        const updated = res.data;
        ElMessage.success(t("common.updateSuccess"));
        return updated;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.staff.update");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deleteStaff(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await StaffService.delete(id);

        if (!res.success) {
          throw new Error(res.message || t("error.staff.delete"));
        }
        ElMessage.success(t("common.deleteSuccess"));
        // if (this.lastQuery) {
        //   await this.fetchList(this.lastQuery);
        // }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.staff.delete");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async exportExcel(query: ExportStaffQuery) {
      this.loading = true;
      this.error = undefined;
      try {
        const params: ExportStaffQuery = {
          ...query,
        };

        // Call API
        await StaffService.exportExcel(params);
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.staff.exportExcel");
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
        const res: ServiceResult<Staff[]> = await StaffService.getTop3Recent();
        if (!res.success) {
          throw new Error(res.message || t("error.staff.top3Recent"));
        } else {
          this.staffs = res.data;
        }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.staff.top3Recent");
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
        const res: ServiceResult<number> = await StaffService.count();
        if (!res.success) {
          throw new Error(res.message || t("error.staff.count"));
        }
        this.total = res.data || 0;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.staff.count");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    resetAndBackToList() {
      this.staffs = undefined;
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
