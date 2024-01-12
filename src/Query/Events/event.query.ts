import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// get Events
export async function getEvents(
  eventFilter?: eventFilterType,
  pageObj?: string
): Promise<AsyncResponseType> {
  let url = `${api.event_module.event}?search=${eventFilter?.search}&limit=${eventFilter?.limit}`;
  if (pageObj) {
    url += pageObj;
  }
  if (eventFilter?.nextStartAfterDocId) {
    url += `&startAfterDocId=${eventFilter?.nextStartAfterDocId}`;
  }
  if (eventFilter?.prevEndBeforeDocId) {
    url += `&endBeforeDocId=${eventFilter?.prevEndBeforeDocId}`;
  }
  if (eventFilter?.filterPage) {
    url += `&page=${eventFilter?.filterPage}`;
  }
  if (eventFilter?.sort) {
    url += `&sort=${eventFilter?.sort}&sortOrder=${eventFilter?.sortOrder}`;
  }
  if (eventFilter?.isActive) {
    url += `&isActive=${eventFilter?.isActive}`;
  }
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}


// get event by Id
export async function getEventById(id: string): Promise<AsyncResponseType> {
  const url = `${api.event_module.event}/${id}`;

  const response = await appClient.get(url);
  return response?.data
}
