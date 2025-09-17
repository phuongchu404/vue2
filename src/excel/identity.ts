const headerMap: Record<string, string> = {
  detaineeCode: "Mã phạm nhân",
  detaineeName: "Họ và tên",
  createdPlace: "Nơi lập",
  reasonNote: "Lý do",
  arrestDate: "Ngày bắt",
  arrestUnit: "Đơn vị bắt giữ",
  fpClassification: "Phân loại chỉ bản",
  dp: "ĐP",
  tw: "TW",
  akFileNo: "Số hồ sơ AK",
  notes: "Ghi chú",

  // Anthropometry
  "anthropometry.faceShape": "Hình dạng khuôn mặt",
  "anthropometry.heightCm": "Chiều cao (cm)",
  "anthropometry.noseBridge": "Sống mũi",
  "anthropometry.distinctiveMarks": "Đặc điểm nhận dạng",
  "anthropometry.earLowerFold": "Nếp tai dưới",
  "anthropometry.earLobe": "Dái tai",
};

const columnWidths = [
  { wch: 15 }, // Mã phạm nhân
  { wch: 20 }, // Họ và tên
  { wch: 20 }, // Nơi lập
  { wch: 30 }, // Lý do
  { wch: 15 }, // Ngày bắt
  { wch: 20 }, // Đơn vị bắt giữ
  { wch: 15 }, // Phân loại chỉ bản
  { wch: 15 }, // ĐP
  { wch: 15 }, // TW
  { wch: 15 }, // Số hồ sơ AK
  { wch: 30 }, // Ghi chú
  { wch: 15 }, // Hình dạng khuôn mặt
  { wch: 15 }, // Chiều cao (cm)
  { wch: 15 }, // Sống mũi
  { wch: 15 }, // Đặc điểm nhận dạng
  { wch: 15 }, // Nếp tai dưới
  { wch: 15 }, // Dái tai
];

export { headerMap, columnWidths };
