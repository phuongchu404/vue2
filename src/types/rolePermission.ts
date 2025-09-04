export interface UpdatePermissionByRoleIdRequest {
  roleId?: number;
  selectedPermissions?: string[];
}

export interface PermissionVO {
  tag?: string;
  removable?: number;
}

export interface RolePermissionState {
  permissions?: PermissionVO[];
  loading?: boolean;
  error?: string;
  success?: boolean;
}
