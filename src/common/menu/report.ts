import i18n from "@/i18n";
const { t } = i18n.global;
export default {
  tag: "report",
  leaf: true,
  path: "/report",
  type: "menu",
  whiteList: false,
  name: t("menu.report"),
  icon: "el-icon-s-custom",
  options: [],
};
