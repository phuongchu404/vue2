import * as Utils from "../utils";
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  PageQuery,
} from "../types/role";
export const RoleService = {
  async listPage(params?: PageQuery) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(`/api/admin/roles?${param}`);
    return res;
  },
  async getAll() {
    const res = Utils.doGet(`/api/admin/roles/list`);
    return res;
  },

  async create(payload: CreateRoleRequest) {
    const res = await Utils.doPost("/api/admin/users", payload);
    return res;
  },

  async update(id: number, payload: UpdateRoleRequest) {
    const res = await Utils.doPut(`/api/admin/roles/${id}`, payload);
    return res;
  },

  async delete(id: number) {
    const res = await Utils.doDelete(`/api/admin/roles/${id}`);
    return res;
  },
};
