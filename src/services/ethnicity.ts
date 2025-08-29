import * as Utils from "../utils";
export const EthnicityService = {
  async list() {
    const res = Utils.doGet(`/api/admin/ethnicity/all`);
    return res;
  },
};
