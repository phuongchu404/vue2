import * as Utils from "../utils";
import type {
  CreatePrisonRequest,
  UpdatePrisonRequest,
  PageQuery,
  ExportExcelQuery,
} from "../types/prison";
export const PrisonService = {
  async list(params?: PageQuery) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(`/api/admin/detention-center/search?${param}`);
    return res;
  },

  async getAll() {
    const res = Utils.doGet(`/api/admin/detention-center/all`);
    return res;
  },

  async getById(id: number) {
    const res = Utils.doGet(`/api/admin/detention-center/${id}`);
    return res;
  },

  async create(payload: CreatePrisonRequest) {
    const res = await Utils.doPost(
      "/api/admin/detention-center/create",
      payload
    );
    return res;
  },

  async update(id: number, payload: UpdatePrisonRequest) {
    const res = await Utils.doPut(`/api/admin/detention-center/${id}`, payload);
    return res;
  },

  async delete(id: number) {
    const res = await Utils.doDelete(`/api/admin/detention-center/${id}`);
    return res;
  },
  async exportExcel(params?: ExportExcelQuery) {
    Utils.doDownload("GET", `/api/admin/detention-center/export`, params);
  },

  async getTop3Recent() {
    const res = Utils.doGet(`/api/admin/detention-center/get-top-3-newest`);
    return res;
  },
  async count() {
    const res = Utils.doGet(`/api/admin/detention-center/count`);
    return res;
  },
};
