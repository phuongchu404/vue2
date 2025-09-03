export interface StaffState {
  staffs?: Staff[];
  total: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  error?: string;
  lastQuery?: PageQuery;
}
export interface Staff {
  id: number;
  staffCode?: string;
  profileNumber?: string;
  fullName?: string;
  gender?: string; // 'MALE' | 'FEMALE' | 'OTHER'

  dateOfBirth?: string; // 'yyyy-MM-dd'
  placeOfBirth?: string;
  idNumber?: string;

  idIssueDate?: string; // 'yyyy-MM-dd'
  idIssuePlace?: string;

  ethnicityId?: number;
  religionId?: number;
  ethnicityName?: string;
  religionName?: string;

  permanentAddress?: string;
  permanentWardId?: string;
  permanentWardFullName?: string;
  permanentProvinceId?: string;
  permanentProvinceFullName?: string;

  temporaryAddress?: string;
  temporaryWardId?: string;
  temporaryWardFullName?: string;
  temporaryProvinceId?: string;
  temporaryProvinceFullName?: string;

  phone?: string;
  email?: string;
  emergencyContact?: string;
  emergencyPhone?: string;

  detentionCenterId?: number;
  detentionCenterName?: string;
  detentionCenterCode?: string;

  departmentId?: number;
  departmentName?: string;
  departmentCode?: string;

  positionId?: number;
  positionName?: string;

  rank?: string;

  educationLevelId?: number;
  educationLevelName?: string;

  status?: string; //'ACTIVE' | 'INACTIVE'
  isActive?: boolean;

  createdAt?: string; // 'yyyy-MM-dd HH:mm:ss'
  updatedAt?: string; // 'yyyy-MM-dd HH:mm:ss'
}

export interface CreateStaffRequest
  extends Omit<
    Staff,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "permanentWardFullName"
    | "temporaryWardFullName"
    | "permanentProvinceFullName"
    | "temporaryProvinceFullName"
    | "permanentProvinceId"
    | "temporaryProvinceId"
  > {}

export interface UpdateStaffRequest
  extends Partial<
    Omit<
      Staff,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "permanentWardFullName"
      | "temporaryWardFullName"
      | "permanentProvinceFullName"
      | "temporaryProvinceFullName"
      | "permanentProvinceId"
      | "temporaryProvinceId"
    >
  > {} // tao kieu moi, (bỏ id, created_at) → mọi field còn lại đều không bắt buộc.

export interface PageQuery {
  pageNo: number;
  pageSize: number;
  staffCode?: string;
  profileNumber?: string;
  fullName?: string;
  idNumber?: string;
  phone?: string;
  email?: string;
  detentionCenterId?: number;
  departmentId?: number;
  positionId?: number;
  rank?: string;
  status?: string;
  isActive?: boolean;
}
