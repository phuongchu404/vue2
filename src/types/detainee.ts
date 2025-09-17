export interface DetaineeState {
  detainees?: Detainee[];
  total: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  error?: string;
  lastQuery?: PageQuery;
}
export interface Detainee {
  id: number;
  detaineeCode?: string;
  profileNumber?: string;
  fullName?: string;
  aliasName?: string;
  gender?: string; // 'MALE' | 'FEMALE' | 'OTHER'

  dateOfBirth?: string; // 'yyyy-MM-dd'
  placeOfBirth?: string;
  idNumber?: string;

  idIssueDate?: string; // 'yyyy-MM-dd'
  idIssuePlace?: string;

  nationalityId?: number;
  ethnicityId?: number;
  religionId?: number;
  ethnicityName?: string;
  religionName?: string;
  nationalityName?: string;

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

  currentAddress?: string;
  currentWardId?: string;
  currentWardFullName?: string;
  currentProvinceFullName?: string;
  currentProvinceId?: string;

  occupation?: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;

  detentionCenterId?: number;
  detentionCenterName?: string;
  detentionCenterCode?: string;

  detentionDate?: string;
  expectedReleaseDate?: string;
  actualReleaseDate?: string;

  caseNumber?: string; // ma so vu an
  charges?: string; //toi danh
  sentenceDuration?: string; //thoi gian tu
  courtName?: string; // ten toa xet xu

  cellNumber?: string; // ma so buong giam
  status?: string;
  notes?: string;

  createdAt?: string; // 'yyyy-MM-dd HH:mm:ss'
  updatedAt?: string; // 'yyyy-MM-dd HH:mm:ss'
}

export interface CreateDetaineeRequest
  extends Omit<
    Detainee,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "permanentWardFullName"
    | "temporaryWardFullName"
    | "permanentProvinceFullName"
    | "temporaryProvinceFullName"
    | "permanentProvinceId"
    | "temporaryProvinceId"
    | "currentProvinceFullName"
    | "currentProvinceId"
    | "currentWardFullName"
    | "detentionCenterName"
    | "detentionCenterCode"
    | "ethinicityName"
    | "religionName"
    | "nationalityName"
  > {}

export interface UpdateDetaineeRequest
  extends Partial<
    Omit<
      Detainee,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "permanentWardFullName"
      | "temporaryWardFullName"
      | "permanentProvinceFullName"
      | "temporaryProvinceFullName"
      | "permanentProvinceId"
      | "temporaryProvinceId"
      | "currentProvinceFullName"
      | "currentProvinceId"
      | "currentWardFullName"
      | "ethinicityName"
      | "religionName"
      | "nationalityName"
    >
  > {} // tao kieu moi, (bỏ id, created_at) → mọi field còn lại đều không bắt buộc.

export interface PageQuery {
  pageNo: number;
  pageSize: number;
  detaineeCode?: string;
  fullName?: string;
  idNumber?: string;
  status?: string;
}

export interface ExportExcelQuery {
  detaineeCode?: string;
  fullName?: string;
  idNumber?: string;
  status?: string;
}
