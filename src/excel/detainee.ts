const headerMap: Record<string, string> = {
  detaineeCode: "Mã phạm nhân",
  fullName: "Họ và tên",
  gender: "Giới tính",
  dateOfBirth: "Ngày sinh",
  idNumber: "Số CCCD/CMND",
  detentionDate: "Ngày bắt",
  cellNumber: "Buồng giam",
  charges: "Tội danh",
  status: "Trạng thái",
};

const columnWidths = [
  { wch: 15 }, // Mã phạm nhân
  { wch: 20 }, // Họ và tên
  { wch: 10 }, // Giới tính
  { wch: 15 }, // Ngày sinh
  { wch: 15 }, // Số CCCD/CMND
  { wch: 15 }, // Ngày bắt
  { wch: 12 }, // Buồng giam
  { wch: 20 }, // Tội danh
  { wch: 15 }, // Trạng thái
];
export { headerMap, columnWidths };
