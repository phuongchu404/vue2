import user from "./en-US/user";
import role from "./en-US/role";
import permission from "./en-US/permission";
import home from "./en-US/home";
import login from "./en-US/login";
import common from "./en-US/common";
import option from "./en-US/option";
import menu from "./en-US/menu";

export default {
    ...menu,
    ...option,
    ...common,
    ...login,
    ...home,
    ...user,
    ...role,
    ...permission,
}
