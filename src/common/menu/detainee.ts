import i18n from "@/components/i18n";
const { t } = i18n.global;
export default {
  tag: "detainee",
  leaf: true,
  path: "/detainees",
  type: "menu",
  whiteList: false,
  name: t("menu.detainee"),
  icon: "el-icon-fa-users",
  options: [],
};
