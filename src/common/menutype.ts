export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "*"
  | (string & {});

export type ItemType = "menu" | "button" | "api";

export interface MenuPermission {
  tag?: string;
  type?: ItemType; //  'api' or 'button'
  name?: string;
  pattern?: string;
  method?: HttpMethod | null;
  isWhiteList?: boolean;
}

export interface MenuItem {
  tag?: string;
  path?: string;
  type?: ItemType; //  'menu'
  name?: string; // label/i18n key
  icon?: string;
  leaf?: boolean;
  isWhiteList?: boolean;
  hidden?: boolean;
  visible?: boolean;
  children?: MenuItem[];
  permissions?: MenuPermission[];
}

export interface TreeItem {
  tag?: string;
  name?: string;
  children?: TreeItem[];
}

export interface BackPermission {
  tag?: string;
  type?: ItemType; //  'api' or 'button'
  isWhiteList?: boolean;
  method?: HttpMethod | null;
  pattern?: string;
}
