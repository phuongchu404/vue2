import type { Staff } from "@/i18n/type";

const staff: Staff = {
  // Sections
  basicInfo: "Thông tin cơ bản",
  contactInfo: "Thông tin liên hệ",
  permanentAddressSection: "Địa chỉ thường trú",
  temporaryAddressSection: "Địa chỉ tạm trú",
  jobInfo: "Thông tin công việc",

  // Form Labels
  profileNumber: "Số hồ sơ",
  code: "Mã cán bộ",
  fullName: "Họ và tên",
  gender: "Giới tính",
  male: "Nam",
  female: "Nữ",
  dateOfBirth: "Ngày sinh",
  placeOfBirth: "Nơi sinh",
  ethnicity: "Dân tộc",
  religion: "Tôn giáo",
  idNumber: "Số CCCD/CMND",
  idIssueDate: "Ngày cấp",
  idIssuePlace: "Nơi cấp",
  phone: "Số điện thoại",
  email: "Email",
  emergencyContact: "Người liên hệ khẩn cấp",
  emergencyPhone: "SĐT liên hệ khẩn cấp",
  province: "Tỉnh/Thành",
  ward: "Xã/Phường",
  address: "Địa chỉ",
  detailAddress: "Số nhà, đường, thôn/xóm...",
  rank: "Cấp bậc",
  department: "Phòng ban",
  position: "Chức vụ",
  prison: "Trại giam",
  educationLevel: "Trình độ học vấn",
  status: "Trạng thái",
  isActive: "Hoạt động",
  active: "Đang hoạt động",
  inactive: "Không hoạt động",
  detentionCenter: "Trại giam công tác",
  education: "Học vấn",

  // Buttons
  addNew: "Thêm cán bộ mới",
  submit: "Lưu",
  reset: "Làm mới",
  cancel: "Hủy",
  update: "Cập nhật",

  // Titles / Dialogs
  detailTitle: "Chi tiết cán bộ",

  // Placeholders
  placeholder: {
    code: "Nhập mã cán bộ...",
    fullName: "Nhập họ và tên...",
    rank: "Nhập cấp bậc...",
    phone: "Nhập số điện thoại...",
    email: "Nhập email...",
    emergencyContact: "Nhập người liên hệ khẩn cấp...",
    emergencyPhone: "Nhập số điện thoại khẩn cấp...",
    dateOfBirth: "Chọn ngày sinh...",
    idIssueDate: "Chọn ngày cấp...",
    createdPlace: "Nhập nơi sinh...",
    province: "Chọn tỉnh/thành...",
    ward: "Chọn xã/phường...",
  },

  // Validation Messages
  validation: {
    required: {
      code: "Vui lòng nhập mã cán bộ",
      fullName: "Vui lòng nhập họ và tên",
      gender: "Vui lòng chọn giới tính",
      phone: "Vui lòng nhập số điện thoại",
      rank: "Vui lòng nhập cấp bậc",
      detentionCenter: "Vui lòng chọn trại giam",
      status: "Vui lòng chọn trạng thái",
    },
    pattern: {
      phone: "Số điện thoại không hợp lệ",
      email: "Email không hợp lệ",
    },
    length: {
      code: "Mã cán bộ phải từ 3-20 ký tự",
      fullName: "Họ tên phải từ 2-50 ký tự",
    },
  },
};

export default staff;
