import * as Utils from "../utils";
export const PermissionService = {
  async getAllMenus() {
    const res = Utils.doGet(`/api/sessions/permission/tag`);
    return res;
  },

  async synchronize(payload: any) {
    const res = await Utils.doPost("/api/admin/permissions", payload);
    return res;
  },
};
