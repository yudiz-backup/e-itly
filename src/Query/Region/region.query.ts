import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// get Region
export async function getRegion(
  filterRegion?: RegionFilterType,
  pageObj?: string
): Promise<AsyncResponseType> {
  let url = `${api.region_module.region}?search=${filterRegion?.search}&limit=${filterRegion?.limit}`;
  if (pageObj) {
    url += pageObj;
  }
  if (filterRegion?.isActive) {
    url += `&isActive=${filterRegion?.isActive}`;
  }
  if (filterRegion?.nextStartAfterDocId) {
    url += `&startAfterDocId=${filterRegion?.nextStartAfterDocId}`;
  }
  if (filterRegion?.prevEndBeforeDocId) {
    url += `&endBeforeDocId=${filterRegion?.prevEndBeforeDocId}`;
  }
  if (filterRegion?.filterPage) {
    url += `&page=${filterRegion?.filterPage}`;
  }
  if (filterRegion?.sort) {
    url += `&sort=${filterRegion?.sort}&sortOrder=${filterRegion?.sortOrder}`;
  }
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// get Region by Id
export async function getRegionById(id: string): Promise<AsyncResponseType> {
  const url = `${api.region_module.region}/${id}`;

  const response = await appClient.get(url);
  return hasSuccess(response.data);
}
