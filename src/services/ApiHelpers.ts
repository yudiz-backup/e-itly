import { logout } from "./AuthService";
import { localStorageKey } from "src/constants/generics";
import { toast } from "react-toastify";
import { removeItem } from "src/utils/storage";

export function hasSuccess(data: any): AsyncResponseType {
  return {
    data: data?.data,
    success: true,
    message: data.message ? data.message : "",
    status: 200,
  };
}

export function hasError(err: any): AsyncResponseType {
  if (err === "Network Error") {
    return {
      success: false,
      message: "Please check your internet connection.",
      status: 0,
    };
  }

  const error = err?.response ? err?.response : err;

  return {
    success: false,
    message: error.data?.message ? error.data?.message : "Something went wrong.",
    status: error.status ? error.status : 0,
  };
}

export async function logoutUser() {
  const logoutUser = await logout();
  if (logoutUser?.success) {
    Object.keys(localStorageKey).forEach((key) => removeItem(localStorageKey[key]));

    toast.success(logoutUser?.message);
    if (typeof window !== "undefined") {
      dispatchEvent(new CustomEvent("unauthorised"));
    }
  }
}
