export interface ServiceResult<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface PagingResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  // total: number;
  // pageNo: number;
  // pageSize: number;
}
