import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { RoleService } from "@/services/role";
import type {
  RoleState,
  Role,
  PageQuery,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "@/types/role";
import type { ServiceResult, PagingResult } from "@/types/common";

import { t } from "@/i18n";

export const useRoleStore = defineStore("role", {
  state: (): RoleState => ({
    roles: undefined,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false,
    error: undefined,
    lastQuery: undefined,
    success: false,
  }),

  getters: {
    getRoles: (state): Role[] | undefined => state.roles,
    getTotal: (state): number => state.total ?? 0,
    getPage: (state): number => state.pageNo ?? 1,
    getSize: (state): number => state.pageSize ?? 10,
    getLoading: (state): boolean => state.loading ?? false,
    getError: (state): string | undefined => state.error,
    getSuccess: (state): boolean => state.success ?? false,
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
        const res: ServiceResult<PagingResult<Role>> =
          await RoleService.listPage(params);
        // Kiểm tra success
        if (!res.success) {
          throw new Error(res.message || t("error.role.fetchList"));
        }

        if (!res.data) {
          throw new Error(t("error.role.noData"));
        }
        const {
          content,
          totalElements,
          number: pageNo,
          size: pageSize,
        } = res.data;

        this.roles = content;
        this.total = totalElements;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.lastQuery = { ...params };
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.role.fetchList");
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
        const res: ServiceResult<Role[]> = await RoleService.getAll();

        if (!res.success) {
          throw new Error(res.message || t("error.role.fetchAll"));
        }

        this.roles = res.data;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.role.fetchAll");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async createRole(payload: CreateRoleRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await RoleService.create(payload);
        this.success = res.success;
        if (!res.success) {
          throw new Error(res.message || t("error.role.create"));
        }

        ElMessage.success(t("common.insertSuccess"));
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.role.create");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateRole(id: number, payload: UpdateRoleRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await RoleService.update(
          id,
          payload
        );
        this.success = res.success;

        if (!res.success) {
          throw new Error(res.message || t("error.role.update"));
        }

        ElMessage.success(t("common.updateSuccess"));
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.role.update");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async deleteRole(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await RoleService.delete(id);
        if (!res.success) {
          throw new Error(res.message || t("error.role.delete"));
        }

        ElMessage.success(t("common.deleteSuccess"));

        if (this.lastQuery) {
          await this.listPage(this.lastQuery);
        }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || t("error.role.delete");
        this.error = msg;
        ElMessage.error(msg);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    resetAndBackToList() {
      this.roles = undefined;
      this.total = 0;
      this.pageNo = 1;
      this.pageSize = 10;
      this.error = undefined;
    },
  },
});
