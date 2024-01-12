import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";


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
  if (filterServiceType?.isActive) {
    url += `&isActive=${filterServiceType?.isActive}`;
  }
  if (filterServiceType?.nextStartAfterDocId) {
    url += `&startAfterDocId=${filterServiceType?.nextStartAfterDocId}`;
  }
  if (filterServiceType?.prevEndBeforeDocId) {
    url += `&endBeforeDocId=${filterServiceType?.prevEndBeforeDocId}`;
  }
  if (filterServiceType?.filterPage) {
    url += `&page=${filterServiceType?.filterPage}`;
  }
  if (filterServiceType?.sort) {
    url += `&sort=${filterServiceType?.sort}&sortOrder=${filterServiceType?.sortOrder}`;
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

  const response = await appClient.get(url);
  return response?.data
}