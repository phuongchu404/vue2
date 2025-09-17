import * as Utils from "../utils";
import type {
  CreateStaffRequest,
  UpdateStaffRequest,
  PageQuery,
  ExportStaffQuery,
} from "../types/staff";
export const StaffService = {
  async list(params?: PageQuery) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(`/api/admin/staff?${param}`);
    return res;
  },

  async getById(id: number) {
    const res = Utils.doGet(`/api/admin/staff/${id}`);
    return res;
  },

  async create(payload: CreateStaffRequest) {
    const res = await Utils.doPost("/api/admin/staff/create", payload);
    return res;
  },

  async update(id: number, payload: UpdateStaffRequest) {
    const res = await Utils.doPut(`/api/admin/staff/update/${id}`, payload);
    return res;
  },

  async delete(id: number) {
    const res = await Utils.doDelete(`/api/admin/staff/${id}`);
    return res;
  },

  async exportExcel(params?: ExportStaffQuery) {
    Utils.doDownload("GET", `/api/admin/staff/export`, params);
  },

  async getTop3Recent() {
    const res = Utils.doGet(`/api/admin/staff/get-top-3-newest`);
    return res;
  },
  async count() {
    const res = Utils.doGet(`/api/admin/staff/count`);
    return res;
  },
};
