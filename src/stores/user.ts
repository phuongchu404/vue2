import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { UserService } from "@/services/user";
import type {
  UserState,
  User,
  PageQuery,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/user";
import type { ServiceResult, PagingResult } from "@/types/common";

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    users: undefined,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false,
    error: undefined,
    lastQuery: undefined,
  }),

  getters: {
    getPrisons: (state): User[] | undefined => state.users,
    getTotal: (state): number => state.total ?? 0,
    getPage: (state): number => state.pageNo ?? 1,
    getSize: (state): number => state.pageSize ?? 10,
    getLoading: (state): boolean => state.loading ?? false,
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
        const res: ServiceResult<PagingResult<User>> = await UserService.list(
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

        this.users = content;
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

    async createUser(payload: CreateUserRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<string> = await UserService.create(payload);

        if (!res.success) {
          throw new Error(res.message || "Create prison failed");
        }

        ElMessage.success("Created successfully");
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

    async updatePrison(id: number, payload: UpdateUserRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await UserService.update(
          id,
          payload
        );

        if (!res.success) {
          throw new Error(res.message || "Update prison failed");
        }

        ElMessage.success("Updated successfully");
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

    async deletePrison(id: number) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await UserService.delete(id);
        if (!res.success) {
          throw new Error(res.message || "Delete prison failed");
        }

        // this.items = (this.items ?? []).filter((x) => x.id !== id);
        // this.total = Math.max(0, this.total - 1);
        ElMessage.success("Deleted successfully");
        if (this.lastQuery) {
          await this.listPage(this.lastQuery);
        }
        // fetchList({ pageNo: 1, pageSize: 10 });
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

    resetAndBackToList() {
      this.users = undefined;
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
