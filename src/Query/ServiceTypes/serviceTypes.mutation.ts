import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

type RowData = {
  serviceType: string;
  isActive: boolean;
}

// add service types
export async function addServiceType(
  serviceTypeData: RowData
): Promise<AsyncResponseType> {
  const url = `${api.service_type_module.service_type}`;
  const response = await appClient.post(url, serviceTypeData);
  return response.data;
}

// update service types
export async function updateServiceType({ serviceTypeData, id }: {
  serviceTypeData: RowData,
  id: string
}): Promise<AsyncResponseType> {
  const url = `${api.service_type_module.service_type}/${id}`;
  const response = await appClient.put(url, serviceTypeData);
  return response.data;
}

// delete service types
export async function deleteServiceType(
  id: string
): Promise<AsyncResponseType> {
  const url = `${api.service_type_module.service_type}/${id}`;
  const response = await appClient.delete(url);
  return response.data;
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
