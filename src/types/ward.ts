export interface Ward {
  code?: string;
  name?: string;
  fullName?: string;
  codeName?: string;
}
export interface WardState {
  wards?: Ward[];
  loading: boolean;
  error?: string;
}