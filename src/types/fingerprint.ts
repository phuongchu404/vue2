export type FingerName =
  | "RIGHT_THUMB"
  | "RIGHT_INDEX"
  | "RIGHT_MIDDLE"
  | "RIGHT_RING"
  | "RIGHT_LITTLE"
  | "LEFT_THUMB"
  | "LEFT_INDEX"
  | "LEFT_MIDDLE"
  | "LEFT_RING"
  | "LEFT_LITTLE";

export interface Fingerprint {
  preview: string;
}

export type FingerprintMap = Partial<Record<FingerName, Fingerprint>>;

export interface Card {
  id: number;
  personId: string;
  detaineeName?: string;
  createdDate?: string;
  createdPlace?: string;
  fpFormula?: string;
  dp?: string;
  tw?: string;
  reasonNote?: string;
  fingerprints?: FingerprintMap;
  createdAt: string; // ISO string
}

export interface FingerprintImpressionResponse {
  id?: number;
  fingerprintCardId?: number;
  finger?: string;
  kind?: string;
  bucket?: string;
  imageKey?: string;
  objectUrl?: string;
  linkUrl?: string;
  qualityScore?: number;
  capturedAt?: string;
}

export interface FingerprintCardResponse {
  id: number;
  detaineeId: number;
  detaineeName: string;
  detaineeCode: string;
  createdDate: string; // 'yyyy-MM-dd'
  createdPlace: string;
  dp: string;
  tw: string;
  fpFormula: string;
  reasonNote: string;
  createdAt: string; // 'yyyy-MM-dd HH:mm:ss'
  updatedAt: string; // 'yyyy-MM-dd HH:mm:ss'
  fingerPrintImages: FingerprintImpressionResponse[];
}

export interface FingerprintState {
  fingerprints: FingerprintCardResponse[];
  total: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  error?: string;
  lastQuery?: PageQuery;
}

export interface PageQuery {
  pageNo: number;
  pageSize: number;
  detaineeCode?: string;
  detaineeName?: string;
  detentionCenterId?: number;
}
