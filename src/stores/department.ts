// stores/department.ts
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { DepartmentService } from "@/services/department";
import type {
  DepartmentState,
  Department,
  PageQuery,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@/types/department";
import type { ServiceResult, PagingResult } from "@/types/common";

export const useDepartmentStore = defineStore("department", {
  state: (): DepartmentState => ({
    departments: undefined,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false,
    error: undefined,
    lastQuery: undefined,
  }),

  getters: {
    getDepartments: (state): Department[] | undefined => state.departments,

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

        const res: ServiceResult<PagingResult<Department>> =
          await DepartmentService.list(params);

        if (!res.success) {
          throw new Error(res.message || "Fetch department failed");
        }

        if (!res.data) {
          throw new Error("No data returned from fetch departments");
        }
        const {
          content,
          totalElements,
          number: pageNo,
          size: pageSize,
        } = res.data;

        this.departments = content;
        this.total = totalElements;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.lastQuery = { ...params };
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Fetch departments failed";
        this.error = msg;
        ElMessage.error(msg);
      } finally {
        this.loading = false;
      }
    },

    async fetchAll() {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Department> = await DepartmentService.list();

        if (!res.success) {
          throw new Error(res.message || "Fetch departments failed");
        }

        const detail = res.data;
        return detail;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Fetch departments failed";
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async createDepartment(payload: CreateDepartmentRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<PagingResult<Department>> =
          await DepartmentService.create(payload);
        if (!res.success) {
          throw new Error(res.message || "Create departments failed");
        }

        const created = res.data;
        ElMessage.success("Created successfully");
        return created;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Create departments failed";
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateDepartment(id: number, payload: UpdateDepartmentRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Department> = await DepartmentService.update(
          id,
          payload
        );

        if (!res.success) {
          throw new Error(res.message || "Update departments failed");
        }

        const updated = res.data;
        ElMessage.success("Updated successfully");
        return updated;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Update departments failed";
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deleteDepartment(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await DepartmentService.delete(id);

        if (!res.success) {
          throw new Error(res.message || "Delete departments failed");
        }
        ElMessage.success("Deleted successfully");
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Delete departments failed";
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async getByDetentionCenterId(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Department[]> =
          await DepartmentService.getByDetentionCenterId(id);

        if (!res.success) {
          throw new Error(res.message || "Fetch prison failed");
        }

        this.departments = res.data;
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
    clear() {
      this.departments = undefined;
      this.error = undefined;
      this.loading = false;
    },
  },
});
