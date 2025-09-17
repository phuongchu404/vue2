// types/department.ts
export interface DepartmentState {
  departments?: Department[];
  total: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  error?: string;
  lastQuery?: PageQuery;
}

export interface Department {
  id?: number;
  name?: string;
  code?: string;
  detentionCenterId?: number;
  detentionCenterCode?: string;
  detentionCenterName?: string;
  description?: string
  isActive?: boolean;

}

export type CreateDepartmentRequest = Omit<Department, "id">;

export type UpdateDepartmentRequest = Partial<Omit<Department, "id">>;

export interface PageQuery {
  pageNo: number;
  pageSize: number;
  id?: number;
  code?: string;
  name?: string;
  detentionCenterId?: number;
  detentionCenterName?: string;
  detentionCenterCode?: string;
  description?: string
  isActive?: boolean;
}
