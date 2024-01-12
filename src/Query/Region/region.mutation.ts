
import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

type RowData = {
  regionName: string;
  isActive: boolean;
}

// add Region
export async function addRegion(
  regionData: RowData
): Promise<AsyncResponseType> {
  const url = `${api.region_module.region}`;

  const response = await appClient.post(url, regionData);
  return response.data
}

// update Region
export async function updateRegion({ regionData, id }: {
  regionData: RowData,
  id: string
}): Promise<AsyncResponseType> {
  const url = `${api.region_module.region}/${id}`;

  const response = await appClient.put(url, regionData);
  return response.data;
}


// delete Region
export async function deleteRegion(id: string): Promise<AsyncResponseType> {
  const url = `${api.region_module.region}/${id}`;
  const response = await appClient.delete(url);
  return (response.data);
}

export async function updateRegionStatus({ isActive, blockId }: {
  isActive: boolean,
  blockId: string
}): Promise<AsyncResponseType> {
  const url = `${api.region_module.ChangeRegionStatus}/${blockId}`;
  try {
    const response = await appClient.put(url, { isActive: isActive });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
