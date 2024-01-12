import { hasSuccess, hasError } from "../services/ApiHelpers";
import { appClient } from "../services/NetworkService";
import api from "../config/api";

export async function updateEventStatus(
  isActive: boolean,
  blockId: string
): Promise<AsyncResponseType> {
  const url = `${api.event_module.changeEventStatus}/${blockId}`;
  try {
    const response = await appClient.put(url, { isActive: isActive });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
