export interface EducationLevel {
  id?: number;
  name?: string;
  code?: string;
  levelOrder?: number;
}
export interface EducationLevelState {
  educationLevels?: EducationLevel[];
  loading: boolean;
  error?: string;
}
