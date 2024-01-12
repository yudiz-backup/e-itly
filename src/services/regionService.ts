import api from "src/config/api";
import { appClient } from "./NetworkService";
import { hasError, hasSuccess } from "./ApiHelpers";

type RowData = {
  regionName: string;
  isActive: boolean;
}

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
    url += `&isActive=${filterRegion?.isActive}`
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
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// add Region
export async function addRegion(
  regionData: RowData
): Promise<AsyncResponseType> {
  const url = `${api.region_module.region}`;
  try {
    const response = await appClient.post(url, regionData);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// update Region
export async function updateRegion(
  regionData: RowData,
  id: string
): Promise<AsyncResponseType> {
  const url = `${api.region_module.region}/${id}`;
  try {
    const response = await appClient.put(url, regionData);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// delete Region
export async function deleteRegion(id: string): Promise<AsyncResponseType> {
  const url = `${api.region_module.region}/${id}`;
  try {
    const response = await appClient.delete(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function updateRegionStatus(
  isActive: boolean,
  blockId: string
): Promise<AsyncResponseType> {
  const url = `${api.region_module.ChangeRegionStatus}/${blockId}`;
  try {
    const response = await appClient.put(url, { isActive: isActive });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
