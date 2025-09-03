export interface Role {
  id?: number;
  roleName?: string;
  description?: string;
  removable?: number;
}
export interface RoleState {
  roles?: Role[];
  total?: number;
  pageNo?: number;
  pageSize?: number;
  loading?: boolean;
  error?: string;
  lastQuery?: PageQuery;
}

export interface PageQuery {
  pageNo: number;
  pageSize: number;
  roleName?: string;
}

export interface CreateRoleRequest extends Omit<Role, "id" | "removable"> {}

export interface UpdateRoleRequest
  extends Partial<Omit<Role, "id" | "removable">> {}
