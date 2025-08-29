import * as Utils from "../utils";
export const ReligionService = {
  async list() {
    const res = Utils.doGet(`/api/admin/religion/all`);
    return res;
  },
};
