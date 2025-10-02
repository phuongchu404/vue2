import { t } from "@/i18n";
// import { user } from "./menu/system/user";
// import { role } from "./menu/system/role";
import { system } from "./menu/system";
import { detainee } from "./menu/detainee";
import { staff } from "./menu/staff";
import { identity } from "./menu/identity";
import { fingerprint } from "./menu/fingerprint";
import { prison } from "./menu/prison";
import { report } from "./menu/report";
import { department } from "./menu/department";
import type { MenuItem, TreeItem, BackPermission } from "./menutype";

export const getNavData = (): MenuItem[] => [
  {
    tag: "index",
    leaf: true,
    path: "/",
    type: "menu",
    isWhiteList: true,
    name: t("menu.index"),
    icon: "HomeFilled",
    children: [],
    permissions: [
      {
        tag: "session:all",
        type: "api",
        isWhiteList: true,
        name: t("option.query"),
        pattern: "/api/sessions/**",
        method: null,
      },
      {
        tag: "session:prison-top-3-recent",
        type: "api",
        isWhiteList: false,
        pattern: "/api/admin/detention-center/get-top-3-newest",
        method: "GET",
      },
      {
        tag: "session:prison:count",
        type: "api",
        isWhiteList: false,
        pattern: "/api/admin/detention-center/count",
        method: "GET",
      },
      {
        tag: "session:detainee:count",
        type: "api",
        isWhiteList: false,
        pattern: "/api/admin/detainee/count",
        method: "GET",
      },
      {
        tag: "session:detainee-top-3-recent",
        type: "api",
        isWhiteList: false,
        pattern: "/api/admin/detainee/get-top-3-newest",
        method: "GET",
      },
      {
        tag: "session:staff:count",
        type: "api",
        isWhiteList: false,
        pattern: "/api/admin/staff/count",
        method: "GET",
      },
      {
        tag: "session:staff-top-3-recent",
        type: "api",
        isWhiteList: false,
        pattern: "/api/admin/staff/get-top-3-newest",
        method: "GET",
      },
      {
        tag: "session:identity:count",
        type: "api",
        isWhiteList: false,
        pattern: "/api/admin/identity-record/count",
        method: "GET",
      },
    ],
  },
  system,
  prison,
  department,
  staff,
  detainee,
  identity,
  fingerprint,
  report,
];

// export const getPermissionTree = () => {
//   let data = getNavData();
//   getTree(data);
//   return data;
// };
export function getPermissionTree(tags: readonly string[] = []): TreeItem[] {
  const tagSet = new Set(tags);
  return buildTree(getNavData(), tagSet);
}

export function getPermissions(): BackPermission[] {
  const list: BackPermission[] = [];
  collectPermissions(getNavData(), list);
  return list;
}

function collectPermissions(
  menuItems: ReadonlyArray<MenuItem>,
  acc: BackPermission[]
): void {
  for (const menuItem of menuItems) {
    acc.push({
      tag: menuItem.tag,
      type: menuItem.type,
      isWhiteList: menuItem.isWhiteList,
    } as BackPermission);
    if (menuItem.leaf) {
      for (const opt of menuItem.permissions ?? []) {
        acc.push({
          tag: opt.tag,
          type: opt.type,
          isWhiteList: opt.isWhiteList,
          method: opt.method,
          pattern: opt.pattern,
        } as BackPermission);
      }
    } else {
      collectPermissions(menuItem.children ?? [], acc);
    }
  }
}
function buildTree(
  menuNodes: ReadonlyArray<MenuItem>,
  tagSet: ReadonlySet<string>
): TreeItem[] {
  const items: TreeItem[] = [];

  for (const menu of menuNodes) {
    if (menu.tag && !tagSet.has(menu.tag)) continue;

    const item: TreeItem = { tag: menu.tag, name: menu.name, children: [] };

    if (menu.leaf) {
      if (menu.permissions?.length) {
        for (const opt of menu.permissions) {
          if (opt.tag && !tagSet.has(opt.tag)) continue;
          // ❗ Ẩn permission có type === 'api' khỏi el-tree
          if (opt.type === "api") continue;

          item.children?.push({ tag: opt.tag, name: opt.name });
        }
      }
    } else {
      const children = buildTree(menu.children ?? [], tagSet);
      if (children.length) item.children?.push(...children);
    }

    items.push(item);
  }

  return items;
}

export const createMenuPermissionMapping = () => {
  const mapping = new Map();
  const navData = getNavData();

  const processMenu = (menuItems: any) => {
    for (const menu of menuItems) {
      if (menu.leaf && menu.permissions) {
        const buttonPerms = menu.permissions.filter(
          (p: any) => p.type === "button"
        );
        const apiPerms = menu.permissions.filter((p: any) => p.type === "api");

        // Tạo mapping: mỗi button permission -> array of api permissions cùng menu
        for (const btnPerm of buttonPerms) {
          mapping.set(
            btnPerm.tag,
            apiPerms.map((p: any) => p.tag)
          );
        }
      } else if (menu.children) {
        processMenu(menu.children);
      }
    }
  };

  processMenu(navData);
  return mapping;
};

// function getTree(values: any) {
//   for (let value of values) {
//     if (value.leaf) {
//       value.label = value.name;
//       if (value.options) {
//         for (let option of value.options) {
//           option.label = option.name;
//         }
//         value.children = value.options;
//       }
//     } else {
//       getTree(value.children);
//     }
//   }
// }
