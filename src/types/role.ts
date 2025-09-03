export interface Role {
  id?: number;
  roleName?: string;
  description?: string;
  removable?: number;
}
export interface RoleState {
  roles?: Role[];
}
