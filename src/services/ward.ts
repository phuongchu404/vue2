import * as Utils from "../utils";
export const WardService = {
  async getByProvinceCode(provinceCode: string) {
    const res = Utils.doGet(`/api/admin/ward/${provinceCode}`);
    return res;
  },
};
