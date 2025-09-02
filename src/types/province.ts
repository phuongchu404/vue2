export interface Province {
  code?: string;
  name?: string;
  fullName?: string;
  codeName?: string;
}

export interface ProvinceState {
  provinces?: Province[];
  loading: boolean;
  error?: string;
}
