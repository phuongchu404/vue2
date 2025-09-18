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
  permissions: [
    {
      tag: "report:view",
      type: "button",
      isWhiteList: false,
      name: t("option.view"),
      pattern: "/api/admin/reports",
      method: "GET",
    },
    {
      tag: "report:generate",
      type: "button",
      isWhiteList: false,
      name: t("option.generate"),
      pattern: "/api/admin/report/generate",
      method: "POST",
    },
  ],
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
