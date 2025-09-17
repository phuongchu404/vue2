import * as Utils from "@/utils";
import type {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  PageQuery,
} from "../types/department";

export const DepartmentService = {
  async list(params?: PageQuery) {
    let param = Utils.queryFormWrapper(params);
    const res = await Utils.doGet(`/api/admin/department/all?${param}`);
    return res;
  },

  async getByDetentionCenterId(id: number) {
    const res = Utils.doGet(`/api/admin/department/by-detention-center/${id}`);
    return res;
  },

  async getById(id: number) {
    return Utils.doGet(`/api/admin/department/${id}`);
  },

  async create(payload: CreateDepartmentRequest) {
    return Utils.doPost("/api/admin/department/create", payload);
  },

  async update(id: number, payload: UpdateDepartmentRequest) {
    return Utils.doPut(`/api/admin/department/update/${id}`, payload);
  },

  async delete(id: number) {
    return Utils.doDelete(`/api/admin/department/delete/${id}`);
  },
};
