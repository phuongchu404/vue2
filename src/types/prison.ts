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
  updatedAt?: string;
  wardId?: string;
}

export interface CreatePrisonRequest
  extends Omit<Prison, "id" | "created_at"> {}

export interface UpdatePrisonRequest
  extends Partial<Omit<Prison, "id" | "created_at">> {}

export interface PageQuery {
  pageNo: number;
  pageSize: number;
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
