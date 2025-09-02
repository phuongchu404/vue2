export interface Position {
  id?: number;
  name?: string;
  code?: string;
  level?: number;
}
export interface PositionState {
  positions?: Position[];
  loading?: boolean;
  error?: string;
}