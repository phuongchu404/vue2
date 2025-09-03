export interface Ethnicity {
  id?: number;
  name?: string;
  code?: string;
}
export interface EthnicityState {
  ethnicities?: Ethnicity[];
  loading?: boolean;
  error?: string;
}
