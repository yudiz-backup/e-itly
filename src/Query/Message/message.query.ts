import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// get Message
export async function getMessage(filterMessage): Promise<AsyncResponseType> {
    let url = `${api.message_module.message}`;

    const queryParams = [
      { key: 'serviceId', value: filterMessage?.serviceId },
      { key: 'eventId', value: filterMessage?.eventId },
      { key: 'itineraryId', value: filterMessage?.itineraryId },
      { key: 'dayRefId', value: filterMessage?.dayRefId },
      { key: 'serviceRefId', value: filterMessage?.serviceRefId },
      { key: 'eventRefId', value: filterMessage?.eventRefId },
      { key: 'threadId', value: filterMessage?.threadId },
      { key: 'nextStartAfterDocId', value: filterMessage?.nextStartAfterDocId },
      { key: 'type', value: filterMessage?.type }
    ];
    
    const queryParamsString = queryParams
      .filter(param => param.value !== undefined)
      .map(param => `${param.key}=${param.value}`)
      .join('&');
    
    if (queryParamsString) {
      url += `?${queryParamsString}`;
    }
    
    try {
        const response = await appClient.get(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

// get Message
export async function getMessageThread(threadFilter): Promise<AsyncResponseType> {

    let url = `${api.message_module.message_threads}`;
    if (threadFilter?.search) {
        url += `?search=${threadFilter?.search}`
    }
    try {
        const response = await appClient.get(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

// get Message Image Url
export async function getMessageImageUrl(
    imageUrl: string
): Promise<AsyncResponseType> {
    const url = `${api.message_module.message}/pre-signed?url=${imageUrl}`;
    try {
        const response = await appClient.get(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}