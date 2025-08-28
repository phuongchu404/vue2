import * as Utils from "../utils";
import type {
  Prison,
  CreatePrisonRequest,
  UpdatePrisonRequest,
  PageQuery,
} from "../types/prison";
export const PrisonService = {
  async list(params?: PageQuery) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(`/api/admin/detention-center/search?${param}`);
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

  // async list(params?: PagingQuery): Promise<PagingResult<Prison>> {
  //   const { data } = await http.get('/admin/prisons', { params });
  //   return data; // kỳ vọng backend trả { items, total, page, size }
  // },

  // async getById(id: number): Promise<Prison> {
  //   const { data } = await http.get(`/admin/prisons/${id}`);
  //   return data;
  // },
};
