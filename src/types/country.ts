export interface Country {
  id?: number;
  name?: string;
  numericCode?: string;
  alpha2Code?: string;
  alpha3Code?: string;
}

export interface CountryState {
  countries?: Country[];
  loading: boolean;
  error?: string;
}
