import api from "src/config/api";
import { appClient } from "./NetworkService";
import { hasError, hasSuccess } from "./ApiHelpers";

type RowData = {
  serviceType: string;
  isActive: boolean;
}

// get service types
export async function getServiceTypes(
  filterServiceType?: ServiceTypeFilterType,
  pageObj?: string
  // pageInfo?: any
): Promise<AsyncResponseType> {
  let url = `${api.service_type_module.service_type}?search=${filterServiceType?.search}&limit=${filterServiceType?.limit}`;
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

// get service type by Id
export async function getServiceTypeById(
  id: string
): Promise<AsyncResponseType> {
  const url = `${api.service_type_module.service_type}/${id}`;
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// add service types
export async function addServiceType(
  serviceTypeData: RowData
): Promise<AsyncResponseType> {
  const url = `${api.service_type_module.service_type}`;
  try {
    const response = await appClient.post(url, serviceTypeData);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// update service types
export async function updateServiceType(
  serviceTypeData: RowData,
  id: string
): Promise<AsyncResponseType> {
  const url = `${api.service_type_module.service_type}/${id}`;
  try {
    const response = await appClient.put(url, serviceTypeData);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// delete service types
export async function deleteServiceType(
  id: string
): Promise<AsyncResponseType> {
  const url = `${api.service_type_module.service_type}/${id}`;
  try {
    const response = await appClient.delete(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function updateServiceTypeStatus(
  isActive: boolean,
  serviceTypeId: string
): Promise<AsyncResponseType> {
  const url = `${api.service_type_module.changeServiceTypeStatus}/${serviceTypeId}`;
  try {
    const response = await appClient.put(url, { isActive: isActive });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
