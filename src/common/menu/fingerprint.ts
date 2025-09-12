import { t } from "@/i18n";
import { MenuItem } from "./../menutype";
// export default {
//   tag: "fingerprint-card",
//   leaf: true,
//   path: "/fingerprint",
//   type: "menu",
//   isWhiteList: false,
//   name: t("menu.fingerprint"),
//   icon: "el-icon-fa-users",
//   options: [],
// };
export const fingerprint: MenuItem = {
  tag: "fingerprint-card",
  leaf: true,
  path: "/fingerprint",
  type: "menu",
  isWhiteList: false,
  name: t("menu.fingerprint"),
  icon: "el-icon-fa-users",
  children: [],
  permissions: [],
};
