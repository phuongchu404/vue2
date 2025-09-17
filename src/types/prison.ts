export interface PrisonState {
  prisons?: Prison[];
  total: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  error?: string;
  lastQuery?: PageQuery;
}
export interface Prison {
  id: number;
  name: string;
  code: string;
  address?: string;
  capacity?: number;
  phone?: string;
  // status?: "ACTIVE" | "INACTIVE";
  isActive?: boolean;
  createdAt?: string;
  currentPopulation?: number;
  deputyDirector?: string;
  director?: string;
  email?: string;
  establishedDate?: string;
  provinceId?: string;
  provinceFullName?: string;
  updatedAt?: string;
  wardId?: string;
  wardFullName?: string;
}

export interface CreatePrisonRequest
  extends Omit<
    Prison,
    "id" | "createdAt" | "updatedAt" | "provinceFullName" | "wardFullName"
  > {}

export interface UpdatePrisonRequest
  extends Partial<
    Omit<
      Prison,
      "id" | "createdAt" | "updatedAt" | "provinceFullName" | "wardFullName"
    >
  > {}

export interface PageQuery {
  pageNo: number;
  pageSize: number;
  code?: string;
  name?: string;
  isActive?: string;
}

export interface ExportExcelQuery {
  code?: string;
  name?: string;
  isActive?: string;
}

export interface PagingResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
