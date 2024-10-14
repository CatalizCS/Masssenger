import Toast, { ToastType } from "react-native-toast-message";

const showToast = (type: "success" | "error" | ToastType, message: string) => {
  Toast.show({
    type,
    text1: message,
  });
};

export const showSuccessToast = (message: string) => {
  showToast("success", message);
};

export const showErrorToast = (message: string) => {
  showToast("error", `${message} ❌`);
};

export const showToasts = (type: ToastType, message: string) => {
  showToast(type, message);
};
