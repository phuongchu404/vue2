import { defineStore } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { PrisonService } from "@/services/prison";
import type {
  Prison,
  PageQuery,
  CreatePrisonRequest,
  UpdatePrisonRequest,
} from "@/types/prison";
import type { ServiceResult, PagingResult } from "@/types/common";

export interface PrisonState {
  content?: Prison[];
  total: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  error?: string;
  lastQuery?: PageQuery;
}

export const usePrisonStore = defineStore("prison", {
  state: (): PrisonState => ({
    content: undefined,
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false,
    error: undefined,
    lastQuery: undefined,
  }),

  getters: {
    getContent: (state): Prison[] | undefined => state.content,
    getTotal: (state): number => state.total,
    getPage: (state): number => state.pageNo,
    getSize: (state): number => state.pageSize,
    getLoading: (state): boolean => state.loading,
    getError: (state): string | undefined => state.error,
    // getById: (state) => (id: number) => state.items?.find((x) => x.id === id),
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
        const res: ServiceResult<PagingResult<Prison>> =
          await PrisonService.list(params);

        // Kiểm tra success
        if (!res.success) {
          throw new Error(res.message || "Fetch prisons failed");
        }

        const {
          content,
          totalElements,
          number: pageNo,
          size: pageSize,
        } = res.data;

        this.content = content;
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
        const res: ServiceResult<Prison> = await PrisonService.getById(id);

        if (!res.success) {
          throw new Error(res.message || "Fetch prison failed");
        }

        const detail = res.data;
        // const idx = this.content?.findIndex((x) => x.id === id) ?? -1;
        // if (idx >= 0 && this.content) {
        //   this.content[idx] = detail;
        // } else {
        //   this.content = this.content ? [detail, ...this.content] : [detail];
        //   this.total = Math.max(this.total, this.content.length);
        // }
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

    async createPrison(payload: CreatePrisonRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Prison> = await PrisonService.create(payload);

        if (!res.success) {
          throw new Error(res.message || "Create prison failed");
        }

        const created = res.data;
        // this.content = this.content ? [created, ...this.content] : [created];
        // this.total += 1;
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

    async updatePrison(id: number, payload: UpdatePrisonRequest) {
      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<Prison> = await PrisonService.update(
          id,
          payload
        );

        if (!res.success) {
          throw new Error(res.message || "Update prison failed");
        }

        const updated = res.data;
        // const idx = this.items?.findIndex((x) => x.id === id) ?? -1;
        // if (idx >= 0 && this.items) {
        //   this.items[idx] = { ...this.items[idx], ...updated };
        // }
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

    async deletePrison(id: number) {
      const { t } = useI18n();
      try {
        await ElMessageBox.confirm(
          t?.("common.deleteConfirm") ?? "Are you sure to delete?",
          t?.("common.reminder") ?? "Reminder",
          { type: "warning" }
        );
      } catch {
        return;
      }

      this.loading = true;
      this.error = undefined;
      try {
        const res: ServiceResult<boolean> = await PrisonService.delete(id);

        if (!res.success) {
          throw new Error(res.message || "Delete prison failed");
        }

        // this.items = (this.items ?? []).filter((x) => x.id !== id);
        // this.total = Math.max(0, this.total - 1);
        ElMessage.success("Deleted successfully");
        this.fetchList({ pageNo: 1, pageSize: 10 });
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
      this.items = undefined;
      this.total = 0;
      this.pageNo = 1;
      this.pageSize = 10;
      this.error = undefined;
      router.replace("/prisons");
    },
  },

  //   persist: true,
});

// export const usePrisonStoreWithOut = () => usePrisonStore(store)
