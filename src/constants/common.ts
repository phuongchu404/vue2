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
  { label: "Nu", value: Gender.FEMALE },
  { label: "Khác", value: Gender.OTHER },
];

export const statusOptions: Option[] = [
  { label: "Đang làm việc", value: Status.ACTIVE },
  { label: "Ngừng hoạt động", value: Status.INACTIVE },
  { label: "Nghị hưu", value: Status.RETIRED },
  { label: "Điều chuyển", value: Status.TRANSFERRED },
];
