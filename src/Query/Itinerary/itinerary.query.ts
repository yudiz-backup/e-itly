import api from "src/config/api";
import { createUrlIdParams } from "src/screens/admin/ItineraryManagement/helper";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// get Itinerary
export async function getItinerary(
  filterItinerary?: ItineraryFilterType,
  pageObj?: string
): Promise<AsyncResponseType> {
  let url = `${api.itinerary_module.itinerary}/all?search=${filterItinerary?.search}&limit=${filterItinerary?.limit}`;
  if (pageObj) {
    url += pageObj;
  }
  if (filterItinerary?.nextStartAfterDocId) {
    url += `&startAfterDocId=${filterItinerary?.nextStartAfterDocId}`;
  }
  if (filterItinerary?.prevEndBeforeDocId) {
    url += `&endBeforeDocId=${filterItinerary?.prevEndBeforeDocId}`;
  }
  if (filterItinerary?.filterPage) {
    url += `&page=${filterItinerary?.filterPage}`;
  }
  if (filterItinerary?.sort) {
    url += `&sort=${filterItinerary?.sort}&sortOrder=${filterItinerary?.sortOrder}`;
  }
  if (filterItinerary?.emailIds?.length) {
    url += `&${createUrlIdParams('emailIds', filterItinerary?.emailIds)}`;
  }
  if (filterItinerary?.bookerId?.length) {
    url += `&${createUrlIdParams('bookerId', filterItinerary?.bookerId)}`;
  }
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// get Itinerary by Id
export async function getItineraryById(id: string): Promise<AsyncResponseType> {
  const url = `${api.itinerary_module.itinerary}/${id}`;

  const response = await appClient.get(url);
  return response?.data
}

// get event by Id
export async function getEventById(id: string): Promise<AsyncResponseType> {
  const url = `${api.event_module.event}/${id}`;
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
type ItineraryOwnerTypes = {
  search: string;
  userType: {
    id: string
  }[]
}

// get Itinerary Owner Filter
export async function getItineraryOwner(
  params: ItineraryOwnerTypes
): Promise<AsyncResponseType> {
  let url = `${api.itinerary_module.filter}?search=${params?.search}`;
  if (params?.userType) {
    url += `&${createUrlIdParams('aUserType', params?.userType)}`;
  }
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// get Itinerary Export BD
export async function getItineraryExportBd(id: string): Promise<AsyncResponseType> {
  const url = `${api.itinerary_module.exportBd}/${id}`;

  const response = await appClient.get(url);
  return response?.data
}

// get Itinerary Aves
export async function getItineraryAves(id: string): Promise<AsyncResponseType> {
  const url = `${api.itinerary_module.aves}/${id}`;

  const response = await appClient.get(url);
  return response?.data
}

