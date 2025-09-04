import * as Utils from "../utils";
import type { UpdateRoleByUserIdRequest } from "../types/userRole";
export const UserRoleService = {
  async updateRoleByUserId(id: number, payload: UpdateRoleByUserIdRequest) {
    const res = await Utils.doPut(`/api/admin/userroles/${id}`, payload);
    return res;
  },
};
