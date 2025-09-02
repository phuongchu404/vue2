import * as Utils from "../utils";
export const ProvinceService = {
  async list() {
    const res = Utils.doGet(`/api/admin/province/all`);
    return res;
  },

  async getByCode(code: string) {
    const res = Utils.doGet(`/api/admin/province/${code}`);
    return res;
  },
};