export interface Department {
  id?: number;
  code?: string;
  name?: string;
}
export interface DepartmentState {
  departments?: Department[];
  loading: boolean;
  error?: string;
}
