import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

type RowData = {
  eventTitle?: string;
  eventDay?: string;
  eventDuration?: string;
  region?: string;
  notes?: string;
  block?: Array<string>;
  service?: Array<string>;
  isActive?: boolean;
}

// delete Event
export async function deleteEvent(id: string): Promise<AsyncResponseType> {
  const url = `${api.event_module.event}/${id}`;
  try {
    const response = await appClient.delete(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// add Event
export async function addEvent(eventData: RowData): Promise<AsyncResponseType> {
  const url = `${api.event_module.event}`;

  const response = await appClient.post(url, eventData);
  return response.data;
}

// update Event
export async function updateEvent({ eventData, id }: {
  eventData: RowData,
  id: string
}): Promise<AsyncResponseType> {
  const url = `${api.event_module.event}/${id}`;

  const response = await appClient.put(url, eventData);
  return response.data;
}