import { t } from "@/i18n";
import type { MenuItem } from "./../menutype";
export const report: MenuItem = {
  tag: "report",
  leaf: true,
  path: "/report",
  type: "menu",
  isWhiteList: false,
  name: t("menu.report"),
  icon: "el-icon-s-custom",
  children: [],
  permissions: [],
};
// export default {
//   tag: "report",
//   leaf: true,
//   path: "/report",
//   type: "menu",
//   isWhiteList: false,
//   name: t("menu.report"),
//   icon: "el-icon-s-custom",
//   options: [],
// };
