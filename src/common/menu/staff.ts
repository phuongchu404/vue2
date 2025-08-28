import i18n from "@/components/i18n";
const { t } = i18n.global;
export default {
  tag: "system:user",
  leaf: true,
  path: "/staff",
  type: "menu",
  whiteList: false,
  name: t("menu.staff"),
  icon: "el-icon-s-custom",
  options: [],
};
