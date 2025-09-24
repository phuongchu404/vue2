import * as Utils from "../utils";
import type { PageQuery } from "../types/fingerprint";
export const FingerprintService = {
  async list(params?: PageQuery) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(`/api/admin/fingerprint?${param}`);
    return res;
  },

  async create(data: FormData) {
    const res = Utils.doPost(`/api/admin/fingerprint/create`, data);
    return res;
  },

  async update(id: number, data: FormData) {
    const res = Utils.doPut(`/api/admin/fingerprint/update/${id}`, data);
    return res;
  },

  async delete(id: number) {
    const res = Utils.doDelete(`/api/admin/fingerprint/${id}`);
    return res;
  },

  async getById(id: number) {
    const res = Utils.doGet(`/api/admin/fingerprint/${id}`);
    return res;
  },
  async count() {
    const res = Utils.doGet(`/api/admin/fingerprint/count`);
    return res;
  },
};
