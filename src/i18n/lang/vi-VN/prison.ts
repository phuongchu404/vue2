import type { Prison } from "@/i18n/type";

const prison: Prison = {
  editTitle: "Chỉnh sửa trại giam",
  detailTitle: "Chi tiết trại giam",
  code: "Mã trại giam",
  name: "Tên trại giam",
  phone: "Số điện thoại",
  province: "Tỉnh/Thành",
  ward: "Xã/Phường",
  address: "Địa chỉ",
  director: "Giám thị",
  deputyDirector: "Phó giám thị",
  capacity: "Sức chứa tối đa",
  currentPopulation: "Số phạm nhân hiện tại",
  status: "Trạng thái",
  active: "Hoạt động",
  inactive: "Tạm dừng",
  occupancyRate: "Tỉ lệ lấp đầy",
  people: "phạm nhân",
  unit: "trạm giam",

  placeholder: {
    code: "Nhập mã trại giam...",
    name: "Nhập tên trại giam...",
    phone: "Nhập số điện thoại...",
    province: "Chọn tỉnh/thành phố",
    ward: "Chọn xã/phường",
    address: "Số nhà, đường, thôn/xóm...",
    director: "Nhập tên giám thị...",
    deputyDirector: "Nhập tên phó giám thị...",
    capacity: "Nhập sức chứa...",
    currentPopulation: "Nhập số phạm nhân hiện tại...",
    description: "Nhập mô tả về trại giam...",
    status: "Chọn trạng thái...",
  },

  notFound: "Không tìm thấy thông tin trại giam!",

  validation: {
    required: {
      name: "Vui lòng nhập tên trại giam",
      address: "Vui lòng nhập địa chỉ",
      province: "Vui lòng chọn tỉnh/thành",
      ward: "Vui lòng chọn xã/phường",
      director: "Vui lòng nhập tên giám thị",
      deputyDirector: "Vui lòng nhập tên phó giám thị",
      phone: "Vui lòng nhập số điện thoại",
      capacity: "Vui lòng nhập sức chứa",
      currentPopulation: "Vui lòng nhập số phạm nhân hiện tại",
      isActive: "Vui lòng chọn trạng thái",
    },
    invalid: {
      name: "Tên trại giam phải từ 5 - 255 ký tự",
      phone: "Số điện thoại không hợp lệ",
      capacity: "Sức chứa phải lớn hơn 0",
      currentPopulation: "Số phạm nhân không thể âm",
      currentPopulationOver: "Số phạm nhân hiện tại không thể vượt quá sức chứa!",
    }
  }
};

export default prison;
