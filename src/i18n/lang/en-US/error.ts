import type { Error } from "@/i18n/type";
const error: Error = {
  country: {
    getAll: "Error when getting country list",
  },
  department: {
    fetchList: "Error when getting department list",
    noData: "No data found",
    fetchDetail: "Error when getting department detail",
    fetchAll: "Error when getting all department list",
    create: "Error when creating department",
    update: "Error when updating department",
    delete: "Error when deleting department",
  },
  detainee: {
    fetchList: "Error when getting detainee list",
    noData: "No data found",
    fetchDetail: "Error when getting detainee detail",
    fetchAll: "Error when getting all detainee list",
    create: "Error when creating detainee",
    update: "Error when updating detainee",
    delete: "Error when deleting detainee",
    exportExcel: "Error when exporting detainee excel file",
    top3Recent: "Error when getting top 3 recent detainee list",
    count: "Error when counting detainee",
  },
  educationLevel: {
    getAll: "Error when getting education level list",
  },
  ethnicity: {
    getAll: "Error when getting ethnicity list",
  },
  fingerprint: {
    fetchList: "Error when getting fingerprint list",
    noData: "No data found",
    fetchDetail: "Error when getting fingerprint detail",
    fetchAll: "Error when getting all fingerprint list",
    create: "Error when creating fingerprint",
    update: "Error when updating fingerprint",
    delete: "Error when deleting fingerprint",
  },
  identity: {
    fetchList: "Error when getting identity list",
    noData: "No data found",
    fetchDetail: "Error when getting identity detail",
    fetchAll: "Error when getting all identity list",
    create: "Error when creating identity",
    update: "Error when updating identity",
    delete: "Error when deleting identity",
    count: "Error when counting identity",
  },
  menu: {
    loadAllMenu: "Error when loading all menu",
    noData: "No data found",
  },
  permission: {
    synchronize: "Error when synchronizing permission",
    getAllMenus: "Error when getting all menus",
  },
  position: {
    getAll: "Error when getting position list",
  },
  prison: {
    fetchList: "Error when getting prison list",
    noData: "No data found",
    fetchDetail: "Error when getting prison detail",
    fetchAll: "Error when getting all prison list",
    create: "Error when creating prison",
    update: "Error when updating prison",
    delete: "Error when deleting prison",
    exportExcel: "Error when exporting prison excel file",
    top3Recent: "Error when getting top 3 recent prison list",
    count: "Error when counting prison",
  },
  province: {
    getAll: "Error when getting province list",
  },
  religion: {
    getAll: "Error when getting religion list",
  },
  role: {
    fetchList: "Error when getting role list",
    noData: "No data found",
    fetchDetail: "Error when getting role detail",
    fetchAll: "Error when getting all role list",
    create: "Error when creating role",
    update: "Error when updating role",
    delete: "Error when deleting role",
  },
  rolePermission: {
    getPermissionByRoleId: "Error when getting permission by role id",
    updatePermissionByRoleId: "Error when updating permission by role id",
  },
  staff: {
    fetchList: "Error when getting staff list",
    noData: "No data found",
    fetchDetail: "Error when getting staff detail",
    fetchAll: "Error when getting all staff list",
    create: "Error when creating staff",
    update: "Error when updating staff",
    delete: "Error when deleting staff",
    count: "Error when counting staff",
    exportExcel: "Error when exporting staff excel file",
    top3Recent: "Error when getting top 3 recent staff list",
  },
  user: {
    fetchList: "Error when getting user list",
    noData: "No data found",
    fetchDetail: "Error when getting user detail",
    fetchAll: "Error when getting all user list",
    create: "Error when creating user",
    update: "Error when updating user",
    delete: "Error when deleting user",
    resetPassword: "Error when reset password",
  },
  userRole: {
    updateRoleByUserId: "Error when updating role by user id",
  },
  ward: {
    getByProvinceCode: "Error when getting ward by province code",
  },
};

export default error;
