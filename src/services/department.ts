import * as Utils from "../utils";
export const DepartmentService = {
  async getByDetentionCenterId(id: number) {
    const res = Utils.doGet(`/api/admin/department/by-detention-center/${id}`);
    return res;
  },
};
