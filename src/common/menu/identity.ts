import i18n from "@/components/i18n";
const { t } = i18n.global;
export default {
  tag: "identity-record",
  leaf: true,
  path: "/identity",
  type: "menu",
  whiteList: false,
  name: t("menu.identity"),
  icon: "el-icon-fa-users",
  options: [],
};
