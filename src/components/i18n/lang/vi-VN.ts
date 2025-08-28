import user from "./vi-VN/user";
import role from "./vi-VN/role";
import permission from "./vi-VN/permission";
import home from "./vi-VN/home";
import login from "./vi-VN/login";
import common from "./vi-VN/common";
import option from "./vi-VN/option";
import menu from "./vi-VN/menu";
import profile from "./vi-VN/profile";

export default {
  ...menu,
  ...option,
  ...common,
  ...login,
  ...home,
  ...user,
  ...role,
  ...permission,
  ...profile,
};
