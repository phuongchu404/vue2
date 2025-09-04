import type { Role } from "./role";

export interface User {
  id?: number;
  avatar?: string;
  userName?: string;
  realName?: string;
  mail?: string;
  createTime?: string | null;
  updateTime?: string | null;
  removable?: 0 | 1;
  roles?: Role[];
  idsRole?: number | null;
  phoneNumber?: string;
  createUser?: string;
  description?: string;
}

export interface UserState {
  users?: User[];
  total?: number;
  pageNo?: number;
  pageSize?: number;
  loading?: boolean;
  error?: string;
  lastQuery?: PageQuery;
  success?: boolean;
}

export interface CreateUserRequest
  extends Omit<
    User,
    | "id"
    | "createTime"
    | "updateTime"
    | "roles"
    | "removable"
    | "idsRole"
    | "createUser"
  > {
  description?: string;
}

export interface UpdateUserRequest
  extends Partial<
    Omit<
      User,
      | "id"
      | "createTime"
      | "updateTime"
      | "roles"
      | "removable"
      | "idsRole"
      | "createUser"
    >
  > {}

export interface PageQuery {
  pageNo: number;
  pageSize: number;
  userName?: string;
}

export interface ResetPassword {
  id?: string;
  password?: string;
}
