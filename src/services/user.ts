import * as Utils from "../utils";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  PageQuery,
} from "../types/user";
export const PrisonService = {
  async list(params?: PageQuery) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(`/api/admin/users?${param}`);
    return res;
  },

  async resetPassword
  async getById(id: number) {
    const res = Utils.doGet(`/api/admin/users/${id}`);
    return res;
  },

  async create(payload: CreateUserRequest) {
    const res = await Utils.doPost(
      "/api/admin/users",
      payload
    );
    return res;
  },

  async update(id: number, payload: UpdateUserRequest) {
    const res = await Utils.doPut(`/api/admin/users/${id}`, payload);
    return res;
  },

  async delete(id: number) {
    const res = await Utils.doDelete(`/api/admin/users/${id}`);
    return res;
  },

  // async list(params?: PagingQuery): Promise<PagingResult<Prison>> {
  //   const { data } = await http.get('/admin/prisons', { params });
  //   return data; // kỳ vọng backend trả { items, total, page, size }
  // },

  // async getById(id: number): Promise<Prison> {
  //   const { data } = await http.get(`/admin/prisons/${id}`);
  //   return data;
  // },
};
