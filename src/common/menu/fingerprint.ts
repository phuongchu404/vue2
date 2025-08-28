import i18n from "@/components/i18n";
const { t } = i18n.global;
export default {
  tag: "fingerprint-card",
  leaf: true,
  path: "/fingerprint",
  type: "menu",
  whiteList: false,
  name: t("menu.fingerprint"),
  icon: "el-icon-fa-users",
  options: [],
};
