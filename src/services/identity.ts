import * as Utils from "../utils";
import type { PageQuery } from "../types/identity";
export const IdentityService = {
  async list(params?: PageQuery) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(`/api/admin/identity-record?${param}`);
    return res;
  },

  async create(data: FormData) {
    const res = Utils.doPost(`/api/admin/identity-record/create`, data);
    return res;
  },

  async update(id: number, data: FormData) {
    const res = Utils.doPut(`/api/admin/identity-record/update/${id}`, data);
    return res;
  },

  async delete(id: number) {
    const res = Utils.doDelete(`/api/admin/identity-record/${id}`);
    return res;
  },

  async getById(id: number) {
    const res = Utils.doGet(`/api/admin/identity-record/${id}`);
    return res;
  },
  async count() {
    const res = Utils.doGet(`/api/admin/identity-record/count`);
    return res;
  },
};
