import * as Utils from "../utils";
import type {
  Identity,
  CreateIdentityRequest,
  UpdateIdentityRequest,
  PageQuery,
} from "../types/identity";
export const IdentityService = {
  async list(params?: PageQuery) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(`/api/admin/identity-record?${param}`);
    return res;
  },
};
