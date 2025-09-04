import { ElMessageBox, ElMessage } from "element-plus";
import type { MessageBoxData, Action } from "element-plus";
import { t } from "@/i18n";

export function useMessage() {
  const messageInfoPassword = async (
    message: string,
    title?: string
  ): Promise<MessageBoxData> => {
    const finalTitle = title || String(t("Message"));

    try {
      const result = await ElMessageBox.alert(message, finalTitle, {
        confirmButtonText: String(t("common.confirm")),
        dangerouslyUseHTMLString: true,
        type: "info",
        showClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
      });

      console.log("User confirmed:", result);
      return result;
    } catch (error) {
      console.log("User cancelled:", error);
      throw error;
    }
  };

  // Thêm các message functions khác
  const messageSuccess = (message: string, duration: number = 3000) => {
    ElMessage.success({
      message,
      duration,
      showClose: true,
    });
  };

  const messageError = (message: string, duration: number = 5000) => {
    ElMessage.error({
      message,
      duration,
      showClose: true,
    });
  };

  const messageWarning = (message: string, duration: number = 4000) => {
    ElMessage.warning({
      message,
      duration,
      showClose: true,
    });
  };

  const messageConfirm = async (
    message: string,
    title?: string,
    options?: any
  ): Promise<MessageBoxData> => {
    const finalTitle = title || String(t("Confirm"));

    try {
      const result = await ElMessageBox.confirm(message, finalTitle, {
        confirmButtonText: String(t("common.confirm")),
        cancelButtonText: String(t("common.cancel")),
        type: "warning",
        dangerouslyUseHTMLString: true,
        ...options,
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    messageInfoPassword,
    messageSuccess,
    messageError,
    messageWarning,
    messageConfirm,
  };
}
