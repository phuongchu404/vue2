const headerMap: Record<string, string> = {
  code: "Mã trại",
  name: "Tên trại giam",
  address: "Địa chỉ",
  wardFullName: "Phường/Xã",
  provinceFullName: "Tỉnh/Thành phố",
  phone: "Số điện thoại",
  email: "Email",
  director: "Giám thị",
  deputyDirector: "Phó giám thị",
  establishedDate: "Ngày thành lập",
  capacity: "Sức chứa",
  currentPopulation: "Số phạm nhân đang giam",
  isActive: "Trạng thái",
  createdAt: "Ngày tạo",
  updatedAt: "Ngày cập nhật",
};

const columnWidths = [
  { wch: 10 }, // Mã trại
  { wch: 20 }, // Tên trại giam
  { wch: 30 }, // Địa chỉ
  { wch: 20 }, // Phường/Xã
  { wch: 20 }, // Tỉnh/Thành phố
  { wch: 15 }, // Số điện thoại
  { wch: 25 }, // Email
  { wch: 20 }, // Giám thị
  { wch: 20 }, // Phó giám thị
  { wch: 15 }, // Ngày thành lập
  { wch: 15 }, // Sức chứa
  { wch: 15 }, // Số phạm nhân đang giam
  { wch: 15 }, // Trạng thái
  { wch: 15 }, // Ngày tạo
  { wch: 15 }, // Ngày cập nhật
];

export { headerMap, columnWidths };
