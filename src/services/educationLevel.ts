import * as Utils from "../utils";
export const EducationLevelService = {
  async list() {
    const res = Utils.doGet(`/api/admin/education-level/all`);
    return res;
  },

};