export interface Religion {
  id?: number;
  name?: string;
  code?: string;
}
export interface ReligionState {
  religions?: Religion[];
  loading: boolean;
  error?: string;
}