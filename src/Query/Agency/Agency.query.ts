import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// get Agency
export async function getAgency(
  filterAgency?: AgencyFilterType,
  pageObj?: string
): Promise<AsyncResponseType> {
  let url = `${api.agency_module.agency}?search=${filterAgency?.search}&limit=${filterAgency?.limit}`;
  if (pageObj) {
    url += pageObj;
  }
  if (filterAgency?.nextStartAfterDocId) {
    url += `&startAfterDocId=${filterAgency?.nextStartAfterDocId}`;
  }
  if (filterAgency?.isActive) {
    url += `&isActive=${filterAgency?.isActive}`;
  }
  if (filterAgency?.prevEndBeforeDocId) {
    url += `&endBeforeDocId=${filterAgency?.prevEndBeforeDocId}`;
  }
  if (filterAgency?.filterPage) {
    url += `&page=${filterAgency?.filterPage}`;
  }
  if (filterAgency?.sort) {
    url += `&sort=${filterAgency?.sort}&sortOrder=${filterAgency?.sortOrder}`;
  }
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// get Agency by Id
export async function getAgencyById(id: string): Promise<AsyncResponseType> {
  const url = `${api.agency_module.agency}/${id}`;

  const response = await appClient.get(url);
  return hasSuccess(response.data);
}
