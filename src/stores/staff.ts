import { defineStore } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
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
import { get } from "lodash";

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
          throw new Error(res.message || "Fetch prisons failed");
        }

        if (!res.data) {
          throw new Error("No data returned from fetch prisons");
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
          e?.response?.data?.message || e?.message || "Fetch prisons failed";
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
          throw new Error(res.message || "Fetch prison failed");
        }

        const detail = res.data;
        return detail;
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

    async createStaff(payload: CreateStaffRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Staff> = await StaffService.create(payload);

        if (!res.success) {
          throw new Error(res.message || "Create prison failed");
        }

        const created = res.data;
        ElMessage.success("Created successfully");
        return created;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Create prison failed";
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
          throw new Error(res.message || "Update prison failed");
        }

        const updated = res.data;
        ElMessage.success("Updated successfully");
        return updated;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Update prison failed";
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
          throw new Error(res.message || "Delete prison failed");
        }
        ElMessage.success("Deleted successfully");
        // if (this.lastQuery) {
        //   await this.fetchList(this.lastQuery);
        // }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Delete prison failed";
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
          e?.response?.data?.message || e?.message || "Export Excel failed";
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
          throw new Error(res.message || "Fetch recent staffs failed");
        } else {
          this.staffs = res.data;
        }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Fetch recent staffs failed";
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
          throw new Error(res.message || "Count staffs failed");
        }
        this.total = res.data || 0;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Count staffs failed";
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
