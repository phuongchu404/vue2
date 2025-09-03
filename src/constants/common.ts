export interface Option {
  label: string;
  value: string;
}
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  RETIRED = "RETIRED",
  TRANSFERRED = "TRANSFERRED",
}

export const genderOptions: Option[] = [
  { label: "Nam", value: Gender.MALE },
  { label: "Nữ", value: Gender.FEMALE },
  { label: "Khác", value: Gender.OTHER },
];

export const statusOptions: Option[] = [
  { label: "Đang làm việc", value: Status.ACTIVE },
  { label: "Nghỉ phép", value: Status.INACTIVE },
  { label: "Nghỉ hưu", value: Status.RETIRED },
  { label: "Chuyển công tác", value: Status.TRANSFERRED },
];
