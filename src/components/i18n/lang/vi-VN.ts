import user from "./vi-VN/user";
import role from "./vi-VN/role";
import permission from "./vi-VN/permission";
import profile from "./vi-VN/profile";
import home from "./vi-VN/home";
import login from "./vi-VN/login";
import common from "./vi-VN/common";
import option from "./vi-VN/option";
import menu from "./vi-VN/menu";
import status from "./vi-VN/status";
import provider from "./vi-VN/provider";
import visitor from "./vi-VN/visitor";
import citizen from "./vi-VN/citizen-card"
import passpost from "./vi-VN/pass-post";
import otherCard from "./vi-VN/otherCard";
import register from "./vi-VN/register";

export default {
  ...provider,
  ...status,
  ...menu,
  ...option,
  ...common,
  ...login,
  ...home,
  ...profile,
  ...user,
  ...role,
  ...permission,
  ...visitor,
  ...citizen,
  ...otherCard,
  ...passpost,
  ...register,
}
