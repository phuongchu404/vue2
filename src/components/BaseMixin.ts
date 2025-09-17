// src/composables/useBaseMixin.ts
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";
import Icon from "../assets/icon/Icon";

export function useBaseMixin() {
  const appStore = useAppStore();

  const {} = storeToRefs(appStore);

  const name = ref("");
  const locals = localStorage.getItem("LANG");

  const isButtonEnabled = (buttonName: string) => {
    return !appStore.buttons.has(buttonName);
  };

  return {
    name,
    Icon,
    locals,
    isButtonEnabled,
  };
}
