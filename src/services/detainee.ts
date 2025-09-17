import * as Utils from "../utils";

import {
  Detainee,
  CreateDetaineeRequest,
  UpdateDetaineeRequest,
  ExportExcelQuery,
  PageQuery,
} from "@/types/detainee";

export const DetaineeService = {
  async list(params?: PageQuery) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(`/api/admin/detainee?${param}`);
    return res;
  },

  async getById(id: number) {
    const res = Utils.doGet(`/api/admin/detainee/${id}`);
    return res;
  },

  async create(payload: CreateDetaineeRequest) {
    const res = await Utils.doPost("/api/admin/detainee/create", payload);
    return res;
  },

  async update(id: number, payload: UpdateDetaineeRequest) {
    const res = await Utils.doPut(`/api/admin/detainee/${id}`, payload);
    return res;
  },

  async delete(id: number) {
    const res = await Utils.doDelete(`/api/admin/detainee/${id}`);
    return res;
  },

  async getByCode(detaineeCode: string) {
    const res = Utils.doGet(`/api/admin/detainee/code/${detaineeCode}`); // id = string
    return res;
  },

  async getByStatus(status: string, page = 0, size = 20) {
    const params = Utils.queryFormWrapper({ status, page, size });
    const res = await Utils.doGet(`/api/admin/detainee/by-status?${params}`);
    return res;
  },

  async getByDetentionCenter(centerId: number, page = 0, size = 20) {
    const params = Utils.queryFormWrapper({ page, size });
    const res = await Utils.doGet(
      `/api/admin/detainee/by-center/${centerId}?${params}`
    );
    return res;
  },

  async getAll() {
    const res = Utils.doGet(`/api/admin/detainee/all`);
    return res;
  },

  async exportExcel(params?: ExportExcelQuery) {
    Utils.doDownload("GET", `/api/admin/detainee/export`, params);
  },

  async getTop3Recent() {
    const res = Utils.doGet(`/api/admin/detainee/get-top-3-newest`);
    return res;
  },

  async count() {
    const res = Utils.doGet(`/api/admin/detainee/count`);
    return res;
  },
};
