// @ts-ignore
import i18n from "@/i18n";

export function currency(value: number, decimals?: number, currency?: String) {
  if (!currency) {
    currency = String(i18n.t("common.currency"));
  }

  if (!decimals && decimals !== 0) {
    let language = localStorage.getItem("LANG") || window.navigator.language;
    switch (language) {
      case "en-US":
        value = value / 100;
        decimals = 2;
        break;
      case "vi-VN":
        decimals = 0;
        break;
      default:
        decimals = 0;
    }
  }

  let fee = Math.abs(value).toFixed(decimals);
  return currency + fee;
}

export function currencyNoSymbol(value: number, decimals?: number) {
  if (!decimals && decimals !== 0) {
    let language = localStorage.getItem("LANG") || window.navigator.language;
    switch (language) {
      case "en-US":
        value = value / 100;
        decimals = 2;
        break;
      case "vi-VN":
        decimals = 0;
        break;
      default:
        decimals = 0;
    }
  }
  let fee = Math.abs(value).toFixed(decimals);
  return fee;
}

export function saveByCurrency(value: number) {
  let language = localStorage.getItem("LANG") || window.navigator.language;
  switch (language) {
    case "en-US":
      value = value * 100;
      break;
    case "vi-VN":
      break;
    default:
  }
  return Math.floor(value);
}
