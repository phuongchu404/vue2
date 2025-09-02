import * as Utils from "../utils";
export const PositionService = {
  async list() {
    const res = Utils.doGet(`/api/admin/position/all`);
    return res;
  },
};
