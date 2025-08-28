// src/composables/useBaseMixin.ts
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores"; // <-- store Pinia bạn đã tạo
import Icon from "../assets/icon/Icon";

export function useBaseMixin() {
  const appStore = useAppStore();

  // Nếu bạn muốn truy cập state có reactivity tách rời:
  const {} = storeToRefs(appStore);

  const name = ref("");
  const locals = localStorage.getItem("LANG");

  // buttons là Set<string> trong state Pinia
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
