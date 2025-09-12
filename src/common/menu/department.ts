import { MenuItem } from "./../menutype";
import { t } from "@/i18n";
export const department: MenuItem = {
  tag: "department",
  leaf: true,
  path: "/department",
  type: "menu",
  isWhiteList: false,
  name: t("menu.department"),
  icon: "el-icon-fa-users",
  children: [],
  permissions: [],
};
