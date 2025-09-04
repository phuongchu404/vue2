import * as Utils from "../utils";
export const PermissionService = {
  async getAllMenus() {
    const res = Utils.doGet(`/api/sessions/permissions`);
    return res;
  },

  async synchronize(payload: any) {
    const res = await Utils.doPost("/api/admin/permissions", payload);
    return res;
  },
};
