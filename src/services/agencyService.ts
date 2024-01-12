import api from "src/config/api";
import { appClient } from "./NetworkService";
import { hasError, hasSuccess } from "./ApiHelpers";

type RowData = {
  agencyName: string;
  location: string;
  isActive: boolean;
}

// get Agency
export async function getAgency(
  filterAgency?: AgencyFilterType,
  pageObj?: string
): Promise<AsyncResponseType> {
  let url = `${api.agency_module.agency}?search=${filterAgency?.search}&limit=${filterAgency?.limit}`;
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

// get Agency by Id
export async function getAgencyById(id: string): Promise<AsyncResponseType> {
  const url = `${api.agency_module.agency}/${id}`;
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// add Agency
export async function addAgency(
  agencyData: RowData
): Promise<AsyncResponseType> {
  const url = `${api.agency_module.agency}`;
  try {
    const response = await appClient.post(url, agencyData);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// update Agency
export async function updateAgency(
  agencyData: RowData,
  id: string
): Promise<AsyncResponseType> {
  const url = `${api.agency_module.agency}/${id}`;
  try {
    const response = await appClient.put(url, agencyData);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// delete Agency
export async function deleteAgency(id: string): Promise<AsyncResponseType> {
  const url = `${api.agency_module.agency}/${id}`;
  try {
    const response = await appClient.delete(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function updateAgencyStatus(
  isActive: boolean,
  blockId: string
): Promise<AsyncResponseType> {
  const url = `${api.agency_module.changeAgencyStatus}/${blockId}`;
  try {
    const response = await appClient.put(url, { isActive: isActive });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
