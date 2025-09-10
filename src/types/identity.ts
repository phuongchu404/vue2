export interface Identity {
  id?: number;
  staffCode: string;
  fullName: string;
  profileNumber: string;
  idNumber: string;
  idIssueDate?: string | null;
  idIssuePlace?: string | null;

  dateOfBirth: string;
  placeOfBirth?: string | null;
  gender: 0 | number;

  phone?: string | null;
  email?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;

  permanentAddress?: string | null;
  permanentProvinceId?: number | null;
  permanentWardId?: number | null;

  temporaryAddress?: string | null;
  temporaryProvinceId?: number | null;
  temporaryWardId?: number | null;

  departmentId?: number | null;
  departmentCode?: string | null;
  departmentName?: string | null;

  detentionCenterId?: number | null;
  detentionCenterCode?: string | null;
  detentionCenterName?: string | null;

  positionId?: number | null;
  positionName?: string | null;
  rank?: string | null;

  educationLevelId?: number | null;
  educationLevelName?: string | null;

  ethnicityId?: number | null;
  ethnicityName?: string | null;

  religionId?: number | null;
  religionName?: string | null;

  status: "ACTIVE" | "INACTIVE" | "RETIRED" |  "TRANSFERRED"| string;
  isActive: boolean;

  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateIdentityRequest
  extends Omit<Identity, "id" | "created_at"> {}

export interface UpdateIdentityRequest
  extends Partial<Omit<Identity, "id" | "created_at">> {}

export interface PageQuery {
  pageNo: number;
  pageSize: number;
  staffCode?: string;
  fullName?: string;
  status?: string;
  rank?: string;
}

export interface PagingResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
