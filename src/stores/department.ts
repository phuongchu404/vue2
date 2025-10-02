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
import { t } from "@/i18n";

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
    async fetchList(query: PageQuery, isCombineOld?: boolean) {
      this.loading = true;
      this.error = undefined
      try {
        const params: PageQuery = {
          ...query,
          pageNo: query.pageNo ?? this.pageNo,
          pageSize: query.pageSize ?? this.pageSize,
        }

        const res: ServiceResult<PagingResult<Department>> =
        await DepartmentService.list(params);

        if (!res.success) {
          throw new Error(res.message || t("error.department.fetchList"));
        }

        if (!res.data) {
          throw new Error(t("error.department.noData"));
        }
        const {
          content,
          totalElements,
          number: pageNo,
          size: pageSize,
        } = res.data;

        this.departments = isCombineOld ? (this.departments ?? []).concat(content) : content;
        this.departments = content;
        this.total = totalElements;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.lastQuery = { ...params };
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.department.fetchList");
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
        const res: ServiceResult<Department> = await DepartmentService.getById(
          id
        );

        if (!res.success) {
          throw new Error(res.message || t("error.department.fetchDetail"));
        }

        const detail = res.data;
        return detail;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.department.fetchDetail");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
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
          throw new Error(res.message || t("error.department.fetchAll"));
        }

        const detail = res.data;
        return detail;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.department.fetchAll");
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
          throw new Error(res.message || t("error.department.create"));
        }

        const created = res.data;
        ElMessage.success(t("common.insertSuccess"));
        return created;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.department.create");
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
          throw new Error(res.message || t("error.department.update"));
        }

        const updated = res.data;
        ElMessage.success(t("common.updateSuccess"));
        return updated;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.department.update");
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
          throw new Error(res.message || t("error.department.delete"));
        }
        ElMessage.success(t("common.deleteSuccess"));
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          t("error.department.delete");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async loadForSelect(query: PageQuery, id?: number, name?: string) {
      await this.fetchList(query);
      let item = this.departments?.find((s) => s.id === id);
      if (!item) {
        this.departments = this.departments?.concat({
          id: id,
          name: name
        })
      }
    }
  },
});
