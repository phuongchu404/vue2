import { get } from "lodash";
import type { Error } from "@/i18n/type";
const error: Error = {
  country: {
    getAll: "Lỗi khi lấy danh sách quốc gia",
  },
  department: {
    fetchList: "Lỗi khi lấy danh sách phòng ban",
    noData: "Không có dữ liệu phòng ban",
    fetchDetail: "Lỗi khi lấy chi tiết phòng ban",
    fetchAll: "Lỗi khi lấy danh sách phòng ban",
    create: "Lỗi khi tạo phòng ban",
    update: "Lỗi khi cập nhật phòng ban",
    delete: "Lỗi khi xóa phòng ban",
  },
  detainee: {
    fetchList: "Lỗi khi lấy danh sách phạm nhân",
    noData: "Không có dữ liệu phạm nhân",
    fetchDetail: "Lỗi khi lấy chi tiết phạm nhân",
    fetchAll: "Lỗi khi lấy danh sách phạm nhân",
    create: "Lỗi khi tạo phạm nhân",
    update: "Lỗi khi cập nhật phạm nhân",
    delete: "Lỗi khi xoá phạm nhân",
    exportExcel: "Lỗi khi xuat file excel phạm nhân",
    top3Recent: "Lỗi khi lấy danh sách phạm nhân gần đây",
    count: "Lỗi khi đếm phạm nhân",
  },
  educationLevel: {
    getAll: "Lỗi khi lấy danh sách trình độ học vấn",
  },
  ethnicity: {
    getAll: "Lỗi khi lấy danh sách dân tộc",
  },
  fingerprint: {
    fetchList: "Lỗi khi lấy danh sách vân tay",
    noData: "Không có dữ liệu vân tay",
    fetchDetail: "Lỗi khi lấy chi tiết vân tay",
    fetchAll: "Lỗi khi lấy danh sách vân tay",
    create: "Lỗi khi tạo vân tay",
    update: "Lỗi khi cập nhật vân tay",
    delete: "Lỗi khi xóa vân tay",
  },
  identity: {
    fetchList: "Lỗi khi lấy danh sách danh bản",
    noData: "Không có dữ liệu danh bản",
    fetchDetail: "Lỗi khi lấy chi tiết danh bản",
    fetchAll: "Lỗi khi lấy danh sách danh bản",
    create: "Lỗi khi tạo danh bản",
    update: "Lỗi khi cập nhật danh bản",
    delete: "Lỗi khi xoá danh bản",
    count: "Lỗi khi đếm danh bản",
  },
  menu: {
    loadAllMenu: "Lỗi khi lấy danh sách menu",
    noData: "Không có dữ liệu menu",
  },
  permission: {
    synchronize: "Lỗi khi đồng bộ quyền",
    getAllMenus: "Lỗi khi lấy danh sách menu",
  },
  position: {
    getAll: "Lỗi khi lấy danh sách vị trí",
  },
  prison: {
    fetchList: "Lỗi khi lấy danh sách trại giam",
    noData: "Không có dữ liệu trại giam",
    fetchDetail: "Lỗi khi lấy chi tiết trại giam",
    fetchAll: "Lỗi khi lấy danh sách trại giam",
    create: "Lỗi khi tạo trại giam",
    update: "Lỗi khi cập nhật trại giam",
    delete: "Lỗi khi xoá trại giam",
    exportExcel: "Lỗi khi xuat file excel trại giam",
    top3Recent: "Lỗi khi lấy danh sách trại giam gần đây",
    count: "Lỗi khi đếm trại giam",
  },
  province: {
    getAll: "Lỗi khi lấy danh sách tỉnh/thành phố",
  },
  religion: {
    getAll: "Lỗi khi lấy danh sách tôn giáo",
  },
  role: {
    fetchList: "Lỗi khi lấy danh sách quyền",
    noData: "Không có dữ liệu quyền",
    fetchDetail: "Lỗi khi lấy chi tiết quyền",
    fetchAll: "Lỗi khi lấy danh sách quyền",
    create: "Lỗi khi tạo quyền",
    update: "Lỗi khi cập nhật quyền",
    delete: "Lỗi khi xoá quyền",
  },
  rolePermission: {
    getPermissionByRoleId: "Lỗi khi lấy danh sách quyền",
    updatePermissionByRoleId: "Lỗi khi cập nhật quyền",
  },
  staff: {
    fetchList: "Lỗi khi lấy danh sách nhân viên",
    noData: "Không có dữ liệu nhân viên",
    fetchDetail: "Lỗi khi lấy chi tiết nhân viên",
    fetchAll: "Lỗi khi lấy danh sách nhân viên",
    create: "Lỗi khi tạo nhân viên",
    update: "Lỗi khi cập nhật nhân viên",
    delete: "Lỗi khi xóa nhân viên",
    count: "Lỗi khi đếm nhân viên",
    exportExcel: "Lỗi khi xuat file excel nhân viên",
    top3Recent: "Lỗi khi lấy danh sách nhân viên gần đây",
  },
  user: {
    fetchList: "Lỗi khi lấy danh sách người dùng",
    noData: "Không có dữ liệu người dùng",
    fetchDetail: "Lỗi khi lấy chi tiết người dùng",
    fetchAll: "Lỗi khi lấy danh sách người dùng",
    create: "Lỗi khi tạo người dùng",
    update: "Lỗi khi cập nhật người dùng",
    delete: "Lỗi khi xóa người dùng",
    resetPassword: "Lỗi khi reset mật khẩu người dùng",
  },
  userRole: {
    updateRoleByUserId: "Lỗi khi cập nhật quyền người dùng",
  },
  ward: {
    getByProvinceCode: "Lỗi khi lấy danh sách phường xã",
  },
};

export default error;
