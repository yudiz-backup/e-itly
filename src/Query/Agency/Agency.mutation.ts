import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";


type RowData = {
  agencyName: string;
  location: string;
  isActive: boolean;
}


// add Agency
export async function addAgency(
  agencyData: RowData
): Promise<AsyncResponseType> {
  const url = `${api.agency_module.agency}`;

  const response = await appClient.post(url, agencyData);
  return response.data
}

// update Agency
export async function updateAgency({ agencyData, id }: {
  agencyData: RowData,
  id: string
}): Promise<AsyncResponseType> {
  const url = `${api.agency_module.agency}/${id}`;

  const response = await appClient.put(url, agencyData);
  return response.data
}

// delete Agency
export async function deleteAgency(id: string): Promise<AsyncResponseType> {
  const url = `${api.agency_module.agency}/${id}`;

  const response = await appClient.delete(url);
  return response.data
}

export async function updateAgencyStatus({ isActive, blockId }: {
  isActive: boolean,
  blockId: string
}): Promise<AsyncResponseType> {
  const url = `${api.agency_module.changeAgencyStatus}/${blockId}`;
  try {
    const response = await appClient.put(url, { isActive: isActive });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
