import { hasSuccess, hasError } from "../services/ApiHelpers";
import { appClient } from "../services/NetworkService";
import api from "../config/api";

export async function addSubAdmin(
  adminObj: FormData
): Promise<AsyncResponseType> {
  const url = `${api.sub_admin_module.sub_admin}`;
  try {
    const response = await appClient.post(url, adminObj, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return hasSuccess(response?.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function getSubAdminList(
  subAdminFilter: SubAdminFilterType,
  pageObj: string
): Promise<AsyncResponseType> {
  let url = `${api.sub_admin_module.sub_admin}/list?limit=${subAdminFilter?.limit}`;
  if (subAdminFilter?.search) {
    url += `&search=${subAdminFilter?.search}`;
  }
  if (pageObj) {
    url += pageObj;
  }
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function deleteSubAdmin(
  subAdminId: string
): Promise<AsyncResponseType> {
  const url = `${api.sub_admin_module.sub_admin}/${subAdminId}`;
  try {
    const response = await appClient.delete(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function getAdminDetails(
  adminId: string
): Promise<AsyncResponseType> {
  const url = `${api.sub_admin_module.sub_admin}/${adminId}`;
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function updateAdmin(
  adminObj: FormData,
  adminId: string
): Promise<AsyncResponseType> {
  const url = `${api.sub_admin_module.sub_admin}/${adminId}`;
  try {
    const response = await appClient.put(url, adminObj, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

export async function uodateSubAdminStatus(
  isActive: boolean,
  blockId: string
): Promise<AsyncResponseType> {
  const url = `${api.sub_admin_module.changeSubAdminStatus}/${blockId}`;
  try {
    const response = await appClient.put(url, { isActive: isActive });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
