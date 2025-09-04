import * as Utils from "../utils";
import type { UpdatePermissionByRoleIdRequest } from "@/types/rolePermission";
export const RolePermissionService = {
  async getPermissionByRoleId(roleId: number) {
    const res = Utils.doGet(`/api/admin/roleperms/${roleId}`);
    return res;
  },

  async updatePermissionByRoleId(
    roleId: number,
    payload: UpdatePermissionByRoleIdRequest
  ) {
    const res = await Utils.doPut(`/api/admin/permissions/${roleId}`, payload);
    return res;
  },
};
