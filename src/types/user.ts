import type { Role } from "./role";

export interface User {
  id: number;
  avatar: string;
  userName: string;
  realName: string;
  mail: string;
  createTime: string | null;
  updateTime: string | null;
  removable: 0 | 1;
  roles: Role[];
  idsRole?: number | null;
  phoneNumber: string;
  createUser: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error?: string;
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
  > {}

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
