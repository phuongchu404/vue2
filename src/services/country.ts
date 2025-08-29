import * as Utils from "../utils";
export const CountryService = {
  async list() {
    const res = Utils.doGet(`/api/admin/country/all`);
    return res;
  },
};
