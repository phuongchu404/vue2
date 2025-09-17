const headerMap: Record<string, string> = {
  staffCode: "Mã cán bộ",
  fullName: "Họ và tên",
  idNumber: "Số CCCD/CMND",
  gender: "Giới tính",
  rank: "Cấp bậc",
  phone: "Số điện thoại",
  email: "Email",
  status: "Trạng thái",
};

const columnWidths = [
  { wch: 15 }, // Mã cán bộ
  { wch: 20 }, // Họ và tên
  { wch: 15 }, // Số CCCD/CMND
  { wch: 10 }, // Giới tính
  { wch: 20 }, // Cấp bậc
  { wch: 15 }, // Số điện thoại
  { wch: 25 }, // Email
  { wch: 15 }, // Trạng thái
];
export { headerMap, columnWidths };
