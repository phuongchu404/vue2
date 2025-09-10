export const ACTIVE = "ACTIVE" as const;
export const INACTIVE = "INACTIVE" as const;
export const RETIRED = "RETIRED" as const;
export const TRANSFERRED = "TRANSFERRED" as const;

export const STAFF_STATUSES = [ACTIVE, INACTIVE, RETIRED, TRANSFERRED] as const;

export type StaffStatus = (typeof STAFF_STATUSES)[number];

export const StaffStatusLabel: Record<StaffStatus, string> = {
  ACTIVE: "Đang làm việc",
  INACTIVE: "Ngừng hoạt động",
  RETIRED: "Nghỉ hưu",
  TRANSFERRED: "Điều chuyển",
};

export const STAFF_STATUS_OPTIONS = STAFF_STATUSES.map((value) => ({
  label: StaffStatusLabel[value],
  value,
}));
