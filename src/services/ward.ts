import * as Utils from "../utils";
export const WardService = {
  async list() {
    const res = Utils.doGet(`/api/admin/religion/all`);
    return res;
  },

  async getByProvinceCode(provinceCode: string) {
    const res = Utils.doGet(`/api/admin/ward/${provinceCode}`);
    return res;
  },
};
