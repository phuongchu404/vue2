import { t } from "@/i18n";
import type { MenuItem } from "../../menutype";
import { user } from "./user";
import { role } from "./role";
export const system: MenuItem = {
  tag: "system",
  leaf: false,
  path: "",
  type: "menu",
  isWhiteList: false,
  name: t("menu.system"),
  icon: "el-icon-fa-cogs",
  children: [user, role],
  permissions: [],
};
