export interface IdentityState {
  identities?: Identity[];
  total: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  error?: string;
  lastQuery?: PageQuery;
}
export interface Identity {
  id?: number;
  detaineeId?: number;
  detaineeName?: string;
  detaineeCode?: string;

  createdPlace?: string;
  reasonNote?: string;
  arrestDate?: string;
  arrestUnit?: string;
  fpClassification?: string;
  dp?: string;
  tw?: string;
  akFileNo?: string;
  notes?: string;

  createdAt?: string;
  updatedAt?: string;

  anthropometry?: AnthropometryResponse | {};

  photos: PhotoResponse[] | [];
}

export interface IdentityRecordUpdateRequest {
  // IdentityRecord
  createdPlace?: string;
  reasonNote?: string;
  arrestDate?: string;
  arrestUnit?: string;
  fpClassification?: string;
  dp?: string;
  tw?: string;
  akFileNo?: string;
  notes?: string;

  // Anthropometry
  faceShape?: string;
  heightCm?: number;
  noseBridge?: string;
  distinctiveMarks?: string;
  earLowerFold?: string;
  earLobe?: string;
}

export interface IdentityRecordCreateRequest
  extends IdentityRecordUpdateRequest {
  detaineeCode?: string;
}

export interface PhotoResponse {
  id?: number;
  identityRecordId?: number;
  view?: string;
  bucket?: string;
  objectKey?: string;
  objectUrl?: string;
  mimeType?: string;
  sizeBytes?: number;
  linkUrl?: string;
  finger?: string;
  createdAt?: string;
}

export interface AnthropometryResponse {
  identityRecordId?: number;
  faceShape?: string;
  heightCm?: number;
  noseBridge?: string;
  distinctiveMarks?: string;
  earLowerFold?: string;
  earLobe?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface PageQuery {
  pageNo: number;
  pageSize: number;
  detaineeCode?: string;
  detaineeName?: string;
  arrestUnit?: string;
}

export interface PagingResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
